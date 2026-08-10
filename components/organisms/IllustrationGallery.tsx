import { useState, type ComponentType } from 'react';
import { CheckCheck, Copy } from 'lucide-react';
import {
  AccidentIllustration,
  AdventureIllustration,
  AccompanimentIllustration,
  BikeIllustration,
  BoardingPassIllustration,
  BrokenGlassIllustration,
  CarIllustration,
  CloudIllustration,
  CoverageIllustration,
  DealIllustration,
  DentalIllustration,
  DestinationIllustration,
  FamilyIllustration,
  FinanceIllustration,
  GrowthIllustration,
  HealthIllustration,
  HomeIllustration,
  KeysIllustration,
  LifeIllustration,
  MedicalAttentionIllustration,
  MentalHealthIllustration,
  MovingIllustration,
  PartnersIllustration,
  PassportIllustration,
  PetIllustration,
  PiggyBankIllustration,
  PolicyIllustration,
  PreventionIllustration,
  ProfileIllustration,
  SecurityIllustration,
  SmartHomeIllustration,
  StormIllustration,
  StudentIllustration,
  SupportIllustration,
  TargetIllustration,
  TheftIllustration,
  TowTruckIllustration,
  TravelIllustration,
  UIKitIllustration,
  WalletIllustration,
  WaterLeakIllustration,
} from '@/components/illustrations';

type IllustrationComponent = ComponentType;

type IllustrationEntry = {
  name: string;
  path: string;
  component: IllustrationComponent;
};

const illustrations: IllustrationEntry[] = [
  ['AccidentIllustration', 'auto/Accident.tsx', AccidentIllustration],
  ['BikeIllustration', 'auto/Bike.tsx', BikeIllustration],
  ['CarIllustration', 'auto/Car.tsx', CarIllustration],
  ['KeysIllustration', 'auto/Keys.tsx', KeysIllustration],
  ['TowTruckIllustration', 'auto/TowTruck.tsx', TowTruckIllustration],
  ['BrokenGlassIllustration', 'claims/BrokenGlass.tsx', BrokenGlassIllustration],
  ['StormIllustration', 'claims/Storm.tsx', StormIllustration],
  ['TheftIllustration', 'claims/Theft.tsx', TheftIllustration],
  ['WaterLeakIllustration', 'claims/WaterLeak.tsx', WaterLeakIllustration],
  ['LifeIllustration', 'finance/Life.tsx', LifeIllustration],
  ['FinanceIllustration', 'finance/Market.tsx', FinanceIllustration],
  ['PiggyBankIllustration', 'finance/PiggyBank.tsx', PiggyBankIllustration],
  ['PolicyIllustration', 'finance/Policy.tsx', PolicyIllustration],
  ['SecurityIllustration', 'finance/Vault.tsx', SecurityIllustration],
  ['WalletIllustration', 'finance/Wallet.tsx', WalletIllustration],
  ['DentalIllustration', 'health/Dental.tsx', DentalIllustration],
  ['HealthIllustration', 'health/HealthConsultation.tsx', HealthIllustration],
  ['MedicalAttentionIllustration', 'health/MedicalAttention.tsx', MedicalAttentionIllustration],
  ['MentalHealthIllustration', 'health/MentalHealth.tsx', MentalHealthIllustration],
  ['PreventionIllustration', 'health/Prevention.tsx', PreventionIllustration],
  ['StudentIllustration', 'health/Student.tsx', StudentIllustration],
  ['FamilyIllustration', 'home/Family.tsx', FamilyIllustration],
  ['HomeIllustration', 'home/HomeCover.tsx', HomeIllustration],
  ['MovingIllustration', 'home/Moving.tsx', MovingIllustration],
  ['PetIllustration', 'home/Pet.tsx', PetIllustration],
  ['SmartHomeIllustration', 'home/SmartHome.tsx', SmartHomeIllustration],
  ['CoverageIllustration', 'sales/Coverage.tsx', CoverageIllustration],
  ['DealIllustration', 'sales/Deal.tsx', DealIllustration],
  ['GrowthIllustration', 'sales/Growth.tsx', GrowthIllustration],
  ['PartnersIllustration', 'sales/Partners.tsx', PartnersIllustration],
  ['TargetIllustration', 'sales/Target.tsx', TargetIllustration],
  ['AccompanimentIllustration', 'tech/Accompaniment.tsx', AccompanimentIllustration],
  ['CloudIllustration', 'tech/Cloud.tsx', CloudIllustration],
  ['ProfileIllustration', 'tech/Profile.tsx', ProfileIllustration],
  ['SupportIllustration', 'tech/Support.tsx', SupportIllustration],
  ['UIKitIllustration', 'tech/UIKit.tsx', UIKitIllustration],
  ['AdventureIllustration', 'travel/Adventure.tsx', AdventureIllustration],
  ['TravelIllustration', 'travel/Assistance.tsx', TravelIllustration],
  ['BoardingPassIllustration', 'travel/BoardingPass.tsx', BoardingPassIllustration],
  ['DestinationIllustration', 'travel/Destination.tsx', DestinationIllustration],
  ['PassportIllustration', 'travel/Passport.tsx', PassportIllustration],
].map(([name, path, component]) => ({
  name: name as string,
  path: `components/illustrations/${path as string}`,
  component: component as IllustrationComponent,
}));

const IllustrationReference = ({ name, path }: { name: string; path: string }) => {
  const [copied, setCopied] = useState(false);

  const copyPath = async () => {
    await navigator.clipboard.writeText(path);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <div className="min-w-0">
        <p className="truncate text-[10px] font-bold uppercase text-text-secondary">{name}</p>
        <code className="block truncate text-[9px] text-text-secondary/70">{path}</code>
      </div>
      <button
        type="button"
        onClick={copyPath}
        className="shrink-0 rounded-md border border-primary/15 p-1.5 text-primary hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/30"
        aria-label={`Copiar ruta de ${name}`}
        title="Copiar ruta de la ilustración"
      >
        {copied ? <CheckCheck className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
};

const IllustrationGallery = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {illustrations.map(({ name, path, component: Illustration }) => (
      <div key={name} className="flex min-h-[170px] flex-col items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">
        <div className="flex h-24 w-full items-center justify-center text-primary">
          <Illustration />
        </div>
        <IllustrationReference name={name} path={path} />
      </div>
    ))}
  </div>
);

export default IllustrationGallery;
