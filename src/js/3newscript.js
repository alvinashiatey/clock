/// right Panel
//Global variables

let THREE = require("three");
import anime from "animejs";

let container, scene, camera, renderer, mesh, mesh2, sunIsUP;
sunIsUP = false;
//initiaing function
function init() {
  container = document.querySelector("#scene-container");
  scene = new THREE.Scene();

  cameraCreated();
  rendererCreated();
  meshCreated();
  mesh2Created();
  lightCreated();

  renderer.setAnimationLoop(() => {
    updateSc();
    render();
  });
}

// Camera function
function cameraCreated() {
  //camera
  const fov = 55; //field of view
  const near = 0.1; // the near clipping plane
  const far = 100; // the far clipping plane
  const aspect = container.clientWidth / container.clientHeight;
  camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  // note every camera starts at (0x, 0y, 0z) set z to position the camera at a spot where the object can be viewed
  camera.position.set(0, 0, 10);
}

//renderer function
function rendererCreated() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  console.log(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  //gammaFactor and Output
  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  //renderer.setClearColor("#000d1a");
  container.appendChild(renderer.domElement);

  //animation is called here

  window.addEventListener("resize", () => {
    renderer.setSize(container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
  });
}

// mesh geometry funtion for moon and sun

//mesh for sun
function meshCreated() {
  const geometry = new THREE.SphereBufferGeometry(2, 20, 20);

  //settiung up texture loader
  const textureLoader = new THREE.TextureLoader();

  //loading texture
  const texture = textureLoader.load("moon.jpg");

  //texture encoding
  texture.encoding = THREE.sRGBEncoding;

  //reducing bluring at glancing angles
  texture.anisotropy = 16;

  const material = new THREE.MeshStandardMaterial({
    map: texture,
    displacementMap: texture,
    displacementScale: 0.1
  });
  mesh = new THREE.Mesh(geometry, material);

  mesh.position.set(0, 0, 0);
  scene.add(mesh);
}

//messh for sun
function mesh2Created() {
  const geometry2 = new THREE.SphereBufferGeometry(2, 20, 20);

  //settiung up texture loader
  const textureLoader2 = new THREE.TextureLoader();

  //loading texture
  const texture2 = textureLoader2.load("sun.jpg");

  //texture encoding
  texture2.encoding = THREE.sRGBEncoding;

  //reducing bluring at glancing angles
  texture2.anisotropy = 16;

  const material2 = new THREE.MeshStandardMaterial({
    map: texture2,
    displacementMap: texture2,
    displacementScale: 0.1
  });
  mesh2 = new THREE.Mesh(geometry2, material2);

  mesh2.position.set(0, 0, -10);

  scene.add(mesh2);
}

// light function
function lightCreated() {
  //creating light
  var light = new THREE.DirectionalLight(0xffffff, 0.6);

  //light position
  light.position.set(10, 10, 10);

  scene.add(light);
}

//update function
function updateSc() {
  //animating the mesh each frame

  mesh.rotation.z += 0.001;
  mesh.rotation.y += 0.005;
  mesh.rotation.x += 0.001;

  mesh2.rotation.z += 0.001;
  mesh2.rotation.y += 0.005;
  mesh2.rotation.x += 0.001;
}

//render called
function render() {
  //render , or call still image of a scene
  renderer.render(scene, camera);
}

// call to set up everythin
init();

// todo link animation to time
export let timeChange = function(hourUpdate) {
  let sceneCanvasBg, backgroundCanvas;
  sceneCanvasBg = document.querySelector("#scene-container");
  backgroundCanvas = [
    "skyblue",
    "#0059b3",
    "#004d99",
    "#001a33",
    "#000d1a",
    "#02020b"
  ];

  var tl = anime.timeline({
    duration: 5000,
    easing: "cubicBezier(0.405, 0.005, 0.35, 1)"
  });

  function sunUP() {
    mesh2.position.set(0, -8, 0);
    //animating thr sun living
    tl.add({
      targets: mesh.position,
      keyframes: [{ y: 0 }, { y: 9 }]
    })
      // animating sun rising
      .add(
        {
          targets: mesh2.position,
          keyframes: [{ y: -1 }, { y: 0 }]
        },
        "-=1"
      );
    sunIsUP = true;
  }

  function moonUp() {
    mesh.position.set(0, -8, 0);
    mesh2.position.set(0, 0, 0);
    tl.add({
      targets: mesh2.position,
      keyframes: [{ y: 0 }, { y: 9 }]
    }).add(
      {
        targets: mesh.position,
        keyframes: [{ y: -1 }, { y: 0 }]
      },
      "-=1"
    );
    sunIsUP = false;
  }

  if (hourUpdate >= 6 && hourUpdate <= 10) {
    if (!sunIsUP) {
      sceneCanvasBg.style.backgroundColor = backgroundCanvas[0];
      sunUP();
    }
  } else if (hourUpdate >= 11 && hourUpdate <= 13) {
    if (!sunIsUP) {
      //mesh2.position.set(0, 0, 1);
      sunUP();
      sunIsUP = true;
    }
    sceneCanvasBg.style.backgroundColor = backgroundCanvas[1];
  } else if (hourUpdate >= 14 && hourUpdate <= 17) {
    if (!sunIsUP) {
      //mesh2.position.set(0, 0, 1);
      sunUP();
      sunIsUP = true;
    }
    sceneCanvasBg.style.backgroundColor = backgroundCanvas[2];
  } else if (hourUpdate >= 18 && hourUpdate <= 20) {
    if (sunIsUP) {
      // animating sunsetting
      moonUp();
    }
    sceneCanvasBg.style.backgroundColor = backgroundCanvas[3];
  } else if (hourUpdate >= 20 && hourUpdate <= 23) {
    sceneCanvasBg.style.backgroundColor = backgroundCanvas[4];
    if (sunIsUP) {
      // animating sunsetting
      moonUp();
    }
  } else {
    sceneCanvasBg.style.backgroundColor = backgroundCanvas[5];
    if (sunIsUP) {
      // animating sunsetting
      moonUp();
    }
  }
};
