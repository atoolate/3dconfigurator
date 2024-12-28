import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui'; // Import dat.GUI
import gsap from 'gsap'; // Import gsap

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 2, 0); // Adjust initial camera position

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });

// Append the renderer to the container
const container = document.getElementById('configurator-container');
container.appendChild(renderer.domElement);

// Update renderer size to fit the container
function updateRendererSize() {
    const { clientWidth, clientHeight } = container;
    renderer.setSize(clientWidth, clientHeight);
    camera.aspect = clientWidth / clientHeight;
    camera.updateProjectionMatrix();
}
// Create a sphere geometry for the environment map
const sphereGeometry = new THREE.SphereGeometry(500, 60, 40);
sphereGeometry.scale(-1, 1, 1); // Invert the sphere to make the texture appear inside

// Load the environment map texture
const textureLoader = new THREE.TextureLoader();
const environmentMap = textureLoader.load('models/images/enviroment/metal.jpg');

// Create a material for the sphere with the environment map
const sphereMaterial = new THREE.MeshBasicMaterial({ 
    map: environmentMap,
    color: 0x00ff00, // Green color
    transparent: true,
    opacity: 0.4 // Adjust opacity as needed
});
// Add smoke to the scene
const smokeTexture = textureLoader.load('models/images/enviroment/fart07.png');
const smokeMaterial = new THREE.MeshBasicMaterial({
    map: smokeTexture,
    transparent: true,
    opacity: 0.2,
    blending: THREE.AdditiveBlending, // Use additive blending to avoid black background
    depthWrite: false // Disable depth write to avoid depth issues
});
const smokeGeometry = new THREE.PlaneGeometry(10, 10);

// Create multiple smoke meshes around the shoe
const smokeMeshes = [];
const smokePositions = [
    { x: 0, y: 0, z: -5 },
    { x: 5, y: 5, z: 5 },
    { x: -5, y: 5, z: 5 },
    { x: 0, y: -5, z: 5 }
];

smokePositions.forEach(pos => {
    const smokeMesh = new THREE.Mesh(smokeGeometry, smokeMaterial);
    smokeMesh.position.set(pos.x, pos.y, pos.z);
    scene.add(smokeMesh);
    smokeMeshes.push(smokeMesh);
});

// Create the sphere mesh and add it to the scene
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

// Rotate the sphere
function rotateSphere() {
    sphere.rotation.y += 0.001; // Adjust the rotation speed as needed
    requestAnimationFrame(rotateSphere);
}
rotateSphere();

// Animate the smoke
function animateSmoke() {
    smokeMeshes.forEach(smokeMesh => {
        smokeMesh.position.y += 0.01; // Adjust the speed and direction as needed
        if (smokeMesh.position.y > 10) {
            smokeMesh.position.y = -10; // Reset position if it goes too high
        }
        // Make the smoke always face the camera
        smokeMesh.lookAt(camera.position);
    });
    requestAnimationFrame(animateSmoke);
}
animateSmoke();

// Handle window resize
window.addEventListener('resize', updateRendererSize);
updateRendererSize(); // Initial size setup

// Add point light
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(1, 8, 2);
scene.add(pointLight);
// add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 0);
scene.add(directionalLight);

// Setup DRACOLoader and GLTFLoader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/'); // Draco decoder path
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Variable to store the shoe model
let shoeModel = null;

// Parts of the shoe that can be customized
const parts = ['laces', 'outside_1', 'outside_2', 'outside_3', 'inside', 'sole_bottom', 'sole_top'];
let currentPartIndex = 0;

// Define camera positions and targets for each part
const cameraPositions = {
    sole_top: { position: { x: 6, y: 0, z: -2 }, target: { x: 0, y: 0, z: 0 } },
    outside_1: { position: { x: 6, y: 2, z:-2 }, target: { x: 0, y: 0, z: 0} },
    outside_2: { position: { x: -6, y: 2, z:-2 }, target: { x: 0, y: 0, z: 0 } },
    outside_3: { position: { x: 0, y: 2, z: -6 }, target: { x: 0, y: 0, z: 0 } },
    inside: { position: { x: 0, y: 5, z: 6 }, target: { x: 0, y: 0, z: 0 } },
    sole_bottom: { position: { x: 0, y: -5, z: 3 }, target: { x: 0, y: 2, z: -1 } },
    laces: { position: { x: 0, y: 5, z: 4 }, target: { x: 0, y: 0, z: 0 } } // Adjusted z position for better view
};

function zoomToPart(partName) {
    const cameraPosition = cameraPositions[partName];
    if (cameraPosition) {
        gsap.to(camera.position, {
            duration: 1.,
            x: cameraPosition.position.x,
            y: cameraPosition.position.y,
            z: cameraPosition.position.z,
            ease: "power2.inOut",
            onUpdate: () => {
                camera.lookAt(new THREE.Vector3(cameraPosition.target.x, cameraPosition.target.y, cameraPosition.target.z));
                controls.target.set(cameraPosition.target.x, cameraPosition.target.y, cameraPosition.target.z);
            }
        });
    }
}


// Load GLTF/GLB model
gltfLoader.load('/models/shoe.glb', (gltf) => {
    shoeModel = gltf.scene;
    
    shoeModel.traverse((child) => {
        if (child.isMesh) {
            child.material.color.set(0xffffff); // Set all parts to white
        }
    });

    scene.add(shoeModel);
    // Scale the model
    shoeModel.scale.set(15, 15, 15);
    
    // Now that the model is loaded, we can initialize the GUI
    initGUI();
});

// Load environment model
gltfLoader.load('/models/environment.glb', (gltf) => {
    const environment = gltf.scene;
    scene.add(environment);
});

// Load and set the environment map as the scene background
const loader = new THREE.TextureLoader();
loader.load('/path/to/env-map.jpg', (texture) => {
    scene.background = texture;
});

// Camera setup
camera.position.set(5, 2, 0); // Adjust initial camera position

// OrbitControls setup for camera manipulation
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;

// GUI controls for shoe model and camera
function initGUI() {
    if (!shoeModel) return; // Ensure shoeModel is loaded before initializing GUI

    const gui = new dat.GUI();
    const shoeFolder = gui.addFolder('Shoe Model');
    const shoeMaterial = { color: 0xffffff, roughness: 0.5, metalness: 0.5 };

    // Add controls to change color
    shoeFolder.addColor(shoeMaterial, 'color').onChange((color) => {
        if (shoeModel) {
            shoeModel.traverse((child) => {
                if (child.isMesh) {
                    child.material.color.set(color);
                }
            });
        }
    });

    // Add controls to change roughness and metalness
    shoeFolder.add(shoeMaterial, 'roughness', 0, 1).onChange((value) => {
        if (shoeModel) {
            shoeModel.traverse((child) => {
                if (child.isMesh) {
                    child.material.roughness = value;
                }
            });
        }
    });

    shoeFolder.add(shoeMaterial, 'metalness', 0, 1).onChange((value) => {
        if (shoeModel) {
            shoeModel.traverse((child) => {
                if (child.isMesh) {
                    child.material.metalness = value;
                }
            });
        }
    });

    // Add controls to change shoe position
    shoeFolder.add(shoeModel.position, 'x', -10, 10).name('Position X');
    shoeFolder.add(shoeModel.position, 'y', -10, 10).name('Position Y');
    shoeFolder.add(shoeModel.position, 'z', -10, 10).name('Position Z');

    shoeFolder.open();

    // Add controls to change camera position
    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(camera.position, 'x', -10, 10).name('Camera X');
    cameraFolder.add(camera.position, 'y', -10, 10).name('Camera Y');
    cameraFolder.add(camera.position, 'z', -10, 10).name('Camera Z');
    cameraFolder.open();
}

// Event listeners for buttons in .configurator-option
document.querySelectorAll('.configurator-option button').forEach(button => {
    button.addEventListener('click', (event) => {
        document.querySelectorAll('.configurator-option button').forEach(btn => btn.classList.remove('selected'));
        event.target.classList.add('selected');

        if (event.target.id === 'color-button') {
            document.querySelector('.color-palette').style.display = 'flex';
        } else {
            document.querySelector('.color-palette').style.display = 'none';
        }
    });
});

// Event listeners for color items
document.querySelectorAll('.color-item').forEach(item => {
    item.addEventListener('click', () => {
        const color = item.getAttribute('data-color');
        const partName = parts[currentPartIndex];
        if (shoeModel) {
            shoeModel.traverse((child) => {
                if (child.isMesh && child.name === partName) {
                    child.material.color.set(color);
                }
            });
        }
        document.querySelectorAll('.color-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
    });
});

// Event listeners for part selector
document.getElementById('prev-part-button').addEventListener('click', () => {
    currentPartIndex = (currentPartIndex - 1 + parts.length) % parts.length;
    updatePartSelector();
});
// Event listeners for part selector
document.getElementById('next-part-button').addEventListener('click', () => {
    currentPartIndex = (currentPartIndex + 1) % parts.length;
    updatePartSelector();
});
// Update part selector
function updatePartSelector() {
    const partName = parts[currentPartIndex];
    document.getElementById('part-name').textContent = partName.replace('_', ' ').toUpperCase();
    console.log('Selected part:', partName); // Debugging: log selected part
    zoomToPart(partName);
}

// change part color by clicking the color

// Animation loop
function animate() {
    controls.update();
    renderer.render(scene, camera);
}

// Start animation loop
renderer.setAnimationLoop(animate);