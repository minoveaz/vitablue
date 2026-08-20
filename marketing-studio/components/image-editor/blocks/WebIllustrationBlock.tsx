import React from 'react';
import { ImageLayer } from '../../../types/imageStudio';
import * as Illustrations from '../../../../components/illustrations';

export interface WebIllustrationBlockProps {
  layer: ImageLayer;
  onUpdateLayerProps?: (layerId: string, patch: Record<string, unknown>) => void;
}

// Mapa de identificadores de ilustraciones a sus componentes reales
export const WEB_ILLUSTRATION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  // Salud & Médico
  'medical-attention': Illustrations.MedicalAttentionIllustration,
  'student': Illustrations.StudentIllustration,
  'prevention': Illustrations.PreventionIllustration,
  'dental': Illustrations.DentalIllustration,
  'health-consultation': Illustrations.HealthIllustration,
  'mental-health': Illustrations.MentalHealthIllustration,

  // Viajes & Extranjería
  'passport': Illustrations.PassportIllustration,
  'assistance': Illustrations.TravelIllustration,
  'destination': Illustrations.DestinationIllustration,
  'boarding-pass': Illustrations.BoardingPassIllustration,
  'adventure': Illustrations.AdventureIllustration,

  // Finanzas & Ahorro
  'piggy-bank': Illustrations.PiggyBankIllustration,
  'vault': Illustrations.SecurityIllustration,
  'policy': Illustrations.PolicyIllustration,
  'wallet': Illustrations.WalletIllustration,
  'life': Illustrations.LifeIllustration,
  'market': Illustrations.FinanceIllustration,

  // Hogar & Familia
  'family': Illustrations.FamilyIllustration,
  'home-cover': Illustrations.HomeIllustration,
  'pet': Illustrations.PetIllustration,
  'moving': Illustrations.MovingIllustration,
  'smart-home': Illustrations.SmartHomeIllustration,

  // Confianza & Ventas
  'target': Illustrations.TargetIllustration,
  'deal': Illustrations.DealIllustration,
  'coverage': Illustrations.CoverageIllustration,
  'partners': Illustrations.PartnersIllustration,
  'growth': Illustrations.GrowthIllustration,

  // Auto & Movilidad
  'car': Illustrations.CarIllustration,
  'bike': Illustrations.BikeIllustration,
  'accident': Illustrations.AccidentIllustration,
  'tow-truck': Illustrations.TowTruckIllustration,
  'keys': Illustrations.KeysIllustration,

  // Tech & Soporte
  'accompaniment': Illustrations.AccompanimentIllustration,
  'support': Illustrations.SupportIllustration,
  'profile': Illustrations.ProfileIllustration,
  'cloud': Illustrations.CloudIllustration,
  'uikit': Illustrations.UIKitIllustration,

  // Siniestros
  'theft': Illustrations.TheftIllustration,
  'water-leak': Illustrations.WaterLeakIllustration,
  'broken-glass': Illustrations.BrokenGlassIllustration,
  'storm': Illustrations.StormIllustration,
};

export const WebIllustrationBlock: React.FC<WebIllustrationBlockProps> = ({ layer }) => {
  const blockProps = (layer.props ?? {}) as Record<string, unknown>;
  const illustrationId = String(blockProps.illustrationId ?? 'medical-attention');
  const Component = WEB_ILLUSTRATION_COMPONENTS[illustrationId] || Illustrations.MedicalAttentionIllustration;

  const colorPastel = String(blockProps.colorPastel ?? '#94D2BD');
  const colorPrimary = String(blockProps.colorPrimary ?? (layer.fill || '#005F73'));
  const colorSecondary = String(blockProps.colorSecondary ?? '#FFFFFF');
  const colorNeutral = String(blockProps.colorNeutral ?? '#1e293b');
  const colorAccent = String(blockProps.colorAccent ?? '#EE9B00');

  return (
    <div
      className="w-full h-full flex items-center justify-center select-none overflow-hidden"
      style={
        {
          '--color-pastel': colorPastel,
          '--color-primary': colorPrimary,
          '--color-secondary': colorSecondary,
          '--color-neutral': colorNeutral,
          '--color-accent': colorAccent,
        } as React.CSSProperties
      }
    >
      <div className="w-full h-full flex items-center justify-center pointer-events-none [&>svg]:w-full [&>svg]:h-full [&>svg]:max-h-full [&>svg]:max-w-full">
        <Component />
      </div>
    </div>
  );
};
