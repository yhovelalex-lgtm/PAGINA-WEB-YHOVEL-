import React from 'react';
import ProjectMedia from './ProjectMedia';
import '../styles/project-experience.css';

export default function ProjectExperience({ projects, onOpen }) {
  const project = projects.find(item => item.id === 'proyecto-en-estudio');
  if (!project) return null;
  return <section id="proyecto-en-estudio" className="project-experience" aria-labelledby="experience-title">
    <a className="experience-preview" href="/proyectos/en-estudio/" aria-label="Explorar Proyecto en estudio">
      <ProjectMedia project={project}/>
      <span>Explorar experiencia ↗</span>
    </a>
    <div className="experience-copy">
      <span className="eyebrow">PROYECTOS EN DESARROLLO</span>
      <h3 id="experience-title">{project.title}</h3>
      <p>{project.description}</p>
      <div className="experience-actions">
        <a className="black" href="/proyectos/en-estudio/">Entrar al proyecto ↗</a>
        <button className="outline" onClick={() => onOpen(project)}>Ver ficha</button>
      </div>
    </div>
  </section>;
}
