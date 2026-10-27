const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const levels=JSON.parse(fs.readFileSync('./level_bundle.json','utf8'));
class El {
 constructor(tag='div'){this.tag=tag;this.style={setProperty(n,v){this[n]=v}};this.children=[];this.attrs={};this.dataset={};this.hidden=true;this.src='';this.textContent='';this.innerHTML='';this.isConnected=true;this.clientWidth=1440;this.clientHeight=900;this._class=new Set();this.classList={add:x=>this._class.add(x),remove:x=>this._class.delete(x),toggle:(x,force)=>{if(force)this._class.add(x);else this._class.delete(x)},contains:x=>this._class.has(x)};}
 appendChild(x){this.children.push(x);return x} replaceChildren(){this.children=[]}
 querySelector(s){if(s==='img')return this.children.find(x=>x.tag==='img');if(s.startsWith('[data-car=')){const m=s.match(/\[data-car="([^"]+)"\]/);return this.children.find(x=>x.dataset.car===m?.[1])}if(s==='.level-name')return new El();return null}
 querySelectorAll(){return []}
 setAttribute(k,v){this.attrs[k]=v} getAttribute(k){return this.attrs[k]||''}
 addEventListener(){} getBoundingClientRect(){return {left:0,top:0,width:1440,height:900}}
}
const elements={};function get(id){return elements[id]??(elements[id]=new El())}
const document={getElementById:get,createElement:tag=>new El(tag),addEventListener(){},fullscreenElement:false,hidden:false};get('ghost').appendChild(new El('img'));get('viewport').clientWidth=1440;get('viewport').clientHeight=900;
const window={KXR_DistrictArt:{render:(district)=>'<g data-district="'+district+'"></g>'},KXRPhysics:require('./geometry.js'),KXRPathInput:require('./path_input.js'),KXR_LEVELS:levels,KXR_MISSION:levels[0],addEventListener(){},AudioContext:null};
const storage={};const localStorage={getItem:k=>storage[k]||null,setItem:(k,v)=>{storage[k]=v}};
let ticker=0;const ctx={window,document,localStorage,requestAnimationFrame:cb=>{setImmediate(()=>cb(ticker+=50))},performance:{now:()=>ticker},setTimeout,clearTimeout,console,Math,Promise};
vm.createContext(ctx);vm.runInContext(fs.readFileSync('./game.js','utf8'),ctx,{filename:'game.js'});
const api=window.KXRDebug;
(async()=>{
 for(let i=0;i<levels.length;i++){
   api.load(i,{intro:false});
   assert.equal(api.status.level,i+1);
   assert.equal(api.status.geometry.ok,true,`start scene ${i+1}`);
   const colors=[...new Set(levels[i].vehicles.map(v=>api.colors[v.sprite]))];assert.ok(colors.length>=5);
   for(let j=0;j<levels[i].sampleSolution.length;j++){
     const {vehicle,to}=levels[i].sampleSolution[j],v=api.status.vehicles.find(x=>x.id===vehicle);
     const preview=api.inspect(vehicle,[v.node,to]);assert.ok(preview.ok,`preview level ${i+1} move ${j+1}: ${preview.reason}`);
     await api.stroke(vehicle,[v.node,to]);
     assert.equal(api.status.moves,j+1);
   }
   assert.equal(api.status.corridor.ok,true);
   for(let a=0;a<50&&!api.status.won;a++)await new Promise(resolve=>setTimeout(resolve,20));
   assert.ok(api.status.won,`win level ${i+1}`);assert.equal(api.status.vehicles[0].node,'HOSP');
   console.log(`PASS browser-like DOM gameplay L${i+1}: ${levels[i].sampleSolution.length} moves -> objective`,levels[i].goalLabel);
 }
 console.log('ALL LEVELS SUCCESS');
})().catch(e=>{console.error(e);process.exitCode=1});
