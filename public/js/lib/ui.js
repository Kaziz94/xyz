var b=t=>({get:e=>t.get(e),set:(e,i)=>(t.set(e,i),i)}),j=/([^\s\\>"'=]+)\s*=\s*(['"]?)$/,G=/^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i,J=/<[a-z][^>]+$/i,Q=/>[^<>]*$/,X=/<([a-z]+[a-z0-9:._-]*)([^>]*?)(\/>)/ig,K=/\s+$/,T=(t,e)=>0<e--&&(J.test(t[e])||!Q.test(t[e])&&T(t,e)),Y=(t,e,i)=>G.test(e)?t:`<${e}${i.replace(K,"")}></${e}>`,V=(t,e,i)=>{let n=[],{length:o}=t;for(let s=1;s<o;s++){let d=t[s-1];n.push(j.test(d)&&T(t,s)?d.replace(j,(c,r,p)=>`${e}${s-1}=${p||'"'}${r}${p?"":'"'}`):`${d}<!--${e}${s-1}-->`)}n.push(t[o-1]);let l=n.join("").trim();return i?l:l.replace(X,Y)},{isArray:_}=Array,{indexOf:tt,slice:S}=[],et=1,O=111,it=({firstChild:t,lastChild:e})=>{let i=document.createRange();return i.setStartAfter(t),i.setEndAfter(e),i.deleteContents(),t},nt=(t,e)=>t.nodeType===O?1/e<0?e?it(t):t.lastChild:e?t.valueOf():t.firstChild:t,ot=t=>{let{childNodes:e}=t,{length:i}=e;if(i<2)return i?e[0]:t;let n=S.call(e,0),o=n[0],l=n[i-1];return{ELEMENT_NODE:et,nodeType:O,firstChild:o,lastChild:l,valueOf(){if(e.length!==i){let s=0;for(;s<i;)t.appendChild(n[s++])}return t}}},lt=(t,e,i,n,o)=>{let l=i.length,s=e.length,d=l,c=0,r=0,p=null;for(;c<s||r<d;)if(s===c){let h=d<l?r?n(i[r-1],-0).nextSibling:n(i[d-r],0):o;for(;r<d;)t.insertBefore(n(i[r++],1),h)}else if(d===r)for(;c<s;)(!p||!p.has(e[c]))&&t.removeChild(n(e[c],-1)),c++;else if(e[c]===i[r])c++,r++;else if(e[s-1]===i[d-1])s--,d--;else if(e[c]===i[d-1]&&i[r]===e[s-1]){let h=n(e[--s],-1).nextSibling;t.insertBefore(n(i[r++],1),n(e[c++],-1).nextSibling),t.insertBefore(n(i[--d],1),h),e[s]=i[d]}else{if(!p){p=new Map;let h=r;for(;h<d;)p.set(i[h],h++)}if(p.has(e[c])){let h=p.get(e[c]);if(r<h&&h<d){let m=c,w=1;for(;++m<s&&m<d&&p.get(e[m])===h+w;)w++;if(w>h-r){let Z=n(e[c],0);for(;r<h;)t.insertBefore(n(i[r++],1),Z)}else t.replaceChild(n(i[r++],1),n(e[c++],-1))}else c++}else t.removeChild(n(e[c++],-1))}return i},st=t=>e=>{for(let i in e){let n=i==="role"?i:`aria-${i}`,o=e[i];o==null?t.removeAttribute(n):t.setAttribute(n,o)}},rt=(t,e)=>{let i,n=!0,o=document.createAttributeNS(null,e);return l=>{i!==l&&(i=l,i==null?n||(t.removeAttributeNode(o),n=!0):(o.value=l,n&&(t.setAttributeNodeNS(o),n=!1)))}},ct=(t,e,i)=>n=>{i!==!!n&&((i=!!n)?t.setAttribute(e,""):t.removeAttribute(e))},dt=({dataset:t})=>e=>{for(let i in e){let n=e[i];n==null?delete t[i]:t[i]=n}},at=(t,e)=>{let i,n=e.slice(2);return!(e in t)&&e.toLowerCase()in t&&(n=n.toLowerCase()),o=>{let l=_(o)?o:[o,!1];i!==l[0]&&(i&&t.removeEventListener(n,i,l[1]),(i=l[0])&&t.addEventListener(n,i,l[1]))}},pt=t=>e=>{typeof e=="function"?e(t):e.current=t},gt=(t,e)=>e==="dataset"?dt(t):i=>{t[e]=i},ht=t=>{let e;return i=>{e!=i&&(e=i,t.textContent=i??"")}};var M=function(t){var e="fragment",i="template",n="content"in s(i),o=n?function(c){var r=s(i);return r.innerHTML=c,r.content}:function(c){var r=s(e),p=s(i),h=null;if(/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(c)){var m=RegExp.$1;p.innerHTML="<table>"+c+"</table>",h=p.querySelectorAll(m)}else p.innerHTML=c,h=p.childNodes;return l(r,h),r};return function(r,p){return(p==="svg"?d:o)(r)};function l(c,r){for(var p=r.length;p--;)c.appendChild(r[0])}function s(c){return c===e?t.createDocumentFragment():t.createElementNS("http://www.w3.org/1999/xhtml",c)}function d(c){var r=s(e),p=s("div");return p.innerHTML='<svg xmlns="http://www.w3.org/2000/svg">'+c+"</svg>",l(r,p.firstChild.childNodes),r}}(document),ft=({childNodes:t},e)=>t[e],k=t=>{let e=[],{parentNode:i}=t;for(;i;)e.push(tt.call(i.childNodes,t)),t=i,i=t.parentNode;return e},{createTreeWalker:P,importNode:L}=document,A=L.length!=1,ut=A?(t,e,i)=>L.call(document,M(t,e,i),!0):M,mt=A?t=>P.call(document,t,1|128,null,!1):t=>P.call(document,t,1|128),v=(t,e,i)=>lt(t.parentNode,e,i,nt,t),vt=t=>{let e,i,n=[],o=l=>{switch(typeof l){case"string":case"number":case"boolean":e!==l&&(e=l,i||(i=document.createTextNode("")),i.nodeValue=l,n=v(t,n,[i]));break;case"object":case"undefined":if(l==null){e!=l&&(e=l,n=v(t,n,[]));break}if(_(l)){e=l,l.length===0?n=v(t,n,[]):typeof l[0]=="object"?n=v(t,n,l):o(String(l));break}"ELEMENT_NODE"in l&&e!==l&&(e=l,n=v(t,n,l.nodeType===11?S.call(l.childNodes):[l]));break;case"function":o(l(t));break}};return o},$t=(t,e)=>{switch(e[0]){case"?":return ct(t,e.slice(1),!1);case".":return gt(t,e.slice(1));case"o":if(e[1]==="n")return at(t,e)}switch(e){case"ref":return pt(t);case"aria":return st(t)}return rt(t,e)};function xt(t){let{type:e,path:i}=t,n=i.reduceRight(ft,this);return e==="node"?vt(n):e==="attr"?$t(n,t.name):ht(n)}var $="isµ",N=b(new WeakMap),yt=/^(?:plaintext|script|style|textarea|title|xmp)$/i,y=()=>({stack:[],entry:null,wire:null}),wt=(t,e)=>{let{content:i,updates:n}=Ct(t,e);return{type:t,template:e,content:i,updates:n,wire:null}},bt=(t,e)=>{let i=V(e,$,t==="svg"),n=ut(i,t),o=mt(n),l=[],s=e.length-1,d=0,c=`${$}${d}`;for(;d<s;){let r=o.nextNode();if(!r)throw`bad template: ${i}`;if(r.nodeType===8)r.nodeValue===c&&(l.push({type:"node",path:k(r)}),c=`${$}${++d}`);else{for(;r.hasAttribute(c);)l.push({type:"attr",path:k(r),name:r.getAttribute(c)}),r.removeAttribute(c),c=`${$}${++d}`;yt.test(r.tagName)&&r.textContent.trim()===`<!--${c}-->`&&(r.textContent="",l.push({type:"text",path:k(r)}),c=`${$}${++d}`)}}return{content:n,nodes:l}},Ct=(t,e)=>{let{content:i,nodes:n}=N.get(e)||N.set(e,bt(t,e)),o=L.call(document,i,!0),l=n.map(xt,o);return{content:o,updates:l}},E=(t,{type:e,template:i,values:n})=>{let{length:o}=n;I(t,n,o);let{entry:l}=t;(!l||l.template!==i||l.type!==e)&&(t.entry=l=wt(e,i));let{content:s,updates:d,wire:c}=l;for(let r=0;r<o;r++)d[r](n[r]);return c||(l.wire=ot(s))},I=({stack:t},e,i)=>{for(let n=0;n<i;n++){let o=e[n];o instanceof B?e[n]=E(t[n]||(t[n]=y()),o):_(o)?I(t[n]||(t[n]=y()),o,o.length):t[n]=null}i<t.length&&t.splice(i)};function B(t,e,i){this.type=t,this.template=e,this.values=i}var{create:_t,defineProperties:kt}=Object,D=t=>{let e=b(new WeakMap),i=n=>(o,...l)=>E(n,{type:t,template:o,values:l});return kt((n,...o)=>new B(t,n,o),{for:{value(n,o){let l=e.get(n)||e.set(n,_t(null));return l[o]||(l[o]=i(y()))}},node:{value:(n,...o)=>E(y(),{type:t,template:n,values:o}).valueOf()}})},Bt=b(new WeakMap);var a=D("html"),g=D("svg");function u(t,e){let i=t.closest(".expandable");if(!!i){if(i.classList.contains("expanded"))return i.classList.remove("expanded");e&&[...i.parentElement.children].forEach(n=>{n.classList.remove("expanded")}),i.classList.add("expanded")}}var x=t=>{if(t.svg&&!t.legend)return t.svg;let e={dot:F(t),target:Lt(t),triangle:Et(t),square:Ft(t),semiCircle:Tt(t),markerLetter:St(t),markerColor:Ot(t),geo:Mt(),circle:Pt(t),diamond:jt(t)};function i(n){let o=`height: ${n.cluster?40:24}px; width: ${n.cluster?40:24}px; position: relative;`,l=a.node`<div style="${o}">`;function s(d){let c=`position:absolute; height:${d.cluster?40:20}px; width:${d.cluster?40:20}px;`;return d.svg?l.appendChild(a.node`<img style="${c}" src="${d.svg}"/>`):d.type?l.appendChild(a.node`<img style="${c}" src="${e[d.type]}"/>`):l.appendChild(a.node`<img style="${c}" src="${F({color:"#666"})}"/>`)}return n.layers&&Array.isArray(n.layers)?n.layers.map(d=>s(d)):s(n),l}return t.legend?i(t):t.type?e[t.type]:F({color:"#666"})},f=new XMLSerializer;function F(t){let e=g.node`
    <svg width=24 height=24 viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
      <circle cx=13 cy=13 r=10 fill='#333'></circle>
      <circle cx=12 cy=12 r=10 fill=${t.fillColor||"#fff"}></circle>`;return`data:image/svg+xml,${encodeURIComponent(f.serializeToString(e))}`}function Lt(t){let e=g.node`
  <svg width=24 height=24 viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <circle cx=13 cy=13 fill='#333' r=10 opacity=0.4></circle>
    <circle cx=12 cy=12 r=10 fill=${t.fillColor||"#FFF"}>`;return t.layers&&Object.entries(t.layers).forEach(i=>{e.appendChild(g.node`<circle cx=12 cy=12 r=${parseFloat(i[0])*10} fill=${i[1]}>`)}),`data:image/svg+xml,${encodeURIComponent(f.serializeToString(e))}`}function Et(t){let e=g.node`
  <svg width=24 height=24 viewBox='${"0 0 24 24"}' xmlns='http://www.w3.org/2000/svg'>
  <polygon points="12,4.68 2,22 22,22" 
  fill="#333" stroke="#333" opacity=0.4 stroke-opacity=0.4 stroke-width=3
  stroke-linejoin="round"/>`;return e.appendChild(g.node`<polygon
    fill=${t.fillColor||"#FFF"} stroke=${t.fillColor||"#FFF"} stroke-width=2
    points="12,4.68 2,22 22,22"  stroke-linejoin="round"/>`),t.layers&&Object.entries(t.layers).forEach(i=>{function n(s,d){return 12+(s-12)*d}function o(s,d){return 16+(s-16)*d}let l=`${n(12,i[0])},${o(4.68,i[0])} ${n(2,i[0])}, ${o(22,i[0])} ${n(22,i[0])}, ${o(22,i[0])}`;e.appendChild(g.node`<polygon
    fill=${i[1]} stroke=${i[1]||"#FFF"} stroke-width=1
    points="${l}" stroke-linejoin="round"/>`)}),`data:image/svg+xml,${encodeURIComponent(f.serializeToString(e))}`}function Ft(t){let e=g.node`
  <svg width=24 height=24 viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <rect fill='#333' opacity=0.3 width=20 height=20 x=2 y=2 rx=1></rect>
    <rect fill=${t.fillColor||"#FFF"} width=20 height=20 x=0 y=0 rx=1></rect>`;return t.layers&&Object.entries(t.layers).forEach(i=>{e.appendChild(g.node`<rect fill=${i[1]}
      width=${parseFloat(i[0])*20}
      height=${parseFloat(i[0])*20}
      x=${10*(1-parseFloat(i[0]))}
      y=${10*(1-parseFloat(i[0]))} rx=${parseFloat(i[0])}></rect>`)}),`data:image/svg+xml,${encodeURIComponent(f.serializeToString(e))}`}function jt(t){let e=g.node`
  <svg width=24 height=24 viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
  <polygon fill='#333' opacity=0.3
    points="12 0, 24 12, 12 24, 0 12"
    ></polygon>
    <polygon fill=${t.fillColor||"#FFF"}
    points="12 0, 24 12, 12 24, 0 12"
    ></polygon>`;function i(n,o){return 12+(n-12)*o}return t.layers&&Object.entries(t.layers).forEach(n=>{let o=`${i(12,n[0])} ${i(0,n[0])},${i(24,n[0])} ${i(12,n[0])},${i(12,n[0])} ${i(24,n[0])}, ${i(0,n[0])} ${i(12,n[0])}`;e.appendChild(g.node`
      <polygon fill=${n[1]||"#FFF"}
      points="${o}"
      ></polygon>`)}),`data:image/svg+xml,${encodeURIComponent(f.serializeToString(e))}`}function Tt(t){let e=g.node`
  <svg width=30 height=30 viewBox='0 0 20 24' xmlns='http://www.w3.org/2000/svg'>
    <defs>
      <clipPath id="cut-off-shade">
        <rect x="0" y="0" width="24" height="11"/>
      </clipPath>
      <clipPath id="cut-off">
        <rect x="0" y="0" width="24" height="10"/>
      </clipPath>
    </defs>
    <circle cx="11" cy="10" r="10" clip-path="url(#cut-off-shade)" fill="#333" opacity=0.4></circle>
    <circle cx=10 cy=10 r=10 fill=${t.fillColor||"#FFF"} clip-path="url(#cut-off-shade)">`;return t.layers&&Object.entries(t.layers).forEach(i=>{e.appendChild(g.node`
    <circle cx=10 cy=10 r=${parseFloat(i[0])*10} fill=${i[1]} clip-path="url(#cut-off-shade)">`)}),`data:image/svg+xml,${encodeURIComponent(f.serializeToString(e))}`}function St(t){let e=g.node`
  <svg width=24 height=24 viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <path style="opacity: 0.5;" fill=${t.colorMarker}
      d=" M 12.692 1.969 C 8.605 1.969 5.334 5.239 5.334 9.328 C 5.334 10.963 5.743 12.189 6.764 14.028 C 8.808 17.504 11.922 21.996 11.922 21.996 C 11.922 21.996 16.576 17.504 18.62 14.028 C 19.642 12.189 20.051 10.963 20.051 9.328 C 20.051 5.239 16.78 1.969 12.692 1.969 Z "/>
    <path fill=${t.color}
      d=" M 12 1.969 C 7.878 1.969 4.813 5.239 4.813 9.328 C 4.813 10.554 5.222 12.189 6.244 14.028 C 8.289 17.504 12 22 12 22 C 12 22 16.055 17.504 18.099 14.028 C 19.122 12.189 19.341 10.963 19.341 9.328 C 19.341 5.239 16.054 1.969 12 1.969 Z "/>
    <circle cx="12.17192400568182" cy="8.918683238636365" r="5.109789772727275" opacity=0.8 fill="rgb(255, 255, 255)"/>
    <text x=12 y=12 style="text-anchor: middle; font-weight: 600; font-size: 10px; font-family: sans-serif; fill: rgb(85, 85, 85);">
    ${t.letter}`;return`data:image/svg+xml,${encodeURIComponent(f.serializeToString(e))}`}function Ot(t){let e=g.node`
  <svg width=18 height=24 viewBox='0 0 24 18' xmlns='http://www.w3.org/2000/svg'>
    <path style="opacity: 0.5;" fill=${t.colorMarker}
      d="M 10.797 1.238 C 6.308 1.238 2.716 4.83 2.716 9.32 C 2.716 11.116 3.165 12.463 4.287 14.483 C 6.532 18.3 9.952 23.234 9.952 23.234 C 9.952 23.234 15.063 18.3 17.308 14.483 C 18.43 12.463 18.879 11.116 18.879 9.32 C 18.879 4.83 15.287 1.238 10.797 1.238 Z"/>
    <path fill=${t.colorMarker}
      d="M 10 1.238 C 5.51 1.238 2.144 4.83 2.144 9.32 C 2.144 10.667 2.593 12.463 3.716 14.483 C 5.961 18.3 10 23.238 10 23.238 C 10 23.238 14.491 18.3 16.736 14.483 C 17.859 12.463 18.1 11.116 18.1 9.32 C 18.1 4.83 14.49 1.238 10 1.238 Z"/>
    <circle cx=10.226 cy=8.871 r=5.612 opacity=0.8 fill="rgb(255, 255, 255)"/>
    <circle cx=10.226 cy=8.871 r=2.806 opacity=0.8 fill=${t.colorDot}/>`;return`data:image/svg+xml,${encodeURIComponent(f.serializeToString(e))}`}function Mt(){let t=g.node`
  <svg width=1000 height=1000 viewBox='0 0 1000 1000' xmlns='http://www.w3.org/2000/svg'>
    <circle cx=500 cy=500 r=350 stroke='#1F964D' opacity=0.8 stroke-width=75 fill=none></circle>
    <circle cx=500 cy=500 r=200 fill='#1F964D' opacity=0.8></circle>
    <path stroke='#1F964D' opacity=0.8 stroke-width=75 d="M500,150L500,0M500,850L500,1000M0,500L150,500M850,500L1000,500" />`;return`data:image/svg+xml,${encodeURIComponent(f.serializeToString(t))}`}function Pt(t){let e=g.node`
  <svg width=24 height=24 viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'>
    <circle cx=16 cy=16 r=10
      stroke="#333"
      stroke-width="${t.strokeWidth||1}"
      fill="none"></circle>
    <circle cx=15 cy=15 r=10
      stroke="${t.strokeColor||"#333"}"
      stroke-width="${t.strokeWidth||1}"
      fill="${t.fillColor||"none"}"></circle>`;return`data:image/svg+xml,${encodeURIComponent(f.serializeToString(e))}`}var R=t=>{let e=t.style.theme,i=a.node`<div class="legend grid">`;return i.appendChild(a.node`
    <div
      class="switch-all label"
      style="grid-column: 1/3;">
        ${mapp_dictionary.layer_style_switch_caption}
      <a
        class="primary-colour"
        style="cursor: pointer;"
        onclick=${n=>{n.stopPropagation(),i.querySelectorAll(".switch").forEach(o=>o.click()),t.reload()}}>${mapp_dictionary.layer_style_switch_all}</a>.`),t.filter.current[e.field]||(t.filter.current[e.field]={}),Object.entries(e.cat).forEach(n=>{let o=Object.assign({},t.style.default,n[1].style&&n[1].style.marker||n[1].style||n[1]);o.svg||o.type?i.appendChild(x(Object.assign({legend:!0},o))):o.fillOpacity===void 0?i.appendChild(g.node`
      <svg height=24 width=24>
      <line
        x1=0 y1=12 x2=24 y2=12
        stroke=${o.strokeColor}
        stroke-width=${o.strokeWidth||1}>`):i.appendChild(g.node`
      <svg height=24 width=24>
      <rect
        width=24 height=24
        fill=${o.fillColor||"#FFF"}
        fill-opacity=${o.fillOpacity}
        stroke=${o.strokeColor}
        stroke-width=${o.strokeWidth||1}>`),i.appendChild(a.node`
    <div
      class="label switch"
      onclick=${l=>{l.stopPropagation(),l.target.classList.toggle("disabled"),l.target.classList.contains("disabled")?(t.filter.current[e.field].ni||(t.filter.current[e.field].ni=[]),t.filter.current[e.field].ni.push(n[0])):(t.filter.current[e.field].ni.splice(t.filter.current[e.field].ni.indexOf(n[0]),1),t.filter.current[e.field].ni.length||delete t.filter.current[e.field].ni),t.reload()}}>${n[1].label||n[0]}`)}),t.style.cluster&&(i.appendChild(x(Object.assign({legend:!0,cluster:!0},t.style.cluster))),i.appendChild(a.node`
    <div class="label" style="alignment-baseline:central;">${mapp_dictionary.layer_style_cluster}`)),i};var z=t=>{let e=a.node`<div class="legend grid">`;return t.style.theme.cat_arr.forEach(i=>{let n=Object.assign({},t.style.default,i.style&&i.style.marker||i.style||i);n.svg||n.type?e.appendChild(x(Object.assign({legend:!0},n))):n.fillOpacity===void 0?e.appendChild(g.node`
      <svg height=24 width=24>
      <line
        x1=0 y1=12 x2=24 y2=12
        stroke=${n.strokeColor}
        stroke-width=${n.strokeWidth||1}>`):e.appendChild(g.node`
      <svg height=24 width=24>
      <rect
        width=24 height=24
        fill=${n.fillColor||"#FFF"}
        fill-opacity=${n.fillOpacity}
        stroke=${n.strokeColor}
        stroke-width=${n.strokeWidth||1}>`),e.appendChild(a.node`
    <div  style="grid-column: 2" class="label">${i.label||i.value}`)}),e};var q=t=>{let e=a.node`<div class="legend">`;e.appendChild(a.node`
  <button class="btn-drop">
  <div
    class="head"
    onclick=${s=>{s.preventDefault(),s.target.parentElement.classList.toggle("active")}}>
    <span>${Object.keys(t.grid_fields)[0]}</span>
    <div class="icon"></div>
  </div>
  <ul>
    ${Object.entries(t.grid_fields).map(s=>a`
        <li onclick=${d=>{let c=d.target.closest(".btn-drop");c.classList.toggle("active"),c.querySelector(":first-child").textContent=s[0],t.grid_size=s[1],t.reload()}}>${s[0]}`)}`);let i=e.appendChild(g.node`<svg width=100% height=100px>`);e.appendChild(a.node`
  <button class="btn-drop">
  <div
    class="head"
    onclick=${s=>{s.preventDefault(),s.target.parentElement.classList.toggle("active")}}>
    <span>${Object.keys(t.grid_fields)[1]}</span>
    <div class="icon"></div>
  </div>
  <ul>
    ${Object.entries(t.grid_fields).map(s=>a`
      <li onclick=${d=>{let c=d.target.closest(".btn-drop");c.classList.toggle("active"),c.querySelector(":first-child").textContent=s[0],t.grid_color=s[1],t.reload()}}>${s[0]}`)}`);let n=38,o=t.style.range.length,l=100/o;for(let s=0;s<o;s++){let d=(s+2)*10/o,c=s*l;i.appendChild(g.node`
    <circle
      fill='#777'
      cx='${c+l/2+1+"%"}'
      cy='${n+1}'
      r='${d}'/>
    <circle
      fill='${t.style.hxcolor||"#999"}'
      cx='${c+l/2+"%"}'
      cy='${n}'
      r='${d}'/>`),s===0&&(e.size_min=i.appendChild(g.node`
      <text
        class='label'
        style='text-anchor: start;'
        x=${c+"%"}
        y=${n-20}>${mapp_dictionary.layer_grid_legend_min}`)),s===(o/2%1!=0&&Math.round(o/2)-1)&&(e.size_avg=i.appendChild(g.node`
      <text
        class='label'
        style='text-anchor: middle;'
        x=${c+l/2+"%"}
        y=${n-20}>${mapp_dictionary.layer_grid_legend_avg}`)),s===o-1&&(e.size_max=i.appendChild(g.node`
      <text
        class='label'
        style='text-anchor: end;'
        x=${c+l+"%"}
        y=${n-20}>${mapp_dictionary.layer_grid_legend_max}`))}n+=20;for(let s=0;s<o;s++){let d=s*l;i.appendChild(g.node`
    <rect
      height=20
      width=${l+"%"}
      x=${d+"%"}
      y=${n}
      fill=${t.style.range[s]}`),s===0&&(e.color_min=i.appendChild(g.node`
      <text
        class='label'
        style='text-anchor: start;'
        x=${d+"%"}
        y=${n+40}>${mapp_dictionary.layer_grid_legend_min}`)),s===(o/2%1!=0&&Math.round(o/2)-1)&&(e.color_avg=i.appendChild(g.node`
      <text
        class='label'
        style='text-anchor: middle;'
        x=${d+l/2+"%"}
        y=${n+40}>${mapp_dictionary.layer_grid_legend_avg}`)),s===o-1&&(e.color_max=i.appendChild(g.node`
      <text
        class='label'
        style='text-anchor: end;'
        x=${d+l+"%"}
        y=${n+40}>${mapp_dictionary.layer_grid_legend_max}`))}return e.appendChild(a.node`
  <td style="padding-top: 5px;" colSpan=2>
  <label class="input-checkbox">
  <input type="checkbox"
    onchange=${s=>{t.grid_ratio=s.target.checked,t.reload()}}>
  </input>
  <div></div><span>${mapp_dictionary.layer_grid_legend_ratio}`),e};var At={categorized:R,graduated:z,grid:q},W=t=>{if(!t.style||t.style.hidden||!t.style.theme&&!t.style.label)return;let e=t.view.appendChild(a.node`
      <div class="drawer panel expandable">`);return e.appendChild(a.node`
    <div
      class="header primary-colour"
      onclick=${o=>{o.stopPropagation(),u(o.target,!0)}}>
      <span>${mapp_dictionary.layer_style_header}</span>
      <button class="btn-header xyz-icon icon-expander primary-colour-filter">`),t.style.themes&&e.appendChild(a.node`
      <div>${mapp_dictionary.layer_style_select_theme}</div>
      <button class="btn-drop">
      <div
        class="head"
        onclick=${o=>{o.preventDefault(),o.target.parentElement.classList.toggle("active")}}>
        <span>${Object.keys(t.style.themes)[0]}</span>
        <div class="icon"></div>
      </div>
      <ul>
        ${Object.entries(t.style.themes).map(o=>a.node`
          <li onclick=${l=>{let s=l.target.closest(".btn-drop");s.querySelector("span").textContent=o[0],s.classList.toggle("active"),t.style.theme=o[1],i(t),t.reload()}}>${o[0]}`)}`),t.style.bringToFront=a.node`
      <button 
        title=${mapp_dictionary.layer_style_bring_to_front}
        style="margin-top: 5px;"
        class="btn-wide primary-colour"
        onclick=${()=>t.bringToFront()}>${mapp_dictionary.layer_style_bring_to_front}`,!t.style.theme&&t.style.label&&e.appendChild(t.style.bringToFront),t.style.theme&&i(t),e;function i(o){o.style.legend&&o.style.legend.remove(),o.style.bringToFront.remove(),!(o.style.theme&&!o.style.theme.type)&&(o.style.legend=n(o),e.appendChild(o.style.legend),e.appendChild(o.style.bringToFront))}function n(o){return o.style.legend=a.node`<div class="legend">`,o.filter=o.filter||{},At[o.style.theme.type](o)}};var C=t=>{t.view=a.node`<div class="drawer layer-view">`;let e=t.view.appendChild(a.node`
    <div class="header enabled"><span>${t.name||t.key}`);e.appendChild(a.node`
    <button
      title=${mapp_dictionary.layer_zoom_to_extent}
      class="btn-header xyz-icon icon-fullscreen"
      onclick=${n=>{n.stopPropagation(),t.zoomToExtent()}}>`);let i=e.appendChild(a.node`
    <button
      title=${mapp_dictionary.layer_visibility}
      class="${`btn-header xyz-icon icon-toggle ${t.display&&"on"||"off"}`}"
      onclick=${n=>{n.stopPropagation(),t.display?t.remove():t.show()}}>`);if(t.view.addEventListener("display-on",()=>{i.classList.add("on")}),t.view.addEventListener("display-off",()=>{i.classList.remove("on")}),t.meta){let n=t.view.appendChild(a.node`<p class="meta">`);n.innerHTML=t.meta}W(t),!(t.view.children.length<=1)&&(t.view.classList.add("expandable"),e.onclick=n=>{n.stopPropagation(),u(n.target,!0)},e.appendChild(a.node`
  <button
    title=${mapp_dictionary.layer_toggle_dashboard}
    class="btn-header xyz-icon icon-expander"
    onclick=${n=>{n.stopPropagation(),u(n.target)}}>`))};var U=t=>{let e={node:t.target,groups:{}};t.list.forEach(n=>{if(!n.hidden){if(C(n),!n.group){e.node.appendChild(n.view);return}e.groups[n.group]||i(n),e.groups[n.group].addLayer(n)}});function i(n){let o={list:[]};e.groups[n.group]=o;let l=e.node.appendChild(a.node`<div class="drawer layer-group expandable">`),s=l.appendChild(a.node`
      <div
        class="header enabled"
        onclick=${r=>{r.stopPropagation(),u(r.target,!0)}}>
        <span>${n.group}`),d=l.appendChild(a.node`<div class="meta">`);o.chkVisibleLayer=()=>{o.list.some(r=>r.display)?c.classList.add("on"):c.classList.remove("on")},o.addLayer=r=>{if(r.groupmeta){let p=d.appendChild(a.node`<div>`);p.innerHTML=r.groupmeta}o.list.push(r),l.appendChild(r.view),o.chkVisibleLayer(),r.view.addEventListener("display-on",o.chkVisibleLayer),r.view.addEventListener("display-off",o.chkVisibleLayer)};let c=s.appendChild(a.node`
        <button
          class="btn-header xyz-icon icon-toggle"
          title=${mapp_dictionary.layer_group_hide_layers}
          onclick=${r=>{if(r.stopPropagation(),r.target.classList.toggle("on"),r.target.classList.contains("on")){o.list.filter(p=>!p.display).forEach(p=>p.show());return}o.list.filter(p=>p.display).forEach(p=>p.remove())}}>`);s.appendChild(a.node`
        <button 
          class="xyz-icon btn-header icon-expander"
          title=${mapp_dictionary.layer_group_toggle}
          onclick=${r=>{r.stopPropagation(),u(r.target)}}>`)}};var H={listview:U,layerview:C};window.mapp_ui=H;var Nt=H;export{Nt as default};
/*! (c) Andrea Giammarchi - ISC */
//# sourceMappingURL=ui.js.map
