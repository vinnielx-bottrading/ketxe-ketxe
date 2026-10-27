/* Pointer-to-graph snapping for a maximum 3-edge stroke; no teleport/diagonal shortcuts. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;if(root)root.KXRPathInput=api;})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
function next(data,path,point,physics,scale=1){
 const n=physics.nodeMap(data),here=path.at(-1),p=n[here],prev=path.length>1?path.at(-2):null;
 if(!p)return null;
 if(prev&&Math.hypot(point.x-n[prev].x,point.y-n[prev].y)<42)return {back:true};
 if(path.length>=4)return null;
 const links=data.edges.filter(([a,b])=>a===here||b===here).map(([a,b])=>a===here?b:a);
 const possible=links.filter(id=>id!==prev&&!path.includes(id)).map(id=>({id,...physics.nearestPointOnSegment(point,p,n[id])}));
 possible.sort((a,b)=>(a.dist+Math.max(0,.70-a.t)*160)-(b.dist+Math.max(0,.70-b.t)*160));
 const q=possible[0];if(!q)return null;
 const near=q.dist<Math.min(54,60/scale),progress=q.t>.65;
 const atNode=Math.hypot(point.x-n[q.id].x,point.y-n[q.id].y)<65;
 return near&&progress||atNode?{node:q.id}:null;
}
return {next};
});
