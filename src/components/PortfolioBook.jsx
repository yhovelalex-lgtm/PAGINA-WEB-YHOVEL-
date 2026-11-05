import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ProjectMedia from './ProjectMedia';
import CONFIG from '../../public/content/site.json';
import '../styles/portfolio-book.css';

function Page({ entry, side }) {
  const { project, sheet } = entry;
  if (side === 'right') return <div className={'folio-art' + (sheet ? ' folio-plan' : '')}>
    {sheet ? <img src={sheet.src} alt={sheet.alt} decoding="async"/> : <ProjectMedia project={project}/>}
  </div>;
  return <div className="folio-paper">
    <small>{sheet?.group || project.category} · {project.year}{project.demo && ' · Concepto'}</small>
    <strong>{sheet?.sheet || project.title}</strong>
    <p>{sheet ? sheet.caption || sheet.alt : project.description.split(/(?<=\.)\s+/).slice(0, 2).join(' ')}</p>
    <small>{sheet ? project.title : project.tools.slice(0, 3).join(' / ')}</small>
  </div>;
}

export default function PortfolioBook({ projects, onOpen }) {
  const reader = useRef(null);
  const trigger = useRef(null);
  const [number, setNumber] = useState(0);
  const [turn, setTurn] = useState(null);
  const [opened, setOpened] = useState(false);
  const reduced = useReducedMotion();
  const pages = projects.flatMap(project => [
    {project}, ...project.gallery.map(sheet => ({project, sheet}))
  ]);
  if (!pages.length) return null;
  const current = Math.min(number, pages.length - 1);
  const entry = pages[current];
  const target = pages[turn];
  const forward = target && turn > current;
  function enter() {
    setNumber(0);
    setTurn(null);
    reader.current.showModal();
    setOpened(true);
  }
  function leave() {
    reader.current.close();
  }
  function move(direction) {
    const next = current + direction;
    if (turn !== null || next < 0 || next >= pages.length) return;
    if (reduced || window.matchMedia('(max-width: 650px)').matches) setNumber(next);
    else setTurn(next);
  }
  return <>
    <section className="folio folio-launch" aria-label="Libro de proyectos">
      <button className="folio-cover" ref={trigger} onClick={enter}>
        <small>{CONFIG.name} {CONFIG.surname}</small>
        <strong>Portafolio<span>.</span></strong>
        <small>Arquitectura × Tecnología</small>
        <span className="folio-enter">Entrar al portafolio ↗</span>
      </button>
    </section>
    <dialog ref={reader} className="folio folio-reader" role="dialog" aria-label="Portafolio completo"
      onClose={() => { setOpened(false); setTurn(null); trigger.current?.focus({preventScroll:true}); }}
      onKeyDown={event => {
        if (event.target.tagName === 'SELECT') return;
        const direction = {ArrowLeft: -1, ArrowRight: 1}[event.key];
        if (direction) { event.preventDefault(); move(direction); }
      }}>
      {opened && <>
        <header className="folio-head">
          <div>{CONFIG.name} {CONFIG.surname}<small>Arquitectura · BIM</small></div>
          <button onClick={leave}>Salir del libro ×</button>
        </header>
        <div className="folio-stage"><div className="folio-spread">
          <div className="folio-half"><Page side="left" entry={target && !forward ? target : entry}/></div>
          <div className="folio-half"><Page side="right" entry={forward ? target : entry}/></div>
          {target && <motion.div aria-hidden="true" className={'folio-leaf ' + (forward ? 'forward' : 'back')}
            initial={{rotateY: 0}} animate={{rotateY: forward ? -180 : 180}}
            transition={{duration: reduced ? 0 : 0.62, ease: [0.45, 0, 0.2, 1]}}
            onAnimationComplete={() => { setNumber(turn); setTurn(null); }}>
            <div><Page side={forward ? 'right' : 'left'} entry={entry}/></div>
            <div><Page side={forward ? 'left' : 'right'} entry={target}/></div>
          </motion.div>}
          <button className="folio-hit prev" aria-label="Página anterior" disabled={!current} onClick={() => move(-1)}/>
          <button className="folio-hit next" aria-label="Página siguiente" disabled={current === pages.length - 1} onClick={() => move(1)}/>
        </div></div>
        <div className="folio-toolbar">
          <span aria-live="polite">{current + 1} / {pages.length}</span>
          <select aria-label="Índice de proyectos y láminas" value={current} disabled={turn !== null}
            onChange={e => setNumber(Number(e.target.value))}>
            {projects.map(project => <optgroup key={project.id} label={project.title}>
              {pages.map((page, i) => page.project.id === project.id && <option key={i} value={i}>
                {page.sheet ? page.sheet.group + ' · ' + (page.sheet.sheet || page.sheet.alt) : project.title}
              </option>)}
            </optgroup>)}
          </select>
          {entry.sheet && <a href={entry.sheet.pdf || entry.sheet.src} target="_blank" rel="noreferrer">
            {entry.sheet.pdf ? 'Abrir PDF ↗' : 'Ampliar plano ↗'}
          </a>}
          <button onClick={() => { leave(); onOpen(entry.project); }}>Ver ficha ↗</button>
        </div>
      </>}
    </dialog>
  </>;
}
