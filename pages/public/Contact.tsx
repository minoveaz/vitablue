import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, Phone } from 'lucide-react';
import { WhatsAppIcon } from '../../components/atoms/WhatsAppIcon';
import BrandHero from '../../components/organisms/BrandHero';
import ContactChannelCard from '../../components/molecules/ContactChannelCard';
import InputText from '../../components/atoms/InputText';
import FormField from '../../components/molecules/FormField';
import Checkbox from '../../components/atoms/Checkbox';
import Button from '../../components/atoms/Button';
import { trackContactConversion } from '@/utils/analytics';
import { VITA_BLUE_ORGANIZATION_SCHEMA } from '@/utils/organizationSchema';


const Contact: React.FC = () => {
  const isEnglish = window.location.pathname.startsWith('/en');
  const [submitted, setSubmitted] = useState(false);
  
  const content = isEnglish ? {
    title: 'Contact VitaBlue | Insurance advice',
    description: 'Contact VitaBlue for help comparing health, expat, student, pet and other insurance options in Spain.',
    eyebrow: 'We are here to help', 
    heading: 'Tell us what you need.', 
    intro: 'Share a few details and our team will help you find the most relevant next step.', 
    name: 'Name', 
    email: 'Email', 
    message: 'How can we help?', 
    consent: 'I agree to VitaBlue processing my details to answer this request.', 
    submit: 'Send request', 
    success: 'Your email client is ready. We will get back to you as soon as possible.', 
    emailLabel: 'Email us', 
    phoneLabel: 'Call us', 
    whatsappLabel: 'Message us on WhatsApp', 
    whatsapp: 'Open WhatsApp', 
    emailSubject: 'VitaBlue contact request', 
    contactPath: '/en/contact',
  } : {
    title: 'Contacto VitaBlue | Asesoramiento en seguros',
    description: 'Contacta con VitaBlue para comparar seguros de salud, expatriados, estudiantes, mascotas y otras coberturas en España.',
    eyebrow: 'Estamos para ayudarte', 
    heading: 'Cuéntanos qué necesitas.', 
    intro: 'Comparte algunos datos y nuestro equipo te ayudará a encontrar el siguiente paso más adecuado.', 
    name: 'Nombre', 
    email: 'Email', 
    message: '¿En qué podemos ayudarte?', 
    consent: 'Acepto que VitaBlue trate mis datos para responder a esta solicitud.', 
    submit: 'Enviar solicitud', 
    success: 'Tu cliente de correo está listo. Te responderemos lo antes posible.', 
    emailLabel: 'Escríbenos', 
    phoneLabel: 'Llámanos', 
    whatsappLabel: 'Escríbenos por WhatsApp', 
    whatsapp: 'Abrir WhatsApp', 
    emailSubject: 'Solicitud de contacto VitaBlue', 
    contactPath: '/contacto',
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(content.emailSubject);
    const nameStr = String(data.get('name') || '');
    const emailStr = String(data.get('email') || '');

    // Google Ads conversion tracking with Enhanced Conversions
    trackContactConversion(
      'form',
      {
        form_name: 'contact_page',
        language: isEnglish ? 'en' : 'es',
      },
      {
        email: emailStr,
        firstName: nameStr,
      }
    );

    const body = encodeURIComponent(`Nombre: ${nameStr}\nEmail: ${emailStr}\n\n${data.get('message')}`);

    window.location.href = `mailto:info@vitablue.es?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };




  return (
    <div className="w-full bg-background-light text-text-main">
      <Helmet>
        <title>{content.title}</title>
        <meta name="description" content={content.description} />
        <meta property="og:title" content={content.title} />
        <meta property="og:description" content={content.description} />
        <meta property="og:image" content="https://www.vitablue.es/assets/vitablue-share.jpg" />
        <link rel="canonical" href={`https://www.vitablue.es${content.contactPath}/`} />
        <link rel="alternate" hrefLang="es" href="https://www.vitablue.es/contacto/" />
        <link rel="alternate" hrefLang="en" href="https://www.vitablue.es/en/contact/" />
        <link rel="alternate" hrefLang="x-default" href="https://www.vitablue.es/contacto/" />
        <script type="application/ld+json">{JSON.stringify({ 
          '@context': 'https://schema.org', 
          '@graph': [
            {
              '@type': 'ContactPage', 
              '@id': `https://www.vitablue.es${content.contactPath}/#webpage`,
              name: content.title, 
              description: content.description, 
              url: `https://www.vitablue.es${content.contactPath}/`, 
              mainEntity: { '@id': 'https://www.vitablue.es/#organization' }
            },
            VITA_BLUE_ORGANIZATION_SCHEMA
          ]
        })}</script>
      </Helmet>

      <main>
        <div className="border-b border-slate-100 bg-slate-50/50 px-4 py-3 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl text-xs font-bold text-text-secondary">
            VitaBlue <span className="px-2 text-slate-300">/</span> {isEnglish ? 'Contact' : 'Contacto'}
          </div>
        </div>
        <BrandHero eyebrow={content.eyebrow} title={content.heading} description={content.intro} />

        <section className="px-6 py-14 sm:px-8 lg:py-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-4">
              <ContactChannelCard 
                href="mailto:info@vitablue.es" 
                icon={<Mail className="h-6 w-6" />} 
                title={content.emailLabel} 
                description="info@vitablue.es" 
              />
              <ContactChannelCard 
                href="tel:+34694583452" 
                icon={<Phone className="h-6 w-6" />} 
                title={content.phoneLabel} 
                description="+34 694 58 34 52" 
              />
              <ContactChannelCard 
                href="https://wa.me/34694583452" 
                icon={<WhatsAppIcon size={24} />} 
                title={content.whatsappLabel} 
                description={content.whatsapp} 
                external
              />
            </div>

            <form onSubmit={handleSubmit} className="rounded-3xl border border-primary/10 bg-white p-6 shadow-sm sm:p-8">
              <div className="grid gap-5 sm:grid-cols-2">
                <InputText 
                  label={content.name} 
                  name="name" 
                  autoComplete="name" 
                  required 
                />
                <InputText 
                  label={content.email} 
                  type="email" 
                  name="email" 
                  autoComplete="email" 
                  required 
                />
              </div>
              <FormField label={content.message}>
                <textarea 
                  required 
                  name="message" 
                  rows={5} 
                  className="w-full font-sans text-sm font-medium rounded-xl border bg-white px-4 py-3 outline-none transition-all duration-200 border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-text-secondary/40 placeholder:font-normal resize-y" 
                />
              </FormField>
              <Checkbox 
                label={content.consent} 
                name="consent" 
                required 
                containerClassName="mt-5" 
              />
              <Button type="submit" variant="primary" size="lg" className="w-full mt-6">
                {content.submit}
              </Button>
              {submitted && <p role="status" className="mt-4 text-sm font-bold text-primary">{content.success}</p>}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Contact;
