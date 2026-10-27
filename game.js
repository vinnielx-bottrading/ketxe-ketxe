/* KẸT XE RỒI! — City Alive v0.3 Draw Path Gameplay.
   Each committed stroke is validated atomically by KXRPhysics.inspectRoute.
   Exact SAME sampled poses drive route preview, swept-collision and vehicle animation.
*/
let DATA = window.KXR_MISSION;
const LEVELS=window.KXR_LEVELS||[DATA];let levelIndex=0;
const P=window.KXRPhysics,$=id=>document.getElementById(id);let nodes=P.nodeMap(DATA),adjacency={};
function rebuildGraph(){nodes=P.nodeMap(DATA);adjacency=Object.fromEntries(DATA.nodes.map(n=>[n.id,[]]));DATA.edges.forEach(([a,b])=>{adjacency[a].push(b);adjacency[b].push(a)});}
rebuildGraph();
const VEHICLE_COLORS={1:'#ff6265',2:'#55b5ff',3:'#ffd34d',4:'#edfaff',5:'#bfccd6',6:'#67ef96',7:'#ffac54',8:'#428cff',9:'#d6a06b',10:'#dce6ef',11:'#b9f6ff'};
function paint(v){return VEHICLE_COLORS[v.sprite]||'#71f1cb'}
function tint(v){const color=paint(v);overlay.style.setProperty('--vehicle-color',color);ghost.style.setProperty('--vehicle-color',color);return color;}
let personalBest={};try{personalBest=JSON.parse(localStorage.getItem('kxr-cityalive-best-v04')||'{}')||{}}catch{}
function remember(level,stars){personalBest[level]=Math.max(stars,personalBest[level]||0);try{localStorage.setItem('kxr-cityalive-best-v04',JSON.stringify(personalBest))}catch{}}

const viewport=$('viewport'),world=$('world'),carsEl=$('cars'),markersEl=$('markers'),overlay=$('drawOverlay');
const line=$('drawLine'),underlay=$('drawUnderlay'),draftTip=$('draftTip'),ghost=$('ghost'),music=$('music');
let vehicles=[],selected=null,history=[],moves=0,won=false,animating=false,gameToken=0,gesture=null,draft=null,panning=null,hintStep=0;
let camera={x:800,y:450,s:1},audioEnabled=true,sfxEnabled=true,audioStarted=false,track=0,ctx=null;
const tracks=['assets/audio/jorisvermeer-smooth-lofi-beat-566127.mp3','assets/audio/xethrocc-playa-del-sol-latin-lofi-160149.mp3'];
music.volume=.24;
function curr(id){return vehicles.find(v=>v.id===id)}
function pretty(id){return curr(id)?.name||id}
function notice(t,kind=''){const el=$('notice');el.textContent=t;el.dataset.kind=kind}
function setMission(t){$('progress').textContent=t}
function sound(freq=480,duration=.11,volume=.024){if(!sfxEnabled)return;try{ctx||=new (window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(freq,ctx.currentTime);g.gain.setValueAtTime(volume,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+duration);o.connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+duration+.01)}catch{}}
function musicTryStart(){if(!audioEnabled||won)return;audioStarted=true;if(!music.src)music.src=tracks[track];music.play().catch(()=>{});updateMusicButton()}
function updateMusicButton(){ $('musicBtn').textContent=audioEnabled?'♫':'♪̸'; $('musicBtn').title=audioEnabled?'Tắt nhạc':'Bật nhạc'; $('musicToggle').textContent=audioEnabled?'🔇 Tắt nhạc':'♫ Bật nhạc';}
function toggleMusic(){audioEnabled=!audioEnabled;if(audioEnabled)musicTryStart();else music.pause();updateMusicButton()}
function nextTrack(){track=(track+1)%tracks.length;music.src=tracks[track];if(audioEnabled)musicTryStart();notice(`Đang nghe: ${track?'Playa del Sol':'Smooth Lo-fi Beat'}`)}
music.addEventListener('ended',()=>{if(audioEnabled)nextTrack()});
function calcScale(){const w=viewport.clientWidth,h=viewport.clientHeight;return w<760?Math.max(w/790,h/900):Math.max(w/1600,h/900)}
function cameraApply(){const w=viewport.clientWidth,h=viewport.clientHeight,s=camera.s;let ox=w/2-camera.x*s,oy=h/2-camera.y*s;if(1600*s>w)ox=Math.max(w-1600*s,Math.min(0,ox));else ox=(w-1600*s)/2;if(900*s>h)oy=Math.max(h-900*s,Math.min(0,oy));else oy=(h-900*s)/2;world.style.transform=`translate(${ox}px,${oy}px) scale(${s})`;camera.ox=ox;camera.oy=oy;}
function resetCamera(){camera.s=calcScale();camera.x=viewport.clientWidth<760?360:800;camera.y=450;cameraApply()}
function cameraTo(n){const p=nodes[n];if(!p)return;camera.x=p.x;camera.y=p.y;cameraApply()}
function screenToWorld(x,y){const rect=viewport.getBoundingClientRect();return {x:(x-rect.left-camera.ox)/camera.s,y:(y-rect.top-camera.oy)/camera.s}}
function displayPose(el,p){el.style.left=p.x+'px';el.style.top=p.y+'px';el.style.transform=`translate(-50%,-50%) rotate(${p.angle}deg)`}
function sprite(v){const path=`assets/vehicles/${String(v.sprite).padStart(2,'0')}_H.png`;return window.KXR_EMBED_ASSETS?.[path]||path}
function carSize(el,v){const d=P.getDims(v);el.style.width=Math.round(d.length/.79)+'px';el.style.height=Math.round(d.width/.75)+'px'}
function showIndicators(){markersEl.replaceChildren();if(!selected||animating||won||draft)return;const v=curr(selected);if(!v)return;for(const next of adjacency[v.node]){const p=nodes[next],ok=P.inspectRoute(DATA,vehicles,v.id,[v.node,next]);const mark=document.createElement('div');mark.className='mini-mark'+(ok.ok?'':' blocked');mark.style.left=p.x+'px';mark.style.top=p.y+'px';mark.title=ok.ok?`Có thể đi đến ${next}`:`Bị chặn: ${ok.reason}`;mark.style.setProperty('--vehicle-color',paint(v));markersEl.appendChild(mark);}}
function renderCars(){carsEl.replaceChildren();for(const v of vehicles){const el=document.createElement('button');el.type='button';el.className='car'+(selected===v.id?' selected':'')+(v.id==='AMB'?' ambulance':'');el.dataset.car=v.id;el.style.setProperty('--vehicle-color',paint(v));el.setAttribute('aria-label',v.name);el.title=v.name;carSize(el,v);displayPose(el,P.poseAt(v,nodes[v.node]));const img=document.createElement('img');img.src=sprite(v);img.alt=v.name;img.draggable=false;el.appendChild(img);el.addEventListener('pointerdown',onVehicleDown);carsEl.appendChild(el);}showIndicators();}
function selectCar(id){if(won||animating)return;const v=curr(id);if(!v)return;if(v.id==='AMB'){notice(`${v.name} đang chờ thông đường. Hãy dời những xe chắn lối.`);return;}selected=id;tint(v);renderCars();notice(`Đã chọn ${v.name}. Vuốt từ thân xe để vẽ đường, thả tay để chạy.`);sound(630,.07,.018)}
function clearDraft(){draft=null;line.setAttribute('points','');underlay.setAttribute('points','');line.style.opacity='0';underlay.style.opacity='0';draftTip.setAttribute('visibility','hidden');ghost.style.display='none';overlay.classList.remove('valid','invalid','pending');$('statusPill').textContent='Vẽ đường từ xe';}
function previewRoute(){
 if(!draft||!gesture)return;
 const v=curr(draft.id),res=draft.nodes.length>1?P.inspectRoute(DATA,vehicles,v.id,draft.nodes):null;
 draft.result=res;
 const poses=res?.poses||[],points=poses.length?poses.filter((_,i)=>i%2===0||i===poses.length-1).map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`):[`${nodes[v.node].x},${nodes[v.node].y}`];
 const candidate=draft.cursorWorld;
 // The tentative tail follows the lane centerline; no teleporting to arbitrary pointer locations.
 if(draft.nodes.length===1&&candidate){const a=nodes[v.node],near=adjacency[v.node].map(id=>({id,...P.nearestPointOnSegment(candidate,a,nodes[id])})).sort((x,y)=>x.dist-y.dist)[0];if(near&&near.dist<40){points.push(`${near.x.toFixed(1)},${near.y.toFixed(1)}`)}}
 const valid=res?.ok===true,bad=res?.ok===false;
 overlay.classList.toggle('valid',valid);overlay.classList.toggle('invalid',bad);overlay.classList.toggle('pending',!res);
 line.setAttribute('points',points.join(' '));underlay.setAttribute('points',points.join(' '));line.style.opacity=draft.dragging?'1':'0';underlay.style.opacity=draft.dragging?'1':'0';
 if(poses.length){const last=poses.at(-1);draftTip.setAttribute('cx',last.x);draftTip.setAttribute('cy',last.y);draftTip.setAttribute('visibility','visible');const g=ghost;g.style.display='block';displayPose(g,last);const img=g.querySelector('img');if(img.getAttribute('src')!==sprite(v))img.setAttribute('src',sprite(v));carSize(g,v)}else{draftTip.setAttribute('visibility','hidden');ghost.style.display='none'}
 $('statusPill').textContent=bad?'⛔ '+res.reason:valid?`✓ ${res.edges} đoạn · thả để xe chạy`:'Đang vẽ tuyến…';
}
function candidateFromCursor(worldPoint){
  return draft ? window.KXRPathInput.next(DATA,draft.nodes,worldPoint,P,camera.s) : null;
}
function onVehicleDown(e){if(animating||won||e.button>0)return;e.stopPropagation();e.preventDefault();const id=e.currentTarget.dataset.car;if(id==='AMB'){notice(`Đây là ${curr('AMB').name.toLowerCase()} mục tiêu; hãy dời các xe khác trước.`);return;}selectCar(id);if(!audioStarted)musicTryStart();gesture={type:'vehicle',id,pointer:e.pointerId,startX:e.clientX,startY:e.clientY};draft={id,nodes:[curr(id).node],dragging:false,cursorWorld:null,result:null};try{viewport.setPointerCapture(e.pointerId)}catch{};}
function onWorldDown(e){if(animating||won||e.button>0)return;if(e.target.closest('.hud,.modalWrap,.car'))return;if(!audioStarted)musicTryStart();gesture={type:'pan',pointer:e.pointerId,startX:e.clientX,startY:e.clientY,cx:camera.x,cy:camera.y};try{viewport.setPointerCapture(e.pointerId)}catch{}}
function onPointerMove(e){if(!gesture||gesture.pointer!==e.pointerId)return;
 if(gesture.type==='pan'){camera.x=gesture.cx-(e.clientX-gesture.startX)/camera.s;camera.y=gesture.cy-(e.clientY-gesture.startY)/camera.s;cameraApply();return;}
 if(gesture.type!=='vehicle'||!draft)return;
 if(!draft.dragging&&Math.hypot(e.clientX-gesture.startX,e.clientY-gesture.startY)<10)return;
 draft.dragging=true;draft.cursorWorld=screenToWorld(e.clientX,e.clientY);
 const next=candidateFromCursor(draft.cursorWorld);
 if(next?.back){draft.nodes.pop();}else if(next?.node){draft.nodes.push(next.node);}
 previewRoute();
}
function onPointerUp(e){if(!gesture||gesture.pointer!==e.pointerId)return;
 const kind=gesture.type;gesture=null;if(kind==='pan')return;
 if(!draft)return;
 if(!draft.dragging||draft.nodes.length<2){clearDraft();showIndicators();return;}
 const id=draft.id,path=[...draft.nodes],check=P.inspectRoute(DATA,vehicles,id,path);
 if(!check.ok){sound(210,.17,.038);notice(`⛔ ${check.reason} Hãy chọn tuyến khác.`,'error');$('statusPill').textContent='⛔ Bị chặn';const redTrail=line.getAttribute('points');clearDraft();line.setAttribute('points',redTrail);underlay.setAttribute('points',redTrail);line.style.opacity='1';underlay.style.opacity='1';overlay.classList.add('invalid');setTimeout(()=>{if(!draft){line.style.opacity='0';underlay.style.opacity='0';overlay.classList.remove('invalid');showIndicators()}},550);showIndicators();return;}
 clearDraft();commitStroke(id,path,check);
}
function onPointerCancel(){gesture=null;clearDraft();showIndicators()}
viewport.addEventListener('pointerdown',onWorldDown);viewport.addEventListener('pointermove',onPointerMove);viewport.addEventListener('pointerup',onPointerUp);viewport.addEventListener('pointercancel',onPointerCancel);
function animateCar(el,poses,duration,token,{follow=false}={}){return new Promise(resolve=>{if(!el||!poses?.length)return resolve(false);el.classList.add('drive');const start=performance.now();function frame(now){if(token!==gameToken||!el.isConnected)return resolve(false);const t=Math.min(1,Math.max(0,(now-start)/duration)),idx=Math.min(poses.length-1,Math.floor(t*(poses.length-1)));const pose=poses[idx];displayPose(el,pose);if(follow&&viewport.clientWidth<760){camera.x=pose.x;camera.y=pose.y;cameraApply()}if(t<1)requestAnimationFrame(frame);else resolve(true)}requestAnimationFrame(frame)})}
async function commitStroke(id,path,check){if(won||animating)return;const v=curr(id);if(!v)return;
 // Revalidate just before commit (no partial mutation on failure).
 const validated=P.inspectRoute(DATA,vehicles,id,path);if(!validated.ok){notice(validated.reason,'error');return;}
 const receipt={id,from:v.node,heading:v.heading,direction:v.direction,to:path.at(-1),path:[...path],cost:path.length-1};
 const token=gameToken;animating=true;selected=null;markersEl.replaceChildren();
 tint(v);const runningPath=validated.poses.filter((_,i)=>i%3===0||i===validated.poses.length-1).map(p=>`${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
 line.setAttribute('points',runningPath);underlay.setAttribute('points',runningPath);line.style.opacity='.9';underlay.style.opacity='.8';overlay.classList.add('valid');
 const el=carsEl.querySelector(`[data-car="${id}"]`);
 if(!await animateCar(el,validated.poses,Math.min(2300,420+receipt.cost*350),token))return;
 if(token!==gameToken)return;clearDraft();
 v.node=receipt.to;v.heading=validated.endHeading;v.direction=validated.endDirection;
 history.push(receipt);moves+=receipt.cost;animating=false;renderCars();
 const flat=history.flatMap(h=>h.path.slice(1).map((to,i)=>({vehicle:h.id,to,from:h.path[i]})));
 hintStep=flat.every((h,i)=>DATA.sampleSolution[i]?.vehicle===h.vehicle&&DATA.sampleSolution[i]?.to===h.to)?flat.length:-1;
 setMission(`${moves} đoạn di chuyển · ${DATA.priorityCorridor.slice(1).filter(n=>!vehicles.some(v=>v.node===n)).length}/8 điểm trống`);
 sound(480,.09,.026);notice(`${v.name} đã chạy theo ${receipt.cost} đoạn đường.`);
 const clear=P.corridorStatus(DATA,vehicles);if(clear.ok)rescueAmbulance();
}
async function rescueAmbulance(){if(animating||won)return;const checked=P.corridorStatus(DATA,vehicles);if(!checked.ok)return;
 const token=gameToken;animating=true;selected=null;markersEl.replaceChildren();$('routePath').style.display='block';$('winFlash').classList.add('show');setMission(`${DATA.missionIcon} Tuyến ưu tiên đã thông`);notice(`${DATA.missionIcon} ${curr('AMB').name} đang đi qua hai giao lộ đến ${DATA.goalLabel.toLowerCase()}!`);sound(790,.28,.05);
 const wasPlaying=audioEnabled&&!music.paused;if(wasPlaying)music.volume=.08;
 const amb=curr('AMB'),el=carsEl.querySelector('[data-car="AMB"]');const go=await animateCar(el,checked.poses,4900,token,{follow:true});if(!go||token!==gameToken)return;
 amb.node='HOSP';amb.direction='H';amb.heading=0;won=true;animating=false;renderCars();setMission(`${moves} đoạn · ĐÃ ĐẾN ${DATA.goalLabel}`);notice(`✅ ${amb.name} đã đến ${DATA.goalLabel.toLowerCase()}. Giao thông đã thông suốt!`);$('banner').classList.add('show');let stars=moves<=DATA.sampleSolution.length?3:moves<=DATA.sampleSolution.length+4?2:1;remember(DATA.level,stars);sound(523,.20,.05);setTimeout(()=>sound(660,.22,.05),160);setTimeout(()=>sound(880,.30,.05),360);
 setTimeout(()=>{if(token!==gameToken)return;$('banner').classList.remove('show');$('modal').classList.remove('hidden');$('modalTitle').textContent='TUYẾN ĐƯỜNG ĐÃ THÔNG!';$('modalText').textContent=`${amb.name} đã đến ${DATA.goalLabel.toLowerCase()} sau ${moves} đoạn đường. ${'★'.repeat(stars)}${'☆'.repeat(3-stars)} Chúc mừng!`;$('startBtn').textContent='CHƠI LẠI';$('nextLevelBtn').hidden=levelIndex>=LEVELS.length-1;window.KXRDonate?.show({title:'ĐƯỜNG ĐÃ THÔNG!',moves,stars,goal:DATA.goalLabel,nextTitle:LEVELS[levelIndex+1]?.title||null});if(wasPlaying&&audioEnabled)music.volume=.24;},1550);
}
function resetGame(){gameToken++;gesture=null;draft=null;vehicles=DATA.vehicles.map(v=>({...v,heading:P.angleFor(v.direction)}));moves=0;history=[];selected=null;won=false;animating=false;hintStep=0;clearDraft();$('banner').classList.remove('show');$('winFlash').classList.remove('show');$('routePath').style.display='none';music.volume=.24;setMission('0 đoạn · Cần khai thông tuyến đường');notice('Chạm chọn một xe, vuốt từ xe để vẽ tuyến rồi thả tay.');renderCars();resetCamera();}
function undo(){if(won||animating)return;const r=history.pop();if(!r)return;const v=curr(r.id);v.node=r.from;v.heading=r.heading;v.direction=r.direction;moves-=r.cost;selected=null;clearDraft();renderCars();const flat=history.flatMap(h=>h.path.slice(1).map(to=>({vehicle:h.id,to})));hintStep=flat.every((h,i)=>DATA.sampleSolution[i]?.vehicle===h.vehicle&&DATA.sampleSolution[i]?.to===h.to)?flat.length:-1;setMission(`${moves} đoạn · đã hoàn tác`);notice(`↶ Đã hoàn tác nét vẽ của ${v.name} (${r.cost} đoạn).`)}
function showHint(){if(won||animating)return;if(hintStep<0){notice('Bạn đã chọn lộ trình riêng. Hãy tự giải hoặc hoàn tác để xem gợi ý mẫu.');return;}const h=DATA.sampleSolution[hintStep];if(!h){notice('Đã hết các bước trong lời giải mẫu.');return;}const v=curr(h.vehicle),r=P.inspectRoute(DATA,vehicles,h.vehicle,[v.node,h.to]);if(!r.ok){notice('Lối đi mẫu đang bị chặn: '+r.reason);return;}selected=h.vehicle;renderCars();const pt=r.poses.filter((_,i)=>i%2===0||i===r.poses.length-1);tint(v);line.setAttribute('points',pt.map(p=>`${p.x},${p.y}`).join(' '));underlay.setAttribute('points',line.getAttribute('points'));line.style.opacity='1';underlay.style.opacity='1';overlay.classList.add('valid');$('statusPill').textContent='💡 Lộ trình gợi ý';notice(`💡 Hãy vẽ đường từ ${v.name} đến vị trí được tô xanh.`);if(viewport.clientWidth<760)cameraTo(v.node);setTimeout(()=>{if(!draft){line.style.opacity='0';underlay.style.opacity='0';overlay.classList.remove('valid');showIndicators()}},2800)}
const menu=$('menuPanel');function toggleMenu(force){const open=typeof force==='boolean'?force:menu.hidden;menu.hidden=!open;$('menuBtn').setAttribute('aria-expanded',open?'true':'false')}
$('menuBtn').onclick=()=>toggleMenu();$('menuClose').onclick=()=>toggleMenu(false);
$('hintBtn').onclick=()=>{toggleMenu(false);showHint()};$('undoBtn').onclick=()=>{toggleMenu(false);undo()};$('resetBtn').onclick=()=>{toggleMenu(false);resetGame()};
$('musicBtn').onclick=toggleMusic;$('musicToggle').onclick=toggleMusic;$('nextMusicBtn').onclick=nextTrack;
$('sfxToggle').onclick=()=>{sfxEnabled=!sfxEnabled;$('sfxToggle').textContent=sfxEnabled?'🔊 Hiệu ứng: Bật':'🔇 Hiệu ứng: Tắt'};
$('homeCamBtn').onclick=()=>cameraTo(curr('AMB').node);
$('fullscreenBtn').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('app').requestFullscreen()}catch{notice('Trình duyệt không hỗ trợ Fullscreen, nhưng trò chơi vẫn phủ cửa sổ.')}};
$('startBtn').onclick=()=>{$('modal').classList.add('hidden');if(won)resetGame();musicTryStart()};
window.addEventListener('resize',()=>{camera.s=calcScale();cameraApply()});
window.addEventListener('blur',()=>{gesture=null;clearDraft()});
document.addEventListener('visibilitychange',()=>{if(document.hidden){gesture=null;clearDraft();if(!music.paused)music.pause();}else if(audioStarted&&audioEnabled&&!won)musicTryStart()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){gesture=null;clearDraft();toggleMenu(false);}else if(e.key.toLowerCase()==='u')undo();else if(e.key.toLowerCase()==='h')showHint();else if(e.key.toLowerCase()==='r')resetGame()});
function missionTitle(){return `${DATA.missionIcon} ${DATA.title.toUpperCase()}`}
function refreshMissionUI(){
 $('missionHeading').textContent=`${missionTitle()}  ·  ${DATA.level}/${LEVELS.length} ▾`;
 $('districtTag').textContent=(DATA.districtName||'Ngã tư trung tâm').toUpperCase();
 $('districtArtwork').innerHTML=window.KXR_DistrictArt.render(DATA.district);
 $('modalIcon').textContent=DATA.missionIcon;
 $('modalIndex').textContent=`CITY ALIVE · NHIỆM VỤ ${String(DATA.level).padStart(2,'0')}`;
 $('goalSymbol').textContent=DATA.goalSymbol||'✚';$('goalText').textContent=DATA.goalLabel||'BỆNH VIỆN';
 window.KXRDonate?.hide();$('modalTitle').textContent=DATA.title;$('modalText').textContent=DATA.brief;
 $('banner').textContent=`${DATA.missionIcon} TUYẾN ĐƯỜNG ĐÃ THÔNG!`;
 $('levelBtn').title=`Chọn màn · ${DATA.title}`;
 $('nextLevelBtn').hidden=DATA.level>=LEVELS.length;$('startBtn').textContent='BẮT ĐẦU NHIỆM VỤ';
}
function loadLevel(index,{intro=true}={}){
 if(!Number.isInteger(index)||index<0||index>=LEVELS.length)return;
 levelIndex=index;DATA=LEVELS[index];rebuildGraph();closeLevels();toggleMenu(false);$('modal').classList.add('hidden');resetGame();refreshMissionUI();
 if(intro)$('modal').classList.remove('hidden');
}
function renderLevels(){const host=$('levelCards');host.replaceChildren();LEVELS.forEach((lv,i)=>{
 const btn=document.createElement('button');btn.className='level-card'+(i===levelIndex?' active':'');btn.innerHTML=`<span class="level-num">${lv.missionIcon} ${String(lv.level).padStart(2,'0')}</span><span class="level-name"></span><span class="district-mini">${lv.districtName||'Ngã tư trung tâm'}</span><span class="level-meta">${lv.vehicles.length} xe · ${lv.sampleSolution.length} đoạn giải mẫu · ${'★'.repeat(personalBest[lv.level]||0)}${'☆'.repeat(3-(personalBest[lv.level]||0))}</span>`;
 btn.querySelector('.level-name').textContent=lv.title;btn.onclick=()=>{loadLevel(i,{intro:true});musicTryStart()};host.appendChild(btn);
 });}
function openLevels(){renderLevels();$('levelsWrap').classList.remove('hidden');toggleMenu(false)}
function closeLevels(){$('levelsWrap').classList.add('hidden')}
$('levelBtn').onclick=openLevels;$('levelMenuBtn').onclick=openLevels;$('levelsClose').onclick=closeLevels;
$('levelsWrap').addEventListener('pointerdown',e=>{if(e.target===$('levelsWrap'))closeLevels()});
$('nextLevelBtn').onclick=()=>{loadLevel(levelIndex+1,{intro:true});musicTryStart()};
window.KXRDebug={get status(){return {vehicles:vehicles.map(v=>({...v})),moves,won,animating,selected,level:levelIndex+1,geometry:P.inspectScene(DATA,vehicles),corridor:P.corridorStatus(DATA,vehicles)}},get draft(){return draft?.nodes||null},get camera(){return {...camera}},inspect:(id,path)=>P.inspectRoute(DATA,vehicles,id,path),load:loadLevel,colors:VEHICLE_COLORS,move:(id,to)=>{const v=curr(id),p=[v.node,to],r=P.inspectRoute(DATA,vehicles,id,p);if(!r.ok)return Promise.resolve(r);return commitStroke(id,p,r)},stroke:(id,path)=>{const r=P.inspectRoute(DATA,vehicles,id,path);if(!r.ok)return Promise.resolve(r);return commitStroke(id,path,r)},undo,reset:resetGame,select:selectCar,screen:(x,y)=>({x:camera.ox+x*camera.s,y:camera.oy+y*camera.s}),nodes};
resetGame();refreshMissionUI();
