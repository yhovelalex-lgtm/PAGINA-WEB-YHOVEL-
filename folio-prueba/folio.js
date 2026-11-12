(() => {
  "use strict";
  const root = document.querySelector(".folio");
  if (!root) return;
  const projects = Array.isArray(window.FOLIO_PROYECTOS) ? window.FOLIO_PROYECTOS : [];
  const book = document.getElementById("folio-book");
  const cover = document.getElementById("folio-cover");
  const spread = document.getElementById("folio-spread");
  const turn = document.getElementById("folio-turn");
  const prev = document.getElementById("folio-prev");
  const next = document.getElementById("folio-next");
  const count = document.getElementById("folio-count");
  const bar = document.getElementById("folio-progress-bar");
  const currentName = document.getElementById("folio-current-name");
  const announcer = document.getElementById("folio-announcer");
  const mobile = document.getElementById("folio-mobile");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const about = {
    title: "[COMPLETAR: frase corta]",
    description: "Estudiante de arquitectura en la Universidad Nacional del Altiplano, Puno. Trabajo con flujos BIM en Revit y Dynamo y con identidad andina como punto de partida del proyecto.",
    tools: "Revit · Dynamo · [COMPLETAR]"
  };
  const spreads = [{kind:"about",name:"Sobre mí"}];
  projects.forEach(project => {
    spreads.push({kind:"project-a",project,name:project.titulo});
    spreads.push({kind:"project-b",project,name:project.titulo});
  });
  spreads.push({kind:"contact",name:"Contacto"});
  let index = 0, opened = false, locked = false, pointerStart = null;
  let light = {x:50,y:44}, targetLight = {x:50,y:44}, lastTime = 0, raf = 0;
  const esc = value => String(value ?? "").replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
  const placeholder = (number,label) => '<div class="folio-placeholder" role="img" aria-label="'+esc(label)+'"><strong>'+esc(number)+'</strong><small>'+esc(label)+'</small></div>';
  const image = (src,alt,number,label) => src
    ? '<div class="folio-image"><img src="'+esc(src)+'" alt="'+esc(alt)+'" loading="lazy" decoding="async" width="1200" height="1600"><span class="folio-caption">'+esc(label)+'</span></div>'
    : placeholder(number,label);
  const page = (side,content) => '<section class="folio-page folio-page-'+side+'"><div class="folio-page-inner">'+content+'</div></section>';
  const aboutLeft = () => '<p class="folio-label">00 · Quién soy</p><h2>'+esc(about.title)+'</h2><div class="folio-rule"></div><p>'+esc(about.description)+'</p><div class="folio-tools"><h3>Herramientas</h3>'+esc(about.tools)+'</div><span class="folio-sheet-index">FOLIO / 00</span>';
  const projectALeft = p => '<p class="folio-label">'+esc(p.numero)+' · Proyecto</p><h2>'+esc(p.titulo)+'</h2><p class="folio-muted">'+esc(p.lugar)+' · '+esc(p.anio)+' · '+esc(p.tipo)+'</p><div class="folio-rule"></div><h3><span class="folio-section-number">01</span> Contexto</h3><p>'+esc(p.contexto)+'</p><h3><span class="folio-section-number">02</span> Aproximación</h3><p>'+esc(p.aproximacion)+'</p><span class="folio-sheet-index">FOLIO / '+esc(p.numero)+'</span>';
  const projectBLeft = p => image(p.imagenPlano,p.altPlano,p.numero,p.piePlano);
  const projectBRight = p => '<p class="folio-label">'+esc(p.numero)+' · Desarrollo</p><h3><span class="folio-section-number">03</span> Propuesta</h3><p>'+esc(p.propuesta)+'</p><h3><span class="folio-section-number">04</span> Resultado</h3><p>'+esc(p.resultado)+'</p><dl class="folio-meta"><div><dt>Programa</dt><dd>'+esc(p.ficha.programa)+'</dd></div><div><dt>Superficie</dt><dd>'+esc(p.ficha.superficie)+'</dd></div><div><dt>Rol</dt><dd>'+esc(p.ficha.rol)+'</dd></div><div><dt>Herramientas</dt><dd>'+esc(p.ficha.herramientas)+'</dd></div></dl><span class="folio-sheet-index">FOLIO / '+esc(p.numero)+' · B</span>';
  function spreadMarkup(i) {
    const item = spreads[i];
    if (item.kind === "about") return page("left",aboutLeft()) + page("right",image(null,"Retrato del autor","Y","Retrato de Yhovel Alex"));
    if (item.kind === "project-a") return page("left",projectALeft(item.project)) + page("right",image(item.project.imagenPrincipal,item.project.altPrincipal,item.project.numero,item.project.piePrincipal));
    if (item.kind === "project-b") return page("left",projectBLeft(item.project)) + page("right",projectBRight(item.project));
    return page("left",'<p class="folio-label">Último pliego · Contacto</p><h2 class="folio-contact-large">Trabajemos<span>juntos.</span></h2><div class="folio-rule"></div><p>[COMPLETAR: correo público]</p><span class="folio-sheet-index">FOLIO / CONTACTO</span>') +
      page("right",'<p class="folio-label">Enlaces</p><h2>Conecta.</h2><ul class="folio-link-list"><li><a href="https://github.com/yhovelalex-lgtm" target="_blank" rel="noreferrer">GitHub ↗</a></li><li>[COMPLETAR: LinkedIn]</li><li>[COMPLETAR: Instagram]</li></ul>');
  }
  function mobileMarkup() {
    const aboutBlock = '<article><p class="folio-label">00 · Quién soy</p><h2>'+esc(about.title)+'</h2><p>'+esc(about.description)+'</p><figure><div class="folio-mobile-placeholder">Y</div></figure><p><strong>Herramientas</strong><br>'+esc(about.tools)+'</p></article>';
    const projectBlocks = projects.map(p => '<article><p class="folio-label">'+esc(p.numero)+' · Proyecto</p><h2>'+esc(p.titulo)+'</h2><p>'+esc(p.lugar)+' · '+esc(p.anio)+' · '+esc(p.tipo)+'</p><figure>'+(p.imagenPrincipal?'<img src="'+esc(p.imagenPrincipal)+'" alt="'+esc(p.altPrincipal)+'" loading="lazy" decoding="async" width="1200" height="1600">':'<div class="folio-mobile-placeholder">'+esc(p.numero)+'</div>')+'</figure><details open><summary><span class="folio-section-number">01</span> Contexto</summary><p>'+esc(p.contexto)+'</p></details><details><summary><span class="folio-section-number">02</span> Aproximación</summary><p>'+esc(p.aproximacion)+'</p></details><details><summary><span class="folio-section-number">03</span> Propuesta</summary><p>'+esc(p.propuesta)+'</p></details><details><summary><span class="folio-section-number">04</span> Resultado</summary><p>'+esc(p.resultado)+'</p></details><figure>'+(p.imagenPlano?'<img src="'+esc(p.imagenPlano)+'" alt="'+esc(p.altPlano)+'" loading="lazy" decoding="async" width="1200" height="1600">':'<div class="folio-mobile-placeholder">'+esc(p.numero)+'</div>')+'</figure><dl><div><dt>Programa</dt><dd>'+esc(p.ficha.programa)+'</dd></div><div><dt>Superficie</dt><dd>'+esc(p.ficha.superficie)+'</dd></div><div><dt>Rol</dt><dd>'+esc(p.ficha.rol)+'</dd></div><div><dt>Herramientas</dt><dd>'+esc(p.ficha.herramientas)+'</dd></div></dl></article>').join("");
    return aboutBlock + projectBlocks + '<article><p class="folio-label">Contacto</p><h2>Trabajemos<br>juntos.</h2><p>[COMPLETAR: correo público]</p><p><a href="https://github.com/yhovelalex-lgtm" target="_blank" rel="noreferrer">GitHub ↗</a></p><p>[COMPLETAR: LinkedIn e Instagram]</p></article>';
  }
  function updateUI() {
    spread.innerHTML = spreadMarkup(index);
    count.textContent = String(index+1).padStart(2,"0")+" / "+String(spreads.length).padStart(2,"0");
    bar.style.transform = "scaleX("+(index+1)/spreads.length+")";
    currentName.textContent = spreads[index].name;
    prev.disabled = !opened || index === 0 || locked;
    next.disabled = !opened || index === spreads.length-1 || locked;
    announcer.textContent = "Pliego "+(index+1)+" de "+spreads.length+": "+spreads[index].name;
  }
  function openBook() {
    if (opened || locked) return;
    opened = true; locked = true;
    book.classList.add("is-open");
    cover.animate(reduced.matches ? [{opacity:1},{opacity:0}] : [{transform:"rotateY(0deg)"},{transform:"rotateY(-180deg)"}], {duration:reduced.matches?150:1100,easing:"cubic-bezier(.22,.8,.18,1)",fill:"forwards"}).onfinish = () => {
      cover.hidden = true; locked = false; updateUI(); prev.disabled = true; next.disabled = false;
    };
    updateUI();
  }
  function closeBook() {
    if (!opened || locked) return;
    locked = true; cover.hidden = false; cover.style.opacity = "1"; book.classList.remove("is-open");
    cover.animate(reduced.matches ? [{opacity:0},{opacity:1}] : [{transform:"rotateY(-180deg)"},{transform:"rotateY(0deg)"}], {duration:reduced.matches?150:1100,easing:"cubic-bezier(.22,.8,.18,1)",fill:"forwards"}).onfinish = () => {
      opened = false; locked = false; cover.style.transform = ""; cover.style.opacity = ""; updateUI();
    };
  }
  function turnPage(direction) {
    if (!opened || locked) return;
    const target = index + direction;
    if (target < 0 || target >= spreads.length) return;
    locked = true; prev.disabled = true; next.disabled = true;
    const old = spreads[index], upcoming = spreads[target];
    const front = direction > 0 ? old.kind === "about" ? page("right",placeholder("Y","Retrato de Yhovel Alex")) : old.kind === "project-a" ? page("right",image(old.project.imagenPrincipal,old.project.altPrincipal,old.project.numero,old.project.piePrincipal)) : old.kind === "project-b" ? page("right",projectBRight(old.project)) : page("right","") : page("left",old.kind === "project-a" ? projectALeft(old.project) : old.kind === "project-b" ? projectBLeft(old.project) : old.kind === "about" ? aboutLeft() : "");
    const back = direction > 0 ? upcoming.kind === "about" ? page("left",aboutLeft()) : upcoming.kind === "project-a" ? page("left",projectALeft(upcoming.project)) : upcoming.kind === "project-b" ? page("left",projectBLeft(upcoming.project)) : page("left",'<p class="folio-label">Contacto</p><h2>Trabajemos juntos.</h2>') : upcoming.kind === "project-a" ? page("right",image(upcoming.project.imagenPrincipal,upcoming.project.altPrincipal,upcoming.project.numero,upcoming.project.piePrincipal)) : upcoming.kind === "project-b" ? page("right",projectBRight(upcoming.project)) : page("right",'<h2>Conecta.</h2>');
    turn.className = "folio-turn";
    turn.innerHTML = '<div class="folio-turn-face folio-turn-front">'+front+'</div><div class="folio-turn-face folio-turn-back">'+back+'</div>';
    const from = direction > 0 ? 0 : 0, to = direction > 0 ? -180 : 180;
    const animation = turn.animate([{transform:"rotateY("+from+"deg)"},{transform:"rotateY("+to+"deg)"}], {duration:reduced.matches?150:900,easing:"cubic-bezier(.22,.8,.18,1)"});
    const timer = window.setTimeout(() => {
      index = target; turn.innerHTML = ""; turn.style.transform = ""; updateUI(); locked = false;
    }, reduced.matches?160:950);
    animation.onfinish = () => window.clearTimeout(timer);
  }
  cover.addEventListener("click",openBook);
  prev.addEventListener("click",() => turnPage(-1));
  next.addEventListener("click",() => turnPage(1));
  document.addEventListener("keydown",event => {
    if (!root.isConnected) return;
    if (event.key === "Escape") { closeBook(); return; }
    if (!opened) { if (event.key === "Enter" && document.activeElement === cover) openBook(); return; }
    if (event.key === "ArrowLeft") { event.preventDefault(); turnPage(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); turnPage(1); }
  });
  spread.addEventListener("click",event => {
    if (!opened || locked || event.target.closest("a,button")) return;
    const bounds = spread.getBoundingClientRect(), x = event.clientX - bounds.left;
    if (x < bounds.width*.28) turnPage(-1);
    else if (x > bounds.width*.72) turnPage(1);
  });
  book.addEventListener("pointerdown",event => { if (opened) pointerStart = {x:event.clientX,time:performance.now()}; });
  book.addEventListener("pointerup",event => {
    if (!pointerStart) return;
    const dx = event.clientX-pointerStart.x, elapsed = Math.max(1,performance.now()-pointerStart.time);
    if (Math.abs(dx)>40 || Math.abs(dx)/elapsed>.3) turnPage(dx<0?1:-1);
    pointerStart = null;
  });
  root.addEventListener("pointermove",event => {
    if (event.pointerType === "mouse") {
      const rect = root.getBoundingClientRect();
      targetLight.x = (event.clientX-rect.left)/rect.width*100;
      targetLight.y = (event.clientY-rect.top)/rect.height*100;
    }
  },{passive:true});
  function animateLight(time) {
    if (!reduced.matches && !document.hidden && root.getBoundingClientRect().bottom>0 && root.getBoundingClientRect().top<innerHeight) {
      const dt = lastTime ? Math.min(.05,(time-lastTime)/1000) : 0;
      const factor = 1-Math.exp(-5*dt);
      if (!matchMedia("(pointer:fine)").matches) {
        targetLight.x = 50+Math.sin(time/8000*Math.PI*2)*12;
        targetLight.y = 44+Math.cos(time/8000*Math.PI*2)*7;
      }
      light.x += (targetLight.x-light.x)*factor; light.y += (targetLight.y-light.y)*factor;
      root.style.setProperty("--folio-light-x",light.x+"%");
      root.style.setProperty("--folio-light-y",light.y+"%");
    }
    lastTime=time; raf=requestAnimationFrame(animateLight);
  }
  document.addEventListener("visibilitychange",() => { if (document.hidden) cancelAnimationFrame(raf); else {lastTime=0; raf=requestAnimationFrame(animateLight);} });
  mobile.innerHTML = mobileMarkup();
  updateUI();
  if (!reduced.matches) raf=requestAnimationFrame(animateLight);
})();