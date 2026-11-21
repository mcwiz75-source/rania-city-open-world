import * as THREE from 'three';
import './style.css';

const app=document.querySelector('#app');
const hud=document.createElement('div');hud.id='hud';hud.innerHTML=`
<div id="brand">RANIA CITY <span style="color:#eab34b">OPEN WORLD</span></div>
<div id="mission">MISSION 01 · CITY EXPLORER<br><b>Find the golden marker.</b></div>
<div id="stats">HEALTH <b id="health">100</b> ♥<br>CASH <b id="cash">$250</b><br><span id="mode">ON FOOT</span></div>
<div id="hint">Chunguza jiji · Tafuta alama ya dhahabu</div><div id="weaponShop" hidden><b>Duka la vifaa</b><p>Bunduki ya mchezo — $300</p><button id="buyWeapon">NUNUA</button><button id="closeShop">FUNGA</button></div>
<div id="controls">
<div class="stick" id="stick" aria-label="Movement joystick"><div class="stick-ring">●</div><div class="stick-knob" id="knob"></div></div>
<div class="actions">
<div class="action-row"><button class="gamebtn face triangle" id="interact">△</button><button class="gamebtn face square" id="action">□</button></div>
<div class="action-row"><button class="gamebtn face circle" id="exit">○</button><button class="gamebtn face cross" id="jump">×</button></div>
<div class="smallnote">RANIA CITY CONTROLS</div></div>
</div>`;
app.appendChild(hud);
document.documentElement.classList.add('game-landscape');
try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock('landscape').catch(()=>{}); } catch (_) {}
const scene=new THREE.Scene();scene.background=new THREE.Color(0x8bc4df);scene.fog=new THREE.Fog(0x8bc4df,65,180);
const camera=new THREE.PerspectiveCamera(65,innerWidth/innerHeight,.1,400);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;app.prepend(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xdaf1ff,0x526044,2));
const sun=new THREE.DirectionalLight(0xfff0d0,2.1);sun.position.set(-35,65,25);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);scene.add(sun);
const mat=(color,roughness=.85)=>new THREE.MeshStandardMaterial({color,roughness});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(220,220),mat(0x668b56));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const roadMat=mat(0x303943),lineMat=mat(0xe8d9a2),sideMat=mat(0xaaa99d);
function road(x,z,w,d){const r=new THREE.Mesh(new THREE.BoxGeometry(w,.08,d),roadMat);r.position.set(x,.05,z);r.receiveShadow=true;scene.add(r);if(w>d){for(let i=-w/2+4;i<w/2-2;i+=7){const l=new THREE.Mesh(new THREE.BoxGeometry(3,.09,.16),lineMat);l.position.set(x+i,.1,z);scene.add(l)}}else{for(let i=-d/2+4;i<d/2-2;i+=7){const l=new THREE.Mesh(new THREE.BoxGeometry(.16,.09,3),lineMat);l.position.set(x,.1,z+i);scene.add(l)}}}
road(0,0,220,13);road(0,-48,220,11);road(0,48,220,11);road(-55,0,11,220);road(55,0,11,220);
for(let x=-90;x<=90;x+=18){for(let z=-90;z<=90;z+=18){if(Math.abs(z)<9||Math.abs(z-48)<7||Math.abs(z+48)<7||Math.abs(x+55)<7||Math.abs(x-55)<7)continue;
const h=7+Math.random()*23,w=8+Math.random()*5,d=8+Math.random()*5;const colors=[0xb9a58b,0x9caeb5,0xd0c2a4,0x858f9a,0xc6a28c];const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(colors[Math.floor(Math.random()*colors.length)]));b.position.set(x,h/2,z);b.castShadow=true;b.receiveShadow=true;scene.add(b);
const roof=new THREE.Mesh(new THREE.BoxGeometry(w+.2,.35,d+.2),mat(0x39434c));roof.position.set(x,h+.12,z);scene.add(roof);
for(let yy=2;yy<h-1;yy+=3.2){for(let xx=-w/2+1.2;xx<w/2;xx+=2.4){const win=new THREE.Mesh(new THREE.BoxGeometry(.95,1.1,.08),mat(0x8dd3e8,.3));win.position.set(x+xx,yy,z+d/2+.05);scene.add(win)}}}}
function tree(x,z){const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.25,.35,2,7),mat(0x65452d));trunk.position.set(x,1,z);scene.add(trunk);const crown=new THREE.Mesh(new THREE.SphereGeometry(1.5,9,7),mat(0x34734a));crown.position.set(x,3,z);crown.castShadow=true;scene.add(crown)}
for(let i=0;i<55;i++){let x=(Math.random()-.5)*190,z=(Math.random()-.5)*190;if(Math.abs(x)<9||Math.abs(z)<9||Math.abs(Math.abs(x)-55)<8||Math.abs(Math.abs(z)-48)<8)continue;tree(x,z)}
// Mhusika mkuu: mwanaume, mhusika wa kubuni wa RANIA CITY
const player=new THREE.Group();
const skin=mat(0x9b684b),shirt=mat(0x1d3557),trousers=mat(0x242a32),shoes=mat(0x17191b);
const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.48,.85,5,10),shirt);torso.scale.set(1.12,1,0.82);torso.position.y=1.18;torso.castShadow=true;player.add(torso);
const neck=new THREE.Mesh(new THREE.CylinderGeometry(.16,.19,.25,10),skin);neck.position.y=1.82;player.add(neck);
const head=new THREE.Mesh(new THREE.SphereGeometry(.34,16,12),skin);head.scale.set(1,.99,.94);head.position.y=2.12;player.add(head);
const hair=new THREE.Mesh(new THREE.SphereGeometry(.355,12,9,0,Math.PI*2,0,Math.PI*.55),mat(0x171717));hair.position.y=2.25;player.add(hair);
const nose=new THREE.Mesh(new THREE.ConeGeometry(.075,.18,8),skin);nose.rotation.x=Math.PI/2;nose.position.set(0,2.1,.32);player.add(nose);
const arms=[];for(const side of [-1,1]){const arm=new THREE.Mesh(new THREE.CapsuleGeometry(.14,.62,4,8),shirt);arm.position.set(side*.59,1.25,0);arm.rotation.z=side*-.12;arm.castShadow=true;player.add(arm);arms.push(arm)}
const legs=[];for(const x of [-.23,.23]){const leg=new THREE.Mesh(new THREE.CapsuleGeometry(.18,.62,4,8),trousers);leg.position.set(x,.48,0);leg.castShadow=true;player.add(leg);legs.push(leg);const shoe=new THREE.Mesh(new THREE.BoxGeometry(.27,.14,.42),shoes);shoe.position.set(x,.12,.1);player.add(shoe)}
player.position.set(0,0,8);scene.add(player);
const car=new THREE.Group();const chassis=new THREE.Mesh(new THREE.BoxGeometry(2.3,.65,4),mat(0xc13e32));chassis.position.y=.8;car.add(chassis);const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.8,.8,1.9),mat(0x8ac3d4,.35));cabin.position.set(0,1.48,-.25);car.add(cabin);for(const x of [-1,1])for(const z of [-1.3,1.3]){const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.38,.38,.22,12),mat(0x17191b));wheel.rotation.z=Math.PI/2;wheel.position.set(x,.42,z);car.add(wheel)}car.position.set(5,0,8);car.visible=true;scene.add(car);

// Ziwa na boti ya kuendesha
const water=new THREE.Mesh(new THREE.CircleGeometry(24,48),new THREE.MeshStandardMaterial({color:0x247fa2,roughness:.25,metalness:.15,transparent:true,opacity:.9}));
water.rotation.x=-Math.PI/2;water.position.set(76,.13,0);scene.add(water);
const boat=new THREE.Group();
const hull=new THREE.Mesh(new THREE.BoxGeometry(2.8,.65,6),mat(0xeeeeea,.35));hull.position.y=.45;boat.add(hull);
const bow=new THREE.Mesh(new THREE.ConeGeometry(1.4,2,4),mat(0xf2f2e8));bow.rotation.x=Math.PI/2;bow.position.set(0,.45,-3.3);boat.add(bow);
const seat=new THREE.Mesh(new THREE.BoxGeometry(1.5,.7,1.4),mat(0x354b5a));seat.position.set(0,1,-.4);boat.add(seat);
boat.position.set(76,.1,5);scene.add(boat);
const weaponShop=new THREE.Group();const shopBase=new THREE.Mesh(new THREE.BoxGeometry(7,4,6),mat(0x6d5140));shopBase.position.y=2;weaponShop.add(shopBase);const shopRoof=new THREE.Mesh(new THREE.BoxGeometry(7.5,.4,6.5),mat(0x9b3f32));shopRoof.position.y=4.2;weaponShop.add(shopRoof);weaponShop.position.set(-27,0,-28);scene.add(weaponShop);
const shopMark=new THREE.Mesh(new THREE.TorusGeometry(1,.13,8,20),mat(0xffc342));shopMark.rotation.x=Math.PI/2;shopMark.position.set(-27,.3,-28);scene.add(shopMark);
let hasWeapon=false,drivingBoat=false,boatAngle=0,projectiles=[];
const marker=new THREE.Mesh(new THREE.TorusGeometry(1.35,.16,8,24),new THREE.MeshStandardMaterial({color:0xffc342,emissive:0x9b5d00}));marker.rotation.x=Math.PI/2;marker.position.set(27,.25,-22);scene.add(marker);
const keys={};document.querySelectorAll('[data-key]').forEach(b=>{const k=b.dataset.key;const on=e=>{e.preventDefault();keys[k]=true;b.classList.add('active')};const off=e=>{e.preventDefault();keys[k]=false;b.classList.remove('active')};b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointercancel',off);b.addEventListener('pointerleave',off)});
addEventListener('keydown',e=>{if(e.key==='w'||e.key==='ArrowUp')keys.forward=true;if(e.key==='s'||e.key==='ArrowDown')keys.back=true;if(e.key==='a'||e.key==='ArrowLeft')keys.left=true;if(e.key==='d'||e.key==='ArrowRight')keys.right=true});addEventListener('keyup',e=>{keys.forward=keys.back=keys.left=keys.right=false});
let driving=false,angle=0,missionDone=false;const action=document.querySelector('#action'),mode=document.querySelector('#mode'),hint=document.querySelector('#hint');
action.onclick=()=>{if(!drivingBoat&&!driving&&player.position.distanceTo(boat.position)<5){drivingBoat=true;player.visible=false;mode.textContent='BOAT';action.textContent='EXIT';hint.textContent='Unaendesha boti. Tumia joystick kuongoza.'}else if(drivingBoat){drivingBoat=false;player.visible=true;player.position.copy(boat.position);player.position.x+=3;mode.textContent='ON FOOT';action.textContent='□'}else if(!driving&&player.position.distanceTo(car.position)<4){driving=true;player.visible=false;mode.textContent='DRIVING';action.textContent='EXIT CAR';hint.textContent='Drive to explore · Use arrows to steer'}else if(driving){driving=false;player.position.copy(car.position);player.position.x+=2.7;player.visible=true;mode.textContent='ON FOOT';action.textContent='ENTER CAR'}else hint.textContent='Walk closer to the red car to enter'};
document.querySelector('#jump').onclick=()=>{if(hasWeapon&&!driving&&!drivingBoat){const dir=new THREE.Vector3(Math.sin(player.rotation.y),0,Math.cos(player.rotation.y));const orb=new THREE.Mesh(new THREE.SphereGeometry(.13,8,8),mat(0xffc64a));orb.position.copy(player.position);orb.position.y+=1.2;scene.add(orb);projectiles.push({mesh:orb,dir,life:1.3});hint.textContent='Kitendo cha silaha ya mchezo!'}else if(!driving&&!drivingBoat)player.position.y=2.1};
document.querySelector('#exit').onclick=()=>{if(driving)action.click();else hint.textContent='Ingia kwenye gari kwa kubonyeza □ ukiwa karibu nalo.'};
document.querySelector('#interact').onclick=()=>{
 if(player.position.distanceTo(weaponShop.position)<10){document.querySelector('#weaponShop').hidden=false;return}
 if(player.position.distanceTo(boat.position)<6){hint.textContent='Bonyeza □ ili kuendesha boti.';return}
 hint.textContent='Hakuna kitu cha kuingiliana karibu nawe.'};
document.querySelector('#closeShop').onclick=()=>document.querySelector('#weaponShop').hidden=true;
document.querySelector('#buyWeapon').onclick=()=>{if(hasWeapon){hint.textContent='Tayari unamiliki kifaa hiki.';return}const cash=document.querySelector('#cash');const amount=Number(cash.textContent.replace(/[^0-9]/g,''));if(amount<300){hint.textContent='Huna fedha za kutosha. Tafuta misheni.';return}cash.textContent='
const stick=document.querySelector('#stick'),knob=document.querySelector('#knob');
let stickPointer=null;
function moveStick(e){const r=stick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const max=r.width*.32,len=Math.hypot(dx,dy);if(len>max){dx=dx/len*max;dy=dy/len*max}knob.style.transform=`translate(${dx}px,${dy}px)`;keys.left=dx < -max*.22;keys.right=dx > max*.22;keys.forward=dy < -max*.22;keys.back=dy > max*.22}
stick.addEventListener('pointerdown',e=>{e.preventDefault();stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);moveStick(e)});
stick.addEventListener('pointermove',e=>{if(e.pointerId===stickPointer)moveStick(e)});
function resetStick(){stickPointer=null;knob.style.transform='translate(0,0)';keys.left=keys.right=keys.forward=keys.back=false}
stick.addEventListener('pointerup',resetStick);stick.addEventListener('pointercancel',resetStick);
let last=0;function animate(t){requestAnimationFrame(animate);const dt=Math.min((t-last)/1000||0,.04);last=t;marker.rotation.z+=dt*1.3;const actor=drivingBoat?boat:(driving?car:player);let move=0,turn=0;if(keys.forward)move=1;if(keys.back)move=-.7;if(keys.left)turn=1;if(keys.right)turn=-1;
if(drivingBoat){boatAngle+=turn*dt*1.1;boat.rotation.y=boatAngle;boat.position.x+=Math.sin(boatAngle)*move*dt*7;boat.position.z+=Math.cos(boatAngle)*move*dt*7;boat.position.x=THREE.MathUtils.clamp(boat.position.x,54,98);boat.position.z=THREE.MathUtils.clamp(boat.position.z,-22,22)}else if(driving){angle+=turn*dt*1.8;car.rotation.y=angle;car.position.x+=Math.sin(angle)*move*dt*13;car.position.z+=Math.cos(angle)*move*dt*13}else{if(turn)player.rotation.y+=turn*dt*2.4;if(move){player.position.x+=Math.sin(player.rotation.y)*move*dt*5;player.position.z+=Math.cos(player.rotation.y)*move*dt*5;legs.forEach((l,i)=>l.rotation.x=Math.sin(t*.012+i*Math.PI)*.45)}player.position.y+=(0-player.position.y)*Math.min(1,dt*9)}
actor.position.x=THREE.MathUtils.clamp(actor.position.x,-103,103);actor.position.z=THREE.MathUtils.clamp(actor.position.z,-103,103);
const target=actor.position.clone();target.y+=driving?2.3:2.1;const offset=new THREE.Vector3(0,(driving||drivingBoat)?6:5,(driving||drivingBoat)?-10:-8).applyAxisAngle(new THREE.Vector3(0,1,0),actor.rotation.y);camera.position.lerp(target.clone().add(offset),.09);camera.lookAt(target);
if(!missionDone&&actor.position.distanceTo(marker.position)<4){missionDone=true;document.querySelector('#cash').textContent='$500';document.querySelector('#mission').innerHTML='MISSION 01 · COMPLETE<br><b>City Explorer — Reward $250</b>';hint.textContent='Mission complete! Explore the city.'}
projectiles=projectiles.filter(p=>{p.mesh.position.addScaledVector(p.dir,dt*24);p.life-=dt;if(p.life<=0){scene.remove(p.mesh);return false}return true});water.material.opacity=.82+Math.sin(t*.0015)*.08;renderer.render(scene,camera)}requestAnimationFrame(animate);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
+(amount-300);hasWeapon=true;document.querySelector('#weaponShop').hidden=true;hint.textContent='Umenunua kifaa cha mchezo. Bonyeza × kutumia.'};

const stick=document.querySelector('#stick'),knob=document.querySelector('#knob');
let stickPointer=null;
function moveStick(e){const r=stick.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let dx=e.clientX-cx,dy=e.clientY-cy;const max=r.width*.32,len=Math.hypot(dx,dy);if(len>max){dx=dx/len*max;dy=dy/len*max}knob.style.transform=`translate(${dx}px,${dy}px)`;keys.left=dx < -max*.22;keys.right=dx > max*.22;keys.forward=dy < -max*.22;keys.back=dy > max*.22}
stick.addEventListener('pointerdown',e=>{e.preventDefault();stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);moveStick(e)});
stick.addEventListener('pointermove',e=>{if(e.pointerId===stickPointer)moveStick(e)});
function resetStick(){stickPointer=null;knob.style.transform='translate(0,0)';keys.left=keys.right=keys.forward=keys.back=false}
stick.addEventListener('pointerup',resetStick);stick.addEventListener('pointercancel',resetStick);
let last=0;function animate(t){requestAnimationFrame(animate);const dt=Math.min((t-last)/1000||0,.04);last=t;marker.rotation.z+=dt*1.3;const actor=driving?car:player;let move=0,turn=0;if(keys.forward)move=1;if(keys.back)move=-.7;if(keys.left)turn=1;if(keys.right)turn=-1;
if(driving){angle+=turn*dt*1.8;car.rotation.y=angle;car.position.x+=Math.sin(angle)*move*dt*13;car.position.z+=Math.cos(angle)*move*dt*13}else{if(turn)player.rotation.y+=turn*dt*2.4;if(move){player.position.x+=Math.sin(player.rotation.y)*move*dt*5;player.position.z+=Math.cos(player.rotation.y)*move*dt*5;legs.forEach((l,i)=>l.rotation.x=Math.sin(t*.012+i*Math.PI)*.45)}player.position.y+=(0-player.position.y)*Math.min(1,dt*9)}
actor.position.x=THREE.MathUtils.clamp(actor.position.x,-103,103);actor.position.z=THREE.MathUtils.clamp(actor.position.z,-103,103);
const target=actor.position.clone();target.y+=driving?2.3:2.1;const offset=new THREE.Vector3(0,driving?6:5,driving?-10:-8).applyAxisAngle(new THREE.Vector3(0,1,0),actor.rotation.y);camera.position.lerp(target.clone().add(offset),.09);camera.lookAt(target);
if(!missionDone&&actor.position.distanceTo(marker.position)<4){missionDone=true;document.querySelector('#cash').textContent='$500';document.querySelector('#mission').innerHTML='MISSION 01 · COMPLETE<br><b>City Explorer — Reward $250</b>';hint.textContent='Mission complete! Explore the city.'}
renderer.render(scene,camera)}requestAnimationFrame(animate);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
