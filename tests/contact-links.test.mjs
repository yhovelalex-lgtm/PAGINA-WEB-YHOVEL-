import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { directContactLinks, gmailComposeUrl } from '../src/lib/contact-links.js';

const site = JSON.parse(fs.readFileSync('public/content/site.json', 'utf8'));

test('Gmail abre redacción web con destinatario configurado', () => {
  const url = gmailComposeUrl(site.email);
  const target = new URL(url);
  assert.equal(target.hostname, 'mail.google.com');
  assert.equal(target.searchParams.get('view'), 'cm');
  assert.equal(target.searchParams.get('fs'), '1');
  assert.equal(target.searchParams.get('to'), site.email);
});

test('contacto externo conserva los tres canales y no incluye GitHub como contacto', () => {
  const links = directContactLinks(site);
  assert.deepEqual(links.map(link => link.id), ['gmail', 'linkedin', 'instagram']);
  for (const link of links) assert.equal(new URL(link.href).protocol, 'https:');
});

test('si faltan redes opcionales no se generan enlaces vacíos', () => {
  assert.deepEqual(directContactLinks({ email: '' }), []);
  assert.equal(gmailComposeUrl('correo-inválido'), null);
});
