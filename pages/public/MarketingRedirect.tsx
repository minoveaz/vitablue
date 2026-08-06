import React from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getMarketingLinkBySlug, resolveMarketingLinkWithTracking } from '@/marketing-studio/utils/marketingLinks';

const MarketingRedirect: React.FC = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const link = getMarketingLinkBySlug(slug);
  const [resolved, setResolved] = React.useState<string | null>(null);
  const trackingStarted = React.useRef(false);

  React.useEffect(() => {
    if (trackingStarted.current) return;
    trackingStarted.current = true;
    void resolveMarketingLinkWithTracking(slug).then((url) => { if (url) setResolved(url); });
  }, [slug]);

  React.useEffect(() => { if (resolved) window.location.replace(resolved); }, [resolved]);

  return <>
    <Helmet>
      <title>Redireccionando a WhatsApp | VitaBlue</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <main className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-6 text-center"><div><p className="text-sm font-bold text-slate-500">Preparando WhatsApp…</p>{!link && <p className="mt-2 text-xs text-slate-400">Este enlace ya no está disponible.</p>}</div></main>
  </>;
};

export default MarketingRedirect;
