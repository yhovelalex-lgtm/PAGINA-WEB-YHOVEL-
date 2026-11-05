import React, { useEffect, useRef, useState } from 'react';
import slides from '../../public/content/editorial-slides.json';
import '../styles/editorial-presentation.css';

// Media references resolve against the same catalog that supplies the book and project details.
function EditorialPhoto({ project, reference }) {
  const image = !reference ? null : reference === 'cover' ? project?.cover : project?.gallery?.find(item => item.sheet === reference);
  const [failed, setFailed] = useState(false);
  return <figure className="ep-photo">
    {image && !failed ? <img src={image.src} alt={image.alt} loading="lazy" decoding="async"
      onError={() => setFailed(true)}/> : <span className="ep-placeholder" role="img" aria-label="Espacio reservado para una imagen"/>}
  </figure>;
}

function Cover({ slide, photo }) {
  return <div className="ep-cover-grid">
    <div className="ep-cover-copy">
      <div className="ep-brand"><b aria-hidden="true">YA</b><span>{slide.author}</span></div>
      <h2>{slide.title.map(line => <span key={line}>{line}</span>)}</h2>
      <div className="ep-credit"><svg viewBox="0 0 48 18" aria-hidden="true">
        {[0,4,6,11,15,18,24,27,33,38,42,46].map((x,i) => <rect key={x} x={x} width={i%3+1} height="18"/>)}
      </svg><span>{slide.subtitle}</span></div>
    </div>{photo}
  </div>;
}

function ContentIndex({ slide, photo, jump }) {
  return <div className="ep-index-grid">{photo}<div className="ep-index-copy">
    <h2>{slide.title}</h2><p>{slide.subtitle}</p>
    <ol>{slide.items.map((item,i) => <li key={item.title}>
      <button onClick={() => jump(item.target)}><small>{String(i+1).padStart(2,'0')}.</small><strong>{item.title}</strong><p>{item.description}</p></button>
    </li>)}</ol>
  </div></div>;
}

// Each named grid area has its position defined by the corresponding layout in CSS.
function ProjectSlide({slide, project}) {
  return <div className="ep-composition">
    <h2 className="ep-name">{slide.title}</h2>
    {slide.subtitle && <div className="ep-text"><h3>{slide.subtitle}</h3><p>{slide.description}</p>
      {!!slide.details.length && <ul>{slide.details.map(detail => <li key={detail}>{detail}</li>)}</ul>}</div>}
    {slide.images.map((image,i) => <div key={i} className={'ep-slot ep-slot-' + i}>
      <EditorialPhoto project={project} reference={image}/>
      {i === 0 && slide.caption && <aside className="ep-caption">{slide.caption}</aside>}
    </div>)}
    {slide.columns?.map(([heading,body],i) => <div key={heading} className={'ep-column col-' + i}><b>{heading}</b><p>{body}</p></div>)}
    {slide.table && <table className="ep-table"><thead><tr>{slide.table[0].map(x => <th key={x}>{x}</th>)}</tr></thead>
      <tbody><tr>{slide.table[1].map(x => <td key={x}>{x}</td>)}</tr></tbody></table>}
    <small className="ep-vertical">{slide.note}</small>
  </div>;
}

const layouts = {cover: Cover, index: ContentIndex};

export default function EditorialPresentation({ projects, onOpen }) {
  const surface = useRef(null);
  useEffect(() => { surface.current?.focus({preventScroll:true}); }, []);
  const [index, setIndex] = useState(0);
  const slide = slides[index];
  const Layout = layouts[slide.layout] || ProjectSlide;
  const project = projects.find(item => item.id === slide.projectId);
  function move(step) {
    setIndex(previous => Math.max(0, Math.min(slides.length - 1, previous + step)));
  }
  return <section ref={surface} className="ep" aria-label="Presentación editorial" tabIndex={0}
    onKeyDown={event => {
      if (event.target.tagName === 'SELECT') return;
      if (['ArrowLeft','ArrowRight'].includes(event.key)) {
        event.preventDefault();
        move(event.key === 'ArrowRight' ? 1 : -1);
      }
    }}>
    <article key={index} className={'ep-slide ep-' + slide.layout} aria-label={slide.subtitle}>
      <header className="ep-running"><span>Architecture</span><span>Portfolio</span><span>Design</span>
        <small>{slide.note}</small></header>
      <Layout project={project} jump={layout => setIndex(slides.findIndex(item => item.layout === layout))} slide={slide} photo={<EditorialPhoto project={project} reference={slide.media}/>}/>
      <div className="ep-palette" aria-hidden="true"><i/><i/><i/></div>
    </article>
    <nav className="ep-controls" aria-label="Navegación de la presentación">
      <button disabled={!index} onClick={() => move(-1)}>← Anterior</button>
      <span aria-live="polite">{String(index+1).padStart(2,'0')} / {String(slides.length).padStart(2,'0')}</span>
      <button disabled={index === slides.length - 1} onClick={() => move(1)}>Siguiente →</button>
      <select aria-label="Ir a lámina" value={index} onChange={event => setIndex(Number(event.target.value))}>
        {slides.map((item,i) => <option key={item.layout} value={i}>{String(i+1).padStart(2,'0')} · {item.subtitle || item.title}</option>)}
      </select>
      {project && <button onClick={() => onOpen(project)}>Ficha completa ↗</button>}
    </nav>
  </section>;
}
