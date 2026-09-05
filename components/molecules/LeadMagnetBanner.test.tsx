import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LeadMagnetBanner } from './LeadMagnetBanner';

describe('LeadMagnetBanner component', () => {
  it('renders inline banner correctly in Spanish with download link and WhatsApp action', () => {
    const html = renderToStaticMarkup(<LeadMagnetBanner isEnglish={false} sourceContext="test-blog" />);

    expect(html).toContain('data-testid="lead-magnet-banner"');
    expect(html).toContain('Checklist Definitiva: Requisitos Médicos Oficiales para Visado de Estudiante');
    expect(html).toContain('Descargar Checklist (PDF)');
    expect(html).toContain('/downloads/checklist-visado-estudiante-espana.pdf');
    expect(html).toContain('wa.me');
    expect(html).toContain('CHECKLIST-ESTUDIANTE');
  });

  it('renders inline banner correctly in English', () => {
    const html = renderToStaticMarkup(<LeadMagnetBanner isEnglish={true} sourceContext="test-blog-en" />);

    expect(html).toContain('data-testid="lead-magnet-banner"');
    expect(html).toContain('Official Consular Resource • 2026/2027');
    expect(html).toContain('Definitive Checklist: Health Insurance for Spain Student Visa');
    expect(html).toContain('Download Checklist (PDF)');
    expect(html).toContain('/downloads/spain-student-visa-health-insurance-checklist.pdf');
    expect(html).toContain('wa.me');
    expect(html).toContain('CHECKLIST-ESTUDIANTE-EN');
  });

  it('renders sidebar variant correctly', () => {
    const html = renderToStaticMarkup(<LeadMagnetBanner variant="sidebar" isEnglish={false} />);

    expect(html).toContain('data-testid="lead-magnet-sidebar"');
    expect(html).toContain('Checklist Oficial: Requisitos Médicos para Visado (PDF)');
    expect(html).toContain('Descargar PDF Gratis');
    expect(html).toContain('/downloads/checklist-visado-estudiante-espana.pdf');
    expect(html).toContain('Revisar dudas por WhatsApp');
  });
});
