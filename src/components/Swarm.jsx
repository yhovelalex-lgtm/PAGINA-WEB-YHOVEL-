import React, { useLayoutEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Box } from 'lucide-react';

// Keep the real DOM text intact for selection, accessibility and React updates.
// A Range follows the actual glyph positions, including line wrapping and italics.
function textMap(element) {
 const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
 const chars = []; let node;
 while ((node = walker.nextNode())) {
  let offset = 0;
  for (const char of node.textContent) {
   chars.push({ node, start: offset, end: offset + char.length });
   offset += char.length;
  }
 }
 return chars;
}
function cursorAt(job, progress, box) {
 const chars = job.chars;
 if (!chars.length) return { x: 0, y: 0, height: 20 };
 const index = Math.min(chars.length - 1, Math.floor(progress * chars.length));
 const char = chars[index], range = document.createRange();
 range.setStart(char.node, char.start); range.setEnd(char.node, char.end);
 const r = range.getBoundingClientRect();
 return { x: Math.max(0, r.right - box.left), y: Math.max(0, r.top - box.top), height: r.height || 20 };
}
export default function Swarm() {
 const reduced = useReducedMotion(), refs = useRef([]), dock = useRef(null), layer = useRef(null), frames = useRef([]);
 useLayoutEffect(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !matchMedia('(pointer:fine)').matches) return;
  const pointer = { x: innerWidth - 110, y: innerHeight - 90 };
  const bots = Array.from({ length: 9 }, () => ({ x: pointer.x, y: pointer.y, vx: 0, vy: 0, job: null }));
  const jobs = new Map(); let raf, last = performance.now(), finishedAt = last;
  const selector = 'h1,h2,h3,p,.eyebrow,.project-image,.portrait,.live-widget,.stats,.timeline,.award,.control,.bar,.philosophy,.contact-card,.portal-model,.app-art,.compare-view,.author';
  function register() {
   const elements = [...document.querySelectorAll('main > section, main > footer')].flatMap(area => [...area.querySelectorAll(selector)]);
   const independent = elements.filter(el => !elements.some(other => other !== el && other.contains(el)));
   independent.forEach(el => {
    if (jobs.has(el)) return;
    const job = { el, state: 'waiting', text: el.matches('h1,h2,h3,p,.eyebrow'), chars: [], start: 0 };
    jobs.set(el, job); el.dataset.compose = 'waiting'; observer.observe(el);
   });
  }
  const observer = new IntersectionObserver(entries => {
   entries.forEach(entry => {
    const job = jobs.get(entry.target);
    if (job && entry.isIntersecting && job.state === 'waiting') job.state = 'queued';
   });
  }, { rootMargin: '-85px 0px -9% 0px', threshold: 0 });
  // Layout effect + scoped stylesheet hide targets BEFORE the browser paints them.
  document.documentElement.classList.add('composition-enabled');
  register();
  const mutations = new MutationObserver(register);
  mutations.observe(document.querySelector('main'), { childList: true, subtree: true });
  function finish(job) {
   job.state = 'done'; job.el.dataset.compose = 'done';
   job.el.style.removeProperty('--compose-clip');
   finishedAt = performance.now();
  }
  function move(e) { pointer.x = e.clientX; pointer.y = e.clientY; }
  function focus(e) { for (const job of jobs.values()) if (job.el === e.target || job.el.contains(e.target) || e.target.contains(job.el)) finish(job); }
  function replay() {
   const areas = [...document.querySelectorAll('main > section,main > footer,.experience')];
   const area = areas.filter(el => { const r = el.getBoundingClientRect(); return r.top <= innerHeight * .43 && r.bottom > innerHeight * .43; }).at(-1);
   if (!area) return;
   for (const job of jobs.values()) if (area.contains(job.el)) {
    job.state = 'waiting'; job.el.dataset.compose = 'waiting'; job.el.style.removeProperty('--compose-clip');
    bots.forEach(b => { if (b.job === job) b.job = null; });
    observer.unobserve(job.el); observer.observe(job.el);
   }
  }
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('folio-replay', replay);
  document.addEventListener('focusin', focus);
  function frame(now) {
   const dt = Math.min((now - last) / 16.67, 2); last = now;
   const visible = [];
   for (const [el, job] of jobs) {
    if (!el.isConnected) { observer.unobserve(el); jobs.delete(el); continue; }
    if (job.state === 'queued') {
     const r = el.getBoundingClientRect();
     if (r.bottom > 85 && r.top < innerHeight * .91 && r.right > 0 && r.left < innerWidth) visible.push(job);
    }
   }
   bots.forEach(b => {
    if (b.job && (!b.job.el.isConnected || b.job.state === 'done')) b.job = null;
    if (!b.job && visible.length) {
     b.job = visible.shift(); b.job.start = now; b.job.state = 'drawing';
     b.job.chars = b.job.text ? textMap(b.job.el) : [];
     b.job.duration = b.job.text ? Math.max(850, Math.min(2800, b.job.chars.length * 24)) : 1150;
     b.job.el.dataset.compose = 'drawing';
    }
   });
   const busy = bots.some(b => b.job);
   const phase = busy ? 'building' : now - finishedAt < 1000 ? 'returning' : 'stored';
   layer.current.dataset.phase = phase;
   const dx = Math.max(10, Math.min(innerWidth - 112, pointer.x + 24)), dy = Math.max(95, Math.min(innerHeight - 48, pointer.y + 22));
   dock.current.style.transform = `translate3d(${dx}px,${dy}px,0)`;
   dock.current.dataset.phase = phase;
   dock.current.querySelector('span').textContent = busy ? 'COMPONIENDO' : phase === 'returning' ? 'REUNIENDO' : '9 / LISTOS';
   bots.forEach((b, i) => {
    const f = frames.current[i]; let tx = dx + 12 + (i % 3) * 14, ty = dy + 8 + Math.floor(i / 3) * 9;
    f.style.opacity = '0';
    if (b.job) {
     const job = b.job, r = job.el.getBoundingClientRect(), age = now - job.start;
     // Draw and size an EMPTY frame, pause, then insert its contents.
     const sizing = Math.min(1, age / 550), progress = Math.max(0, Math.min(1, (age - 850) / job.duration));
     const inView = r.bottom > 85 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
     f.style.opacity = inView ? '1' : '0';
     f.style.left = `${r.left - 4}px`; f.style.top = `${r.top - 4}px`;
     f.style.width = `${(r.width + 8) * (.12 + .88 * sizing)}px`;
     f.style.height = `${(r.height + 8) * (.15 + .85 * sizing)}px`;
     f.dataset.kind = job.text ? 'text' : 'image'; f.dataset.stage = age < 850 ? 'frame' : 'insert';
     f.querySelector('.frame-caption').textContent = age < 550 ? 'TRAZAR MARCO' : age < 850 ? 'AJUSTAR MEDIDAS' : job.text ? `T / ESCRIBIR ${Math.round(progress * 100)}%` : `COLOCAR / ${Math.round(progress * 100)}%`;
     if (age >= 850) {
      job.el.dataset.compose = 'inserting';
      if (job.text) {
       const c = cursorAt(job, progress, r), bottom = Math.min(r.height + 5, c.y + c.height + 2);
       job.el.style.setProperty('--compose-clip', `polygon(-3px -3px,calc(100% + 3px) -3px,calc(100% + 3px) ${c.y}px,${c.x}px ${c.y}px,${c.x}px ${bottom}px,-3px ${bottom}px)`);
       f.style.setProperty('--caret-x', `${c.x + 4}px`); f.style.setProperty('--caret-y', `${c.y + 4}px`); f.style.setProperty('--caret-height', `${c.height}px`);
       tx = r.left + c.x; ty = r.top + c.y + c.height;
      } else {
       job.el.style.setProperty('--compose-clip', `inset(0 ${100 - progress * 100}% 0 0)`);
       tx = r.left + r.width * progress; ty = r.bottom;
      }
     } else { tx = r.left + r.width * sizing; ty = r.top + r.height * sizing; }
     if (progress >= 1) { finish(job); b.job = null; f.style.opacity = '0'; }
    }
    tx = Math.max(8, Math.min(innerWidth - 70, tx)); ty = Math.max(86, Math.min(innerHeight - 80, ty));
    const d = Math.hypot(tx - b.x, ty - b.y);
    b.vx = (b.vx + (tx - b.x) * .045 * dt) * Math.pow(.77, dt); b.vy = (b.vy + (ty - b.y) * .045 * dt) * Math.pow(.77, dt);
    b.x += b.vx * dt; b.y += b.vy * dt;
    const el = refs.current[i];
    el.style.transform = `translate3d(${b.x}px,${b.y}px,0) rotate(${d > 70 ? Math.max(-28, Math.min(28, b.vx * 2)) : 0}deg) scale(${phase === 'stored' ? .12 : 1})`;
    el.style.opacity = phase === 'stored' ? '0' : '1'; el.dataset.jet = d > 70 ? 'true' : 'false'; el.dataset.working = b.job && d < 80 ? 'true' : 'false';
   });
   raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  return () => {
   cancelAnimationFrame(raf); observer.disconnect(); mutations.disconnect();
   document.documentElement.classList.remove('composition-enabled');
   jobs.forEach(job => { delete job.el.dataset.compose; job.el.style.removeProperty('--compose-clip'); });
   window.removeEventListener('pointermove', move); window.removeEventListener('folio-replay', replay); document.removeEventListener('focusin', focus);
  };
 }, [reduced]);
 if(reduced)return null;
 return <div ref={layer} className="swarm builder-swarm" aria-hidden="true">{Array.from({length:9},(_,i)=><div key={'frame'+i} ref={el=>frames.current[i]=el} className="edit-frame" style={{'--agent-color':['#2455ee','#587a81','#6b5f9e'][i%3]}}><span className="frame-caption"/><i/><i/><i/><i/><div className="scan-line"/></div>)}<div ref={dock} className="robot-dock"><Box size={14}/><span>9 / LISTOS</span><i/></div>{Array.from({length:9},(_,i)=><div className="bot builder-bot" style={{'--agent-color':['#2455ee','#587a81','#6b5f9e'][i%3]}} ref={el=>refs.current[i]=el} key={i}><svg viewBox="0 0 32 36" width="28"><g stroke="#3f3f46" strokeWidth="1.5" fill="white"><path d="M16 6V2m-2 0h4"/><rect x="7" y="7" width="18" height="14" rx="4"/><circle cx="12" cy="13" r="1" fill="#2455ee"/><circle cx="20" cy="13" r="1" fill="#2455ee"/><path d="M13 18h6M7 22l-4 4"/><g className="tool-arm"><path d="M25 19l4-5m-2-3 4 4M26 10l5 5" stroke="#2455ee"/></g><g className="legs"><path d="M11 21v8H7m14-8v8h4"/></g></g><path className="flame" d="M10 22l3 12 3-10 3 10 3-12" fill="#2455ee"/><g className="sparks" stroke="#2455ee"><path d="M27 5V1m3 6 2-2m-9-1-2-2"/></g></svg><span className="builder-label">{['TÍTULO','TRAZO','TEXTO','RETÍCULA','CAPAS','DETALLE','ALINEAR','ESPACIO','REVISIÓN'][i]}</span><div className="builder-guide"/><span className="agent-pointer">➤</span></div>)}</div>;
}
