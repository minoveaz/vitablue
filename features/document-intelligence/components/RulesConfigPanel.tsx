import React from 'react';
import {
  FileCheck,
  Globe,
  RotateCcw,
  Shield,
  Sliders,
} from 'lucide-react';
import { RULE_DEFINITIONS } from '../rules/defaultRules';
import { useRulesConfig } from '../rules/rulesStore';
import type { RuleCategory, RuleSeverity } from '../rules/types';

const CATEGORY_METADATA: Record<
  RuleCategory,
  { label: string; icon: React.ComponentType<{ className?: string }>; description: string }
> = {
  core_integrity: {
    label: 'Integridad de Identidad & Formatos (Core)',
    icon: Shield,
    description: 'Algoritmos matemáticos y comprobaciones deterministas de formato (DNI, NIE, MRZ).',
  },
  insurance_policy: {
    label: 'Reglas de Negocio & Pólizas de Seguro',
    icon: FileCheck,
    description: 'Límites de edad actuarial, requisitos de tomador para menores y normas de emisión.',
  },
  visa_residency: {
    label: 'Requisitos de Visado, Estancia & Extranjería',
    icon: Globe,
    description: 'Vigencia mínima para consulados (Schengen/estudios) y medios de cobro extranjeros.',
  },
};

const SEVERITY_CONFIG: Record<
  RuleSeverity,
  { label: string; bg: string; text: string; border: string }
> = {
  error: {
    label: 'Bloqueante (Error)',
    bg: 'bg-red-50 text-red-700',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  warning: {
    label: 'Advertencia (Warning)',
    bg: 'bg-amber-50 text-amber-800',
    text: 'text-amber-800',
    border: 'border-amber-200',
  },
  info: {
    label: 'Informativo (Info)',
    bg: 'bg-sky-50 text-sky-700',
    text: 'text-sky-700',
    border: 'border-sky-200',
  },
};

export const RulesConfigPanel: React.FC = () => {
  const { config, updateRule, resetToDefaults } = useRulesConfig();

  const categories: RuleCategory[] = ['core_integrity', 'insurance_policy', 'visa_residency'];

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
      {/* Header del Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Sliders className="size-6" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">
              Motor de Reglas & Validación de Negocio
            </h2>
            <p className="text-xs text-slate-500">
              Configura umbrales, severidades y reglas activas para la extracción y emisión de pólizas.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={resetToDefaults}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
          title="Restaurar todas las reglas a sus valores de fábrica"
        >
          <RotateCcw className="size-3.5 text-slate-400" /> Restaurar por defecto
        </button>
      </div>

      {/* Categorías de Reglas */}
      {categories.map((category) => {
        const meta = CATEGORY_METADATA[category];
        const Icon = meta.icon;
        const rules = RULE_DEFINITIONS.filter((r) => r.category === category);

        return (
          <div
            key={category}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            {/* Header de Categoría */}
            <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <Icon className="size-4.5 text-primary" />
                <div>
                  <h3 className="text-sm font-black text-slate-800">{meta.label}</h3>
                  <p className="text-[11px] text-slate-500">{meta.description}</p>
                </div>
              </div>
            </div>

            {/* Listado de Reglas */}
            <div className="divide-y divide-slate-100">
              {rules.map((rule) => {
                const ruleState = config[rule.id] ?? {
                  enabled: rule.defaultEnabled,
                  severity: rule.defaultSeverity,
                  customThresholdValue: rule.configurableThreshold?.defaultValue,
                };

                return (
                  <div
                    key={rule.id}
                    className={`flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 transition-colors ${
                      ruleState.enabled ? 'bg-white' : 'bg-slate-50/40 opacity-60'
                    }`}
                  >
                    {/* Switch + Info */}
                    <div className="flex items-start gap-3.5 max-w-xl">
                      {/* Toggle Switch */}
                      <label className="relative inline-flex cursor-pointer items-center mt-0.5 shrink-0">
                        <input
                          type="checkbox"
                          checked={ruleState.enabled}
                          onChange={(e) => updateRule(rule.id, { enabled: e.target.checked })}
                          className="peer sr-only"
                        />
                        <div className="peer h-5 w-9 rounded-full bg-slate-200 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-primary peer-checked:after:translate-x-full peer-focus:outline-none" />
                      </label>

                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-bold text-slate-900">{rule.name}</p>
                          {!ruleState.enabled && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-500">
                              Desactivada
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-slate-500 leading-relaxed">
                          {rule.description}
                        </p>
                      </div>
                    </div>

                    {/* Controles de Configuración: Severidad & Umbrales */}
                    <div className="flex flex-wrap items-center gap-3 pl-12 md:pl-0">
                      {/* Input de Umbral Configurable */}
                      {rule.configurableThreshold && (
                        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
                          <span className="text-[11px] font-bold text-slate-500">
                            {rule.configurableThreshold.label}:
                          </span>
                          <input
                            type="number"
                            disabled={!ruleState.enabled}
                            min={rule.configurableThreshold.min}
                            max={rule.configurableThreshold.max}
                            step={rule.configurableThreshold.step ?? 1}
                            value={
                              ruleState.customThresholdValue ??
                              rule.configurableThreshold.defaultValue
                            }
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              if (!isNaN(val)) {
                                updateRule(rule.id, { customThresholdValue: val });
                              }
                            }}
                            className="w-16 rounded border border-slate-200 bg-white px-2 py-0.5 text-center text-xs font-black text-slate-800 outline-none focus:border-primary disabled:opacity-50"
                          />
                          <span className="text-[11px] font-bold text-slate-400">
                            {rule.configurableThreshold.unit}
                          </span>
                        </div>
                      )}

                      {/* Selector de Severidad */}
                      <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
                        {(['error', 'warning', 'info'] as RuleSeverity[]).map((sev) => {
                          const isSelected = ruleState.severity === sev;
                          const sevMeta = SEVERITY_CONFIG[sev];

                          return (
                            <button
                              key={sev}
                              type="button"
                              disabled={!ruleState.enabled}
                              onClick={() => updateRule(rule.id, { severity: sev })}
                              className={`rounded-lg px-2.5 py-1 text-[11px] font-bold transition-all disabled:opacity-40 ${
                                isSelected
                                  ? `${sevMeta.bg} shadow-2xs font-black ring-1 ring-inset ${sevMeta.border}`
                                  : 'text-slate-500 hover:text-slate-800'
                              }`}
                            >
                              {sev === 'error' ? '🔴 Error' : sev === 'warning' ? '🟡 Alerta' : 'ℹ️ Info'}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
