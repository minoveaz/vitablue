import { describe, it, expect } from 'vitest';
import {
  resolveWhatsAppContext,
  buildContextualWhatsAppUrl,
  getNavbarWhatsAppUrl,
  getFooterWhatsAppUrl,
  getFloatingWhatsAppUrl,
  getBlogWhatsAppUrl,
  getProductWhatsAppUrl,
  DEFAULT_WHATSAPP_PHONE,
} from './whatsappLinks';

describe('WhatsApp Contextual Links & Attribution Helper', () => {
  it('resolves Spanish and English student visa landing contexts', () => {
    const es = resolveWhatsAppContext('/productos/seguros-salud/seguro-medico-estudiantes');
    expect(es.tag).toBe('LANDING-ESTUDIANTES-ES');
    expect(es.message.toLowerCase()).toContain('estudiante');

    const en = resolveWhatsAppContext('/en/health-insurance-student-visa-spain');
    expect(en.tag).toBe('LANDING-ESTUDIANTES-EN');
    expect(en.message).toContain('Student Visa');
  });

  it('resolves expat and digital nomad landings in ES and EN', () => {
    const expatEs = resolveWhatsAppContext('/productos/seguros-salud/seguro-expatriados');
    expect(expatEs.tag).toBe('LANDING-EXPATRIADOS-ES');

    const expatEn = resolveWhatsAppContext('/en/health-insurance-expatriates-spain');
    expect(expatEn.tag).toBe('LANDING-EXPATRIADOS-EN');

    const nomadEs = resolveWhatsAppContext('/productos/seguros-salud/seguro-nomadas-digitales');
    expect(nomadEs.tag).toBe('LANDING-NOMADAS-ES');

    const nomadEn = resolveWhatsAppContext('/en/digital-nomad-insurance-spain');
    expect(nomadEn.tag).toBe('LANDING-NOMADAS-EN');
  });

  it('resolves Sanitas Mascotas and niche products', () => {
    const pet = resolveWhatsAppContext('/productos/seguro-mascotas/sanitas-mascotas');
    expect(pet.tag).toBe('LANDING-MASCOTAS');
    expect(pet.message).toContain('Mascotas');

    const sanitasMasSalud = resolveWhatsAppContext('/productos/seguros-salud/seguros-sanitas/sanitas-mas-salud');
    expect(sanitasMasSalud.tag).toBe('LANDING-SANITAS-MAS-SALUD');

    const foreigners = resolveWhatsAppContext('/productos/seguros-salud/seguro-salud-extranjeros');
    expect(foreigners.tag).toBe('LANDING-EXTRANJEROS');

    const life = resolveWhatsAppContext('/productos/seguro-vida');
    expect(life.tag).toBe('LANDING-VIDA');

    const travel = resolveWhatsAppContext('/productos/seguro-viaje');
    expect(travel.tag).toBe('LANDING-VIAJE');

    const decesos = resolveWhatsAppContext('/productos/seguro-para-decesos/asistencia-familiar');
    expect(decesos.tag).toBe('LANDING-DECESOS');
  });

  it('resolves geo destination and consulate paths', () => {
    const madrid = resolveWhatsAppContext('/productos/seguros-salud/seguro-medico-estudiantes/madrid');
    expect(madrid.tag).toBe('LANDING-ESTUDIANTES-MADRID');
    expect(madrid.message).toContain('Madrid');

    const bogota = resolveWhatsAppContext('/productos/seguros-salud/seguro-medico-estudiantes/colombia');
    expect(bogota.tag).toBe('LANDING-ESTUDIANTES-COLOMBIA');
    expect(bogota.message).toContain('Colombia');
  });

  it('resolves blog articles with clean tags', () => {
    const article = resolveWhatsAppContext('/blog/requisitos-seguro-medico-visado-estudiante-espana');
    expect(article.tag).toContain('BLOG-');
    expect(article.message).toContain('blog de VitaBlue');

    const articleEn = resolveWhatsAppContext('/en/blog/student-visa-spain-health-insurance-requirements');
    expect(articleEn.tag).toContain('BLOG-');
    expect(articleEn.message).toContain('VitaBlue blog');
  });

  it('generates fully formed https://wa.me link with encoded parameters', () => {
    const url = buildContextualWhatsAppUrl({
      pathname: '/productos/seguro-mascotas/sanitas-mascotas',
    });

    expect(url).toContain(`https://wa.me/${DEFAULT_WHATSAPP_PHONE}?text=`);
    const decodedText = decodeURIComponent(url);
    expect(decodedText).toContain('[LANDING-MASCOTAS]');
    expect(decodedText).toContain('Sanitas Mascotas');
  });

  it('provides specialized structural helpers for Navbar, Footer and Floating widget', () => {
    const navUrl = getNavbarWhatsAppUrl('es', '/sobre-nosotros');
    expect(decodeURIComponent(navUrl)).toContain('[NAVBAR-SOBRE-NOSOTROS-ES]');

    const footerUrl = getFooterWhatsAppUrl('en', '/en/contact');
    expect(decodeURIComponent(footerUrl)).toContain('[FOOTER-CONTACT-PAGE-EN]');

    const floatUrl = getFloatingWhatsAppUrl('/productos/seguros-salud/seguro-nomadas-digitales');
    expect(decodeURIComponent(floatUrl)).toContain('[FLOAT-LANDING-NOMADAS-ES]');
  });

  it('provides specialized blog and product helpers', () => {
    const blogUrl = getBlogWhatsAppUrl('Guía de Visado', false);
    expect(decodeURIComponent(blogUrl)).toContain('[BLOG-ADVISOR-ES]');
    expect(decodeURIComponent(blogUrl)).toContain('Guía de Visado');

    const prodUrl = getProductWhatsAppUrl('mascotas');
    expect(decodeURIComponent(prodUrl)).toContain('[LANDING-MASCOTAS]');
  });
});
