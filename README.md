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

### Portafolio editorial

En **Proyectos → Entrar al portafolio**, la presentación abre sus 16 láminas. Usa las flechas, las teclas ← y →, el índice o «Ir a lámina». «Ficha completa» abre el catálogo técnico del proyecto con sus vistas y PDF.

Edita títulos, listas, captions, tablas y composición en `public/content/editorial-slides.json`. Cada registro selecciona el `layout`, el `projectId` del catálogo y las referencias visuales: `cover` o códigos de `gallery[].sheet`. Un valor `null` conserva el espacio de una futura imagen. El contenido y archivos de cada obra se mantienen en `public/content/projects.json` y `public/media/projects/`. Los colores y fuentes de la presentación se ajustan en `src/styles/editorial-presentation.css`.

Ejecuta `npm ci` y `npm run dev` para probar localmente. Ejecuta `npm run check` antes de subir tu rama a GitHub. Vercel genera la vista previa de la rama y publica producción al integrar los cambios en main.

### Proyecto provisional inmersivo

La tarjeta **Proyecto en estudio** y la lámina **En estudio** abren su ficha. Desde «Abrir proyecto» se accede a `/proyectos/en-estudio/`. El HTML autocontenido está en `public/proyectos/en-estudio/index.html`. Emplea imágenes ya publicadas de ANKA y transiciones nativas ligadas al scroll. La secuencia de vídeo y los mapas de profundidad del prompt necesitan recursos propios del futuro proyecto.

Sustituye las rutas de imagen en el HTML y en `ASSETS`, los textos y los datos del registro `proyecto-en-estudio` cuando se defina la obra. El formulario genera un resumen local para copiar. La información se envía únicamente cuando se conecta expresamente un servicio de contacto.
