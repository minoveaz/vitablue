import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, MessageCircle, Phone } from 'lucide-react';
import BrandHero from '../../components/organisms/BrandHero';

const Contact: React.FC = () => {
  const isEnglish = window.location.pathname.startsWith('/en');
  const [submitted, setSubmitted] = useState(false);
  const content = isEnglish ? {
    title: 'Contact VitaBlue | Insurance advice',
    description: 'Contact VitaBlue for help comparing health, expat, student, pet and other insurance options in Spain.',
    eyebrow: 'We are here to help', heading: 'Tell us what you need.', intro: 'Share a few details and our team will help you find the most relevant next step.', name: 'Name', email: 'Email', message: 'How can we help?', consent: 'I agree to VitaBlue processing my details to answer this request.', submit: 'Send request', success: 'Your email client is ready. We will get back to you as soon as possible.', emailLabel: 'Email us', phoneLabel: 'Call us', whatsappLabel: 'Message us on WhatsApp', whatsapp: 'Open WhatsApp', emailSubject: 'VitaBlue contact request', contactPath: '/en/contact',
  } : {
    title: 'Contacto VitaBlue | Asesoramiento en seguros',
    description: 'Contacta con VitaBlue para comparar seguros de salud, expatriados, estudiantes, mascotas y otras coberturas en España.',
    eyebrow: 'Estamos para ayudarte', heading: 'Cuéntanos qué necesitas.', intro: 'Comparte algunos datos y nuestro equipo te ayudará a encontrar el siguiente paso más adecuado.', name: 'Nombre', email: 'Email', message: '¿En qué podemos ayudarte?', consent: 'Acepto que VitaBlue trate mis datos para responder a esta solicitud.', submit: 'Enviar solicitud', success: 'Tu cliente de correo está listo. Te responderemos lo antes posible.', emailLabel: 'Escríbenos', phoneLabel: 'Llámanos', whatsappLabel: 'Escríbenos por WhatsApp', whatsapp: 'Abrir WhatsApp', emailSubject: 'Solicitud de contacto VitaBlue', contactPath: '/contacto',
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(content.emailSubject);
    const body = encodeURIComponent(`Nombre: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`);
    window.location.href = `mailto:info@vitablue.es?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return <div className="w-full bg-background-light text-text-main">
    <Helmet>
      <title>{content.title}</title>
      <meta name="description" content={content.description} />
      <meta property="og:title" content={content.title} />
      <meta property="og:description" content={content.description} />
      <meta property="og:image" content="https://www.vitablue.es/vitablue_logo_social.jpg" />
      <link rel="canonical" href={`https://www.vitablue.es${content.contactPath}`} />
      <script type="application/ld+json">{JSON.stringify({ '@context': 'https://schema.org', '@type': 'ContactPage', name: content.title, description: content.description, url: `https://www.vitablue.es${content.contactPath}`, mainEntity: { '@type': 'Organization', name: 'VitaBlue', email: 'info@vitablue.es', telephone: '+34694583452' } })}</script>
    </Helmet>

    <main>
      <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl text-xs font-bold text-text-secondary">VitaBlue <span className="px-2 text-slate-300">/</span> {isEnglish ? 'Contact' : 'Contacto'}</div></div>
      <BrandHero eyebrow={content.eyebrow} title={content.heading} description={content.intro} />

      <section className="px-6 py-14 sm:px-8 lg:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <a href="mailto:info@vitablue.es" className="flex items-start gap-4 rounded-3xl border border-primary/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><Mail className="mt-1 h-6 w-6 text-primary" aria-hidden="true" /><span><strong className="block">{content.emailLabel}</strong><span className="text-text-secondary">info@vitablue.es</span></span></a>
            <a href="tel:+34694583452" className="flex items-start gap-4 rounded-3xl border border-primary/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><Phone className="mt-1 h-6 w-6 text-primary" aria-hidden="true" /><span><strong className="block">{content.phoneLabel}</strong><span className="text-text-secondary">+34 694 58 34 52</span></span></a>
            <a href="https://wa.me/34694583452" target="_blank" rel="noreferrer" className="flex items-start gap-4 rounded-3xl border border-primary/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"><MessageCircle className="mt-1 h-6 w-6 text-primary" aria-hidden="true" /><span><strong className="block">{content.whatsappLabel}</strong><span className="text-text-secondary">{content.whatsapp}</span></span></a>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-bold">{content.name}<input required name="name" autoComplete="name" className="mt-2 min-h-12 w-full border border-slate-300 px-4 font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
              <label className="text-sm font-bold">{content.email}<input required type="email" name="email" autoComplete="email" className="mt-2 min-h-12 w-full border border-slate-300 px-4 font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
            </div>
            <label className="mt-5 block text-sm font-bold">{content.message}<textarea required name="message" rows={5} className="mt-2 w-full resize-y border border-slate-300 px-4 py-3 font-medium outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" /></label>
            <label className="mt-5 flex items-start gap-3 text-sm font-medium leading-6 text-text-secondary"><input required type="checkbox" name="consent" className="mt-1 h-4 w-4 accent-primary" />{content.consent}</label>
            <button type="submit" className="mt-6 min-h-12 w-full bg-primary px-6 py-3 text-sm font-black text-white transition hover:bg-primary-dark">{content.submit}</button>
            {submitted && <p role="status" className="mt-4 text-sm font-bold text-primary">{content.success}</p>}
          </form>
        </div>
      </section>
    </main>
  </div>;
};

export default Contact;
