## 1.5.1 — 2026-11-04

- Contacto visible sin modal: Gmail, LinkedIn e Instagram con iconos, nombres y apertura directa en pestaña nueva.
- Gmail abre la redacción web con destinatario preconfigurado; GitHub permanece como enlace técnico en el pie.
- Componente aislado `DirectContact`, vínculos comprobables con tests; sin nuevas dependencias.
- Se conservan la navegación, los proyectos, las láminas y los modales restantes.

## 1.5.0 — 2026-11-04

**IA:** ChatGPT (OpenAI) · **Rama:** `feature/contacto-redes`

- Contacto: correo público, LinkedIn e Instagram en `site.json`; modal «Hablemos» y pie de página con enlaces.
- Trayectoria editable en `site.json` (`trajectory`) y programa «IA y herramientas digitales para el sector AEC» (AECODE × PRO Innóvate, #BecaAITalent), con información provisional no verificada como certificación.
- Biografía provisional en `site.json`, aún sin mostrarse.
- SEO: canonical, Open Graph, Twitter card y datos estructurados `Person`.
- Validación de redes HTTPS, estructura de trayectoria y dos nuevas pruebas; revisar con `npm run check` y vista previa de Vercel.
- Se conserva navegación, portada, robots, libro interactivo y los planos existentes; `main` no se modifica hasta completar revisión.

## 1.4.0 — 2026-11-03

- Recorrido automático tras 12 segundos sin actividad, espera a los robots y deja 7 segundos de lectura.
- Avance suave por tramos para no saltar contenido de secciones altas; termina al llegar al final.
- Pausa inmediata con mouse, teclado, rueda o tacto; suspensión en formularios, modales y pestañas ocultas.
- Control AUTO ON/OFF y cuenta regresiva. Movimiento reducido desactiva el recorrido.

## 1.3.0 — 2026-11-03

- Corregido el reinicio de opacidad de los marcos en cada fotograma.
- Añadidas cotas de ancho/alto, ocho tiradores, guías centrales, coordenadas y propiedades tipográficas.
- Marcos conservados durante escritura, colocación y revisión final antes de desvanecerse.
- Nueve identidades visuales y panel de presencia con tareas simultáneas (simulación).

## 1.2.0 — 2026-11-03

- Composición por bloque al entrar en pantalla, sin mostrar y ocultar previamente el contenido.
- Marcos vacíos con ajuste de tamaño, escritura por carácter siguiendo las líneas reales y colocación progresiva de imágenes.
- Cola de tareas para nueve robots; el contenido completado permanece visible. Repetición manual disponible.
- Lectura inmediata al pausar robots, usar teclado o preferir movimiento reducido.

# Historial de cambios

## 1.1.0 — 2026-11-03
- Migración del prototipo a una plataforma organizada para GitHub y Vercel.
- Contenido separado en site.json, projects.json y apps.json.
- Portada narrativa vinculada al scroll; centro de aplicaciones.
- Robots, marcos de edición y navegación por capítulos conservados.
- Portadas, galerías, enlaces reales y editor local de fichas.
- Validación de contenido, tests y guía de recuperación.
