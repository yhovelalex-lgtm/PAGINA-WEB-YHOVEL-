import { useEffect, useState } from 'react';

export const TOUR_IDLE_MS = 12000;
export const TOUR_READ_MS = 7000;

// Short viewport advances also visit the lower blocks of tall sections.
export function nextTourStop(y, viewport, maximum, chapterTops) {
  const nextChapter = chapterTops.find(top => top > y + 24);
  return Math.min(maximum, y + viewport * .65, nextChapter ?? maximum);
}

export default function useIdleTour({ enabled, swarm, reduced, chapters }) {
  const [status, setStatus] = useState('EN ESPERA');
  useEffect(() => {
    if (!enabled || !swarm || reduced || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStatus(reduced ? 'MOVIMIENTO REDUCIDO' : 'PAUSADO');
      return;
    }
    let lastInput = performance.now(), readSince = null, animation = 0, moving = false;
    const cancel = () => { cancelAnimationFrame(animation); animation = 0; moving = false; };
    const activity = () => {
      cancel(); lastInput = performance.now(); readSince = null; setStatus('EN ESPERA');
    };
    const events = ['pointermove', 'pointerdown', 'wheel', 'touchstart', 'touchmove', 'keydown'];
    events.forEach(event => window.addEventListener(event, activity, { passive: true }));
    document.addEventListener('visibilitychange', activity);
    window.addEventListener('folio-replay', activity);
    const timer = setInterval(() => {
      const now = performance.now();
      const editing = document.activeElement?.matches('input,textarea,select,[contenteditable="true"]');
      if (document.hidden || document.querySelector('[role="dialog"]') || editing) {
        cancel(); lastInput = now; readSince = null; setStatus('PAUSA / EDICIÓN'); return;
      }
      const book = document.querySelector('[data-book-open="true"]')?.getBoundingClientRect();
      if (book && book.bottom > 100 && book.top < innerHeight * .9) {
        cancel(); lastInput = now; readSince = null; setStatus('LECTURA DEL LIBRO'); return;
      }
      if (moving) return;
      if (now - lastInput < TOUR_IDLE_MS) { setStatus('EN ESPERA'); return; }
      const building = document.querySelector('.builder-swarm')?.dataset.phase;
      const pending = [...document.querySelectorAll('[data-compose="waiting"],[data-compose="drawing"],[data-compose="inserting"]')].some(el => {
        const r = el.getBoundingClientRect();
        return r.top < innerHeight * .88 && r.bottom > 100 && r.left < innerWidth && r.right > 0;
      });
      if (building === 'building' || building === 'returning' || pending) {
        readSince = null; setStatus('ESPERANDO ROBOTS'); return;
      }
      if (readSince === null) readSince = now;
      const remaining = Math.ceil((TOUR_READ_MS - (now - readSince)) / 1000);
      if (remaining > 0) { setStatus(`SIGUIENTE EN ${remaining} s`); return; }
      const maximum = Math.max(0, document.documentElement.scrollHeight - innerHeight);
      if (scrollY >= maximum - 4) { setStatus('RECORRIDO COMPLETO'); return; }
      const startY = scrollY;
      const tops = chapters.map(([selector]) => document.querySelector(selector)).filter(Boolean)
        .map(el => el.getBoundingClientRect().top + startY - 100).sort((a,b) => a-b);
      const target = nextTourStop(startY, innerHeight, maximum, tops);
      const started = performance.now(); moving = true; setStatus('AVANZANDO');
      function advance(time) {
        const t = Math.min(1, (time - started) / 1800);
        const ease = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        window.scrollTo({ top: startY + (target - startY) * ease, behavior: 'instant' });
        if (t < 1) animation = requestAnimationFrame(advance);
        else { moving = false; animation = 0; readSince = null; }
      }
      animation = requestAnimationFrame(advance);
    }, 250);
    return () => {
      clearInterval(timer); cancel();
      events.forEach(event => window.removeEventListener(event, activity));
      document.removeEventListener('visibilitychange', activity);
      window.removeEventListener('folio-replay', activity);
    };
  }, [enabled, swarm, reduced, chapters]);
  return status;
}
