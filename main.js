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
gltfLoader.load(
    '/models/shoe.glb', // Make sure this path is correct relative to your server root
    (gltf) => {
        console.log('Model loaded successfully:', gltf);
        shoeModel = gltf.scene;

        // Change material to standard white (.map)
        shoeModel.traverse((child) => {
            if (child.isMesh) {
                child.material = new THREE.MeshStandardMaterial({ color: 0xffffff });
                child.name = 'shoe'; // Name the shoe for identification
            }
        });

        shoeModel.position.set(0, 0, 0); // Adjust position if needed
        //scale 15
        shoeModel.scale.set(15, 15, 15); // Adjust scale if needed

        scene.add(shoeModel);

        // Now that the model is loaded, you can safely add controls for it
        initGUI();
    },
    (xhr) => {
        console.log(`Loading model: ${(xhr.loaded / xhr.total) * 100}% loaded`);
    },
    (error) => {
        console.error('An error occurred while loading the model:', error);
    }
);

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

  

    // Add controls to rotate the shoe
    shoeFolder.add(shoeModel.rotation, 'x', 0, Math.PI * 2).name('Rotation X');
    shoeFolder.add(shoeModel.rotation, 'y', 0, Math.PI * 2).name('Rotation Y');
    shoeFolder.add(shoeModel.rotation, 'z', 0, Math.PI * 2).name('Rotation Z');
    shoeFolder.open();
}

// Animation loop
function animate() {
    controls.update();
    renderer.render(scene, camera);
}

// Start animation loop
renderer.setAnimationLoop(animate);
