import React, { useState } from 'react';
import { Settings2 } from 'lucide-react';
import Button from '@/components/atoms/Button';
import { useConsent, type ConsentCategory } from '@/context/ConsentContext';

const optionalCategories: Array<{ key: Exclude<ConsentCategory, 'necessary'>; label: string; description: string }> = [
  { key: 'preferences', label: 'Preferencias', description: 'Recuerdan opciones de idioma y experiencia.' },
  { key: 'analytics', label: 'Analítica', description: 'Ayudan a medir el uso de la web de forma agregada.' },
  { key: 'marketing', label: 'Marketing', description: 'Permiten medir campañas y publicidad relevante.' },
];

const ConsentPreferences: React.FC = () => {
  const { choices, updateChoices, rejectOptional } = useConsent();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(choices);
  const openPanel = () => { setDraft(choices); setOpen(true); };
  const save = () => { updateChoices(draft); setOpen(false); };

  return (
    <div className="space-y-4 border-t border-slate-200 pt-5">
      <Button variant="secondary" size="sm" onClick={openPanel}><Settings2 className="mr-2 size-4" aria-hidden="true" />Configurar cookies</Button>
      {open && <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5" role="region" aria-label="Preferencias de cookies">
        <h2 className="text-h3 text-text-main">Preferencias de cookies</h2>
        <p className="mt-2 text-body-reg text-text-secondary">Puedes cambiar tu elección en cualquier momento. Las cookies necesarias siempre permanecen activas.</p>
        <div className="mt-4 space-y-3">
          <label className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 opacity-75"><input type="checkbox" checked disabled className="mt-1" /><span><strong className="block text-sm text-text-main">Necesarias</strong><span className="text-caption text-text-secondary">Funcionamiento básico y seguridad.</span></span></label>
          {optionalCategories.map(({ key, label, description }) => <label key={key} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3"><input type="checkbox" checked={draft[key]} onChange={(event) => setDraft({ ...draft, [key]: event.target.checked })} className="mt-1" /><span><strong className="block text-sm text-text-main">{label}</strong><span className="text-caption text-text-secondary">{description}</span></span></label>)}
        </div>
        <div className="mt-4 flex flex-wrap gap-3"><Button variant="primary" size="sm" onClick={save}>Guardar preferencias</Button><Button variant="ghost" size="sm" onClick={() => { rejectOptional(); setOpen(false); }}>Retirar consentimiento</Button></div>
      </div>}
    </div>
  );
};

export default ConsentPreferences;
