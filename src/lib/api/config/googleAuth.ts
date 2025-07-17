export interface GoogleUser {
  id: string;
  email: string;
  name: string;
  picture: string;
  provider: 'google';
}

export interface GoogleAuthConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scopes: string[];
}

export const googleAuthConfig: GoogleAuthConfig = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your-google-client-secret',
  redirectUri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback',
  scopes: ['openid', 'profile', 'email']
};

export class GoogleAuthService {
  private static instance: GoogleAuthService;
  
  public static getInstance(): GoogleAuthService {
    if (!GoogleAuthService.instance) {
      GoogleAuthService.instance = new GoogleAuthService();
    }
    return GoogleAuthService.instance;
  }

  public async initialize(): Promise<void> {
    console.log('Google OAuth initialized with config:', googleAuthConfig);
  }

  public async signIn(): Promise<GoogleUser> {
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: 'google_user_123',
          email: 'admin@example.com',
          name: 'Admin User',
          picture: 'https://via.placeholder.com/40',
          provider: 'google'
        });
      }, 1500);
    });
  }

  public async signOut(): Promise<void> {
    console.log('Google OAuth sign out');
  }

  public async getCurrentUser(): Promise<GoogleUser | null> {
    return null;
  }

  public async isSignedIn(): Promise<boolean> {
    return false;
  }
}

export const googleAuth = GoogleAuthService.getInstance();

export const getGoogleOAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: googleAuthConfig.clientId,
    redirect_uri: googleAuthConfig.redirectUri,
    scope: googleAuthConfig.scopes.join(' '),
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent'
  });
  
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
};

export const handleGoogleOAuthCallback = async (): Promise<GoogleUser> => {
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'google_user_123',
        email: 'admin@example.com',
        name: 'Admin User',
        picture: 'https://via.placeholder.com/40',
        provider: 'google'
      });
    }, 1000);
  });
}; 