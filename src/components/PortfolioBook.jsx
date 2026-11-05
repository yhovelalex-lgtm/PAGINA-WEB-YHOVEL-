import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ProjectMedia from './ProjectMedia';
import CONFIG from '../../public/content/site.json';
import '../styles/portfolio-book.css';

function Page({ project, side }) {
  if (!project) return side === 'left' ? null : (
    <div className="folio-cover">
      <small>{CONFIG.name} {CONFIG.surname}</small>
      <strong>Portafolio<span>.</span></strong>
      <small>Arquitectura × Tecnología</small>
    </div>
  );
  if (side === 'right') return <div className="folio-art"><ProjectMedia project={project}/></div>;
  const drawing = project.gallery[0];
  return <div className="folio-paper">
    <small>{project.category} · {project.year}{project.demo && ' · Concepto'}</small>
    <strong>{project.title}</strong>
    {drawing ? <img src={drawing.src} alt={drawing.alt} loading="lazy" decoding="async"/> :
      <p>{project.description}</p>}
    <small>{drawing?.sheet || project.tools.slice(0, 3).join(' / ')}</small>
  </div>;
}

export default function PortfolioBook({ projects, onOpen }) {
  const [number, setNumber] = useState(-1);
  const [turn, setTurn] = useState(null);
  const reduced = useReducedMotion();
  if (!projects.length) return null;
  const current = Math.min(number, projects.length - 1);
  const project = projects[current];
  const forward = turn !== null && turn > current;
  function move(direction) {
    const next = current + direction;
    if (turn !== null || next < -1 || next >= projects.length) return;
    if (reduced) setNumber(next);
    else setTurn(next);
  }
  const left = turn !== null && !forward ? turn : current;
  const right = forward ? turn : current;
  return <section className="folio" aria-label="Libro de proyectos" data-book-open={!!project}
    onKeyDown={event => {
      const direction = {ArrowLeft: -1, ArrowRight: 1}[event.key];
      if (direction) { event.preventDefault(); move(direction); }
    }}>
    <div className="folio-stage">
      <div className="folio-spread">
        <div className="folio-half"><Page side="left" project={projects[left]}/></div>
        <div className="folio-half"><Page side="right" project={projects[right]}/></div>
        {turn !== null && <motion.div aria-hidden="true" className={'folio-leaf ' + (forward ? 'forward' : 'back')}
          initial={{rotateY: 0}} animate={{rotateY: forward ? -180 : 180}}
          transition={{duration: reduced ? 0 : 0.62, ease: [0.45, 0, 0.2, 1]}}
          onAnimationComplete={() => { setNumber(turn); setTurn(null); }}>
          <div><Page side={forward ? 'right' : 'left'} project={project}/></div>
          <div><Page side={forward ? 'left' : 'right'} project={projects[turn]}/></div>
        </motion.div>}
        <button className="folio-hit prev" aria-label={current === 0 ? 'Volver a la cubierta' : 'Página anterior'}
          disabled={current < 0} onClick={() => move(-1)}/>
        <button className="folio-hit next" aria-label={project ? 'Página siguiente' : 'Abrir portafolio'}
          disabled={current === projects.length - 1} onClick={() => move(1)}/>
      </div>
    </div>
    <div className="folio-toolbar">
      <span aria-live="polite">{project ? (current + 1) + ' / ' + projects.length + ' · ' + project.title : 'Haz clic en la cubierta para abrir'}</span>
      {project && <button onClick={() => onOpen(project)}>Ver ficha ↗</button>}
    </div>
  </section>;
}
