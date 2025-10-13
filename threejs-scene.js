// Wait for DOM and Three.js to load
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("three-canvas");
    if (!canvas) {
        console.error("Canvas not found!");
        return;
    }

    console.log("Three.js initializing...");

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        canvas: canvas, 
        alpha: true, // Transparent background
        antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Fully transparent

    // Simple rotating cube (green wireframe)
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ 
        color: 0x00ff00, 
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    camera.position.z = 5;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();

    // Handle window resize
    window.addEventListener("resize", () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    console.log("Three.js scene running - cube should be spinning!");
});

// Optional: For loading a GLTF model (uncomment and add local GLTFLoader.js)
// Download GLTFLoader.js and add <script src="GLTFLoader.js"></script> to index.html after three.min.js
// Then in this file, after scene setup:
// const loader = new THREE.GLTFLoader();
// loader.load('assets/model.glb', (gltf) => {
//     scene.add(gltf.scene);
//     gltf.scene.scale.set(2, 2, 2);
//     gltf.scene.position.set(0, 0, 0);
//     console.log("Model loaded!");
// }, undefined, (error) => {
//     console.error("Model load error:", error);
// });