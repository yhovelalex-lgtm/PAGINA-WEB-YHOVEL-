import fs from 'node:fs';
import path from 'node:path';
import {validateProjects,validateApps,safeUrl} from '../src/lib/content.js';
const read=name=>JSON.parse(fs.readFileSync(`public/content/${name}.json`,'utf8'));
try{
 const projects=validateProjects(read('projects')),apps=validateApps(read('apps')),site=read('site');
 if(!site.name||!site.surname||!site.role||!safeUrl(site.github)||!safeUrl(site.repository))throw Error('Perfil incompleto o enlaces inválidos');
 const host=(u,h)=>{try{const x=new URL(u).hostname.replace(/^www\./,'');return x===h||x.endsWith('.'+h)}catch{return false}};
 if(site.linkedin&&!(safeUrl(site.linkedin)&&host(site.linkedin,'linkedin.com')))throw Error('LinkedIn debe ser un enlace HTTPS de linkedin.com');
 if(site.instagram&&!(safeUrl(site.instagram)&&host(site.instagram,'instagram.com')))throw Error('Instagram debe ser un enlace HTTPS de instagram.com');
 if(site.trajectory&&(!Array.isArray(site.trajectory)||site.trajectory.some(t=>!t.period||!t.title||!t.description)))throw Error('trajectory: cada elemento necesita period, title y description');
 if(site.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(site.email))throw Error('Email inválido');
 for(const project of projects)for(const image of [project.cover,...project.gallery].filter(Boolean)){if(image.src.startsWith('/media/')&&!fs.existsSync(path.join('public',image.src)))throw Error(`Falta la imagen ${image.src}`)}
 console.log(`Contenido válido: ${projects.length} proyectos (${projects.filter(p=>p.status==='published').length} visibles), ${apps.length} aplicaciones.`);
}catch(e){console.error('ERROR DE CONTENIDO:',e.message);process.exitCode=1}
