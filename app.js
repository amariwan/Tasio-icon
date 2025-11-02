const ICONS_JSON = 'icons.json';
const ICONS_DIR = 'data-icon';
const THEME_KEY = 'tasio:theme';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

async function fetchJson(path){
  const res = await fetch(path);
  if(!res.ok) throw new Error('Fehler beim Lesen: '+path);
  return res.json();
}

function el(tag, attrs = {}, children = []){
  const e = document.createElement(tag);
  for(const k in attrs){
    if(k === 'class') e.className = attrs[k];
    else if(k.startsWith('on') && typeof attrs[k] === 'function') e.addEventListener(k.slice(2), attrs[k]);
    else e.setAttribute(k, attrs[k]);
  }
  for(const c of children) e.append(typeof c === 'string' ? document.createTextNode(c) : c);
  return e;
}

async function render(){
  const icons = await fetchJson(ICONS_JSON);
  const grid = $('#grid');
  $('#count').textContent = `${icons.length} Icons`;

  // Theme: initialize from localStorage or system preference
  const themeToggle = document.getElementById('theme-toggle');
  function applyTheme(t){
    document.documentElement.setAttribute('data-theme', t);
    if(themeToggle){
      themeToggle.textContent = t === 'light' ? '☀️' : '🌙';
      themeToggle.setAttribute('aria-pressed', t === 'light');
    }
  }

  const saved = localStorage.getItem(THEME_KEY);
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const startTheme = saved || (prefersLight ? 'light' : 'dark');
  applyTheme(startTheme);

  if(themeToggle){
    themeToggle.classList.add('theme-toggle');
    themeToggle.addEventListener('click', ()=>{
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  function makeCard(name){
    const preview = el('div',{class:'preview'});
    const img = el('img',{src:`${ICONS_DIR}/${name}.svg`, alt:name, loading:'lazy'});
    preview.appendChild(img);

    const meta = el('div',{class:'meta'}, [name]);

    const btnCopy = el('button',{title:'Copy SVG', onclick: async ()=>{
      try{
        const txt = await (await fetch(`${ICONS_DIR}/${name}.svg`)).text();
        await navigator.clipboard.writeText(txt);
        btnCopy.textContent = 'Copied';
        setTimeout(()=>btnCopy.textContent='Copy',900);
      }catch(e){console.error(e); alert('Konnte nicht kopieren');}
    }}, ['Copy']);

    const btnDL = el('button',{title:'Download SVG', onclick: ()=>{
      fetch(`${ICONS_DIR}/${name}.svg`).then(r=>r.blob()).then(blob=>{
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${name}.svg`; document.body.appendChild(a); a.click(); a.remove();
        URL.revokeObjectURL(url);
      });
    }}, ['Download']);

    const actions = el('div',{class:'actions'}, [btnCopy, btnDL]);

    const card = el('div',{class:'card'}, [preview, meta, actions]);
    return card;
  }

  for(const name of icons){
    grid.appendChild(makeCard(name));
  }

  const search = $('#search');
  search.addEventListener('input', (e)=>{
    const q = e.target.value.trim().toLowerCase();
    const cards = $$('.card');
    for(const c of cards){
      const name = c.querySelector('.meta').textContent.toLowerCase();
      c.style.display = name.includes(q) ? '' : 'none';
    }
  });

  // optional: download-all (basic): create a zip of SVGs - browser-side zip is heavy; we'll fallback to suggest server-side
  $('#download-all').addEventListener('click', ()=>{
    alert('Für "Download alle" benutze bitte einen Server/ZIP-Generator. Alternativ: clone repo oder lade den data-icon Ordner herunter.');
  });
}

render().catch(err=>{
  console.error(err);
  $('#count').textContent = 'Fehler beim Laden der Icons. Schau in die Konsole.';
});
