let THREE = require("three");
import anime from "animejs";

let sunContainer,
  sunScene,
  sunCamera,
  sunRenderer,
  sunMesh,
  sunMesh2,
  sunTexture,
  sunTextureLoader,
  sunTextureLoader2,
  sunTexture2;

let localDate = new Date();
let localHour = localDate.getHours();

function startSun() {
  sunContainer = document.querySelector("#sun-container");
  sunScene = new THREE.Scene();

  sunCameraCreated();
  sunRendereCreated();
  sunMeshCreated();
  setBackgroundColor();
  //   sunControlsCreated();
  sunLightCreated();

  sunRenderer.setAnimationLoop(() => {
    animateSun();
    renderSun();
  });
}

// sunCameraCreated function
function sunCameraCreated() {
  const fv = 55;
  const aspct = sunContainer.clientWidth / sunContainer.clientHeight;
  const nr = 0.1;
  const fr = 100;
  sunCamera = new THREE.PerspectiveCamera(fv, aspct, nr, fr);
  sunCamera.position.set(0, 0, 10);
}

//renderer function created
function sunRendereCreated() {
  sunRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  sunRenderer.setSize(sunContainer.clientWidth, sunContainer.clientHeight);
  sunRenderer.setPixelRatio(window.devicePixelRatio);

  //set the gamm and engine corrections
  sunRenderer.gammaFactor = 2.2;
  sunRenderer.gammaOutput = true;
  sunRenderer.physicallyCorrectLights = true;

  sunContainer.appendChild(sunRenderer.domElement);

  //resize animation when window size changes
  window.addEventListener("resize", () => {
    sunRenderer.setSize(sunContainer.clientWidth, sunContainer.clientHeight);
    sunCamera.aspect = sunContainer.clientWidth / sunContainer.clientHeight;
    sunCamera.updateProjectionMatrix();
  });
}

//sunMesh Function
function sunMeshCreated() {
  const sunGeometry2 = new THREE.SphereBufferGeometry(2, 20, 20);

  // load sun texture
  sunTextureLoader2 = new THREE.TextureLoader();
  sunTexture2 = sunTextureLoader2.load("moon.jpg");

  //encoding
  sunTexture2.encoding = THREE.sRGBEncoding;
  sunTexture2.anisotropy = 16;

  //Material and coloring of obj
  const sunMaterial2 = new THREE.MeshStandardMaterial({
    map: sunTexture2,
    displacementMap: sunTexture2,
    displacementScale: 0.1
  });

  const sunGeometry = new THREE.SphereBufferGeometry(2, 20, 20);

  // load sun texture
  sunTextureLoader = new THREE.TextureLoader();
  sunTexture = sunTextureLoader.load("sun.jpg");

  //encoding
  sunTexture.encoding = THREE.sRGBEncoding;
  sunTexture.anisotropy = 16;

  //Material and coloring of obj
  const sunMaterial = new THREE.MeshStandardMaterial({
    map: sunTexture,
    displacementMap: sunTexture,
    displacementScale: 0.1
  });

  //creating the object by combining the geometry and material
  sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
  sunMesh2 = new THREE.Mesh(sunGeometry2, sunMaterial2);

  sunMesh2.position.set(0, 0, -200);

  sunMesh.position.set(0, 0, 0);

  sunScene.add(sunMesh);
  sunScene.add(sunMesh2);
}

// sun Light Created
function sunLightCreated() {
  //light
  const sunLight = new THREE.DirectionalLight(0xffffff, 4);
  sunLight.position.set(10, 10, 10);
  sunScene.add(sunLight);

  const sunLightAmbient = new THREE.AmbientLight(0xaaaaaa, 0.5);
  sunScene.add(sunLightAmbient);
}

//animated
function animateSun() {
  //test

  sunMesh2.rotation.x -= 0.002;
  sunMesh2.rotation.y -= 0.002;
  sunMesh2.rotation.z -= 0.002;

  //   const localDate = new Date();

  //   const localHour = localDate.getHours();
  if (localHour >= 6 && localHour <= 18) {
    sunMesh.rotation.x -= 0.002;
    sunMesh.rotation.y -= 0.002;
    sunMesh.rotation.z -= 0.002;
  } else {
    sunMesh2.rotation.x -= 0.001;
    sunMesh2.rotation.y -= 0.001;
    sunMesh2.rotation.z -= 0.001;
  }
}

function setBackgroundColor() {
  let sunCanvasBg, backgroundCanvas;
  sunCanvasBg = document.querySelector("#sun-container");
  backgroundCanvas = [
    "skyblue",
    "#0059b3",
    "#004d99",
    "#001a33",
    "#000d1a",
    "#02020b"
  ];

  if (localHour >= 6 && localHour <= 10) {
    sunCanvasBg.style.backgroundColor = "skyblue";
    sunMesh.position.set(0, -8, 0);
    anime({
      targets: sunMesh.position,
      keyframes: [{ y: -1 }, { y: 0 }],
      delay: -10,
      duration: 10000,
      easing: "cubicBezier(0.405, 0.005, 0.35, 1)"
    });
  } else if (localHour >= 11 && localHour <= 13) {
    sunCanvasBg.style.backgroundColor = backgroundCanvas[1];
  } else if (localHour >= 14 && localHour <= 17) {
    sunCanvasBg.style.backgroundColor = backgroundCanvas[2];
  } else if (localHour >= 18 && localHour <= 23) {
    sunCanvasBg.style.backgroundColor = backgroundCanvas[4];
    anime({
      targets: sunMesh.position,
      keyframes: [{ y: 0 }, { y: 9 }],
      delay: 0,
      duration: 10000,
      easing: "cubicBezier(0.405, 0.005, 0.35, 1)"
    });
    anime({
      targets: sunMesh2.position,
      keyframes: [{ z: -200 }, { z: 0 }],
      delay: 0,
      duration: 15000,
      easing: "cubicBezier(0.405, 0.005, 0.35, 1)"
    });
  } else {
    sunCanvasBg.style.backgroundColor = backgroundCanvas[5];
    sunMesh2.position.set(0, 0, 0);
    sunMesh.position.set(0, 0, -200);
    sunMesh2.rotation.x -= 0.002;
    sunMesh2.rotation.y -= 0.002;
    sunMesh2.rotation.z -= 0.002;
  }
}

//Renderer
function renderSun() {
  sunRenderer.render(sunScene, sunCamera);
}

//  call the sun
startSun();
