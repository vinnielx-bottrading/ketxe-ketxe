/* KXR City Alive v0.3 — graph-constrained draw paths + deterministic swept SAT.
   Browser and Node compatible. World coordinates in pixels.
   The SAME samples drive preview, validation and animation. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.KXRPhysics=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const VEHICLES={1:{length:96,width:42},2:{length:96,width:42},3:{length:96,width:42},4:{length:100,width:44},5:{length:102,width:44},6:{length:100,width:44},7:{length:142,width:44},8:{length:142,width:44},9:{length:142,width:44},10:{length:96,width:42},11:{length:104,width:44}};
const STEP=4,CLEARANCE=2,MAX_DEGREES=2;
const nodeMap=data=>Object.fromEntries(data.nodes.map(n=>[n.id,n]));
const getDims=v=>VEHICLES[v.sprite]||VEHICLES[1];
const angleFor=d=>d==='V'?90:0;
const axisFor=(a,b)=>Math.abs(a.x-b.x)>Math.abs(a.y-b.y)?'H':'V';
const norm=a=>((a%360)+360)%360;
const deltaAngle=(a,b)=>((b-a+540)%360)-180;
function corners(p){const r=p.angle*Math.PI/180,c=Math.cos(r),s=Math.sin(r),u=p.length/2,v=p.width/2;return [[-u,-v],[u,-v],[u,v],[-u,v]].map(([x,y])=>({x:p.x+x*c-y*s,y:p.y+x*s+y*c}));}
function overlap(p,q,gap=CLEARANCE){const a=corners(p),b=corners(q);for(const poly of [a,b])for(let k=0;k<2;k++){const dx=poly[(k+1)%4].x-poly[k].x,dy=poly[(k+1)%4].y-poly[k].y,l=Math.hypot(dx,dy),ax=-dy/l,ay=dx/l;const pp=pts=>pts.map(p=>p.x*ax+p.y*ay);const A=pp(a),B=pp(b);if(Math.max(...A)+gap/2<=Math.min(...B)-gap/2||Math.max(...B)+gap/2<=Math.min(...A)-gap/2)return false;}return true;}
function poseAt(v,node){return {x:node.x,y:node.y,angle:v.heading??angleFor(v.direction),...getDims(v)};}
const connected=(data,a,b)=>data.edges.some(([u,v])=>u===a&&v===b||u===b&&v===a);
const headingOf=(a,b)=>norm(Math.atan2(b.y-a.y,b.x-a.x)*180/Math.PI);
function compileSegment(vehicle,from,to){
 const dims=getDims(vehicle),prev=vehicle.heading??angleFor(vehicle.direction),travel=headingOf(from,to);
 const reversing=Math.abs(deltaAngle(prev,travel))>135;
 const turning=axisFor(from,to)!==(vehicle.direction||'H');
 // Straight reverse keeps the nose pointed in the old direction. For an orthogonal turn,
 // tangent easing steers the nose toward the travel axis and the curve offsets its body center.
 const lastAngle=turning?prev+deltaAngle(prev,travel):prev;
 const dist=Math.hypot(to.x-from.x,to.y-from.y),turnDiff=Math.abs(deltaAngle(prev,lastAngle));
 const samples=Math.max(2,Math.ceil(dist/STEP),Math.ceil(turnDiff/MAX_DEGREES));
 const handle=turning?Math.min(20,dist*.15):0;
 const unit=a=>({x:Math.cos(a*Math.PI/180),y:Math.sin(a*Math.PI/180)});
 const startU=unit(prev),endU=unit(lastAngle);
 const p0=from,p3=to,p1={x:from.x+startU.x*handle,y:from.y+startU.y*handle},p2={x:to.x-endU.x*handle,y:to.y-endU.y*handle};
 function at(t){
   const mt=1-t;
   let x=from.x+(to.x-from.x)*t,y=from.y+(to.y-from.y)*t,angle=prev;
   if(turning){
     x=mt*mt*mt*p0.x+3*mt*mt*t*p1.x+3*mt*t*t*p2.x+t*t*t*p3.x;
     y=mt*mt*mt*p0.y+3*mt*mt*t*p1.y+3*mt*t*t*p2.y+t*t*t*p3.y;
     const dx=3*mt*mt*(p1.x-p0.x)+6*mt*t*(p2.x-p1.x)+3*t*t*(p3.x-p2.x);
     const dy=3*mt*mt*(p1.y-p0.y)+6*mt*t*(p2.y-p1.y)+3*t*t*(p3.y-p2.y);
     angle=prev+deltaAngle(prev,Math.atan2(dy,dx)*180/Math.PI);
     if(t===0)angle=prev;if(t===1)angle=lastAngle;
   }
   return {x,y,angle,...dims};
 }
 // Adaptively subdivide near sharp changes in curvature: neither body-center travel
 // nor heading change may exceed the collision-sampling limits.
 const poses=[at(0)];
 function refine(t0,a,t1,b,depth=0){
   if((Math.hypot(b.x-a.x,b.y-a.y)<=STEP&&Math.abs(deltaAngle(a.angle,b.angle))<=MAX_DEGREES)||depth>=14){poses.push(b);return;}
   const tm=(t0+t1)/2,m=at(tm);refine(t0,a,tm,m,depth+1);refine(tm,m,t1,b,depth+1);
 }
 for(let i=1;i<=samples;i++){const t0=(i-1)/samples,t1=i/samples;refine(t0,poses.at(-1),t1,at(t1));}
 return {poses,endHeading:norm(lastAngle),endDirection:axisFor(from,to),gear:turning?'forward':(reversing?'reverse':'forward'),turning};
}
function nearestPointOnSegment(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,t=Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1)));return {x:a.x+dx*t,y:a.y+dy*t,t,dist:Math.hypot(p.x-a.x-dx*t,p.y-a.y-dy*t)};}
function laneContainsPoint(data,pt,radius=82){const n=nodeMap(data);return data.edges.some(([u,v])=>nearestPointOnSegment(pt,n[u],n[v]).dist<=radius);}
// Road corridor is an explicit drivable mask around the authored centerline graph. Static
// buildings/curbs are excluded outside the mask; finer per-object polygons are later work.
function environmentOk(data,pose){return corners(pose).every(pt=>laneContainsPoint(data,pt,85));}
function inspectRoute(data,vehicles,id,path,{ignoreGoal=false,checkEnvironment=true}={}){
 const v=vehicles.find(v=>v.id===id),n=nodeMap(data);
 if(!v)return {ok:false,reason:'Không tìm thấy xe.'};
 if(!Array.isArray(path)||path.length<2||path.length>(ignoreGoal?32:4)||path[0]!==v.node)return {ok:false,reason:'Tuyến phải bắt đầu tại xe và có tối đa 3 đoạn.'};
 if(new Set(path).size!==path.length)return {ok:false,reason:'Không được đi vòng lại một điểm trong cùng nét.'};
 const otherVehicles=vehicles.filter(o=>o.id!==id);
 let cur={...v},poses=[],segments=[];
 for(let i=1;i<path.length;i++){
   const from=n[path[i-1]],to=n[path[i]];
   if(!from||!to||!connected(data,path[i-1],path[i]))return {ok:false,reason:'Không có làn đường nối hai điểm.'};
   if((data.closedEdges||[]).some(([a,b])=>a===path[i-1]&&b===path[i]||b===path[i-1]&&a===path[i]))return {ok:false,reason:'Đoạn đường đang bị phong tỏa.',blockedBy:'ROAD_CLOSED',segment:i-1,poses};
   if(!ignoreGoal&&v.id!=='AMB'&&to.kind==='goal')return {ok:false,reason:'Lối bệnh viện chỉ dành cho xe cứu thương.'};
   const part=compileSegment(cur,from,to);
   for(let j=0;j<part.poses.length;j++){
     const pose=part.poses[j];
     if(checkEnvironment&&!environmentOk(data,pose))return {ok:false,reason:'Thân xe sẽ vượt khỏi phần đường cho phép.',blockedBy:'ROAD',segment:i-1,atPoseIndex:poses.length+j,poses:[...poses,...part.poses.slice(0,j+1)]};
     for(const o of otherVehicles){if(overlap(pose,poseAt(o,n[o.node]))){return {ok:false,reason:`Thân xe vướng ${o.name}.`,blockedBy:o.id,segment:i-1,atPoseIndex:poses.length+j,poses:[...poses,...part.poses.slice(0,j+1)]};}}
   }
   segments.push({from:path[i-1],to:path[i],poseCount:part.poses.length,gear:part.gear,turn:part.turning});
   poses.push(...(poses.length?part.poses.slice(1):part.poses));
   cur.node=path[i];cur.heading=part.endHeading;cur.direction=part.endDirection;
 }
 return {ok:true,poses,segments,endHeading:cur.heading,endDirection:cur.direction,edges:path.length-1};
}
function inspectMove(data,vehicles,id,dest,opts={}){const v=vehicles.find(v=>v.id===id);if(!v)return {ok:false,reason:'Xe không tồn tại.'};return inspectRoute(data,vehicles,id,[v.node,dest],opts);}
function inspectScene(data,vehicles){const n=nodeMap(data),issues=[];for(let i=0;i<vehicles.length;i++)for(let j=i+1;j<vehicles.length;j++)if(overlap(poseAt(vehicles[i],n[vehicles[i].node]),poseAt(vehicles[j],n[vehicles[j].node])))issues.push([vehicles[i].id,vehicles[j].id]);return {ok:issues.length===0,collisions:issues};}
function corridorStatus(data,vehicles,opts={}){const a=vehicles.find(v=>v.id==='AMB');if(!a)return {ok:false,reason:'Không có xe cứu thương.'};const checked=inspectRoute(data,vehicles,'AMB',data.priorityCorridor, {ignoreGoal:true,...opts});return checked.ok?{ok:true,poses:checked.poses}:checked;}
return {VEHICLES,STEP,CLEARANCE,MAX_DEGREES,nodeMap,getDims,angleFor,axisFor,poseAt,corners,overlap,connected,nearestPointOnSegment,laneContainsPoint,environmentOk,compileSegment,inspectRoute,inspectMove,inspectScene,corridorStatus};
});
