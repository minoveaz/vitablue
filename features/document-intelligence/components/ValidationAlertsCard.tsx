import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Info,
  ShieldCheck,
} from 'lucide-react';
import type { ValidationAlert } from '../rules/types';

export const ValidationAlertsCard: React.FC<{
  alerts: ValidationAlert[];
  onFieldFocus?: (fieldKey: string) => void;
}> = ({ alerts, onFieldFocus }) => {
  const [collapsed, setCollapsed] = useState(false);

  const errors = alerts.filter((a) => a.severity === 'error');
  const warnings = alerts.filter((a) => a.severity === 'warning');
  const infos = alerts.filter((a) => a.severity === 'info');

  if (alerts.length === 0) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 px-4 py-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 className="size-4.5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-black text-emerald-900">
              Conformidad Completa: 0 alertas detectadas
            </p>
            <p className="text-[11px] text-emerald-700">
              El documento cumple todas las reglas de integridad, límites de edad y requisitos de visado.
            </p>
          </div>
        </div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 border border-emerald-300">
          Apto para Emisión
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
      {/* Header Resumen */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setCollapsed(!collapsed)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') setCollapsed(!collapsed);
        }}
        className="flex items-center justify-between cursor-pointer border-b border-slate-100 bg-slate-50/80 px-4 py-3 select-none hover:bg-slate-100/70 transition-colors"
      >
        <div className="flex flex-wrap items-center gap-2">
          <ShieldCheck className="size-4 text-primary shrink-0" />
          <h4 className="text-xs font-black text-slate-800">
            Diagnóstico de Negocio & Validación:
          </h4>

          <div className="flex items-center gap-1.5 text-[10px] font-black">
            {errors.length > 0 && (
              <span className="rounded-full bg-red-100 px-2 py-0.5 text-red-700 border border-red-200">
                {errors.length} {errors.length === 1 ? 'Error' : 'Errores'}
              </span>
            )}
            {warnings.length > 0 && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-amber-800 border border-amber-200">
                {warnings.length} {warnings.length === 1 ? 'Alerta' : 'Alertas'}
              </span>
            )}
            {infos.length > 0 && (
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-sky-700 border border-sky-200">
                {infos.length} {infos.length === 1 ? 'Nota' : 'Notas'}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-[11px] font-bold">
            {collapsed ? 'Ver detalle' : 'Ocultar'}
          </span>
          {collapsed ? <ChevronDown className="size-3.5" /> : <ChevronUp className="size-3.5" />}
        </div>
      </div>

      {/* Lista de Alertas Desglosadas */}
      {!collapsed && (
        <div className="divide-y divide-slate-100">
          {alerts.map((alert, idx) => {
            const isError = alert.severity === 'error';
            const isWarning = alert.severity === 'warning';

            return (
              <div
                key={`${alert.ruleId}-${idx}`}
                className={`flex items-start gap-3 p-3.5 text-xs transition-colors ${
                  isError
                    ? 'bg-red-50/40'
                    : isWarning
                      ? 'bg-amber-50/30'
                      : 'bg-sky-50/20'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isError ? (
                    <AlertOctagon className="size-4 text-red-600" />
                  ) : isWarning ? (
                    <AlertTriangle className="size-4 text-amber-600" />
                  ) : (
                    <Info className="size-4 text-sky-600" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`font-black text-[12px] ${
                        isError
                          ? 'text-red-900'
                          : isWarning
                            ? 'text-amber-900'
                            : 'text-sky-900'
                      }`}
                    >
                      {alert.title}
                    </p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {alert.ruleName}
                    </span>
                  </div>

                  <p className="mt-0.5 text-slate-600 leading-relaxed text-[11px]">
                    {alert.message}
                  </p>

                  {alert.recommendation && (
                    <p className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                      <span className="font-bold text-primary">💡 Recomendación:</span>{' '}
                      {alert.recommendation}
                    </p>
                  )}
                </div>

                {alert.affectedFields && alert.affectedFields.length > 0 && onFieldFocus && (
                  <button
                    type="button"
                    onClick={() => onFieldFocus(alert.affectedFields![0])}
                    className="shrink-0 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[10px] font-bold text-slate-700 hover:border-primary hover:text-primary transition-colors shadow-2xs"
                    title={`Ir al campo ${alert.affectedFields.join(', ')}`}
                  >
                    Revisar campo
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
