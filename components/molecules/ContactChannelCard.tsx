import React from 'react';

interface ContactChannelCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  external?: boolean;
}

const ContactChannelCard: React.FC<ContactChannelCardProps> = ({ href, icon, title, description, external = false }) => (
  <a
    href={href}
    {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    className="flex items-start gap-4 rounded-3xl border border-primary/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
  >
    <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-cyan/15 text-primary">{icon}</span>
    <span>
      <strong className="block text-base font-black text-text-main">{title}</strong>
      <span className="mt-1 block text-body-reg text-text-secondary">{description}</span>
    </span>
  </a>
);

export default ContactChannelCard;
