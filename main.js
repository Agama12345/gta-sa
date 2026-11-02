import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
const canvas=document.querySelector('#world');const renderer=new THREE.WebGLRenderer({canvas,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0xa8c8c0);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0xb9cec1,0.00032);const camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,1,2400);scene.add(new THREE.HemisphereLight(0xd9eff0,0x63785a,2));const sun=new THREE.DirectionalLight(0xffe4b9,2.2);sun.position.set(-1000,1600,700);scene.add(sun);
new RGBELoader().load('/assets/sky-1k.hdr', sky=>{sky.mapping=THREE.EquirectangularReflectionMapping;scene.environment=sky;scene.background=sky}, undefined, ()=>console.warn('Nie udało się wczytać nieba'));
const loader=new THREE.TextureLoader();function groundTexture(path,rx,ry){const t=loader.load(path);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rx,ry);t.anisotropy=renderer.capabilities.getMaxAnisotropy();return t}
const sandTex=groundTexture('/assets/sand.jpg',75,1000),sandNormal=groundTexture('/assets/sand-normal.jpg',75,1000);sandNormal.colorSpace=THREE.NoColorSpace;
const sandTexSouth=groundTexture('/assets/sand.jpg',800,55),sandNormalSouth=groundTexture('/assets/sand-normal.jpg',800,55);sandNormalSouth.colorSpace=THREE.NoColorSpace;
const pavementTex=groundTexture('/assets/pavement.jpg',2,1100),pavementNormal=groundTexture('/assets/pavement-normal.jpg',2,1100),pavementRough=groundTexture('/assets/pavement-rough.jpg',2,1100);pavementNormal.colorSpace=THREE.NoColorSpace;pavementRough.colorSpace=THREE.NoColorSpace;
const grassTex=groundTexture('/assets/grass.jpg',180,180),roadNS=groundTexture('/assets/asphalt-clean.jpg',11,1300),roadEW=groundTexture('/assets/asphalt-clean.jpg',1100,11);
const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:1});const groundMat=new THREE.MeshStandardMaterial({map:grassTex,roughness:1}),roadMat=mat('#596560'),sandMat=new THREE.MeshStandardMaterial({map:sandTex,normalMap:sandNormal,roughness:1}),waterMat=new THREE.MeshStandardMaterial({color:'#397b86',roughness:.35,metalness:.08}),parkMat=new THREE.MeshStandardMaterial({map:grassTex,roughness:1});
function box(x,y,z,w,h,d,m){let o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);scene.add(o);return o}box(0,-8,0,5000,16,5000,groundMat);box(2310,-2,0,380,5,5000,waterMat);box(5000,-2,0,5000,5,10000,waterMat);box(-2000,-2,5000,9000,5,5000,waterMat);box(2050,0,0,150,3,5000,sandMat);box(0,0,2260,4000,3,280,new THREE.MeshStandardMaterial({map:sandTexSouth,normalMap:sandNormalSouth,roughness:1}));box(0,-2,2450,4000,5,100,waterMat);
// Repeatable facade texture, created locally to keep the prototype self-contained.
function facade(base){let c=document.createElement('canvas');c.width=256;c.height=256;let g=c.getContext('2d');g.fillStyle=base;g.fillRect(0,0,256,256);for(let y=9;y<256;y+=32){g.fillStyle='rgba(35,51,50,.15)';g.fillRect(0,y+22,256,2);for(let x=9;x<256;x+=32){g.fillStyle='#536d6a';g.fillRect(x,y,19,19);g.fillStyle='#8fa9a0';g.fillRect(x+2,y+2,7,15);g.fillStyle='rgba(241,221,172,.5)';if((x*y)%5===0)g.fillRect(x+11,y+2,6,15)}}let t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;return new THREE.MeshStandardMaterial({map:t,roughness:.9})}
const plaster=groundTexture('/assets/wall.jpg',4,4);
const plasterNormal=groundTexture('/assets/wall-normal.jpg',4,4);plasterNormal.colorSpace=THREE.NoColorSpace;
const plasterArm=groundTexture('/assets/wall-rough.jpg',4,4);plasterArm.colorSpace=THREE.NoColorSpace;
const walls=['#ddd7cd','#b8b8b5','#d7cfbf','#b8c1c0','#bfafa2'].map(color=>new THREE.MeshStandardMaterial({color,map:plaster,normalMap:plasterNormal,roughnessMap:plasterArm,roughness:1})),roof=mat('#8a8e7d'),interior=mat('#c6b79d');let groups=new Map();function instance(key,m,x,y,z,w,h,d){if(!groups.has(key))groups.set(key,{m,transforms:[]});groups.get(key).transforms.push([x,y,z,w,h,d])}
function flush(){for(const [key,{m,transforms}] of groups){const glass=key.startsWith('glass_');const mesh=new THREE.InstancedMesh(glass?new THREE.PlaneGeometry(1,1):new THREE.BoxGeometry(1,1,1),m,transforms.length),dummy=new THREE.Object3D();transforms.forEach((v,i)=>{dummy.position.set(v[0],v[1],v[2]);if(glass){dummy.rotation.y=v[3]<1?Math.PI/2:0;dummy.scale.set(v[3]<1?v[5]:v[3],v[4],1)}else{dummy.rotation.y=0;dummy.scale.set(v[3],v[4],v[5])}dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});mesh.computeBoundingSphere();scene.add(mesh)}}
const windowGlass=new THREE.MeshStandardMaterial({color:'#364d57',metalness:.08,roughness:.5,side:THREE.DoubleSide});const trimMaterial=mat('#ddd8cd');
let rng=42;function random(){rng=(rng*1664525+1013904223)>>>0;return rng/4294967296}const buildings=[];for(let x=-1800;x<=1800;x+=240){box(x,1,0,34,2,4400,new THREE.MeshStandardMaterial({map:roadNS,roughness:1}))}for(let z=-2040;z<=1800;z+=240){box(0,1,z,3800,2,34,new THREE.MeshStandardMaterial({map:roadEW,roughness:1}))}
// Each street block holds multiple independently sized buildings; district rules
// keep the centre taller, housing shorter, and the port low and industrial.
function addBuilding(cx,cz,w,d,h,color){
 let chunk=Math.floor((cx+2400)/480)+'_'+Math.floor((cz+2400)/480),key='w'+color+'_'+chunk,t=1.2,door=4;
 instance(key,walls[color],cx-w/2+t/2,h/2,cz,t,h,d);instance(key,walls[color],cx+w/2-t/2,h/2,cz,t,h,d);
 instance(key,walls[color],cx,h/2,cz-d/2+t/2,w,h,t);instance(key,walls[color],cx-(w+door)/4,h/2,cz+d/2-t/2,(w-door)/2,h,t);instance(key,walls[color],cx+(w+door)/4,h/2,cz+d/2-t/2,(w-door)/2,h,t);instance(key,walls[color],cx,(h+4)/2,cz+d/2-t/2,door,h-4,t);
 instance('roof_'+chunk,roof,cx,h,cz,w,1,d);instance('floor_'+chunk,interior,cx,.5,cz,w-2,.5,d-2);
 if(h>25){instance('roof_'+chunk,roof,cx+w*.2,h+1,cz+d*.2,4,2,4);instance('roof_'+chunk,roof,cx-w*.2,h+.7,cz-d*.2,3,1.4,3)}
 buildings.push({x:cx,z:cz,w,d,h});
 for(let level=1;level<Math.floor(h/3.7);level++){let wy=level*3.7+1;instance('trim_'+chunk,trimMaterial,cx,wy-1.15,cz-d/2-.2,w,.12,.38);instance('trim_'+chunk,trimMaterial,cx,wy-1.15,cz+d/2+.2,w,.12,.38);instance('trim_'+chunk,trimMaterial,cx-w/2-.2,wy-1.15,cz,.38,.12,d);instance('trim_'+chunk,trimMaterial,cx+w/2+.2,wy-1.15,cz,.38,.12,d);for(let ox=-w/2+3;ox<w/2-2;ox+=5){instance('glass_'+chunk,windowGlass,cx+ox,wy,cz-d/2-.1,2.7,2,.16);instance('glass_'+chunk,windowGlass,cx+ox,wy,cz+d/2+.1,2.7,2,.16)}for(let oz=-d/2+3;oz<d/2-2;oz+=5){instance('glass_'+chunk,windowGlass,cx-w/2-.1,wy,cz+oz,.16,2,2.7);instance('glass_'+chunk,windowGlass,cx+w/2+.1,wy,cz+oz,.16,2,2.7)}}
}
for(let x=-1800;x<1800;x+=240)for(let z=-2040;z<1800;z+=240){let centerX=x+120,centerZ=z+120;
 if((centerX < -1000&&centerZ < -850)||(centerX>-400&&centerX<400&&centerZ>-400&&centerZ<400)||(centerX>700&&centerX<1200&&centerZ>700&&centerZ<1200))continue;
 const downtown=Math.abs(centerX)<800&&Math.abs(centerZ)<1000,port=centerX>1200&&centerZ<0;
 for(let col=0;col<2;col++)for(let row=0;row<2;row++){
  if((centerX===120&&centerZ===600&&col===0&&row===0)||random()<.09)continue;let cx=x+66+col*105+(random()-.5)*12,cz=z+66+row*105+(random()-.5)*12;
  let w=48+random()*25,d=48+random()*25;
  let h=port?12+random()*18:downtown?(random()<.28?85+random()*95:25+random()*55):10+random()*32;
  addBuilding(cx,cz,w,d,h,Math.floor(random()*walls.length));
 }
}
// Sidewalks and lane markings throughout the street grid.
const sidewalkMaterial=new THREE.MeshStandardMaterial({map:pavementTex,normalMap:pavementNormal,roughnessMap:pavementRough,roughness:1});
const pale=mat('#d5d0bf');
for(let x=-1800;x<=1800;x+=240){for(const dx of [-21,21])box(x+dx,1.1,0,7,2.2,4400,sidewalkMaterial);for(let z=-2140;z<2100;z+=18)instance('paint',pale,x,2.2,z,.3,.15,7)}
const pavementEW=groundTexture('/assets/pavement.jpg',950,2),normalEW=groundTexture('/assets/pavement-normal.jpg',950,2),roughEW=groundTexture('/assets/pavement-rough.jpg',950,2);normalEW.colorSpace=THREE.NoColorSpace;roughEW.colorSpace=THREE.NoColorSpace;
const sidewalkEW=new THREE.MeshStandardMaterial({map:pavementEW,normalMap:normalEW,roughnessMap:roughEW});
for(let z=-2040;z<=1800;z+=240){for(const dz of [-21,21])box(0,1.1,z+dz,3800,2.2,7,sidewalkEW);for(let x=-1850;x<1850;x+=18)instance('paint',pale,x,2.3,z,7,.15,.3)}
for(let x=-1800;x<=1800;x+=240)for(let z=-2040;z<=1800;z+=240){if(Math.abs(x)<400&&Math.abs(z)<400)continue;for(let k=-4;k<=4;k++){instance('paint',pale,x+k*2.6,2.3,z-13,1.1,.15,5);instance('paint',pale,x-13,2.3,z+k*2.6,5,.15,1.1)}}
// Parks, trees and the forest.
box(0,1.55,0,750,3.1,750,parkMat);box(960,1.55,960,500,3.1,500,parkMat);box(0,3.15,0,12,.1,730,sidewalkMaterial);box(0,3.15,0,730,.1,12,sidewalkEW);box(960,3.15,960,10,.1,480,sidewalkMaterial);box(960,3.15,960,480,.1,10,sidewalkEW);const trunk=mat('#806b50'),leaves=[mat('#638965'),mat('#789e70'),mat('#9aad76')];function tree(x,z,s){instance('trunk',trunk,x,s*.35,z,7*s/30,25*s/30,7*s/30);let k=Math.floor(random()*3);instance('leaf'+k,leaves[k],x,s,z,s,s*1.2,s)}flush();
// Public-domain Poly Haven assets, redistributed through public GitHub mirrors.
// Low, smoothly blended forest hills instead of a completely flat world.
function forestHeight(x,z){let u=(x+2400)/1300,v=(z+2400)/1400;if(u<0||u>1||v<0||v>1)return 0;let edge=Math.min(1,u*8,(1-u)*8,v*8,(1-v)*8);return Math.max(0,edge)*(16+14*Math.sin(u*8)*Math.cos(v*7)+9*Math.sin(u*14+v*10))}
const hillGeometry=new THREE.PlaneGeometry(1300,1400,40,40);hillGeometry.rotateX(-Math.PI/2);let hillPos=hillGeometry.attributes.position;for(let i=0;i<hillPos.count;i++){let x=hillPos.getX(i)-1750,z=hillPos.getZ(i)-1700;hillPos.setY(i,forestHeight(x,z)+.1)}hillGeometry.computeVertexNormals();const hillTex=groundTexture('/assets/grass.jpg',55,55);const hill=new THREE.Mesh(hillGeometry,new THREE.MeshStandardMaterial({map:hillTex,color:'#a5b49b',roughness:1}));hill.position.set(-1750,0,-1700);scene.add(hill);
const gltfLoader=new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
function placeAsset(url, locations, height){gltfLoader.load(url,gltf=>{const original=gltf.scene;original.updateMatrixWorld(true);const bounds=new THREE.Box3().setFromObject(original);const size=bounds.getSize(new THREE.Vector3());if(!Number.isFinite(size.y)||size.y<=0)return;const center=bounds.getCenter(new THREE.Vector3());locations.forEach(([x,z,rotation,scale=1,elevation=0])=>{let group=new THREE.Group(),model=original.clone(true),factor=height/size.y*scale;model.position.set(-center.x*factor,-bounds.min.y*factor,-center.z*factor);model.scale.setScalar(factor);group.position.set(x,3+elevation,z);group.rotation.y=rotation;group.add(model);scene.add(group)})},undefined,e=>console.warn('Błąd wczytania modelu',url,e))}
const pineLocations=[];for(let i=0;i<25;i++){let x=-2200+random()*1100,z=-2200+random()*1100;pineLocations.push([x,z,random()*Math.PI*2,.7+random()*.6,forestHeight(x,z)])};
placeAsset('/assets/pine.glb',pineLocations,35);
const parkTrees=[];for(let i=0;i<30;i++){let x=(random()-.5)*690,z=(random()-.5)*690;if(Math.abs(x)<25||Math.abs(z)<25)continue;parkTrees.push([x,z,random()*6,.65+random()*.45])}for(let i=0;i<15;i++){let x=730+random()*460,z=730+random()*460;if(Math.abs(x-960)<20||Math.abs(z-960)<20)continue;parkTrees.push([x,z,random()*6,.65+random()*.45])}placeAsset('/assets/props/oak.glb',parkTrees,20);

placeAsset('/assets/boulder_01.glb',[[1900,500,0,1],[1900,600,2,.7],[1850,-400,1,.8],[800,1950,2,.8],[-1100,1900,3,1]],18);
placeAsset('/assets/fern.glb',[[-200,140,0,1],[240,190,1,1],[-260,-200,2,1],[900,960,3,1]],3);
// Repeat realistic CC0 street furniture in the city and parks.
const lamps=[[130,501,Math.PI,1],[200,501,Math.PI,1],[130,459,0,1],[200,459,0,1]];for(let x=-1680;x<=1680;x+=720)for(let z=-1920;z<1800;z+=720)lamps.push([x-93,z-99,0,1]);
placeAsset('/assets/props/street-lamp.glb',lamps,7);
const benches=[[-140,-80,0,1],[140,80,Math.PI,1],[-100,180,Math.PI/2,1],[820,900,0,1],[1080,1010,1.5,1]];
placeAsset('/assets/props/park-bench.glb',benches,1.1);
placeAsset('/assets/props/trash-can.glb',[[-130,-80,0,1],[150,80,0,1],[815,900,0,1],[1075,1010,0,1],[108,488,0,1]],1.1);
placeAsset('/assets/props/hydrant.glb',[[115,488,0,1],[-320,480,0,1],[580,720,0,1],[1770,-200,0,1]],.9);
placeAsset('/assets/props/utility-box.glb',[[130,490,0,1],[370,240,1,1],[-370,720,0,1]],1.5);
// A small, assembled facade sample: actual modular geometry, not the whole city.
gltfLoader.load('/assets/facade/modular_urban_apartments_facade.gltf', gltf=>{
 const wall=gltf.scene.getObjectByName('wall_window_centered_large_02');
 const windowPart=gltf.scene.getObjectByName('window_centered_large_02');
 const door=gltf.scene.getObjectByName('door_centered_large_01');const doorWall=gltf.scene.getObjectByName('wall_door_centered_large_01');
 if(!wall||!windowPart){console.warn('Brak modułów fasady');return}
 const body=box(110,7.5,541,30,15,26,mat('#b0a598'));body.position.y=7.5;
 for(let floor=0;floor<5;floor++)for(let column=0;column<10;column++)for(const source of floor===0&&column===4&&door&&doorWall?[doorWall,door]:[wall,windowPart]){
   const part=source.clone(true);part.position.set(98+column*3, floor*3+2, 527.8);scene.add(part)
 }
},undefined,e=>console.warn('Nie udało się wczytać fasady',e));
// Nearby street-level facades use authentic modular meshes. Instances are bounded to a
// small radius so detail does not multiply into tens of millions of triangles at once.
let facadeDetail=null,detailTime=0;
gltfLoader.load('/assets/facade/modular_urban_apartments_facade.gltf',gltf=>{
 const sources=['wall_window_centered_large_02','window_centered_large_02'].map(n=>gltf.scene.getObjectByName(n));
 if(sources.some(s=>!s))return;
 const meshes=[];
 for(const source of sources){source.updateWorldMatrix(true,true);let inv=new THREE.Matrix4().copy(source.matrixWorld).invert();source.traverse(child=>{if(!child.isMesh)return;let relative=inv.clone().multiply(child.matrixWorld);let material=child.material.clone();material.side=THREE.DoubleSide;let m=new THREE.InstancedMesh(child.geometry,material,80);m.count=0;m.frustumCulled=false;m.instanceMatrix.setUsage(THREE.DynamicDrawUsage);scene.add(m);meshes.push({mesh:m,relative})})}
 facadeDetail={meshes,dummy:new THREE.Object3D(),matrix:new THREE.Matrix4()};
});
function refreshFacadeDetails(){if(!facadeDetail)return;let {meshes,dummy,matrix}=facadeDetail;let count=0;
 for(const b of buildings.filter(b=>Math.hypot(b.x-camera.position.x,b.z-camera.position.z)<180).sort((a,b)=>Math.hypot(a.x-camera.position.x,a.z-camera.position.z)-Math.hypot(b.x-camera.position.x,b.z-camera.position.z))){
  for(const side of [0,1,2,3]){let width=side<2?b.w:b.d, cols=Math.floor((width-4)/6);for(let f=0;f<2&&f*3<b.h-3;f++)for(let col=0;col<cols;col++){
   if(count>=80)break;let offset=-width/2+2+col*6+6;
   // The facade module spans local x=-3..0; its x scale of two spans six metres.
   let x=b.x+(side<2?offset:side===2?-b.w/2-.3:b.w/2+.3);
   let z=b.z+(side<2?(side===0?b.d/2+.3:-b.d/2-.3):offset);
   dummy.position.set(x,2.25+f*3,z);dummy.rotation.set(0,side<2?0:Math.PI/2,0);dummy.scale.set(2,1,1);dummy.updateMatrix();
   for(const item of meshes){matrix.multiplyMatrices(dummy.matrix,item.relative);item.mesh.setMatrixAt(count,matrix)}count++;
  }}
 }for(const item of meshes){item.mesh.count=count;item.mesh.instanceMatrix.needsUpdate=true}
}
const asphaltNormal=groundTexture('/assets/asphalt-clean-normal.jpg',11,1300);asphaltNormal.colorSpace=THREE.NoColorSpace;
const asphaltArm=groundTexture('/assets/asphalt-clean-rough.jpg',11,1300);asphaltArm.colorSpace=THREE.NoColorSpace;
const asphaltNormalEW=groundTexture('/assets/asphalt-clean-normal.jpg',1100,11);asphaltNormalEW.colorSpace=THREE.NoColorSpace;
const asphaltArmEW=groundTexture('/assets/asphalt-clean-rough.jpg',1100,11);asphaltArmEW.colorSpace=THREE.NoColorSpace;
scene.traverse(o=>{if(!o.isMesh||!o.material)return;let m=o.material;if(m.map===roadNS){m.normalMap=asphaltNormal;m.roughnessMap=asphaltArm;m.needsUpdate=true}if(m.map===roadEW){m.normalMap=asphaltNormalEW;m.roughnessMap=asphaltArmEW;m.needsUpdate=true}});
const places={city:{pos:[950,190,1350],look:[200,65,0],name:'CENTRUM MIASTA',desc:'MIEJSCE, W KTÓRYM WSZYSTKO SIĘ ZACZYNA'},blocks:{pos:[-1000,260,1000],look:[-500,80,500],name:'BLOKOWISKA',desc:'DZIELNICA, KTÓRA NIGDY NIE ZASYPIA'},park:{pos:[650,370,850],look:[0,0,0],name:'ZIELONY PARK',desc:'CHWILA ODDECHU W SERCU MIASTA'},forest:{pos:[-1350,370,-1000],look:[-1900,0,-1700],name:'LAS PÓŁNOCNY',desc:'DALEKO OD MIEJSKIEGO ZGIEŁKU'},beach:{pos:[1450,300,800],look:[2150,0,250],name:'WYBRZEŻE',desc:'DWIE PLAŻE, JEDNO NIEKOŃCZĄCE SIĘ LATO'}};let yaw=0,pitch=0,active='city';function setPlace(id){active=id;let p=places[id];camera.position.set(...p.pos);let target=new THREE.Vector3(...p.look).sub(camera.position).normalize();yaw=Math.atan2(-target.x,-target.z);pitch=Math.asin(target.y);document.querySelector('#place-name').textContent=p.name;document.querySelector('#place-description').textContent=p.desc;document.querySelectorAll('[data-place]').forEach(b=>b.classList.toggle('active',b.dataset.place===id))}setPlace('city');document.querySelectorAll('[data-place]').forEach(b=>b.onclick=()=>{setPlace(b.dataset.place);document.querySelector('#app').classList.remove('map-open')});document.querySelector('#toggle-map').onclick=()=>document.querySelector('#app').classList.toggle('map-open');document.querySelector('#overview').onclick=()=>{document.querySelector('#app').classList.remove('exploring','map-open');setPlace('city')};document.querySelector('#reset').onclick=()=>{document.querySelector('#app').classList.remove('exploring');setPlace('city')};document.querySelector('#explore').onclick=()=>{camera.position.set(110,4.2,480);yaw=-Math.PI/2;pitch=0;document.querySelector('#app').classList.add('exploring');document.querySelector('#hint').classList.add('show');setTimeout(()=>document.querySelector('#hint').classList.remove('show'),5000)};
let keys={};addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);addEventListener('blur',()=>keys={});let dragging=false,lastX=0,lastY=0;canvas.addEventListener('pointerdown',e=>{dragging=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});canvas.addEventListener('pointerup',()=>dragging=false);canvas.addEventListener('pointermove',e=>{if(!dragging)return;yaw-=(e.clientX-lastX)*.004;pitch=Math.max(-1.4,Math.min(1.4,pitch-(e.clientY-lastY)*.004));lastX=e.clientX;lastY=e.clientY});
const map=document.querySelector('#map'),mc=map.getContext('2d');
// The minimap is built from the same roads, buildings and zones as the 3D scene.
const mapBase=document.createElement('canvas');mapBase.width=360;mapBase.height=280;const bg=mapBase.getContext('2d');
function mapRect(x,z,w,d,color){bg.fillStyle=color;bg.fillRect((x+2500)/5000*360,(z+2500)/5000*280,w/5000*360,d/5000*280)}
mapRect(-2500,-2500,5000,5000,'#91a68a');mapRect(-2400,-2400,1300,1400,'#597d60');
for(let x=-1800;x<=1800;x+=240)mapRect(x-17,-2200,34,4400,'#718578');
for(let z=-2040;z<=1800;z+=240)mapRect(-1900,z-17,3800,34,'#718578');
mapRect(-375,-375,750,750,'#70936d');mapRect(710,710,500,500,'#70936d');
for(const b of buildings)mapRect(b.x-b.w/2,b.z-b.d/2,b.w,b.d,'#c3c7ae');
mapRect(1975,-2500,150,5000,'#d4c09a');mapRect(2125,-2500,375,5000,'#6e9fa2');mapRect(-2000,2120,3975,280,'#d4c09a');mapRect(-2000,2400,3975,100,'#6e9fa2');
function drawMap(){mc.drawImage(mapBase,0,0);let px=(camera.position.x+2500)/5000*360,py=(camera.position.z+2500)/5000*280;mc.fillStyle='#e1eeac';mc.beginPath();mc.arc(px,py,5,0,Math.PI*2);mc.fill();mc.strokeStyle='#fff';mc.lineWidth=2;mc.stroke()}
let clock=new THREE.Clock();function tick(){let dt=Math.min(clock.getDelta(),.05);detailTime+=dt;if(detailTime>.5){refreshFacadeDetails();detailTime=0}let speed=(keys.shift?65:12)*dt;let f=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),r=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));if(keys.w||keys.arrowup)camera.position.addScaledVector(f,speed);if(keys.s||keys.arrowdown)camera.position.addScaledVector(f,-speed);if(keys.d||keys.arrowright)camera.position.addScaledVector(r,speed);if(keys.a||keys.arrowleft)camera.position.addScaledVector(r,-speed);if(keys.e)camera.position.y+=speed;if(keys.q)camera.position.y-=speed;camera.position.y=Math.max(4.2,Math.min(1500,camera.position.y));camera.position.x=THREE.MathUtils.clamp(camera.position.x,-2500,2500);camera.position.z=THREE.MathUtils.clamp(camera.position.z,-2500,2500);camera.rotation.order='YXZ';camera.rotation.y=yaw;camera.rotation.x=pitch;drawMap();renderer.render(scene,camera);requestAnimationFrame(tick)}tick();addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
