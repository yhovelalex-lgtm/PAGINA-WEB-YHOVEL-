// Enlaces públicos. No usa claves ni servicios de terceros para generar la interfaz.
export function gmailComposeUrl(email) {
  if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return null;
  return 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(email.trim());
}
export function directContactLinks(site = {}) {
  const gmail = gmailComposeUrl(site.email);
  return [
    gmail && { id: 'gmail', label: 'Gmail', detail: site.email.trim(), href: gmail },
    site.linkedin && { id: 'linkedin', label: 'LinkedIn', detail: 'Perfil profesional', href: site.linkedin },
    site.instagram && { id: 'instagram', label: 'Instagram', detail: 'Proyectos y proceso', href: site.instagram },
  ].filter(Boolean);
}
