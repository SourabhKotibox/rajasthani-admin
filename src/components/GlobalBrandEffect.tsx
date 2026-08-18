import { useEffect } from 'react';
import { useAppSelector } from '@/store';

export default function GlobalBrandEffect() {
  const branding = useAppSelector((s) => s.branding);

  useEffect(() => {
    // Sync favicon
    const updateFavicon = (href: string, rel: string) => {
      let link = document.querySelector(`link[rel~='${rel}']`) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.rel = rel;
        document.head.appendChild(link);
      }
      link.href = href;
    };

    if (branding.faviconUrl) {
      updateFavicon(branding.faviconUrl, 'icon');
    }
    if ((branding as any).safariPinnedTabUrl) {
      updateFavicon((branding as any).safariPinnedTabUrl, 'mask-icon');
    }

    // Sync page title
    if (branding.platformName) {
      document.title = `${branding.platformName} — Professional Cinema Platform`;
    }
  }, [branding]);

  return null;
}
