import React from 'react';

export default function ProjectGallery({ images = [] }) {
  const sections = new Map();
  for (const image of images) {
    const section = image.group || 'Galería';
    if (!sections.has(section)) sections.set(section, []);
    sections.get(section).push(image);
  }
  return [...sections].map(([name, items]) => (
    <section className="project-sheets" key={name}>
      <h3>{name}</h3>
      {items.map(image => (
        <figure key={image.src}>
          <figcaption><strong>{image.sheet}</strong> {image.caption || image.alt}</figcaption>
          <a href={image.src} target="_blank" rel="noreferrer" aria-label={'Ampliar ' + image.alt}>
            <img className="detail-image" loading="lazy" src={image.src} alt={image.alt}/>
            <span>Ampliar vista ↗</span>
          </a>
        </figure>
      ))}
    </section>
  ));
}
