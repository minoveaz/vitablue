import React, { useState } from 'react';
import { Calculator, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '@/components/atoms/Button';

interface ReimbursementCalculatorProps {
  className?: string;
  onCtaClick?: () => void;
}

export const ReimbursementCalculator: React.FC<ReimbursementCalculatorProps> = ({
  className = '',
  onCtaClick
}) => {
  const [invoiceAmount, setInvoiceAmount] = useState<number>(350);
  const [refundPercentage, setRefundPercentage] = useState<number>(80);

  const calculatedRefund = (invoiceAmount * refundPercentage) / 100;
  const calculatedOutofPocket = invoiceAmount - calculatedRefund;

  return (
    <div className={`bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-xl max-w-xl w-full flex flex-col gap-6 ${className}`}>
      
      {/* Header section */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-text-main uppercase tracking-wider">Calculadora de Reembolso</h3>
          <p className="text-[11px] text-text-secondary/70 font-semibold">Simula la devolución de tus facturas médicas</p>
        </div>
      </div>

      {/* Inputs Section */}
      <div className="flex flex-col gap-5">
        {/* Invoice Amount Input Slider */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-bold text-text-main">
            <span>Importe de la consulta / factura</span>
            <span className="text-sm font-extrabold text-primary">{invoiceAmount} €</span>
          </div>
          <input 
            type="range"
            min="20"
            max="1500"
            step="10"
            value={invoiceAmount}
            onChange={(e) => setInvoiceAmount(Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
            aria-label="Importe de factura"
          />
          <div className="flex justify-between text-[9px] text-text-secondary/50 font-bold">
            <span>20 €</span>
            <span>1500 €</span>
          </div>
        </div>

        {/* Reimbursement Percentage Selector */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center text-xs font-bold text-text-main">
            <span>Porcentaje de reembolso de tu póliza</span>
            <span className="text-sm font-extrabold text-primary">{refundPercentage}%</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[80, 90, 100].map((percentage) => (
              <button
                key={percentage}
                type="button"
                onClick={() => setRefundPercentage(percentage)}
                className={`py-2 px-3 rounded-xl border-2 text-xs font-bold transition-all duration-150 ${
                  refundPercentage === percentage 
                    ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                    : 'border-slate-100 hover:border-slate-200 text-text-secondary/70'
                }`}
              >
                {percentage}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Calculations / Summary Display */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100 flex flex-col gap-3">
        <div className="flex justify-between items-center pb-2.5 border-b border-slate-200/50">
          <span className="text-xs font-bold text-text-secondary">Te devuelve el seguro:</span>
          <span className="text-lg font-black text-green-600">+{calculatedRefund.toFixed(0)} €</span>
        </div>
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="text-text-secondary/70">Solo asumes tú:</span>
          <span className="text-text-main">{calculatedOutofPocket.toFixed(0)} €</span>
        </div>
      </div>

      {/* Bottom conversion elements */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <Button
          variant="primary"
          onClick={onCtaClick}
          rightIcon={<ArrowRight className="w-4 h-4" />}
          className="w-full text-xs font-bold py-3 px-5 shadow-lg shadow-primary/10"
        >
          Comparar seguros con reembolso
        </Button>
        <span className="text-[9px] text-text-secondary/60 font-semibold flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          Válido en cualquier especialista mundial.
        </span>
      </div>

    </div>
  );
};

export default ReimbursementCalculator;
