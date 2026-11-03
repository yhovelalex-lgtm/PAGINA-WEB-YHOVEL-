# Publicación y recuperación

## Publicación verificada — 3 noviembre 2026

- Web: https://pagina-web-yhovel.vercel.app/
- Proyecto Vercel: `pagina-web-yhovel`, equipo ARCHYM.
- Primer despliegue: `dpl_CGx91cGnFrF7bFBmZwhFyexbMVe1`, estado READY.
- Código inicial: `0e32ca76ce6fbcf4bb7810a58f172e53603372f5`.
- GitHub Actions: seis pruebas y compilación correctas.
- Acceso público comprobado sin cookies: HTTP 200.
- Node del proyecto: 22.x.
- Verificados en navegador: portada, filtro y editor de borradores.

## Flujo

GitHub main → Vercel → validación de JSON → build de Vite → publicación.

Configuración: raíz del repositorio, framework Vite, instalación `npm ci`, compilación `npm run build`, salida `dist`. No se requieren variables secretas.

Los proyectos se importan del JSON versionado e intentan refrescarse desde `/content/projects.json` del mismo despliegue. Si falla la lectura, se conserva la copia incluida en la compilación. No se utiliza la caché de proyectos locales de la antigua demo.

## Mejoras de código

1. Crear rama `feature/<nombre>` o `fix/<nombre>`.
2. Hacer un cambio concreto, ejecutar `npm run check`.
3. Abrir Pull Request y revisar vista previa de Vercel.
4. Integrar a main cuando el resultado esté correcto.
5. Registrar cambios visibles en CHANGELOG.

La workflow de GitHub comprueba tests y compilación. El build de Vercel valida el catálogo por sí mismo. No se han configurado reglas de protección que obliguen a esperar a GitHub Actions antes de desplegar.

## Si algo falla

- **JSON inválido / imagen ausente:** revisar el error de validación en los logs, corregir y guardar otro commit. Un build fallido no sustituye la última versión correcta.
- **Fallo visual tras publicar:** Vercel → proyecto → Deployments → elegir una versión anterior correcta y utilizar la acción de rollback disponible. Comprobar que vuelve a estar operativa.
- **Corregir el código fuente:** revertir el commit defectuoso mediante un nuevo commit y volver a desplegar. Un rollback de hosting no modifica GitHub: el siguiente despliegue podría reintroducir el error si no se revierte también allí.
- **Enlace externo roto:** corregir la URL en `apps.json` o `projects.json`.

No sobrescribir historial ni forzar pushes. Las versiones se identifican por SHA de commit. Mantener `package-lock.json` para instalaciones reproducibles.
