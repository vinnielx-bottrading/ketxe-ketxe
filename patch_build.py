from pathlib import Path
import json,re
p=Path(__file__).parent
f=p/'game.js'; s=f.read_text()
def rep(old,new):
 global s
 if old not in s: raise Exception('CANNOT FIND '+old[:130])
 s=s.replace(old,new)
rep('const DATA = window.KXR_MISSION;\nconst P=window.KXRPhysics, $=id=>document.getElementById(id), nodes=P.nodeMap(DATA);\nconst adjacency=Object.fromEntries(DATA.nodes.map(n=>[n.id,[]]));\nDATA.edges.forEach(([a,b])=>{adjacency[a].push(b);adjacency[b].push(a)});', '''let DATA = window.KXR_MISSION;
const LEVELS=window.KXR_LEVELS||[DATA];let levelIndex=0;
const P=window.KXRPhysics,$=id=>document.getElementById(id);let nodes=P.nodeMap(DATA),adjacency={};
function rebuildGraph(){nodes=P.nodeMap(DATA);adjacency=Object.fromEntries(DATA.nodes.map(n=>[n.id,[]]));DATA.edges.forEach(([a,b])=>{adjacency[a].push(b);adjacency[b].push(a)});}
rebuildGraph();
const VEHICLE_COLORS={1:'#ff6265',2:'#55b5ff',3:'#ffd34d',4:'#edfaff',5:'#bfccd6',6:'#67ef96',7:'#ffac54',8:'#428cff',9:'#d6a06b',10:'#dce6ef',11:'#b9f6ff'};
function paint(v){return VEHICLE_COLORS[v.sprite]||'#71f1cb'}
function tint(v){const color=paint(v);overlay.style.setProperty('--vehicle-color',color);ghost.style.setProperty('--vehicle-color',color);return color;}
let personalBest={};try{personalBest=JSON.parse(localStorage.getItem('kxr-cityalive-best-v04')||'{}')||{}}catch{}
function remember(level,stars){personalBest[level]=Math.max(stars,personalBest[level]||0);try{localStorage.setItem('kxr-cityalive-best-v04',JSON.stringify(personalBest))}catch{}}
''')
rep("const line=$('drawLine'),draftTip=$('draftTip'),ghost=$('ghost'),music=$('music');", "const line=$('drawLine'),underlay=$('drawUnderlay'),draftTip=$('draftTip'),ghost=$('ghost'),music=$('music');")
rep("mark.title=ok.ok?`Có thể đi đến ${next}`:`Bị chặn: ${ok.reason}`;markersEl.appendChild(mark);", "mark.title=ok.ok?`Có thể đi đến ${next}`:`Bị chặn: ${ok.reason}`;mark.style.setProperty('--vehicle-color',paint(v));markersEl.appendChild(mark);")
rep("el.dataset.car=v.id;el.setAttribute('aria-label',v.name);", "el.dataset.car=v.id;el.style.setProperty('--vehicle-color',paint(v));el.setAttribute('aria-label',v.name);")
rep("if(v.id==='AMB'){notice('Xe cứu thương đang chờ. Hãy vẽ đường để dời các xe chắn lối.');return;}selected=id;renderCars();", "if(v.id==='AMB'){notice(`${v.name} đang chờ thông đường. Hãy dời những xe chắn lối.`);return;}selected=id;tint(v);renderCars();")
rep("draft=null;line.setAttribute('points','');line.style.opacity='0';", "draft=null;line.setAttribute('points','');underlay.setAttribute('points','');line.style.opacity='0';underlay.style.opacity='0';")
rep("line.setAttribute('points',points.join(' '));line.style.opacity=draft.dragging?'1':'0';", "line.setAttribute('points',points.join(' '));underlay.setAttribute('points',points.join(' '));line.style.opacity=draft.dragging?'1':'0';underlay.style.opacity=draft.dragging?'1':'0';")
rep("if(id==='AMB'){notice('Đây là xe cứu thương mục tiêu; hãy dời các xe khác trước.');return;}", "if(id==='AMB'){notice(`Đây là ${curr('AMB').name.toLowerCase()} mục tiêu; hãy dời các xe khác trước.`);return;}")
rep("const redTrail=line.getAttribute('points');clearDraft();line.setAttribute('points',redTrail);line.style.opacity='1';overlay.classList.add('invalid');setTimeout(()=>{if(!draft){line.style.opacity='0';overlay.classList.remove('invalid');showIndicators()}},550)", "const redTrail=line.getAttribute('points');clearDraft();line.setAttribute('points',redTrail);underlay.setAttribute('points',redTrail);line.style.opacity='1';underlay.style.opacity='1';overlay.classList.add('invalid');setTimeout(()=>{if(!draft){line.style.opacity='0';underlay.style.opacity='0';overlay.classList.remove('invalid');showIndicators()}},550)")
rep("notice('🚑 Xe cứu thương đang chạy qua hai giao lộ đến bệnh viện!');", "notice(`${DATA.missionIcon} ${curr('AMB').name} đang đi qua hai giao lộ đến ${DATA.goalLabel.toLowerCase()}!`);")
rep("amb.node='HOSP';amb.direction='H';amb.heading=0;won=true;animating=false;renderCars();setMission(`${moves} đoạn · ĐÃ ĐẾN BỆNH VIỆN`);notice('✅ Xe cứu thương đã đến bệnh viện. Giao thông đã thông suốt!');$('banner').classList.add('show');", "amb.node='HOSP';amb.direction='H';amb.heading=0;won=true;animating=false;renderCars();setMission(`${moves} đoạn · ĐÃ ĐẾN ${DATA.goalLabel}`);notice(`✅ ${amb.name} đã đến ${DATA.goalLabel.toLowerCase()}. Giao thông đã thông suốt!`);$('banner').classList.add('show');let stars=moves<=DATA.sampleSolution.length?3:moves<=DATA.sampleSolution.length+4?2:1;remember(DATA.level,stars);")
rep("$('modalText').textContent=`Xe cứu thương đã đến bệnh viện sau ${moves} đoạn đường. Chúc mừng!`;$('startBtn').textContent='CHƠI LẠI';", "$('modalText').textContent=`${amb.name} đã đến ${DATA.goalLabel.toLowerCase()} sau ${moves} đoạn đường. ${'★'.repeat(stars)}${'☆'.repeat(3-stars)} Chúc mừng!`;$('startBtn').textContent='CHƠI LẠI';$('nextLevelBtn').hidden=levelIndex>=LEVELS.length-1;")
rep("function resetGame(){gameToken++;", "function resetGame(){gameToken++;")
rep("notice('Chạm chọn một xe, vuốt từ xe để vẽ tuyến rồi thả tay.');renderCars();resetCamera();}", "notice('Chạm chọn một xe, vuốt từ xe để vẽ tuyến rồi thả tay.');renderCars();resetCamera();}")
rep("line.setAttribute('points',pt.map(p=>`${p.x},${p.y}`).join(' '));line.style.opacity='1';", "tint(v);line.setAttribute('points',pt.map(p=>`${p.x},${p.y}`).join(' '));underlay.setAttribute('points',line.getAttribute('points'));line.style.opacity='1';underlay.style.opacity='1';")
rep("line.style.opacity='0';overlay.classList.remove('valid');showIndicators()", "line.style.opacity='0';underlay.style.opacity='0';overlay.classList.remove('valid');showIndicators()")
rep("$('startBtn').onclick=()=>{$('modal').classList.add('hidden');if(won)resetGame();musicTryStart()};", "$('startBtn').onclick=()=>{$('modal').classList.add('hidden');if(won)resetGame();musicTryStart()};")
rep("window.KXRDebug={get status(){return {vehicles:vehicles.map(v=>({...v})),moves,won,animating,selected,geometry:P.inspectScene(DATA,vehicles),corridor:P.corridorStatus(DATA,vehicles)}},", "window.KXRDebug={get status(){return {vehicles:vehicles.map(v=>({...v})),moves,won,animating,selected,level:levelIndex+1,geometry:P.inspectScene(DATA,vehicles),corridor:P.corridorStatus(DATA,vehicles)}},")
rep("inspect:(id,path)=>P.inspectRoute(DATA,vehicles,id,path),move:","inspect:(id,path)=>P.inspectRoute(DATA,vehicles,id,path),load:loadLevel,colors:VEHICLE_COLORS,move:")
# Append mission-loading helpers before debug exposure
rep("window.KXRDebug={", '''function missionTitle(){return `${DATA.missionIcon} ${DATA.title.toUpperCase()}`}
function refreshMissionUI(){
 $('missionHeading').textContent=`${missionTitle()}  ·  ${DATA.level}/${LEVELS.length} ▾`;
 $('modalIcon').textContent=DATA.missionIcon;
 $('modalIndex').textContent=`CITY ALIVE · NHIỆM VỤ ${String(DATA.level).padStart(2,'0')}`;
 $('goalSymbol').textContent=DATA.goalSymbol||'✚';$('goalText').textContent=DATA.goalLabel||'BỆNH VIỆN';
 $('modalTitle').textContent=DATA.title;$('modalText').textContent=DATA.brief;
 $('banner').textContent=`${DATA.missionIcon} TUYẾN ĐƯỜNG ĐÃ THÔNG!`;
 $('levelBtn').title=`Chọn màn · ${DATA.title}`;
 $('nextLevelBtn').hidden=DATA.level>=LEVELS.length;
}
function loadLevel(index,{intro=true}={}){
 if(!Number.isInteger(index)||index<0||index>=LEVELS.length)return;
 levelIndex=index;DATA=LEVELS[index];rebuildGraph();closeLevels();toggleMenu(false);$('modal').classList.add('hidden');resetGame();refreshMissionUI();
 if(intro)$('modal').classList.remove('hidden');
}
function renderLevels(){const host=$('levelCards');host.replaceChildren();LEVELS.forEach((lv,i)=>{
 const btn=document.createElement('button');btn.className='level-card'+(i===levelIndex?' active':'');btn.innerHTML=`<span class="level-num">${lv.missionIcon} ${String(lv.level).padStart(2,'0')}</span><span class="level-name"></span><span class="level-meta">${lv.vehicles.length} xe · ${lv.sampleSolution.length} đoạn mẫu · ${'★'.repeat(personalBest[lv.level]||0)}${'☆'.repeat(3-(personalBest[lv.level]||0))}</span>`;
 btn.querySelector('.level-name').textContent=lv.title;btn.onclick=()=>{loadLevel(i,{intro:true});musicTryStart()};host.appendChild(btn);
 });}
function openLevels(){renderLevels();$('levelsWrap').classList.remove('hidden');toggleMenu(false)}
function closeLevels(){$('levelsWrap').classList.add('hidden')}
$('levelBtn').onclick=openLevels;$('levelMenuBtn').onclick=openLevels;$('levelsClose').onclick=closeLevels;
$('levelsWrap').addEventListener('pointerdown',e=>{if(e.target===$('levelsWrap'))closeLevels()});
$('nextLevelBtn').onclick=()=>{loadLevel(levelIndex+1,{intro:true});musicTryStart()};
window.KXRDebug={''')
rep("resetGame();\n", "resetGame();refreshMissionUI();\n") # danger replaces occurrences? only trailing top-level? matches at end of game.js may be `...;resetGame();\n` yes
f.write_text(s)

f=p/'index.html'; s=f.read_text()
# inline styles define path gradient and chosen car; insert last stylesheet prior </style>
new_css='''
/* v0.4 - Color-coded routes and compact five-mission selector */
.drawoverlay{--vehicle-color:#6af0b0}
.drawoverlay #drawUnderlay{fill:none;stroke:#09252ae8;stroke-width:20;stroke-linejoin:round;stroke-linecap:round;filter:drop-shadow(0 0 4px #08232b);opacity:0}
.drawoverlay #drawLine{stroke:var(--vehicle-color);stroke-width:10;filter:drop-shadow(0 0 7px var(--vehicle-color))}
.drawoverlay.pending #drawLine{stroke:var(--vehicle-color);opacity:.65}
.drawoverlay.valid #drawLine{stroke:var(--vehicle-color)}
.drawoverlay.invalid #drawLine{stroke:#ff615f;filter:drop-shadow(0 0 6px #f43d39)}
.drawoverlay #draftTip{fill:var(--vehicle-color);stroke:#102a35;stroke-width:4;filter:drop-shadow(0 0 6px var(--vehicle-color))}
.drawoverlay.invalid #draftTip{fill:#ff615f;filter:drop-shadow(0 0 6px #ff615f)}
.car.selected{filter:drop-shadow(0 0 12px var(--vehicle-color,#73f4c8)) drop-shadow(0 6px 4px #000a)}
.mini-mark:not(.blocked){background:color-mix(in srgb,var(--vehicle-color,#4af0a6) 25%,transparent);border-color:var(--vehicle-color,#73ffd8);box-shadow:0 0 14px var(--vehicle-color,#4af0a6)}
.mini-mark:not(.blocked):after{color:var(--vehicle-color,#c0ffdb)}
#ghost{filter:drop-shadow(0 0 10px var(--vehicle-color,#59e9aa))}
.level-launch{cursor:pointer;border:1px solid #abd4dd77;color:inherit;min-width:0}
.level-launch:hover{background:#21495b}
.level-launch:focus-visible{outline:2px solid #baf1e3}
.levelsWrap{position:absolute;inset:0;background:#031920c9;z-index:65;display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(5px)}
.levelsWrap.hidden{display:none}
.level-dialog{width:min(570px,96vw);max-height:85dvh;overflow-y:auto;background:linear-gradient(150deg,#234852,#102a37);border:1px solid #93e5df8c;box-shadow:0 25px 65px #00121ab5;border-radius:20px;padding:20px}
.level-header{display:flex;align-items:center;justify-content:space-between;gap:12px}
.level-header h2{margin:0;color:#ffce78;font-size:24px}
.level-header button{background:#2e5260;border:1px solid #86a9b6;border-radius:10px;padding:6px 13px;font-size:20px}
.level-dialog>p{color:#bfdbdc;font-size:13px;line-height:1.5}
#levelCards{display:grid;grid-template-columns:repeat(auto-fit,minmax(195px,1fr));gap:10px}
.level-card{display:flex;flex-direction:column;gap:7px;align-items:flex-start;text-align:left;background:#1e3b49;color:#f6fafb;border:1px solid #487484;border-radius:13px;padding:14px;min-height:111px}
.level-card.active{border-color:#ffd572;background:#315268}
.level-card:hover{background:#365c67}
.level-num{font-weight:850;color:#ffd26d;font-size:19px}.level-name{font-weight:750;font-size:14px}.level-meta{color:#a4c7cc;font-size:11px}
.modal .nextbtn{background:#355d69;margin-top:10px;border-color:#87b9c9}
.modal .nextbtn[hidden]{display:none}
@media(max-width:760px){#levelCards{grid-template-columns:1fr 1fr;gap:7px}.level-card{min-height:118px;padding:10px}.level-dialog{padding:13px}.level-header h2{font-size:19px}.mission-mini{max-width:55vw}.mission-mini strong{font-size:10px}}
'''
s=s.replace('</style>',new_css+'</style>')
s=s.replace('<text x="1533" y="382" text-anchor="middle" fill="#a81c2a" font-weight="900" font-size="19">✚</text><text x="1533" y="404" text-anchor="middle" font-weight="900" font-size="14" fill="#255262">BỆNH VIỆN</text>', '<text id="goalSymbol" x="1533" y="382" text-anchor="middle" fill="#a81c2a" font-weight="900" font-size="19">✚</text><text id="goalText" x="1533" y="404" text-anchor="middle" font-weight="900" font-size="14" fill="#255262">BỆNH VIỆN</text>')
s=s.replace('<polyline id="drawLine" points="" style="opacity:0"/>','<polyline id="drawUnderlay" points="" style="opacity:0"/><polyline id="drawLine" points="" style="opacity:0"/>')
s=s.replace('<div class="mission-mini compact"><strong>🚑 MỞ ĐƯỜNG CỨU THƯƠNG</strong><small id="progress">0 đoạn · Cần khai thông tuyến đường</small></div>', '<button class="mission-mini compact level-launch" id="levelBtn" type="button"><strong id="missionHeading">🚑 MỞ ĐƯỜNG CỨU THƯƠNG</strong><small id="progress">0 đoạn · Cần khai thông tuyến đường</small></button>')
s=s.replace('<button id="hintBtn">💡 Gợi ý tuyến đường</button>', '<button id="levelMenuBtn">🗺 Chọn màn chơi</button><button id="hintBtn">💡 Gợi ý tuyến đường</button>')
s=s.replace('<div style="font-size:42px">🚑</div><small class="tiny">CITY ALIVE · NHIỆM VỤ 01</small>', '<div style="font-size:42px" id="modalIcon">🚑</div><small class="tiny" id="modalIndex">CITY ALIVE · NHIỆM VỤ 01</small>')
s=s.replace('<button class="btn" id="startBtn">BẮT ĐẦU NHIỆM VỤ</button>', '<button class="btn" id="startBtn">BẮT ĐẦU NHIỆM VỤ</button><button class="btn nextbtn" id="nextLevelBtn" hidden>MÀN TIẾP THEO ➜</button>')
s=s.replace('<audio id="music" preload="none"></audio>', '<div class="levelsWrap hidden" id="levelsWrap"><div class="level-dialog"><div class="level-header"><h2>🗺 Chọn nhiệm vụ</h2><button id="levelsClose" aria-label="Đóng">×</button></div><p>Bộ 5 màn thử City Alive. Chọn màn bất kỳ để kiểm tra cơ chế, sao được lưu trên thiết bị.</p><div id="levelCards"></div></div></div><audio id="music" preload="none"></audio>')
levels=json.loads((p/'level_bundle.json').read_text())
embedded='<script>window.KXR_LEVELS='+json.dumps(levels,ensure_ascii=False,separators=(',',':'))+';window.KXR_MISSION=window.KXR_LEVELS[0];</script>'
s=re.sub(r'<script>window.KXR_MISSION=.*?</script>',lambda _:embedded,s,flags=re.S)
# keep remaining script refs
f.write_text(s)
print('Patched game.js/index.html', len(s))
