import React from 'react';
import { Building2, Check } from 'lucide-react';
import { EXPORT_PROFILES } from '../exportProfiles';

export const ProfilesConfigPanel: React.FC<{
  activeProfileId: string;
  onSelectProfile: (id: string) => void;
}> = ({ activeProfileId, onSelectProfile }) => {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Building2 className="size-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">
              Perfiles de Exportación & Aseguradoras
            </h2>
            <p className="text-xs text-slate-500">
              Esquemas de mapeo de campos y formateo adaptados a los portales de emisión de cada aseguradora.
            </p>
          </div>
        </div>
      </div>

      {/* Grid de Perfiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {EXPORT_PROFILES.map((profile) => {
          const isActive = profile.id === activeProfileId;

          return (
            <div
              key={profile.id}
              className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                isActive
                  ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{profile.icon}</span>
                    <h3 className="font-bold text-sm text-slate-900">{profile.shortLabel}</h3>
                  </div>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary text-white px-2 py-0.5 text-[10px] font-black">
                      <Check className="size-3" /> Activo
                    </span>
                  )}
                </div>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed font-medium">
                  {profile.description}
                </p>

                <div className="mt-4 space-y-2 text-xs">
                  <div className="rounded-lg bg-slate-50 p-2.5">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Tratamiento de Apellidos</p>
                    <p className="font-bold text-slate-800 text-[11px] mt-0.5">
                      {profile.id === 'aseguradora-1'
                        ? 'Separación estricta (1º Apellido y 2º Apellido)'
                        : profile.id === 'aseguradora-2'
                          ? 'Apellidos agrupados en un único campo'
                          : 'Estándar internacional ICAO'}
                    </p>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-2.5">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Formato de Fechas</p>
                    <p className="font-bold text-slate-800 text-[11px] mt-0.5">DD/MM/AAAA</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onSelectProfile(profile.id)}
                  disabled={isActive}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-primary text-white cursor-default shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-primary hover:text-primary'
                  }`}
                >
                  {isActive ? '✓ Perfil Predeterminado' : 'Establecer como Predeterminado'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
