import * as THREE from 'three';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as dat from 'dat.gui'; // Import dat.GUI
import gsap from 'gsap'; // Import gsap

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add point light
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(1, 8, 2);
scene.add(pointLight);

// add directional light
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

// Load GLTF/GLB model
gltfLoader.load('/models/shoe.glb', (gltf) => {
    shoeModel = gltf.scene;
    
    shoeModel.traverse((child) => {
        if (child.isMesh) {
            // Check the name of the part and set the color accordingly
            switch (child.name) {
                case 'laces':
                    child.material.color.set(0xff0000); // Red for laces
                    break;
                case 'outside_1':
                case 'outside_2':
                case 'outside_3':
                    child.material.color.set(0x0000ff); // Blue for outside parts
                    break;
                case 'sole_bottom':
                    child.material.color.set(0x00ff00); // Green for sole bottom
                    break;
                case 'sole_top':
                    child.material.color.set(0xffff00); // Yellow for sole top
                    break;
                default:
                    child.material.color.set(0xffffff); // Default white for other parts
                    break;
            }
        }
    });

    scene.add(shoeModel);
    
    // Now that the model is loaded, we can initialize the GUI
    initGUI();
});

// Camera setup
camera.position.y = 12;
camera.position.z = 5;
camera.position.x = 0;

// OrbitControls setup for camera manipulation
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;

// GUI controls for shoe model
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
}

// Animation loop
function animate() {
    controls.update();
    renderer.render(scene, camera);
}

// Start animation loop
renderer.setAnimationLoop(animate);
