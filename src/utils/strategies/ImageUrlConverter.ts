interface UrlConverterStrategy {
  canHandle(url: string): boolean;
  convert(url: string): string;
}

class GoogleDriveUrlConverter implements UrlConverterStrategy {
  canHandle(url: string): boolean {
    return url.includes('drive.google.com');
  }

  convert(url: string): string {
    let fileId = '';
    
    const match1 = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (match1) {
      fileId = match1[1];
    }
    
    const match2 = url.match(/[?&]id=([a-zA-Z0-9-_]+)/);
    if (match2) {
      fileId = match2[1];
    }
    
    return fileId ? `https://drive.google.com/uc?id=${fileId}` : url;
  }
}

class DropboxUrlConverter implements UrlConverterStrategy {
  canHandle(url: string): boolean {
    return url.includes('dropbox.com');
  }

  convert(url: string): string {
    if (url.includes('dl=0')) {
      return url.replace('dl=0', 'dl=1');
    }
    
    if (!url.includes('dl=')) {
      const separator = url.includes('?') ? '&' : '?';
      return url + separator + 'dl=1';
    }
    
    return url;
  }
}

class DefaultUrlConverter implements UrlConverterStrategy {
  canHandle(url: string): boolean {
    if(url.includes('drive.google.com') || url.includes('dropbox.com')) {
      return true;
    }
    return false;
  }

  convert(_url: string): string {
    return _url;
  }
}

export class ImageUrlConverterService {
  private strategies: UrlConverterStrategy[] = [
    new GoogleDriveUrlConverter(),
    new DropboxUrlConverter(),
    new DefaultUrlConverter(),
  ];

  convert(url: string): string {
    if (!url) return url;
    
    const strategy = this.strategies.find(s => s.canHandle(url));
    return strategy ? strategy.convert(url) : url;
  }
}

export const imageUrlConverter = new ImageUrlConverterService(); 