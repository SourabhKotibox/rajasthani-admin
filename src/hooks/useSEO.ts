import { useEffect } from 'react';
import { useAppSelector } from '@/store';

type SeoData = {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
};

export function useSEO(seo: SeoData) {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const setMeta = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    const setProp = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.content = content;
    };

    if (seo.title) {
      document.title = seo.title;
    }

    if (seo.description) {
      setMeta('description', seo.description);
      setProp('og:description', seo.description);
      setProp('twitter:description', seo.description);
    }

    if (seo.keywords) {
      setMeta('keywords', seo.keywords);
    }

    if (seo.ogImage) {
      setProp('og:image', seo.ogImage);
      setProp('twitter:image', seo.ogImage);
    }

    if (seo.canonicalUrl) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = seo.canonicalUrl;
    }

    setProp('og:type', 'website');
    setProp('twitter:card', 'summary_large_image');
  }, [seo]);
}
