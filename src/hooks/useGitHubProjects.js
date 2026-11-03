import {useState,useEffect} from 'react';
import bundled from '../../public/content/projects.json';
import CONFIG from '../../public/content/site.json';
import {validateProjects} from '../lib/content';
export default function useGitHubProjects(){
 const [allProjects,setAllProjects]=useState(()=>validateProjects(bundled));
 const [status,setStatus]=useState('Catálogo versionado'),[error,setError]=useState('');
 useEffect(()=>{const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),10000);let active=true;
 fetch(CONFIG.projectsUrl,{signal:controller.signal,cache:'no-cache'}).then(r=>{if(!r.ok)throw Error(`No se pudo leer el catálogo (${r.status})`);return r.json()}).then(data=>{if(active){setAllProjects(validateProjects(data));setStatus('Catálogo actualizado')}}).catch(e=>{if(active){setStatus('Copia de respaldo');setError('No se pudo actualizar el catálogo. Se muestra la copia incluida en esta versión.')}}).finally(()=>clearTimeout(timer));
 return()=>{active=false;controller.abort();clearTimeout(timer)}},[]);
 return {projects:allProjects.filter(p=>p.status==='published'),allProjects,status,error};
}
