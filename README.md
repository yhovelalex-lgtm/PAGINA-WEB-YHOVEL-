# PAGINA WEB YHOVEL

Plataforma de arquitectura, BIM y tecnología de Yhovel Alex Merma Ari.

**React + Vite + Tailwind CSS + Framer Motion + Lucide.** Contenido versionado en GitHub y publicación en Vercel. Sin base de datos, suscripciones nuevas ni claves necesarias para ejecutar la web.

**Web:** https://pagina-web-yhovel.vercel.app/

**Tareas:** https://github.com/yhovelalex-lgtm/PAGINA-WEB-YHOVEL-/issues

## Empezar

```bash
npm ci
npm run dev
```

Antes de publicar: `npm run check`. Vercel utiliza `npm run build`, que valida los datos antes de compilar.

## Qué editar

| Necesidad | Archivo / carpeta |
|---|---|
| Nombre, contacto, GitHub | `public/content/site.json` |
| Proyectos, categorías, portada y galería | `public/content/projects.json` |
| Aplicaciones y enlaces | `public/content/apps.json` |
| Renders optimizados | `public/media/projects/<id>/` |
| Portada narrativa | `src/components/Portal.jsx` |
| Robots y coreografía | `src/components/Swarm.jsx` |
| Navegación inferior | `src/components/SequenceBar.jsx` |
| Diseño general | `src/styles/portfolio.css` y `platform.css` |
| Validación | `src/lib/content.js` y `scripts/validate-content.mjs` |

## Guías

- [Actualizar proyectos e imágenes](docs/ACTUALIZAR-CONTENIDO.md)
- [Publicar y recuperar versiones](docs/PUBLICACION-Y-RECUPERACION.md)
- [Plan y tareas](docs/PLAN.md)
- [Herramientas, costes y límites](docs/HERRAMIENTAS.md)
- [Sistema de diseño](docs/DISENO.md)
- [Historial de cambios](CHANGELOG.md)

El editor “Preparar proyecto” guarda un borrador en el navegador y exporta JSON. **No publica en GitHub ni autentica al administrador.** Publicar requiere guardar el catálogo y las imágenes en este repositorio. El portafolio público nunca solicita tokens.

Los proyectos con `demo: true`, los niveles de habilidades y los reconocimientos demo son ejemplos, no acreditaciones verificadas. La imagen del autor es una silueta sustituible. El correo público, LinkedIn e Instagram se configuran en `public/content/site.json`.

Este repositorio es público: no guardar secretos, datos privados, contratos ni documentos de terceros. `status: draft` oculta una ficha en la galería, pero no vuelve privado el archivo de GitHub.
