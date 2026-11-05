import React, {useRef, useState} from 'react';
import EditorialPresentation from './EditorialPresentation';
import CONFIG from '../../public/content/site.json';

export default function PortfolioPresentation({projects, onOpen}) {
  const dialog = useRef(null);
  const [open, setOpen] = useState(false);
  const cover = projects.find(project => !project.demo && project.cover)?.cover;
  function enter() {
    dialog.current.showModal();
    setOpen(true);
  }
  function details(project) {
    dialog.current.close();
    onOpen(project);
  }
  return <>
    <section className="ep-launch" aria-label="Portafolio editorial">
      <button onClick={enter}><small>{CONFIG.name} {CONFIG.surname}</small>
        <strong>Portafolio.</strong><span>Entrar al portafolio ↗</span>
        {cover && <img src={cover.src} alt={cover.alt} loading="lazy"/>}
      </button>
    </section>
    <dialog ref={dialog} className="ep-dialog" role="dialog" aria-label="Portafolio completo" onClose={() => setOpen(false)}>
      {open && <><header className="ep-top"><span>{CONFIG.name} {CONFIG.surname}</span>
        <button onClick={() => dialog.current.close()}>Cerrar ×</button></header>
        <EditorialPresentation projects={projects} onOpen={details}/>
      </>}
    </dialog>
  </>;
}
