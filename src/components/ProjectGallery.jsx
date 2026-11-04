import React from 'react';

function Sheet({ image }) {
  return (
    <figure>
      <figcaption><strong>{image.sheet}</strong> {image.caption || image.alt}</figcaption>
      <a href={image.src} target="_blank" rel="noreferrer" aria-label={'Ampliar ' + image.alt}>
        <img className="detail-image" loading="lazy" src={image.src} alt={image.alt}/>
        <span>Ampliar vista ↗</span>
      </a>
      {image.pdf?.startsWith('/media/') && (
        <a className="sheet-pdf" href={image.pdf} target="_blank" rel="noreferrer"
           aria-label={'Abrir lámina completa ' + image.sheet}>
          Ver lámina completa · PDF ↗
        </a>
      )}
    </figure>
  );
}

export default function ProjectGallery({ images = [] }) {
  const sections = new Map();
  for (const image of images) {
    const name = image.group || 'Galería';
    if (!sections.has(name)) sections.set(name, []);
    sections.get(name).push(image);
  }
  return Array.from(sections, ([name, items]) => {
    const sheets = items.map(image => <Sheet key={image.src} image={image}/>);
    if (images.length > 12) {
      return (
        <details key={name} className="project-sheets sheet-discipline">
          <summary>{name} <small>{items.length} vistas</small></summary>
          {sheets}
        </details>
      );
    }
    return <section key={name} className="project-sheets"><h3>{name}</h3>{sheets}</section>;
  });
}
