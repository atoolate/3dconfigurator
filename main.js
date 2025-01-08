import * as THREE from 'three';
import {
    GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
    DRACOLoader
} from 'three/examples/jsm/loaders/DRACOLoader.js'; // Import DRACOLoader
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls';
import {
    FontLoader
} from 'three/examples/jsm/loaders/FontLoader.js';
import {
    TextGeometry
} from 'three/examples/jsm/geometries/TextGeometry.js';
import gsap from 'gsap'; // Import gsap
// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(4, 2, 0); // Adjust initial camera position

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true; // Enable shadow maps
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadow map

// Append the renderer to the container
const container = document.getElementById('configurator-container');
container.appendChild(renderer.domElement);

// Update renderer size to fit the container
function updateRendererSize() {
    const {
        clientWidth,
        clientHeight
    } = container;
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
    color: 0x0000ff, // Blue color
    transparent: true,
    opacity: 0.35 // Adjust opacity as needed
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

// Handle window resize
window.addEventListener('resize', updateRendererSize);
updateRendererSize(); // Initial size setup

// Add point light
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(1, 8, 2);
pointLight.castShadow = true; // Enable shadows for the point light
scene.add(pointLight);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 1, 0);
directionalLight.castShadow = true; // Enable shadows for the directional light
scene.add(directionalLight);

// Setup GLTFLoader and DRACOLoader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/'); // Draco decoder path

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Variable to store the shoe model
let shoeModel = null;

// Parts of the shoe that can be customized
const parts = ['select_part', 'laces', 'outside_1', 'outside_2', 'outside_3', 'inside', 'sole_bottom', 'sole_top'];
let currentPartIndex = 0;

// Store selected colors for each part
const selectedColors = {};
const selectedFabrics = {};

// Initialize default values
parts.forEach(partName => {
    selectedColors[partName] = '#ffffff'; // Default color is white
    selectedFabrics[partName] = 'none'; // No fabric selected
});

// Define camera positions and targets for each part
const cameraPositions = {
    select_part: {
        position: {
            x: 7,
            y: 2,
            z: 0
        },
        target: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    sole_top: {
        position: {
            x: -6,
            y: 0,
            z: 2
        },
        target: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    outside_1: {
        position: {
            x: -6,
            y: 2,
            z: 2
        },
        target: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    outside_2: {
        position: {
            x: 6,
            y: 2,
            z: 2
        },
        target: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    outside_3: {
        position: {
            x: 4.2,
            y: 3,
            z: 1
        },
        target: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    inside: {
        position: {
            x: 1,
            y: 7.5,
            z: -0.2
        },
        target: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    sole_bottom: {
        position: {
            x: 0,
            y: -3,
            z: -4
        },
        target: {
            x: 0,
            y: 0,
            z: 0
        }
    },
    laces: {
        position: {
            x: 0,
            y: 5,
            z: 4
        },
        target: {
            x: 0,
            y: 0,
            z: 0
        }
    } // Adjusted z position for better view
};

// Mapping of internal part names to display names
const partDisplayNames = {
    select_part: 'Select Part',
    laces: 'Laces',
    outside_1: 'Outside 1',
    outside_2: 'Outside 2',
    outside_3: 'Outside 3',
    inside: 'Inside',
    sole_bottom: 'Sole Bottom',
    sole_top: 'Sole Top'
};

// Load GLTF/GLB model
gltfLoader.load('/models/shoe.glb', (gltf) => {
    shoeModel = gltf.scene;

    shoeModel.traverse((child) => {
        if (child.isMesh) {
            child.material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.4
            });
            child.castShadow = true; // Enable shadows for the shoe parts
            child.receiveShadow = true; // Enable shadows for the shoe parts
        }
    });

    // Ensure the model's position and scale are correctly set
    shoeModel.position.set(0, 0, 0);
    shoeModel.scale.set(12, 12, 12);

    scene.add(shoeModel);

});
// function add 

// Load and set the environment map as the scene background
const loader = new THREE.TextureLoader();
loader.load('/path/to/env-map.jpg', (texture) => {
    scene.background = texture;
});

// Camera setup
camera.position.set(6, 1, 4); // Adjust initial camera position

// OrbitControls setup for camera manipulation
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.enableZoom = true;
controls.minDistance = 3; // Minimum zoom distance
controls.maxDistance = 10; // Maximum zoom distance


// GUI controls for shoe model and camera


// Create a showcase platform
const platformGeometry = new THREE.CylinderGeometry(4, 5, 5, 32);
const platformMaterial = new THREE.MeshStandardMaterial({
    color: 0x000000
});
const platform = new THREE.Mesh(platformGeometry, platformMaterial);
platform.position.set(0, -3.5, 0); // Position the platform below the shoe
platform.receiveShadow = true; // Enable shadows for the platform
scene.add(platform);

// Add logo on top of the platform
const logoTexture = textureLoader.load('/logo/swear-logo-square-white.png'); // Replace with the correct path to your logo image
const logoMaterial = new THREE.MeshBasicMaterial({
    map: logoTexture,
    color: 0xffffff,
    transparent: true
});
const logoGeometry = new THREE.PlaneGeometry(4, 4); // Adjust size as needed
const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
logoMesh.position.set(0, -0.9, 0); // Position the logo above the platform
logoMesh.rotation.x = -Math.PI / 2; // Rotate the logo to lay flat on the platform
logoMesh.receiveShadow = true; // Enable shadows for the logo
scene.add(logoMesh);


// Event listeners for buttons in .configurator-optioninitials
// Get the input field and buttons
const initialsInput = document.getElementById('initials');
const addInitialsButton = document.getElementById('add-initials-button');
const initialsButton = document.getElementById('initials-button');
const initialsInputDiv = document.querySelector('.initials-input');

// Show the initials input div when the "Add Initials" button is clicked
initialsButton.addEventListener('click', () => {
    //zoom to ccamera position
    gsap.to(camera.position, {
        duration: 1.5,
        x: 0,
        y: 1,
        z: -4,
        ease: "power2.inOut",
    });
    initialsInputDiv.style.display = 'flex';
    document.querySelector('.color-palette').style.display = 'none';
    document.querySelector('.fabric-palette').style.display = 'none';
});

// Add event listener to the "Add Initials" button
addInitialsButton.addEventListener('click', () => {
    const initials = initialsInput.value;
    if (initials) {
        addInitialsTotextArea(initials);
    } else {
        alert('Please enter your Engraving of choice.');
    }
});


// Event listeners for buttons in .configurator-option
document.querySelectorAll('.configurator-option button').forEach(button => {
    button.addEventListener('click', (event) => {
        if (event.target.id !== 'randomizer-button') {
            document.querySelectorAll('.configurator-option button').forEach(btn => btn.classList.remove('selected'));
            event.target.classList.add('selected');
        }

        if (event.target.id === 'color-button') {
            document.querySelector('.color-palette').style.display = 'flex';
            document.querySelector('.fabric-palette').style.display = 'none';
            initialsInputDiv.style.display = 'none';
        } else if (event.target.id === 'fabric-button') {
            document.querySelector('.fabric-palette').style.display = 'flex';
            document.querySelector('.color-palette').style.display = 'none';
            initialsInputDiv.style.display = 'none';
        } else if (event.target.id === 'initials-button') {
            initialsInputDiv.style.display = 'flex';
            document.querySelector('.color-palette').style.display = 'none';
            document.querySelector('.fabric-palette').style.display = 'none';
        }
    });
});

const fabricTextures = {
    'corduroy': {
        color: '/public/models/images/fabric/corduroy/Fabric022_2K-JPG_Color.jpg',
        roughness: 'public/models/images/fabric/corduroy/Fabric022_2K-JPG_Roughness.jpg',
        normal: 'public/models/images/fabric/corduroy/Fabric022_2K-JPG_NormalGL.jpg'
    },
    'leather': {
        color: 'public/models/images/fabric/leather/Leather030_1K-JPG_Color.jpg',
        roughness: 'public/models/images/fabric/leather/Leather030_1K-JPG_Roughness.jpg',
        normal: 'public/models/images/fabric/leather/Leather030_1K-JPG_NormalGL.jpg',
    },
    'denim': {
        color: 'public/models/images/fabric/denim/Fabric069_1K-JPG_Color.jpg',
        roughness: 'public/models/images/fabric/denim/Fabric069_1K-JPG_Roughness.jpg',
        normal: 'public/models/images/fabric/denim/Fabric069_1K-JPG_NormalGL.jpg'
    },
    'vegan-leather': {
        color: '/public/models/images/fabric/vegan-leather/Leather008_2K-JPG_Color.jpg',
        roughness: '/public/models/images/fabric/vegan-leather/Leather008_2K-JPG_Roughness.jpg',
        normal: '/public/models/images/fabric/vegan-leather/Leather008_2K-JPG_NormalGL.jpg'
    }
};
let notificationTimeout;

function showNotification(message) {
    // Check if a notification is already displayed
    if (document.querySelector('.notification')) {
        return;
    }

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    notificationTimeout = setTimeout(() => {
        notification.remove();
        notificationTimeout = null;
    }, 2000); // Remove notification after 2 seconds
}

// Event listeners for color items
document.querySelectorAll('.color-item').forEach(item => {
    item.addEventListener('click', () => {
        if (parts[currentPartIndex] === 'select_part') {
            showNotification('Psst! Select a part first.');
            return;
        }
        const color = item.getAttribute('data-color');
        const partName = parts[currentPartIndex];
        selectedColors[partName] = color; // Store the selected color
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

// Event listeners for fabric items
document.querySelectorAll('.fabric-item').forEach(item => {
    item.addEventListener('click', () => {
        if (parts[currentPartIndex] === 'select_part') {
            showNotification('Psst! Select a part first.');
            return;
        }
        const fabric = item.getAttribute('data-fabric');
        const partName = parts[currentPartIndex];
        if (shoeModel) {
            shoeModel.traverse((child) => {
                if (child.isMesh && child.name === partName) {
                    if (fabric === 'none') {
                        child.material.map = null; // Remove the texture
                    } else {
                        const fabricTexture = textureLoader.load(`/public/models/images/fabric/${fabric}.jpg`);
                        child.material.map = fabricTexture;
                    }
                    child.material.color.set(selectedColors[partName] || 0xffffff); // Reapply the selected color or default to white
                    child.material.needsUpdate = true;
                }
            });
        }
        document.querySelectorAll('.fabric-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
    });
});

// Event listeners for color items
document.querySelectorAll('.color-item').forEach(item => {
    item.addEventListener('click', () => {
        const color = item.getAttribute('data-color');
        const partName = parts[currentPartIndex];
        selectedColors[partName] = color; // Store the selected color
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

// Event listeners for fabric items
document.querySelectorAll('.fabric-item').forEach(item => {
    item.addEventListener('click', () => {
        const fabric = item.getAttribute('data-fabric');
        const partName = parts[currentPartIndex];
        if (shoeModel) {
            shoeModel.traverse((child) => {
                if (child.isMesh && child.name === partName) {
                    if (fabric === 'none') {
                        child.material.map = null; // Remove the texture
                    } else {
                        const fabricTexture = textureLoader.load(`/public/models/images/fabric/${fabric}.jpg`);
                        child.material.map = fabricTexture;
                    }
                    child.material.needsUpdate = true;
                }
            });
        }
        document.querySelectorAll('.fabric-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
    });
});

// Event listener for randomizer button
document.getElementById('randomizer-button').addEventListener('click', () => {
    parts.forEach(partName => {
        // Randomly select a color
        const randomColorItem = document.querySelectorAll('.color-item')[Math.floor(Math.random() * document.querySelectorAll('.color-item').length)];
        const randomColor = randomColorItem.getAttribute('data-color');
        selectedColors[partName] = randomColor;

        // Randomly select a fabric
        const randomFabricItem = document.querySelectorAll('.fabric-item')[Math.floor(Math.random() * document.querySelectorAll('.fabric-item').length)];
        const randomFabric = randomFabricItem.getAttribute('data-fabric');
        selectedFabrics[partName] = randomFabric;

        // Apply random color and fabric to the part
        if (shoeModel) {
            shoeModel.traverse((child) => {
                if (child.isMesh && child.name === partName) {
                    child.material.color.set(randomColor);
                    if (randomFabric === 'none') {
                        child.material.map = null; // Remove the texture
                    } else {
                        const fabricTexture = textureLoader.load(`/public/models/images/fabric/${randomFabric}.jpg`);
                        child.material.map = fabricTexture;
                    }
                    child.material.needsUpdate = true;
                }
            });
        }
    });

    // Highlight the selected color and fabric for the current part
    highlightSelectedColorAndFabric(currentPartName);
       // Remove the "selected" class from the randomizer button
       document.getElementById('randomizer-button').classList.remove('selected');
});

// Raycaster setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Event listener for mouse movement
window.addEventListener('mousemove', onMouseMove);

function onMouseMove(event) {
    const rect = container.getBoundingClientRect();
    // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

// Add this code after the existing mousemove event listener
window.addEventListener('click', onClick);

let currentPartName = parts[currentPartIndex]; // Initialize with the first part

function onClick(event) {
    // Update the raycaster with the current mouse position
    raycaster.setFromCamera(mouse, camera);

    // Calculate objects intersecting the raycaster
    const intersects = raycaster.intersectObjects(shoeModel.children, true);

    if (intersects.length > 0) {
        const intersectedPart = intersects[0].object.name;
        selectPart(intersectedPart);
        zoomToPart(intersectedPart);
    }
}

// Function to select a part and update the UI
function selectPart(partName) {
    const partNameElement = document.getElementById('part-name');
    const displayName = partDisplayNames[partName] || partName;
    partNameElement.textContent = displayName.toUpperCase(); // Update the part name in the UI to caps

    // Update the currentPartIndex and currentPartName based on the selected part
    currentPartIndex = parts.indexOf(partName);
    currentPartName = partName;

    // Update the color and fabric options based on the selected part
    updateColorPalette(partName);
    updateFabricPalette(partName);

    // Highlight the selected color and fabric for the selected part
    highlightSelectedColorAndFabric(partName);
}

// Function to highlight the selected color and fabric for the selected part
function highlightSelectedColorAndFabric(partName) {
    const selectedColor = selectedColors[partName];
    const selectedFabric = selectedFabrics[partName];

    document.querySelectorAll('.color-item').forEach(item => {
        item.classList.remove('selected');
        if (item.getAttribute('data-color') === selectedColor) {
            item.classList.add('selected');
        }
    });

    document.querySelectorAll('.fabric-item').forEach(item => {
        item.classList.remove('selected');
        if (item.getAttribute('data-fabric') === selectedFabric) {
            item.classList.add('selected');
        }
    });
}

// Function to change the color of the selected part
function changeColor(partName, color) {
    const part = shoeModel.getObjectByName(partName);
    if (part && part.material) {
        part.material.color.set(color); // Set the base color
        selectedColors[partName] = color; // Store the selected color

        if (selectedFabrics[partName] && selectedFabrics[partName] !== 'none') {
            const fabricTexture = fabricTextures[selectedFabrics[partName]];
            const textureLoader = new THREE.TextureLoader();

            // Load textures
            part.material.map = textureLoader.load(fabricTexture.color);
            part.material.roughnessMap = textureLoader.load(fabricTexture.roughness);
            part.material.normalMap = textureLoader.load(fabricTexture.normal);

            // Blend base color with texture
            part.material.color.set(color).multiplyScalar(0.8); // Adjust brightness if needed
        }

        part.material.needsUpdate = true;
        highlightSelectedColorAndFabric(partName); // Highlight the selected color
    }
}

// Function to change the fabric of the selected part
function changeFabric(partName, fabricName) {
    const part = shoeModel.getObjectByName(partName);
    if (part && part.material) {
        const textureLoader = new THREE.TextureLoader();

        if (fabricName === 'none') {
            part.material.map = null; // Remove textures
            part.material.roughnessMap = null;
            part.material.normalMap = null;

            // Ensure base color is visible
            part.material.color.set(selectedColors[partName] || '#ffffff');
        } else {
            const fabricTexture = fabricTextures[fabricName];

            // Load textures
            const colorMap = textureLoader.load(fabricTexture.color);
            const roughnessMap = textureLoader.load(fabricTexture.roughness);
            const normalMap = textureLoader.load(fabricTexture.normal);

            part.material.map = colorMap;
            part.material.roughnessMap = roughnessMap;
            part.material.normalMap = normalMap;

            // Blend base color with texture
            part.material.color.set(selectedColors[partName] || '#ffffff').multiplyScalar(0.8);
        }

        part.material.needsUpdate = true;
        selectedFabrics[partName] = fabricName; // Store the selected fabric
        highlightSelectedColorAndFabric(partName); // Highlight the selected fabric
    }
}

// Function to update the color palette based on the selected part
function updateColorPalette(partName) {
    // Example implementation: update the color palette UI
    const colorPalette = document.querySelector('.color-palette');
    colorPalette.innerHTML = ''; // Clear existing colors

    // Add new colors for the selected part (example colors)
    const colors = ['#fce4ec', '#f50057', '#d50000', '#ff5722', '#ffeb3b', '#ffffff', '#8bc34a', '#009688', '#03a9f4', '#673ab7', '#000000'];
    colors.forEach(color => {
        const colorItem = document.createElement('div');
        colorItem.className = 'color-item';
        colorItem.style.backgroundColor = color;
        colorItem.dataset.color = color;
        colorItem.addEventListener('click', () => changeColor(partName, color));
        colorPalette.appendChild(colorItem);
    });
}

// Function to update the fabric palette based on the selected part
function updateFabricPalette(partName) {
    const fabricPalette = document.querySelector('.fabric-palette');
    fabricPalette.innerHTML = ''; // Clear existing fabrics

    const fabrics = [{
            name: 'none',
            image: '',
            color: '#cccccc'
        },
        {
            name: 'corduroy',
            image: fabricTextures['corduroy'].color
        },
        {
            name: 'leather',
            image: fabricTextures['leather'].color
        },
        {
            name: 'denim',
            image: fabricTextures['denim'].color
        },
        {
            name: 'vegan-leather',
            image: fabricTextures['vegan-leather'].color
        }
    ];

    fabrics.forEach(fabric => {
        const fabricItem = document.createElement('div');
        fabricItem.className = 'fabric-item';
        if (fabric.image) {
            fabricItem.style.backgroundImage = `url(${fabric.image})`;
        } else {
            fabricItem.style.backgroundColor = fabric.color;
        }
        fabricItem.dataset.fabric = fabric.name;
        fabricItem.addEventListener('click', () => changeFabric(partName, fabric.name));
        fabricPalette.appendChild(fabricItem);
    });
}

// Update the animate function to ensure only one part is highlighted at a time
function animate() {
    controls.update();

    if (shoeModel) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(shoeModel.children, true);

        // Reset all parts to their original color
        shoeModel.traverse((child) => {
            if (child.isMesh && child.material.emissive) {
                child.material.emissive.setHex(0x000000);
            }
        });

        // Highlight the first intersected part
        if (intersects.length > 0 && intersects[0].object.material.emissive) {
            intersects[0].object.material.emissive.setHex(0x00ff00); // Green color with low opacity
            intersects[0].object.material.emissiveIntensity = 0.1; // Lower opacity
        }
    }

    renderer.render(scene, camera);
}

// Update the zoomToPart function to handle part names correctly
function zoomToPart(partName) {
    const cameraPosition = cameraPositions[partName];
    if (cameraPosition) {
        gsap.to(camera.position, {
            duration: 1.5,
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

// Start animation loop
renderer.setAnimationLoop(animate);

// Event listeners for part selector buttons
document.getElementById('prev-part-button').addEventListener('click', () => {
    currentPartIndex = (currentPartIndex - 1 + parts.length) % parts.length;
    currentPartName = parts[currentPartIndex];
    selectPart(currentPartName);
    zoomToPart(currentPartName);
});

document.getElementById('next-part-button').addEventListener('click', () => {
    currentPartIndex = (currentPartIndex + 1) % parts.length;
    currentPartName = parts[currentPartIndex];
    selectPart(currentPartName);
    zoomToPart(currentPartName);
});

// Event listeners for color items
document.querySelectorAll('.color-item').forEach(item => {
    item.addEventListener('click', () => {
        if (currentPartName === 'select_part') {
            showNotification('Psst! Select a part first.');
            return;
        }
        const color = item.getAttribute('data-color');
        selectedColors[currentPartName] = color; // Store the selected color
        if (shoeModel) {
            shoeModel.traverse((child) => {
                if (child.name === currentPartName) {
                    child.material.color.set(color);
                }
            });
        }
        document.querySelectorAll('.color-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
    });
});

// Event listeners for fabric items
document.querySelectorAll('.fabric-item').forEach(item => {
    item.addEventListener('click', () => {
        if (currentPartName === 'select_part') {
            showNotification('Psst! Select a part first.');
            return;
        }
        const fabric = item.getAttribute('data-fabric');
        if (shoeModel) {
            shoeModel.traverse((child) => {
                if (child.name === currentPartName) {
                    if (fabric === 'none') {
                        child.material.map = null; // Remove the texture
                    } else {
                        const textureLoader = new THREE.TextureLoader();
                        const fabricTexture = textureLoader.load(`/public/models/images/fabric/${fabric}.jpg`);
                        child.material.map = fabricTexture;
                    }
                    child.material.needsUpdate = true;
                }
            });
        }
        document.querySelectorAll('.fabric-item').forEach(i => i.classList.remove('selected'));
        item.classList.add('selected');
    });
});

// Event listener for randomizer button
document.getElementById('randomizer-button').addEventListener('click', () => {
    parts.forEach(partName => {
        // Randomly select a color
        const randomColorItem = document.querySelectorAll('.color-item')[Math.floor(Math.random() * document.querySelectorAll('.color-item').length)];
        const randomColor = randomColorItem.getAttribute('data-color');
        selectedColors[partName] = randomColor;

        // Randomly select a fabric
        const randomFabricItem = document.querySelectorAll('.fabric-item')[Math.floor(Math.random() * document.querySelectorAll('.fabric-item').length)];
        const randomFabric = randomFabricItem.getAttribute('data-fabric');
        selectedFabrics[partName] = randomFabric;

        // Apply random color and fabric to the part
        if (shoeModel) {
            shoeModel.traverse((child) => {
                if (child.isMesh && child.name === partName) {
                    const textureLoader = new THREE.TextureLoader();
                    if (randomFabric === 'none') {
                        child.material.map = null; // Remove the texture
                        child.material.roughnessMap = null;
                        child.material.normalMap = null;
                        child.material.color.set(randomColor); // Set the random color
                    } else {
                        const fabricTexture = fabricTextures[randomFabric];
                        child.material.map = textureLoader.load(fabricTexture.color);
                        child.material.roughnessMap = textureLoader.load(fabricTexture.roughness);
                        child.material.normalMap = textureLoader.load(fabricTexture.normal);
                        child.material.color.set('#ffffff'); // Ensure the base color is white

                        // Reapply the selected color
                        if (randomColor !== '#ffffff') {
                            child.material.color.set(randomColor);
                        }
                    }
                    child.material.needsUpdate = true;
                }
            });
        }
    });

    // Highlight the selected color and fabric for the current part
    highlightSelectedColorAndFabric(currentPartName);
});


// Add event listener for order button
const orderButton = document.getElementById('order-button');
orderButton.addEventListener('click', () => {
    alert('Order placed');
});