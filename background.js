// Initialize WebGL background
const initWebGLBackground = () => {
  const canvas = document.getElementById('webgl-background');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 1000;

  // Create particles with custom geometry
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCnt = 10000;
  const posArray = new Float32Array(particlesCnt * 3);
  const colorsArray = new Float32Array(particlesCnt * 3);
  const originalPositions = new Float32Array(particlesCnt * 3);
  const velocities = new Float32Array(particlesCnt * 3);
  
  for(let i = 0; i < particlesCnt * 3; i += 3) {
    // Create a spherical distribution of particles
    const radius = Math.random() * 800 + 200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    posArray[i] = x;
    posArray[i + 1] = y;
    posArray[i + 2] = z;
    
    // Store original positions for animation
    originalPositions[i] = x;
    originalPositions[i + 1] = y;
    originalPositions[i + 2] = z;

    // Initialize velocities
    velocities[i] = 0;
    velocities[i + 1] = 0;
    velocities[i + 2] = 0;

    // Set the RGB color (219, 74, 43)
    colorsArray[i] = 219/255; // R
    colorsArray[i + 1] = 74/255; // G
    colorsArray[i + 2] = 43/255; // B
  }
  
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

  // Create particle material
  const particlesMaterial = new THREE.PointsMaterial({
    size: 2.5,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
  });

  // Create particle system
  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Mouse interaction
  const mouse = new THREE.Vector2();
  const mouseSphere = new THREE.Vector3();
  let mouseStrength = 0;
  let prevMouseX = 0;
  let prevMouseY = 0;
  let mouseSpeed = 0;
  
  document.addEventListener('mousemove', (event) => {
    // Update mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Calculate mouse speed
    const dx = event.clientX - prevMouseX;
    const dy = event.clientY - prevMouseY;
    mouseSpeed = Math.sqrt(dx * dx + dy * dy) * 0.1;
    
    // Update previous position
    prevMouseX = event.clientX;
    prevMouseY = event.clientY;
    
    // Project mouse position to 3D space
    mouseSphere.set(
      mouse.x * 1000,
      mouse.y * 1000,
      0
    );
    
    // Increase mouse strength based on speed
    mouseStrength = Math.min(mouseSpeed, 2);
  });

  // Animation
  const clock = new THREE.Clock();
  
  const animate = () => {
    const elapsedTime = clock.getElapsedTime();
    const positions = particlesGeometry.attributes.position.array;
    const damping = 0.95; // Velocity damping factor
    
    // Animate particles
    for(let i = 0; i < positions.length; i += 3) {
      // Get current position
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Calculate distance to mouse
      const distanceToMouse = Math.sqrt(
        Math.pow(x - mouseSphere.x, 2) +
        Math.pow(y - mouseSphere.y, 2) +
        Math.pow(z - mouseSphere.z, 2)
      );
      
      // Apply repulsion force
      if (distanceToMouse < 400) {
        const force = (1 - distanceToMouse / 400) * mouseStrength * 80;
        velocities[i] += (x - mouseSphere.x) * force * 0.0015;
        velocities[i + 1] += (y - mouseSphere.y) * force * 0.0015;
        velocities[i + 2] += (z - mouseSphere.z) * force * 0.0015;
      }
      
      // Apply velocity
      positions[i] += velocities[i];
      positions[i + 1] += velocities[i + 1];
      positions[i + 2] += velocities[i + 2];
      
      // Apply spring force back to original position
      const springForce = 0.02;
      velocities[i] += (originalPositions[i] - positions[i]) * springForce;
      velocities[i + 1] += (originalPositions[i + 1] - positions[i + 1]) * springForce;
      velocities[i + 2] += (originalPositions[i + 2] - positions[i + 2]) * springForce;
      
      // Apply damping to velocity
      velocities[i] *= damping;
      velocities[i + 1] *= damping;
      velocities[i + 2] *= damping;
    }
    
    // Decay mouse strength
    mouseStrength *= 0.95;
    
    // Update geometry
    particlesGeometry.attributes.position.needsUpdate = true;
    
    // Gentle rotation of the entire particle system
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = Math.sin(elapsedTime * 0.03) * 0.1;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  };

  animate();

  // Handle resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', initWebGLBackground);