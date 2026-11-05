import React, {useRef, useState} from 'react';
import EditorialPresentation from './EditorialPresentation';
import CONFIG from '../../public/content/site.json';

export default function PortfolioPresentation({projects, onOpen}) {
  const dialog = useRef(null);
  const [open, setOpen] = useState(false);
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
      <div className="ep-cover-stage">
        <button onClick={enter} aria-label="Entrar al portafolio">
          <small>{CONFIG.name} {CONFIG.surname}</small>
          <strong>Portafolio<span>.</span></strong>
          <small>Arquitectura × Tecnología</small>
          <i aria-hidden="true">→</i>
        </button>
      </div>
      <p>Haz clic en la cubierta para abrir</p>
    </section>
    <dialog ref={dialog} className="ep-dialog" role="dialog" aria-label="Portafolio completo" onClose={() => setOpen(false)}>
      {open && <><header className="ep-top"><span>{CONFIG.name} {CONFIG.surname}</span>
        <button onClick={() => dialog.current.close()}>Cerrar ×</button></header>
        <EditorialPresentation projects={projects} onOpen={details}/>
      </>}
    </dialog>
  </>;
}
