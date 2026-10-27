const assert=require('assert');
const P=require('./geometry.js');
for(let lvl=1;lvl<=5;lvl++){
 let d=require('./levels/mission_'+String(lvl).padStart(2,'0')+'.json');
 let cars=d.vehicles.map(v=>({...v,heading:P.angleFor(v.direction)}));
 assert(P.inspectScene(d,cars).ok);
 for(let [a,b] of d.closedEdges||[]){
   assert(d.edges.some(([c,e])=>(c===a&&e===b)||(c===b&&e===a)),`Closed edge missing from graph ${lvl}:${a}-${b}`);
   let temp=[{id:'TEST',sprite:1,node:a,name:'Test',direction:'H',heading:0}];
   let result=P.inspectRoute(d,temp,'TEST',[a,b]);
   assert(!result.ok&&result.blockedBy==='ROAD_CLOSED',`Closed road wasn't enforced level ${lvl}: ${a}-${b}`);
   console.log('PASS closed:',lvl,a,b);
 }
 console.log('PASS district',lvl,d.district,'vehicles',cars.length);
}
