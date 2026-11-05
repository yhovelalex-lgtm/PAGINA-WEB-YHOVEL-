import React from 'react';
import { ArrowUpRight, Mail } from 'lucide-react';
import { directContactLinks } from '../lib/contact-links.js';

function BrandIcon({ brand }) {
  if (brand === 'gmail') return (
    <svg width="27" height="27" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 18V7" stroke="#4285F4" strokeWidth="3" strokeLinecap="round"/>
      <path d="M21 18V7" stroke="#34A853" strokeWidth="3" strokeLinecap="round"/>
      <path d="M3 7L12 13.4 21 7" fill="none" stroke="#EA4335" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
  if (brand === 'linkedin') return (
    <svg width="27" height="27" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="1" y="1" width="22" height="22" rx="3" fill="#0A66C2"/>
      <circle cx="6.4" cy="7" r="1.45" fill="white"/>
      <path d="M5.1 10h2.7v8.3H5.1zM10 10h2.6v1.1c.6-.9 1.6-1.4 3-1.4 2.5 0 3.3 1.5 3.3 4v4.6h-2.7v-4.1c0-1.3-.3-2.1-1.5-2.1-1.3 0-2 1-2 2.2v4H10z" fill="white"/>
    </svg>
  );
  return (
    <svg width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="#C13584" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <rect x="2.6" y="2.6" width="18.8" height="18.8" rx="5.3"/>
      <circle cx="12" cy="12" r="4.2"/>
      <circle cx="17.5" cy="6.7" r="1" fill="#C13584" stroke="none"/>
    </svg>
  );
}

export default function DirectContact({ site }) {
  const links = directContactLinks(site);
  return (
    <div className="contact-card contact-card--direct">
      <div className="contact-direct-heading">
        <Mail size={22} strokeWidth={1.7} aria-hidden="true"/>
        <span>¿Una idea en mente?</span>
        <strong>Hablemos.</strong>
        <p>Elige cómo prefieres contactarme.</p>
      </div>
      <nav className="contact-direct-list" aria-label="Contacto directo">
        {links.map(link => (
          <a key={link.id} className={'contact-direct-link contact-direct-link--' + link.id}
            href={link.href} target="_blank" rel="noopener noreferrer"
            aria-label={'Abrir ' + link.label + ': ' + link.detail}>
            <span className="contact-direct-brand"><BrandIcon brand={link.id}/></span>
            <span className="contact-direct-label"><strong>{link.label}</strong><small>{link.detail}</small></span>
            <ArrowUpRight className="contact-direct-arrow" size={18} aria-hidden="true"/>
          </a>
        ))}
      </nav>
    </div>
  );
}
