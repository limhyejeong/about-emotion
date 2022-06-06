import { OrbitControls } from "./controls/OrbitControls.js";
import { PreventDragClick } from './js/PreventDragClick.js';

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Renderer
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('canvas'), antialias: true });
// renderer.setClearColor(0xffffff);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);

// 텍스쳐 이미지 로드
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log('로드 시작');
}
loadingManager.onProgress = img => {
  console.log(img + ' 로드');
}
loadingManager.onLoad = () => {
  console.log('로드 완료');
}
loadingManager.onError = () => {
  console.log('에러');
}

const textureLoader = new THREE.TextureLoader(loadingManager);
const waterBaseColor = textureLoader.load("./textures/water/Water_002_COLOR.jpg");
const waterNormalMap = textureLoader.load("./textures/water/Water_002_NORM.jpg");
const waterHeightMap = textureLoader.load("./textures/water/Water_002_DISP.png");
const waterRoughness = textureLoader.load("./textures/water/Water_002_ROUGH.jpg");
const waterAmbientOcclusion = textureLoader.load("./textures/water/Water_002_OCC.jpg");

// const texture = textureLoader.load('./textures/Obsidian_001_normal.jpg');
// const texture2 = textureLoader.load('./textures/gradient.jpeg');


// Scene
const scene = new THREE.Scene();

//camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 1, 5);
// scene.add(camera);


// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;



// boxGeometry
const starGeometry = new THREE.IcosahedronGeometry(0.3, 0);
const starMaterial = new THREE.MeshNormalMaterial();

// sphereGeometry
const sphereGeometry = new THREE.SphereGeometry(1, 128, 128);
const sphereMaterial = new THREE.MeshNormalMaterial();

// PLANE
const geometry = new THREE.SphereGeometry(1, 128, 128);
// const geometry = new THREE.BoxGeometry(1, 1, 1); // 박스
// const geometry = new THREE.CapsuleGeometry(1, 1, 4, 8); // 강낭콩
// const geometry = new THREE.ConeGeometry( 5, 20, 32 ); // 원뿔
// const geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
// const geometry = new THREE.DodecahedronGeometry(1, 1); //
// const geometry = new THREE.BoxGeometry( 100, 100, 100 );
// const geometry = new THREE.IcosahedronGeometry(1, 0)
// const geometry = new THREE.OctahedronGeometry(1, 0) // 다이아몬드
// const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 ); //도넛
// const geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 ); //구불구불

const sphere = new THREE.Mesh(geometry,
    new THREE.MeshStandardMaterial({
        map: waterBaseColor,
        normalMap: waterNormalMap,
        displacementMap: waterHeightMap, displacementScale: 0.01,
        roughnessMap: waterRoughness, roughness: 0,
        aoMap: waterAmbientOcclusion
    }));
sphere.receiveShadow = true;
sphere.castShadow = true;
sphere.rotation.x = - Math.PI / 4;
sphere.position.z = - 30;
scene.add(sphere);


// const tex = {
//   clearcoat: 1.0, // 클리어코드 재질 (코팅)
//   cleacoatRoughness: 0.1, // 
//   metalness: 0.9, // 금속성
//   roughness: 0.5,
//   color: 'blue',
//   normalMap: texture2,
//   normalScale: new THREE.Vector2(0.15, 0.15),
//   // envMap: envmap.texture
// }
// let sphereMaterial2 = new THREE.MeshPhongMaterial(tex);

// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial2);
sphere.position.x = (Math.random() - 0.5) * 5;
sphere.position.y = (Math.random() - 0.5) * 5;
sphere.position.z = (Math.random() - 0.5) * 5;
let scale = 0.3;
sphere.scale.set(scale, scale, scale);
scene.add(sphere);



// 트윈
let currPosition = 1;

const tweenCamera = (camera, position, duration) => {
  currPosition = currPosition === 0 ? 1 : 0;

  // 카메라 시점
  new TWEEN.Tween(controls.target).to({
    x: sphere.position.x + 0.5,
    y: sphere.position.y,
    z: sphere.position.z
  }, duration)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();

  // 카메라 위치
  new TWEEN.Tween(camera.position).to({
    x: position[0],
    y: position[1],
    z: position[2] + 1
  }, duration)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .start();

  console.log("TWEEN", currPosition)
}
// 



for (let i = 0; i < 200; i++) {
  const box = new THREE.Mesh(starGeometry, starMaterial);

  box.position.x = (Math.random() - 0.5) * 10;
  box.position.y = (Math.random() - 0.5) * 10;
  box.position.z = (Math.random() - 0.5) * 10;

  box.rotation.x = Math.random() * Math.PI;
  box.rotation.y = Math.random() * Math.PI;

  const scale = Math.random();
  box.scale.set(scale, scale, scale);

  scene.add(box);
}

// Light
const light = new THREE.SpotLight(0xffffff, 1);
light.position.set(200, 200, 200);
// light.castShadow = true;
scene.add(light);

// AMBIENT LIGHT
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
// DIRECTIONAL LIGHT
const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
dirLight.position.x += 20
dirLight.position.y += 20
dirLight.position.z += 20
dirLight.castShadow = true
dirLight.shadow.mapSize.width = 4096;
dirLight.shadow.mapSize.height = 4096;
const d = 10;
dirLight.shadow.camera.left = - d;
dirLight.shadow.camera.right = d;
dirLight.shadow.camera.top = d;
dirLight.shadow.camera.bottom = - d;
dirLight.position.z = -25;

let target = new THREE.Object3D();
target.position.z = -30;
dirLight.target = target;
dirLight.target.updateMatrixWorld();

dirLight.shadow.camera.lookAt(0, 0, -30);
scene.add(dirLight);


let k = 2;
let m = 0.1;

// 노이즈 
const update = function () {
  let time = performance.now() * 0.003;

  if (currPosition == 1 ) {
    k = 0;
    m = 0;
  } else { 
    k = 2;
    m = 0.1;
  }

  for (let i = 0; i < geometry.vertices.length; i++) {
    let p = geometry.vertices[i];
    p.normalize().multiplyScalar(1 + m * noise.perlin3(p.x * k + time, p.y * k, p.z * k));
  }
  geometry.computeVertexNormals();
  geometry.normalsNeedUpdate = true;
  geometry.verticesNeedUpdate = true;

  render();
}


// Animate
const animate = () => {
  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  controls.update();

  TWEEN.update();

  update();

  render();
  window.requestAnimationFrame(animate);
};




const render = () => {
  controls.update();
  renderer.render(scene, camera);
}



window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});



// let position;

const positions = [
  [camera.position.x, camera.position.y, camera.position.z],
  [sphere.position.x, sphere.position.y, sphere.position.z]
];

// const aspects = [
//   [controls.target.x, controls.target.y, controls.target.z],
//   [sphere.position.x+2, sphere.position.y, sphere.position.z]
// ];



canvas.addEventListener('click', () => {
  if (preventDragClick.mouseMoved) return;

  // camera.aspect = sphere.position.x / sphere.position.y;
  // controls.target.copy(sphere.position)

  tweenCamera(camera, positions[currPosition], 2000);

  update();
})

const preventDragClick = new PreventDragClick(canvas);

animate();
