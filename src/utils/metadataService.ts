import type { Metadata } from "next";
import { METADATA_CONFIG, SEO_CONFIG, SITE_CONFIG } from "../constants";

interface PersonalInfo {
  name?: string;
  title?: string;
  description?: string;
  heroImage?: string;
  socialLinks?: Array<{ name: string; url: string }>;
}

class MetadataService {
  private createDefaultMetadata(): Metadata {
    return {
      title: METADATA_CONFIG.DEFAULT_TITLE,
      description: METADATA_CONFIG.DEFAULT_DESCRIPTION,
      keywords: [...METADATA_CONFIG.DEFAULT_KEYWORDS],
      authors: [{ name: SITE_CONFIG.NAME }],
      creator: SITE_CONFIG.NAME,
      publisher: SITE_CONFIG.NAME,
    };
  }

  private createPersonalizedMetadata(personalInfo: PersonalInfo): Metadata {
    const name = personalInfo.name || SITE_CONFIG.NAME;
    const title = personalInfo.title || SITE_CONFIG.DEFAULT_TITLE;
    const description =
      personalInfo.description || METADATA_CONFIG.DEFAULT_DESCRIPTION;

    return {
      title: `${name} | ${title}`,
      description,
      keywords: [...METADATA_CONFIG.DEFAULT_KEYWORDS, name],
      authors: [{ name }],
      creator: name,
      publisher: name,
    };
  }

  private createOpenGraphMetadata(
    personalInfo: PersonalInfo | null
  ): Metadata["openGraph"] {
    const name = personalInfo?.name || SITE_CONFIG.NAME;
    const title = personalInfo?.title || SITE_CONFIG.DEFAULT_TITLE;
    const description =
      personalInfo?.description || METADATA_CONFIG.DEFAULT_DESCRIPTION;
    const heroImage = personalInfo?.heroImage || METADATA_CONFIG.OG_IMAGE;

    return {
      title: `${name} | ${title}`,
      description,
      url: METADATA_CONFIG.SITE_URL,
      siteName: `${name} Portfolio`,
      images: [
        {
          url: heroImage,
          width: METADATA_CONFIG.OG_IMAGE_WIDTH,
          height: METADATA_CONFIG.OG_IMAGE_HEIGHT,
          alt: `${name} - ${title}`,
        },
      ],
      locale: METADATA_CONFIG.LOCALE,
      type: "website",
    };
  }

  private createTwitterMetadata(
    personalInfo: PersonalInfo | null
  ): Metadata["twitter"] {
    const name = personalInfo?.name || SITE_CONFIG.NAME;
    const title = personalInfo?.title || SITE_CONFIG.DEFAULT_TITLE;
    const description =
      personalInfo?.description || METADATA_CONFIG.DEFAULT_DESCRIPTION;
    const heroImage = personalInfo?.heroImage || METADATA_CONFIG.OG_IMAGE;
    const twitterHandle =
      personalInfo?.socialLinks?.find((link) => link.name === "Twitter")?.url ||
      METADATA_CONFIG.TWITTER_HANDLE;

    return {
      card: "summary_large_image",
      title: `${name} | ${title}`,
      description,
      images: [heroImage],
      creator: twitterHandle,
    };
  }

  public generateMetadata(personalInfo?: PersonalInfo): Metadata {
    const baseMetadata = personalInfo
      ? this.createPersonalizedMetadata(personalInfo)
      : this.createDefaultMetadata();

    return {
      ...baseMetadata,
      formatDetection: {
        email: SEO_CONFIG.FORMAT_DETECTION.EMAIL,
        address: SEO_CONFIG.FORMAT_DETECTION.ADDRESS,
        telephone: SEO_CONFIG.FORMAT_DETECTION.TELEPHONE,
      },
      metadataBase: new URL(METADATA_CONFIG.SITE_URL),
      alternates: {
        canonical: "/",
      },
      openGraph: this.createOpenGraphMetadata(personalInfo || null),
      twitter: this.createTwitterMetadata(personalInfo || null),
      robots: {
        index: SEO_CONFIG.ROBOTS.INDEX,
        follow: SEO_CONFIG.ROBOTS.FOLLOW,
        googleBot: {
          index: SEO_CONFIG.ROBOTS.GOOGLE_BOT.INDEX,
          follow: SEO_CONFIG.ROBOTS.GOOGLE_BOT.FOLLOW,
          "max-video-preview": SEO_CONFIG.ROBOTS.GOOGLE_BOT.MAX_VIDEO_PREVIEW,
          "max-image-preview": SEO_CONFIG.ROBOTS.GOOGLE_BOT.MAX_IMAGE_PREVIEW,
          "max-snippet": SEO_CONFIG.ROBOTS.GOOGLE_BOT.MAX_SNIPPET,
        },
      },
      verification: {
        google: METADATA_CONFIG.GOOGLE_VERIFICATION,
      },
    };
  }
}

export const metadataService = new MetadataService();
