import React, { useMemo, useState } from 'react';
import { Copy, ExternalLink, Link2, Pencil, Plus, Save, Trash2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Campaign } from '@/marketing-studio/utils/campaigns';
import { getMarketingLinks, getPublicMarketingLinkUrl, MarketingLink, saveMarketingLinks, saveMarketingLinksToSupabase } from '@/marketing-studio/utils/marketingLinks';

interface CampaignLinksPanelProps { campaign: Campaign; }

export const CampaignLinksPanel: React.FC<CampaignLinksPanelProps> = ({ campaign }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);
  const [editing, setEditing] = useState<MarketingLink | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<{ name: string; slug: string; channel: MarketingLink['channel']; phone: string; message: string }>({ name: '', slug: '', channel: 'tiktok', phone: '34694583452', message: '' });
  const links = useMemo(() => getMarketingLinks().filter((link) => link.campaignId === campaign.id), [campaign.id]);

  const slugify = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const openCreate = () => { setEditing(null); setForm({ name: `${campaign.name} · TikTok`, slug: '', channel: 'tiktok', phone: '34694583452', message: 'Hola, vengo de TikTok de VitaBlue y necesito información sobre esta campaña.' }); setShowForm(true); };
  const openEdit = (link: MarketingLink) => { setEditing(link); setForm({ name: link.name, slug: link.slug, channel: link.channel, phone: link.phone, message: link.message }); setShowForm(true); };
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    const slug = slugify(form.slug || form.name);
    if (!form.name.trim() || !slug || !form.message.trim()) return;
    const allLinks = getMarketingLinks();
    if (allLinks.some((link) => link.slug === slug && link.id !== editing?.id)) return;
    const now = new Date().toISOString();
    const next: MarketingLink = editing
      ? { ...editing, ...form, slug, phone: form.phone.replace(/\D/g, ''), updatedAt: now }
      : { ...form, id: `marketing-link-${Date.now()}`, slug, phone: form.phone.replace(/\D/g, ''), campaignId: campaign.id, active: true, clicks: 0, createdAt: now, updatedAt: now };
    const nextLinks = editing ? allLinks.map((link) => link.id === editing.id ? next : link) : [next, ...allLinks];
    saveMarketingLinks(nextLinks);
    void saveMarketingLinksToSupabase(nextLinks);
    setShowForm(false);
    setEditing(null);
    window.location.reload();
  };
  const remove = (id: string) => { const nextLinks = getMarketingLinks().filter((link) => link.id !== id); saveMarketingLinks(nextLinks); void saveMarketingLinksToSupabase(nextLinks); window.location.reload(); };

  const copy = async (slug: string) => {
    await navigator.clipboard?.writeText(getPublicMarketingLinkUrl(slug));
    setCopied(slug);
    window.setTimeout(() => setCopied(null), 1600);
  };

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div><p className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">Atribución y distribución</p><h3 className="mt-1 font-display text-xl font-black text-slate-800">Enlaces de esta campaña</h3><p className="mt-1 text-xs text-slate-500">Usa un enlace distinto por red para identificar de dónde llegan los contactos a WhatsApp.</p></div>
        <button onClick={openCreate} className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-[10px] font-black text-white"><Plus size={14} /> Crear enlace</button>
      </div>
      {showForm && <form onSubmit={save} className="space-y-3 rounded-2xl border border-primary/20 bg-brand-cyan/20 p-4"><div className="flex items-center justify-between"><p className="text-xs font-black text-slate-800">{editing ? 'Editar enlace' : 'Nuevo enlace de campaña'}</p><button type="button" onClick={() => setShowForm(false)}><X size={15} className="text-slate-400" /></button></div><div className="grid gap-3 sm:grid-cols-2"><label className="text-[10px] font-bold text-slate-600">Nombre<input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs" /></label><label className="text-[10px] font-bold text-slate-600">Canal<select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value as MarketingLink['channel'] })} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs"><option value="tiktok">TikTok</option><option value="instagram">Instagram</option><option value="facebook">Facebook</option><option value="youtube">YouTube</option><option value="linkedin">LinkedIn</option><option value="x">X</option><option value="other">Otro</option></select></label></div><label className="block text-[10px] font-bold text-slate-600">Slug<input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} placeholder="tiktok-estudiantes" className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 font-mono text-xs" /></label><label className="block text-[10px] font-bold text-slate-600">Mensaje de WhatsApp<textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs" /></label><button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[10px] font-black text-white"><Save size={13} /> Guardar enlace</button></form>}
      {links.length === 0 ? <p className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">Todavía no hay enlaces asociados. Crea el primero para TikTok, Instagram u otra red.</p> : <div className="grid gap-3 md:grid-cols-2">{links.map((link) => <div key={link.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black text-slate-800">{link.name}</p><p className="mt-1 font-mono text-[10px] text-primary">{getPublicMarketingLinkUrl(link.slug)}</p></div><span className="text-[10px] font-black text-slate-400">{link.clicks} clics</span></div><div className="mt-3 flex gap-2"><button onClick={() => copy(link.slug)} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-black text-slate-600"><Copy size={12} /> {copied === link.slug ? 'Copiado' : 'Copiar'}</button><button onClick={() => openEdit(link)} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-black text-slate-600"><Pencil size={12} /> Editar</button><button onClick={() => remove(link.id)} className="inline-flex items-center gap-1 rounded-lg bg-rose-50 px-2.5 py-1.5 text-[10px] font-black text-rose-600"><Trash2 size={12} /> Borrar</button><a href={getPublicMarketingLinkUrl(link.slug)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1.5 text-[10px] font-black text-slate-600"><ExternalLink size={12} /> Abrir</a></div></div>)}</div>}
      <button onClick={() => navigate('/backoffice/marketing-studio/enlaces')} className="inline-flex items-center gap-1.5 text-[10px] font-black text-primary hover:underline"><Link2 size={13} /> Ver biblioteca completa de enlaces</button>
    </section>
  );
};
