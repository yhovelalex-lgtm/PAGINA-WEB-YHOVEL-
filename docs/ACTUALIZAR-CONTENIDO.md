# Actualizar contenido

## Añadir un proyecto desde GitHub

1. Abre `public/media/projects` y usa **Add file → Upload files**. Organiza las imágenes en una carpeta con el mismo ID del proyecto: `centro-acora/portada.webp`, `centro-acora/interior-01.webp`.
2. Abre `public/content/projects.json`, pulsa el lápiz y añade un objeto separado por coma. No repitas el ID.
3. Guarda en una rama y abre un Pull Request para revisar la vista previa; para cambios pequeños puedes guardar en `main` cuando hayas revisado el contenido.
4. Comprueba la validación y el despliegue en Vercel. Al publicar desde main, el sitio utiliza el nuevo catálogo.

```json
{
  "id": "centro-acora",
  "title": "Centro agroindustrial en Ácora",
  "category": "Arquitectura",
  "year": "2026",
  "description": "Descripción del proyecto y tu participación.",
  "tools": ["Revit", "Dynamo"],
  "visual": 0,
  "status": "published",
  "demo": false,
  "cover": {"src": "/media/projects/centro-acora/portada.webp", "alt": "Vista exterior del centro agroindustrial"},
  "gallery": [{"src": "/media/projects/centro-acora/interior-01.webp", "alt": "Vista interior del área de capacitación"}],
  "url": "https://example.com/proyecto"
}
```

Elimina `url` si no existe un enlace real. Una categoría nueva genera automáticamente su filtro. `cover: null` utiliza la ilustración alternativa. Las rutas empiezan en `/media/`, sin `public`.

## Preparar sin escribir JSON

En la web, “Preparar proyecto” abre un formulario. Completa la ficha, guarda el borrador local y descarga el catálogo guardado. Revisa el archivo y copia su contenido en `public/content/projects.json` de GitHub. La descarga no publica ni sube imágenes. No hay contraseñas ni tokens en ese formulario.

Los borradores locales solo existen en ese navegador; descarga una copia antes de limpiar sus datos. Un borrador importado previamente puede estar desactualizado respecto al catálogo: revisa y combina los cambios antes de reemplazar el JSON.

## Imágenes y videos

- Usar WebP/AVIF o JPEG optimizado. Objetivo orientativo: 1600–2200 px de ancho y menos de 500 KB por imagen.
- Escribir texto alternativo descriptivo para cada imagen.
- No subir archivos RVT, PSD, originales enormes o videos largos al repositorio.
- Guardar originales en Drive y publicar solo copias optimizadas. Para videos, añadir un enlace HTTPS a una plataforma de video; esta versión no embebe videos automáticamente.
- Un cambio de portada debe reemplazar la ruta en JSON. No basta con subir el archivo.

## Aplicaciones y contacto

Edita `apps.json` para incorporar herramientas; cada entrada requiere `id`, `name`, `description` y `url` HTTPS. Añade `status` para su etiqueta. En `site.json`, `email` activa el enlace de contacto y `years` el contador de trayectoria. No inventar cifras, premios ni datos.
