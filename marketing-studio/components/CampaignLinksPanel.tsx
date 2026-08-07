import React, { useMemo, useState } from 'react';
import { Check, Copy, ExternalLink, Link2, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Campaign } from '@/marketing-studio/utils/campaigns';
import { getMarketingLinks, getPublicMarketingLinkUrl, MarketingLink, saveMarketingLinks, saveMarketingLinksToSupabase } from '@/marketing-studio/utils/marketingLinks';

interface CampaignLinksPanelProps { campaign: Campaign; }

export const CampaignLinksPanel: React.FC<CampaignLinksPanelProps> = ({ campaign }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);
  const [linksVersion, setLinksVersion] = useState(0);
  const [editing, setEditing] = useState<MarketingLink | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [utmLink, setUtmLink] = useState<MarketingLink | null>(null);
  const [utmPlatform, setUtmPlatform] = useState('instagram');
  const [utmContent, setUtmContent] = useState('post');
  const [utmCopied, setUtmCopied] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState<{ name: string; slug: string; channel: MarketingLink['channel']; phone: string; message: string }>({ name: '', slug: '', channel: 'tiktok', phone: '34694583452', message: '' });
  const links = useMemo(() => getMarketingLinks().filter((link) => link.campaignId === campaign.id), [campaign.id, linksVersion]);

  const slugify = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const openCreate = () => { setEditing(null); setSaveError(null); setForm({ name: `${campaign.name} · TikTok`, slug: '', channel: 'tiktok', phone: '34694583452', message: 'Hola, vengo de TikTok de VitaBlue y necesito información sobre esta campaña.' }); setShowForm(true); };
  const openEdit = (link: MarketingLink) => { setEditing(link); setSaveError(null); setForm({ name: link.name, slug: link.slug, channel: link.channel, phone: link.phone, message: link.message }); setShowForm(true); };
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    const slug = slugify(form.slug || form.name);
    if (!form.name.trim()) { setSaveError('Escribe un nombre para el enlace.'); return; }
    if (!slug) { setSaveError('Escribe un slug o completa el nombre del enlace.'); return; }
    if (!form.message.trim()) { setSaveError('Escribe el mensaje que recibirá WhatsApp.'); return; }
    const allLinks = getMarketingLinks();
    if (allLinks.some((link) => link.slug === slug && link.id !== editing?.id)) { setSaveError(`El slug "${slug}" ya está utilizado. Elige otro, por ejemplo "${slug}-${form.channel}".`); return; }
    const now = new Date().toISOString();
    const next: MarketingLink = editing
      ? { ...editing, ...form, slug, phone: form.phone.replace(/\D/g, ''), updatedAt: now }
      : { ...form, id: `marketing-link-${Date.now()}`, slug, phone: form.phone.replace(/\D/g, ''), campaignId: campaign.id, active: true, clicks: 0, createdAt: now, updatedAt: now };
    const nextLinks = editing ? allLinks.map((link) => link.id === editing.id ? next : link) : [next, ...allLinks];
    saveMarketingLinks(nextLinks);
    void saveMarketingLinksToSupabase(nextLinks);
    setSaveError(null);
    setShowForm(false);
    setEditing(null);
    setLinksVersion((version) => version + 1);
  };
  const remove = (id: string) => { const nextLinks = getMarketingLinks().filter((link) => link.id !== id); saveMarketingLinks(nextLinks); void saveMarketingLinksToSupabase(nextLinks); setLinksVersion((version) => version + 1); };

  const copy = async (slug: string) => {
    await navigator.clipboard?.writeText(getPublicMarketingLinkUrl(slug));
    setCopied(slug);
    window.setTimeout(() => setCopied(null), 1600);
  };

  const buildUtmUrl = (link: MarketingLink) => {
    const url = new URL(getPublicMarketingLinkUrl(link.slug));
    url.searchParams.set('utm_source', utmPlatform);
    url.searchParams.set('utm_medium', 'social');
    url.searchParams.set('utm_campaign', campaign.id);
    url.searchParams.set('utm_content', utmContent);
    return url.toString();
  };

  const copyUtmUrl = async () => {
    if (!utmLink || !navigator.clipboard) return;
    await navigator.clipboard.writeText(buildUtmUrl(utmLink));
    setUtmCopied(true);
    window.setTimeout(() => setUtmCopied(false), 1600);
  };

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div><p className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">Atribución y distribución</p><h3 className="mt-1 font-display text-xl font-black text-slate-800">Enlaces de esta campaña</h3><p className="mt-1 text-xs text-slate-500">Usa un enlace distinto por red para identificar de dónde llegan los contactos a WhatsApp.</p></div>
        <button onClick={openCreate} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[10px] font-black text-white"><Plus size={14} /> Crear enlace</button>
      </div>
      {showForm && <form onSubmit={save} className="space-y-3 rounded-2xl border border-primary/20 bg-brand-cyan/20 p-4"><div className="flex items-center justify-between"><p className="text-xs font-black text-slate-800">{editing ? 'Editar enlace' : 'Nuevo enlace de campaña'}</p><button type="button" onClick={() => setShowForm(false)}><X size={15} className="text-slate-400" /></button></div><div className="grid gap-3 sm:grid-cols-2"><label className="text-[10px] font-bold text-slate-600">Nombre<input value={form.name} onChange={(e) => { setSaveError(null); setForm({ ...form, name: e.target.value }); }} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs" /></label><label className="text-[10px] font-bold text-slate-600">Canal<select value={form.channel} onChange={(e) => { setSaveError(null); setForm({ ...form, channel: e.target.value as MarketingLink['channel'] }); }} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs"><option value="tiktok">TikTok</option><option value="instagram">Instagram</option><option value="facebook">Facebook</option><option value="youtube">YouTube</option><option value="linkedin">LinkedIn</option><option value="x">X</option><option value="other">Otro</option></select></label></div><label className="block text-[10px] font-bold text-slate-600">Slug<input value={form.slug} onChange={(e) => { setSaveError(null); setForm({ ...form, slug: slugify(e.target.value) }); }} placeholder="facebook-estudiantes" className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 font-mono text-xs" /></label><label className="block text-[10px] font-bold text-slate-600">Mensaje de WhatsApp<textarea value={form.message} onChange={(e) => { setSaveError(null); setForm({ ...form, message: e.target.value }); }} rows={3} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs" /></label>{saveError && <p role="alert" className="rounded-lg bg-rose-50 px-3 py-2 text-[10px] font-bold text-rose-700">{saveError}</p>}<button type="submit" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[10px] font-black text-white"><Save size={13} /> Guardar enlace</button></form>}
      {utmLink && <div className="space-y-3 rounded-2xl border border-primary/20 bg-brand-cyan/10 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black text-slate-800">Generar URL con UTM</p><p className="mt-1 text-[10px] font-semibold text-slate-500">Usa esta URL al publicar para medir el tráfico de esta campaña.</p></div><button type="button" onClick={() => setUtmLink(null)}><X size={15} className="text-slate-400" /></button></div><div className="grid gap-3 sm:grid-cols-2"><label className="text-[10px] font-bold text-slate-600">Plataforma<select value={utmPlatform} onChange={(event) => setUtmPlatform(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs"><option value="facebook">Facebook</option><option value="instagram">Instagram</option><option value="tiktok">TikTok</option><option value="linkedin">LinkedIn</option><option value="x">X</option><option value="youtube">YouTube</option></select></label><label className="text-[10px] font-bold text-slate-600">Formato<select value={utmContent} onChange={(event) => setUtmContent(event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs"><option value="post">Post</option><option value="story">Story</option><option value="reel">Reel</option><option value="bio">Bio</option><option value="link">Enlace</option></select></label></div><div className="flex flex-col gap-2 sm:flex-row"><input readOnly value={buildUtmUrl(utmLink)} className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-2 font-mono text-[10px] text-slate-600" /><button type="button" onClick={copyUtmUrl} className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[10px] font-black text-white">{utmCopied ? <Check size={13} /> : <Copy size={13} />}{utmCopied ? 'Copiada' : 'Copiar URL'}</button></div></div>}
      {links.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">Todavía no hay enlaces asociados. Crea el primero para TikTok, Instagram u otra red.</p> : <div className="grid gap-3 md:grid-cols-2">{links.map((link) => <div key={link.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black text-slate-800">{link.name}</p><p className="mt-1 font-mono text-[10px] text-primary">{getPublicMarketingLinkUrl(link.slug)}</p></div><span className="text-[10px] font-black text-slate-400">{link.clicks} clics</span></div><div className="mt-3 flex flex-wrap gap-2"><button onClick={() => copy(link.slug)} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-black text-slate-600"><Copy size={12} /> {copied === link.slug ? 'Copiado' : 'Copiar'}</button><button onClick={() => setUtmLink(link)} className="inline-flex items-center gap-1 rounded-lg bg-brand-cyan/30 px-2.5 py-1.5 text-[10px] font-black text-primary"><Link2 size={12} /> UTM</button><button onClick={() => openEdit(link)} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-black text-slate-600"><Pencil size={12} /> Editar</button><button onClick={() => remove(link.id)} className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-[10px] font-black text-rose-600"><Trash2 size={12} /> Borrar</button><a href={getPublicMarketingLinkUrl(link.slug)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-black text-slate-600"><ExternalLink size={12} /> Abrir</a></div></div>)}</div>}
      <button onClick={() => navigate('/backoffice/marketing-studio/enlaces')} className="inline-flex items-center gap-1.5 text-[10px] font-black text-primary hover:underline"><Link2 size={13} /> Ver biblioteca completa de enlaces</button>
    </section>
  );
};
