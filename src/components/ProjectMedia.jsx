import React,{useState,useEffect} from 'react';
import Building from './Building';
export default function ProjectMedia({project}){const [failed,setFailed]=useState(false);useEffect(()=>setFailed(false),[project.cover?.src]);return project.cover&&!failed?<img className="project-cover" src={project.cover.src} alt={project.cover.alt} loading="lazy" decoding="async" onError={()=>setFailed(true)}/>:<div className="vector-cover"><Building variant={project.visual}/><span className="media-caption">{failed?'Imagen no disponible · vista alternativa':'Ilustración conceptual'}</span></div>}
