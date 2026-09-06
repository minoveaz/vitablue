import React, { useState } from 'react';
import Button from '@/components/atoms/Button';

export interface QuoteEstimatorOption {
  id: string;
  label: string;
}

export interface QuoteEstimatorProps {
  title?: string;
  description?: string;
  ageLabel?: string;
  initialAge?: number;
  minAge?: number;
  maxAge?: number;
  ageSuffix?: string;
  modalityLabel?: string;
  options: QuoteEstimatorOption[];
  initialOption?: string;
  calculatePrice: (age: number, option: string) => string;
  calculateSecondaryPrice?: (age: number, option: string) => string;
  priceLabel?: string;
  priceSuffix?: string;
  personalizedPriceLabel?: string;
  submitLabel?: string;
  onSubmit?: (age: number, option: string) => void;
}

const QuoteEstimator: React.FC<QuoteEstimatorProps> = ({
  title = 'Estimador de Cuota',
  description = 'Calcula un precio aproximado según tu edad y modalidad.',
  ageLabel = 'Edad del Asegurado',
  initialAge = 30,
  minAge = 18,
  maxAge = 65,
  ageSuffix = 'años',
  modalityLabel = 'Modalidad',
  options,
  initialOption,
  calculatePrice,
  calculateSecondaryPrice,
  priceLabel = 'Cuota Estimada:',
  priceSuffix = '€/mes',
  personalizedPriceLabel = 'Precio personalizado',
  submitLabel = 'Iniciar Contratación Online',
  onSubmit,
}) => {
  const [age, setAge] = useState(initialAge);
  const [selectedOption, setSelectedOption] = useState(initialOption ?? options[0]?.id ?? '');
  const price = calculatePrice(age, selectedOption);
  const secondaryPrice = calculateSecondaryPrice ? calculateSecondaryPrice(age, selectedOption) : undefined;

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-slate-100 bg-white p-6 text-left text-text-main shadow-xl sm:p-8">
      <div>
        <h2 className="text-h3 font-display font-black">{title}</h2>
        <p className="mt-1 text-xs font-semibold text-text-secondary">{description}</p>
      </div>

      <div className="space-y-4">
        <label className="block text-[10px] font-black uppercase tracking-wider text-text-secondary">
          {ageLabel}: <span className="ml-1 text-sm font-sans font-black text-primary">{age} {ageSuffix}</span>
          <input
            type="range"
            min={minAge}
            max={maxAge}
            value={age}
            onChange={(event) => setAge(Number(event.target.value))}
            className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-primary"
          />
        </label>

        <div>
          <label className="mb-2 block text-[10px] font-black uppercase tracking-wider text-text-secondary">{modalityLabel}</label>
          <div className="grid grid-cols-3 gap-2">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedOption(option.id)}
                className={`min-h-10 rounded-xl border px-1 py-2.5 text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
                  selectedOption === option.id
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-slate-150 bg-white text-text-secondary hover:bg-slate-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-slate-50/90 p-4 sm:p-4.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary">
            {priceLabel}
          </span>
          {secondaryPrice && (
            <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
              {secondaryPrice}
            </span>
          )}
        </div>

        <div className="mt-2.5 flex items-baseline">
          {price === 'Consultar' ? (
            <span className="text-base font-black text-primary">Consultar asesor</span>
          ) : price === 'Personalizado' ? (
            <span className="text-base font-black text-primary">{personalizedPriceLabel}</span>
          ) : (
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs font-bold text-text-secondary">Desde</span>
              <span className="text-2xl sm:text-3xl font-sans font-black text-text-main tracking-tight">
                {price}
              </span>
              <span className="text-xs font-bold text-text-secondary">
                {priceSuffix}
              </span>
            </div>
          )}
        </div>
      </div>



      <Button variant="accent" className="w-full whitespace-nowrap font-bold shadow-md shadow-accent/15" onClick={() => onSubmit?.(age, selectedOption)}>
        {submitLabel}
      </Button>
    </div>
  );
};

export default QuoteEstimator;
