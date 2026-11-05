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

Los proyectos con `demo: true`, los niveles de habilidades y los reconocimientos demo son ejemplos, no acreditaciones verificadas. La imagen del autor es una silueta sustituible. El correo de contacto permanece vacío hasta que el autor elija su dirección pública.

Este repositorio es público: no guardar secretos, datos privados, contratos ni documentos de terceros. `status: draft` oculta una ficha en la galería, pero no vuelve privado el archivo de GitHub.

### Agregar una obra al libro interactivo

Añade una obra a `public/content/projects.json` con `status: "published"` y `demo: false`. Su ficha admite `cover`, `location` y una galería completa. Para dirigir la selección editorial indica, por ejemplo, `"bookSheets": ["A-101", "A-103", "E-103", "IS104", "IE102"]`. Los códigos deben coincidir con `gallery[].sheet`. El orden de la selección determina el recorrido por disciplina. Si omites la lista, el libro elige la primera vista de hasta cuatro disciplinas. Una lista vacía presenta únicamente la obra. La ficha conserva toda la galería y sus PDF.

Portada, contenido, aperturas, láminas y cierre comparten la retícula de hojas blancas. Las obras sin portada dejan espacio en blanco hasta que añadas la imagen. El cuarto proyecto publicado ocupa la apertura de reserva. Ejecuta `npm run check` antes de subir los cambios.

### Presentación editorial · primera entrega

En Proyectos abre el libro y elige **Presentación**. Cambia textos en `public/content/editorial-slides.json`. Cada lámina usa un `projectId` del catálogo y una referencia de imagen: `cover` o un código de `gallery[].sheet`. Los colores y las fuentes están al inicio de `src/styles/editorial-presentation.css`. La portada y el índice están implementados en `src/components/EditorialPresentation.jsx`.

Para probar: `npm ci`, `npm run dev` y abre la URL que muestre Vite. Antes de subir la rama ejecuta `npm run check`. Al subir commits a `feature/portafolio`, el proyecto conectado de Vercel genera la vista previa.
