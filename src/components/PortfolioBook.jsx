import EditorialPresentation from './EditorialPresentation';
import React, { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { buildBook } from '../lib/book';
import CONFIG from '../../public/content/site.json';
import '../styles/portfolio-book.css';

function Picture({ image, plan = false }) {
  return image && <img className={plan ? 'ed-plan' : 'ed-photo'} src={image.src} alt={image.alt} decoding="async"/>;
}

function Page({ entry, side, context }) {
  const { kind, project, images = [], chapter } = entry;
  const right = side === 'right';
  const selected = images[right ? 1 : 0];
  let body;
  if (kind === 'cover' || kind === 'end') {
    body = right ? <Picture image={context.cover}/> : <>
      <h2>{kind === 'cover' ? <>Arquitec-<br/>tura.</> : <>Gracias por<br/>tu visita.</>}</h2>
      <p>{CONFIG.name} {CONFIG.surname}<br/>Modelado BIM · Documentación de proyectos</p>
    </>;
  } else if (kind === 'index') {
    body = right ? <><h2>Contenido</h2><ol className="ed-index">{context.chapters.map(page =>
      <li key={page.project.id}><small>{page.chapter}</small>{page.title}</li>)}</ol></> :
      <Picture image={context.drawing} plan/>;
  } else if (kind === 'reserve') {
    body = !right && <h2 className="ed-reserve">Proyecto_{chapter}</h2>;
  } else if (kind === 'project') {
    body = right ? <Picture image={project.cover}/> : <>
      <small>Proyecto_{chapter}</small><h2>{project.title}</h2>
      <p>{project.description.split(/(?<=\.)\s+/).slice(0, 2).join(' ')}</p>
      <small>{[project.location, project.year, project.tools.slice(0,2).join(' · ')].filter(Boolean).join(' / ')}</small>
    </>;
  } else if (selected) {
    body = <><small>{project.title}</small><h3>{entry.title}</h3>
      <Picture image={selected} plan/><p className="ed-caption">{selected.sheet} · {selected.caption || selected.alt}</p></>;
  } else {
    body = <><small>Proyecto_{chapter}</small><h2>{images[0].sheet}</h2><p>{images[0].caption || images[0].alt}</p></>;
  }
  return <div className={'ed-page ed-' + kind + ' ed-' + side}>
    <div className="ed-running"><span>Arquitectura</span><span>Portafolio</span></div>
    <div className="ed-body">{body}</div>
    <small className="ed-foot">{right ? 'Yhovel Alex Merma Ari' : 'Arquitectura · BIM'}</small>
  </div>;
}

export default function PortfolioBook({ projects, onOpen }) {
  const [presentation, setPresentation] = useState(false);
  const reader = useRef(null);
  const trigger = useRef(null);
  const [number, setNumber] = useState(0);
  const [turn, setTurn] = useState(null);
  const [opened, setOpened] = useState(false);
  const reduced = useReducedMotion();
  const pages = buildBook(projects);
  if (!projects.length) return null;
  const chapters = pages.filter(page => page.kind === 'project');
  const context = {chapters, cover: chapters.find(page => page.project.cover)?.project.cover,
    drawing: pages.find(page => page.images?.length)?.images[0]};
  const current = Math.min(number, pages.length - 1);
  const entry = pages[current];
  const target = pages[turn];
  const stacked = window.matchMedia('(max-width: 650px)').matches;
  const forward = target && turn > current;
  function enter() {
    setPresentation(false);
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
    if (reduced) setNumber(next);
    else setTurn(next);
  }
  return <>
    <section className="folio folio-launch" aria-label="Libro de proyectos">
      <button className="folio-cover" ref={trigger} onClick={enter}>
        <small>{CONFIG.name} {CONFIG.surname}</small>
        <strong>Portafolio<span>.</span></strong>
        <Picture image={context.cover}/>
        <small>Arquitectura × Tecnología</small>
        <span className="folio-enter">Entrar al portafolio ↗</span>
      </button>
    </section>
    <dialog ref={reader} className="folio folio-reader" role="dialog" aria-label="Portafolio completo"
      onClose={() => { setOpened(false); setTurn(null); trigger.current?.focus({preventScroll:true}); }}
      onKeyDown={event => {
        if (presentation || event.target.tagName === 'SELECT') return;
        const direction = {ArrowLeft: -1, ArrowRight: 1}[event.key];
        if (direction) { event.preventDefault(); move(direction); }
      }}>
      {opened && <>
        <header className="folio-head">
          <div>{CONFIG.name} {CONFIG.surname}<small>Arquitectura · BIM</small></div>
          <button onClick={leave}>Salir del libro ×</button>
        </header>
        <nav className="folio-mode" aria-label="Modo de lectura">
          <button aria-pressed={!presentation} onClick={() => setPresentation(false)}>Libro</button>
          <button aria-pressed={presentation} disabled={turn !== null} onClick={() => setPresentation(true)}>Presentación</button>
        </nav>
        {presentation ? <EditorialPresentation projects={projects}/> : <>
        <div className="folio-stage"><div className="folio-spread">
          <div className="folio-half"><Page context={context} side="left" entry={target && !forward ? target : entry}/></div>
          <div className="folio-half"><Page context={context} side="right" entry={forward ? target : entry}/></div>
          {target && <motion.div aria-hidden="true" className={'folio-leaf ' + (forward ? 'forward' : 'back')}
            initial={{rotateY: 0, rotateX: 0}} animate={stacked ? {rotateX: forward ? 180 : -180} : {rotateY: forward ? -180 : 180}}
            transition={{duration: reduced ? 0 : 0.76, ease: [0.45, 0, 0.2, 1]}}
            onAnimationComplete={() => { setNumber(turn); setTurn(null); }}>
            <div><Page context={context} side={forward ? 'right' : 'left'} entry={entry}/></div>
            <div><Page context={context} side={forward ? 'left' : 'right'} entry={target}/></div>
          </motion.div>}
          <button className="folio-hit prev" aria-label="Página anterior" disabled={!current} onClick={() => move(-1)}/>
          <button className="folio-hit next" aria-label="Página siguiente" disabled={current === pages.length - 1} onClick={() => move(1)}/>
        </div></div>
        <div className="folio-toolbar">
          <span aria-live="polite">{current + 1} / {pages.length}</span>
          <select aria-label="Índice de proyectos y láminas" value={current} disabled={turn !== null}
            onChange={e => setNumber(Number(e.target.value))}>
            {pages.map((page, i) => <option key={i} value={i}>{page.chapter ? page.chapter + ' / ' : ''}{page.title}</option>)}
          </select>
          {entry.images?.map(image => <a key={image.src} href={image.pdf || image.src} target="_blank" rel="noreferrer">
            {image.sheet} · {image.pdf ? 'PDF' : 'Ampliar'} ↗
          </a>)}
          {entry.project && <button onClick={() => { leave(); onOpen(entry.project); }}>Ficha completa ↗</button>}
        </div>
        </>}
      </>}
    </dialog>
  </>;
}
