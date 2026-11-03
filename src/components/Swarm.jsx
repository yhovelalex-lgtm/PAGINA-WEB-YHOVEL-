import React,{useState,useEffect,useRef,useMemo} from 'react';
import {motion,AnimatePresence,useReducedMotion} from 'framer-motion';
import {ArrowUpRight,ArrowRight,Plus,Minus,X,Code2,Box,Layers,GitBranch,Check,Mail,MoveHorizontal,Maximize2,RotateCw,Download,Settings2,ChevronLeft,ChevronRight} from 'lucide-react';
export default function Swarm(){
 const reduced=useReducedMotion(),refs=useRef([]),dock=useRef(null),layer=useRef(null),frames=useRef([]);
 useEffect(()=>{
  if(reduced||!matchMedia('(pointer:fine)').matches)return;
  const pointer={x:innerWidth-110,y:innerHeight-90};
  const bots=Array.from({length:9},()=>({x:pointer.x,y:pointer.y,vx:0,vy:0,target:null,started:false}));
  let raf,last=performance.now(),start=last,section=null,candidate=null,candidateSince=0,animations=[],decorated=[];
  const areas=[...document.querySelectorAll('main > section, main > footer, .experience')];
  const names=['TÍTULO','TRAZO','TEXTO','RETÍCULA','CAPAS','DETALLE','ALINEAR','ESPACIO','REVISIÓN'];
  const clear=()=>{frames.current.forEach(f=>{if(f)f.style.opacity='0'});animations.forEach(a=>a.cancel());animations=[];decorated.forEach(el=>el.classList.remove('robot-editing'));decorated=[];};
  function assign(next,now){
   clear();section=next;start=now;
   const elements=[...next.querySelectorAll('h1,h2,h3,.eyebrow,p,.project-image,.timeline,.award,.control,.bar,.philosophy,.contact-card,.portrait,.live-widget,.stats')].filter(el=>{
    const r=el.getBoundingClientRect();return r.width>10&&r.bottom>90&&r.top<innerHeight-25;
   });
   // Prefer independent blocks so several builders never animate the same parent and child.
   const targets=elements.filter(el=>!elements.some(other=>other!==el&&other.contains(el))).slice(0,9);
   bots.forEach((b,i)=>{b.target=targets[i%Math.max(1,targets.length)]||next;b.started=false;});
   layer.current.dataset.phase='building';
  }
  function move(e){pointer.x=e.clientX;pointer.y=e.clientY;}
  function replay(){if(section)assign(section,performance.now())}window.addEventListener('folio-replay',replay);window.addEventListener('pointermove',move,{passive:true});
  function frame(now){
   const dt=Math.min((now-last)/16.67,2);last=now;
   // A stable reading line prevents flicker at the boundary between two sections.
   const readingLine=innerHeight*.43;
   const next=areas.filter(el=>{const r=el.getBoundingClientRect();return r.top<=readingLine&&r.bottom>readingLine}).at(-1)||areas.find(el=>{const r=el.getBoundingClientRect();return r.bottom>100&&r.top<innerHeight*.7});
   if(next!==candidate){candidate=next;candidateSince=now;}
   if(next&&next!==section&&now-candidateSince>150)assign(next,now);
   const age=now-start,phase=age<6000?'building':age<7800?'returning':'stored';
   layer.current.dataset.phase=phase;
   const dx=Math.max(10,Math.min(innerWidth-112,pointer.x+24)),dy=Math.max(95,Math.min(innerHeight-48,pointer.y+22));
   dock.current.style.transform=`translate3d(${dx}px,${dy}px,0)`;
   dock.current.dataset.phase=phase;
   dock.current.querySelector('span').textContent=phase==='building'?'EDITANDO':phase==='returning'?'REUNIENDO':'9 / LISTOS';
   bots.forEach((b,i)=>{
    const local=age-i*170;const progress=Math.max(0,Math.min(1,(local-600)/3600));
    let tx=dx+12+(i%3)*14,ty=dy+8+Math.floor(i/3)*9;
    const working=phase==='building'&&local>0&&local<4400&&b.target;
    if(working){
     const r=b.target.getBoundingClientRect();
     const mode=i%3;
     const f=frames.current[i];
     if(f){f.style.opacity=local>200?'1':'0';f.style.left=(r.left-5)+'px';f.style.top=(r.top-5)+'px';f.style.width=(r.width+10)+'px';f.style.height=(r.height+10)+'px';f.style.setProperty('--build',progress);f.querySelector('.frame-caption').textContent=`${names[i]} / ${Math.round(progress*100)}%`;}
     // Writers sweep the baseline; layout robots move to corners; reviewers scan vertically.
     const px=mode===0?r.left+r.width*progress:mode===1?r.left+r.width:r.left+r.width*.85;
     const py=mode===0?r.bottom+4:mode===1?r.top+r.height*progress:r.top+r.height*(.5+.45*Math.sin(progress*Math.PI*2));
     tx=Math.max(8,Math.min(innerWidth-85,px));
     ty=Math.max(86,Math.min(innerHeight-85,py));
     if(!b.started){
      b.started=true;
      if(!decorated.includes(b.target)){
       decorated.push(b.target);b.target.classList.add('robot-editing');
       const textBlock=b.target.matches('h1,h2,h3,p,.eyebrow');const keyframes=textBlock?[{opacity:.18,clipPath:'inset(0 100% 0 0)'},{opacity:1,clipPath:'inset(0 0 0 0)'}]:[{opacity:.35,translate:'0 16px',scale:'.97'},{opacity:1,translate:'0 0',scale:'1'}];animations.push(b.target.animate(keyframes,{duration:2600,delay:450,easing:textBlock?'steps(36,end)':'cubic-bezier(.2,.7,.2,1)',fill:'backwards'}));
      }
     }
    }
    if(!working&&frames.current[i])frames.current[i].style.opacity='0';
    if(local>4400&&b.target)b.target.classList.remove('robot-editing');
    const d=Math.hypot(tx-b.x,ty-b.y);
    b.vx=(b.vx+(tx-b.x)*.045*dt)*Math.pow(.77,dt);b.vy=(b.vy+(ty-b.y)*.045*dt)*Math.pow(.77,dt);
    b.x+=b.vx*dt;b.y+=b.vy*dt;
    const el=refs.current[i];
    el.style.transform=`translate3d(${b.x}px,${b.y}px,0) rotate(${d>70?Math.max(-28,Math.min(28,b.vx*2)):0}deg) scale(${phase==='stored'?.12:1})`;
    el.style.opacity=phase==='stored'?'0':'1';el.dataset.jet=d>70?'true':'false';el.dataset.working=working&&d<80?'true':'false';
   });
   raf=requestAnimationFrame(frame);
  }
  raf=requestAnimationFrame(frame);
  return()=>{cancelAnimationFrame(raf);clear();window.removeEventListener('pointermove',move);window.removeEventListener('folio-replay',replay);};
 },[reduced]);
 if(reduced)return null;
 return <div ref={layer} className="swarm builder-swarm" aria-hidden="true">{Array.from({length:9},(_,i)=><div key={'frame'+i} ref={el=>frames.current[i]=el} className="edit-frame" style={{'--agent-color':['#2455ee','#587a81','#6b5f9e'][i%3]}}><span className="frame-caption"/><i/><i/><i/><i/><div className="scan-line"/></div>)}<div ref={dock} className="robot-dock"><Box size={14}/><span>9 / LISTOS</span><i/></div>{Array.from({length:9},(_,i)=><div className="bot builder-bot" style={{'--agent-color':['#2455ee','#587a81','#6b5f9e'][i%3]}} ref={el=>refs.current[i]=el} key={i}><svg viewBox="0 0 32 36" width="28"><g stroke="#3f3f46" strokeWidth="1.5" fill="white"><path d="M16 6V2m-2 0h4"/><rect x="7" y="7" width="18" height="14" rx="4"/><circle cx="12" cy="13" r="1" fill="#2455ee"/><circle cx="20" cy="13" r="1" fill="#2455ee"/><path d="M13 18h6M7 22l-4 4"/><g className="tool-arm"><path d="M25 19l4-5m-2-3 4 4M26 10l5 5" stroke="#2455ee"/></g><g className="legs"><path d="M11 21v8H7m14-8v8h4"/></g></g><path className="flame" d="M10 22l3 12 3-10 3 10 3-12" fill="#2455ee"/><g className="sparks" stroke="#2455ee"><path d="M27 5V1m3 6 2-2m-9-1-2-2"/></g></svg><span className="builder-label">{['TÍTULO','TRAZO','TEXTO','RETÍCULA','CAPAS','DETALLE','ALINEAR','ESPACIO','REVISIÓN'][i]}</span><div className="builder-guide"/><span className="agent-pointer">➤</span></div>)}</div>;
}
