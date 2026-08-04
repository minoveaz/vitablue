import React from 'react';
import { BarChart3, Boxes, Globe, Image, LayoutDashboard, Palette, Sparkles } from 'lucide-react';
import SaaSShell from '@/components/layouts/SaaSShell';

export const backofficeNavigation = [
  { to: '/backoffice', label: 'Inicio del backoffice', icon: LayoutDashboard, end: true },
  { to: '/backoffice/catalogo', label: 'Catálogo de productos', icon: Boxes, end: true },
  { to: '/backoffice/marketing-studio/identidad-de-marca', label: 'Identidad de marca', icon: Palette },
  { to: '/backoffice/marketing-studio/perfiles-sociales', label: 'Perfiles sociales', icon: Image },
  { to: '/backoffice/marketing-studio/campanas', label: 'Gestión de campañas', icon: BarChart3 },
  { to: '/backoffice/marketing-studio/conexiones', label: 'Conexiones API', icon: Globe },
  { to: '/backoffice/marketing-studio/generador-contenido', label: 'Generador de contenido', icon: Sparkles },
];

interface BackofficeShellProps { children: React.ReactNode; title?: string; eyebrow?: string; }

const BackofficeShell: React.FC<BackofficeShellProps> = ({ children, title = 'Backoffice VitaBlue', eyebrow = 'Panel de Administración' }) => (
  <SaaSShell navigation={backofficeNavigation} title={title} eyebrow={eyebrow}>{children}</SaaSShell>
);

export default BackofficeShell;
