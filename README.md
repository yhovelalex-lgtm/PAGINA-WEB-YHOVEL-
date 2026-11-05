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

Añade un registro en `public/content/projects.json` con un `id` único, `title`, `category`, `description`, `year`, `tools` y `status: "published"`. Puedes duplicar el registro de ANKA como plantilla. Para una portada propia, coloca un WebP en `public/media/projects/<id>/` e indica su ruta pública y texto alternativo en `cover.src` y `cover.alt`. La primera imagen de `gallery` ilustra la hoja izquierda. Con `status: "draft"` puedes preparar el contenido antes de mostrarlo.

El orden del JSON determina el orden del libro. Pulsa «Entrar al portafolio» para abrir el lector negro a pantalla completa. La primera página de cada obra presenta el proyecto. A continuación aparece una página por cada elemento de `gallery`, en su orden original. Usa `group` para la disciplina, `sheet` para el código, `caption` para explicar qué muestra la lámina y `pdf` cuando exista un original. El índice permite saltar directamente a cualquier plano. La mitad derecha avanza y la izquierda retrocede, también en móvil. «Ver ficha» abre el detalle compartible `?proyecto=<id>`. Ejecuta `npm run check` antes de subir los cambios.
