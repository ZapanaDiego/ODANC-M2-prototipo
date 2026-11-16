const fs=require('node:fs');
(async()=>{
 const page=await(await fetch('http://127.0.0.1:9223/json/new?about:blank',{method:'PUT'})).json();const ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0;const pending=new Map(),errors=[];
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){pending.get(m.id)(m);pending.delete(m.id)}if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text)};
 const call=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,m=>m.error?reject(m.error):resolve(m.result));ws.send(JSON.stringify({id:n,method,params}))});
 const ev=async expression=>{const r=await call('Runtime.evaluate',{expression,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value};
 const shot=async(name,selector)=>{const rect=await ev(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});e.scrollIntoView({block:'start'});const r=e.getBoundingClientRect();return {x:r.x+scrollX,y:r.y+scrollY,width:r.width,height:r.height}})()`);await new Promise(r=>setTimeout(r,100));const r=await call('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,clip:{...rect,scale:1}});fs.writeFileSync(`documentacion/capturas/${name}.png`,Buffer.from(r.data,'base64'));console.log(name,rect)};
 await call('Runtime.enable');await call('Page.enable');await call('Emulation.setDeviceMetricsOverride',{width:1440,height:1100,deviceScaleFactor:1,mobile:false});
 await call('Page.navigate',{url:'file:///home/diego/Proyectos/ODANC/disenio/index.html#/plazos'});await new Promise(r=>setTimeout(r,500));await ev(`document.querySelector('#fecha-inicio').value='2026-09-14';document.querySelector('#dias-plazo').value='3';document.querySelector('#btn-calcular-plazo').click()`);await shot('01-modulo1','#page-plazos');
 await ev(`location.hash='#/documentos'`);await new Promise(r=>setTimeout(r,250));await shot('02-seleccion','#vista-nuevo-documento');
 await ev(`document.querySelector('#paso-siguiente').click()`);await shot('03-expediente','#vista-nuevo-documento');
 await ev(`window.confirm=()=>true;document.querySelector('#cargar-ejemplo').click();document.querySelector('#paso-siguiente').click()`);await shot('04-contenido','#vista-nuevo-documento');
 await ev(`document.querySelector('#paso-siguiente').click()`);await shot('05-revision','#page-documentos');
 await ev(`document.querySelector('#btn-guardar-documento').click()`);await new Promise(r=>setTimeout(r,250));await ev(`document.querySelector('#tab-documentos').click()`);await new Promise(r=>setTimeout(r,180));await shot('06-historial','#page-documentos');
 await ev(`document.querySelector('#tab-nuevo').click();document.querySelector('#paso-anterior').click();document.querySelector('#paso-anterior').click();document.querySelector('#paso-anterior').click();document.querySelector('#doc-unidad').value='Jefatura / Juez de Paz';document.querySelector('#doc-unidad').dispatchEvent(new Event('change'))`);await shot('07-jefatura','#vista-nuevo-documento');
 if(errors.length)throw Error(errors.join('\n'));ws.close();
})().catch(e=>{console.error(e);process.exit(1)});
