# Notas para IAs y colaboradores

Léelo junto con `CHANGELOG.md` y `docs/DISENO.md` antes de cambiar nada. Actualízalo al terminar.

## Convenciones del proyecto
- Una rama `feature/nombre` por mejora. No modificar `main` directamente.
- Antes de integrar, ejecutar `npm run check` (tests, validación del contenido, compilación), inspeccionar vista previa y comprobar interacciones.
- Conservar funciones existentes: portada, robots, navegación, recorrido AUTO, libro y planos por disciplinas, galerías, aplicaciones y editor local.
- El contenido se organiza en `public/content/*.json`. Identidad y contacto: `site.json`; proyectos y planos: `projects.json`; aplicaciones: `apps.json`.
- Paleta aprobada: #FFFFFF, #F4F4F6, #E4E4E7, #18181B y #2455EE. Mantener la identidad.
- Los CSS existentes están minificados; agregar nuevas reglas al final de `src/styles/platform.css` y evitar sobreescrituras globales.
- Respetar movimiento reducido, accesibilidad por teclado y enlaces seguros. El repositorio es público: no guardar secretos.
- `lucide-react` no suministra íconos de marca: mostrar LinkedIn e Instagram con enlaces de texto.

## Cambios 1.5.0 — 2026-11-04
- Implementación en rama `feature/contacto-redes` por ChatGPT (OpenAI).
- Correo, LinkedIn, Instagram, ubicación, `bio` y `trajectory` en `site.json`.
- Modal «Hablemos» y pie de página enlazan a las redes profesionales.
- Metadatos de SEO en `index.html`; validación y pruebas actualizadas.

## Pendientes y advertencias
- El texto `bio` y el hito AECODE × PRO Innóvate son provisionales; no afirmar programa concluido ni certificado sin confirmación.
- `bio` todavía no se muestra en la interfaz.
- Reconocimientos y porcentajes de habilidades son `demo`; no presentarlos como logros verificados.
- La silueta del hero es temporal. No usar fotos no autorizadas.
- Falta imagen social para `og:image`; elegir una con autorización.
- Integración futura de publicaciones sociales: preferir tarjetas manuales en `social.json` con enlaces seleccionados, sin suponer acceso a publicaciones privadas.
- Verificar la vista previa de Vercel antes de solicitar merge; GitHub Actions debe confirmar `npm run check`.

## Contacto directo 1.5.1
- `src/components/DirectContact.jsx` sustituye únicamente el botón de modal «Hablemos» por tres enlaces externos visibles.
- `src/lib/contact-links.js` genera las URLs externas; Gmail usa redacción web con destinatario y no registra ninguna credencial.
- GitHub se mantiene como enlace de código del pie, no en las tarjetas principales.
- No modificar ni eliminar modales de proyectos o del editor local.
