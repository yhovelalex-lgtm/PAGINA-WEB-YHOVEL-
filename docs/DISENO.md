# Dirección visual

Paleta aprobada: blanco #FFFFFF, gris #F4F4F6, bordes #E4E4E7, texto #18181B y cobalto #2455EE. Mantener la identidad arquitectónica, espacio en blanco y tipografía jerarquizada.

La entrada presenta una ilustración vectorial conceptual que pasa de alambre a volumen con el scroll. No representa un render real del autor. Los materiales definitivos se incorporarán con sus proyectos.

La referencia de edición colaborativa se traduce en robots con roles, marcos temporales, escritura progresiva y una cápsula junto al cursor. La navegación nunca espera a que termine la animación. Respetar movimiento reducido; no depender del hover para abrir contenido.

Se consultó UI UX Pro Max (NextLevelBuilder), revisión 713eef51b04efc98d6fa565323b495f7c9c89fd4, consulta “architecture portfolio minimal storytelling”. Coincidencias útiles: minimalismo, hero protagonista, navegación clara, foco visible, imágenes optimizadas y movimiento reducido. Se conservaron los colores aprobados por el usuario en lugar de la propuesta automática naranja.

La biblioteca de componentes de 21st es un apoyo opcional de autoría; la página no depende de una llamada a esa API. Claude Code es otra herramienta de desarrollo, no un componente que deba ejecutarse dentro del sitio.

## Composición al desplazarse

Cada bloque reserva sus dimensiones desde el primer render. En escritorio con puntero fino, `useLayoutEffect` prepara los bloques antes de pintar. IntersectionObserver activa solo los que entran en pantalla. Cada robot traza un marco (550 ms), ajusta (300 ms) y escribe o coloca contenido (850–2800 ms). La escritura usa posiciones DOM Range: conserva el texto original y sigue sus saltos de línea. Los bloques terminados no se ocultan al cambiar de sección. El botón de repetición reinicia explícitamente la sección actual.

Movimiento reducido, pantallas táctiles y modo impresión muestran el contenido directamente. Desactivar robots elimina todas las máscaras. Al enfocar un bloque con teclado, se revela inmediatamente.

Verificación: comprobar títulos inferiores en estado waiting antes de hacer scroll, recorrido hacia proyectos, cola de bloques visibles y retorno al estado done. Probar también repetición, pausa y filtros.

### Capas de edición colaborativa

Los marcos incorporan ocho tiradores, cotas de dimensiones reales en píxeles, coordenadas del documento, metadatos tipográficos y guías centrales. Cada robot tiene número y color propios. El panel de presencia indica actividad simultánea y se identifica como simulación, sin usuarios remotos reales. El trazado dura 850 ms, seguido de 600 ms de ajuste; tras insertar contenido se revisa durante 1550 ms, con desvanecimiento final. La opacidad no se reinicia durante cada fotograma: permanece estable mientras el robot trabaja.

### Recorrido por inactividad

AUTO está activado inicialmente. Tras 12 segundos sin entradas del usuario, espera que finalicen los robots y reserva 7 segundos de lectura, con cuenta regresiva. Avanza durante 1,8 segundos hasta el siguiente inicio de sección o un 65% de la pantalla, lo que esté más cerca, para visitar también bloques inferiores. Termina al llegar al pie de página.

Mouse, clic, rueda, teclado y tacto cancelan el desplazamiento y reinician la espera. Se suspende durante la edición de campos, con un modal abierto o la pestaña oculta. AUTO OFF, pausa de robots y movimiento reducido desactivan el recorrido. No utiliza servicios externos ni tareas programadas.
