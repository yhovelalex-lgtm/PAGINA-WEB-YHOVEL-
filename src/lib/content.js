export function safeUrl(value,{local=false}={}){
 if(typeof value!=='string'||!value.trim())return false;
 if(local&&value.startsWith('/media/')&&!value.includes('..')&&!value.includes('\\'))return true;
 try{const u=new URL(value);return u.protocol==='https:'&&!u.username&&!u.password}catch{return false}
}
export function validateProjects(data){
 const rows=Array.isArray(data)?data:data?.projects;
 if(!Array.isArray(rows)||rows.length>100)throw Error('El catálogo debe ser un array de hasta 100 proyectos.');
 const ids=new Set();
 return rows.map((p,i)=>{
  if(!p||!['id','title','category','description'].every(k=>typeof p[k]==='string'&&p[k].trim()&&p[k].length<=4000))throw Error(`Proyecto ${i+1}: completa id, title, category y description.`);
  if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.id)||ids.has(p.id))throw Error(`ID inválido o repetido: ${p.id}`);ids.add(p.id);
  if(p.status&&!['published','draft'].includes(p.status))throw Error(`Estado inválido en ${p.id}.`);
  if(p.url&&!safeUrl(p.url))throw Error(`El enlace de ${p.id} debe ser HTTPS.`);
  if(p.cover&&(!safeUrl(p.cover.src,{local:true})||typeof p.cover.alt!=='string'||!p.cover.alt.trim()))throw Error(`Portada de ${p.id}: usa una ruta /media/ o HTTPS y un texto alt.`);
  if(p.gallery&&!Array.isArray(p.gallery))throw Error(`La galería de ${p.id} debe ser un array.`);
  if((p.gallery||[]).length>30)throw Error('Máximo 30 imágenes por proyecto.');
  for(const image of p.gallery||[])if(!safeUrl(image?.src,{local:true})||typeof image.alt!=='string'||!image.alt.trim())throw Error(`Imagen inválida en ${p.id}.`);
  return {...p,year:String(p.year||new Date().getFullYear()),tools:Array.isArray(p.tools)?p.tools.filter(t=>typeof t==='string').slice(0,12):[],visual:Number.isInteger(p.visual)?Math.abs(p.visual)%4:i%4,status:p.status||'published',demo:!!p.demo,gallery:p.gallery||[]};
 });
}
export function validateApps(apps){if(!Array.isArray(apps))throw Error('apps.json debe contener un array');const ids=new Set();for(const app of apps){if(!app.id||ids.has(app.id)||!app.name||!app.description||!safeUrl(app.url))throw Error('Aplicación inválida o duplicada');ids.add(app.id)}return apps}
export function exportJson(data,name='projects.json'){const blob=new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
