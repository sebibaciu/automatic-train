gsap.registerPlugin(ScrollTrigger);

window.addEventListener('DOMContentLoaded', () => {
  const stage = document.querySelector('.stage');
  const tubeInner = document.querySelector(".tube__inner");
  const originalLine = tubeInner.querySelector(".line");
  const navbar = document.querySelector('.navbar');
  const logo = document.querySelector('.logo');

  const numLines = 10;
  const angle = 360 / numLines;
  let radius = 0;

  // --- Setup Cylinder ---
  function setupCylinder() {
    const fontSizePx = window.innerWidth * 0.1;
    radius = (fontSizePx/2)/Math.sin((Math.PI/180)*(angle/2));

    tubeInner.innerHTML = '';
    for(let i=0;i<numLines;i++){
      const clone = originalLine.cloneNode(true);
      clone.style.position = 'absolute';
      clone.style.top = '50%';
      clone.style.left = '50%';
      clone.style.transformOrigin = `50% 50% -${radius}px`;
      clone.style.transform = `rotateX(${-angle*i}deg) translateZ(${radius}px) translate(-50%, -50%)`;
      tubeInner.appendChild(clone);
    }
  }

  setupCylinder();
  window.addEventListener('resize', setupCylinder);

  function updateProps(targets){
    targets.forEach(target => {
      let deg = gsap.getProperty(target, "rotateX");
      let conv = Math.abs(Math.cos(deg*(Math.PI/180))/2 + 0.5);
      gsap.set(target, {
        opacity: conv+0.1,
        fontWeight: 400 + 300*conv
      });
    });
  }

  // --- Timeline: rotation + shrink ---
  const cylinderTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: '.cylinder-section',
      start: "top top",
      end: "bottom top",
      scrub: 1,
      pin: window.innerWidth > 768, // pin only on tablet/desktop
      onUpdate: self => {
        if(self.progress > 0.85) navbar.classList.add('visible');
      }
    }
  });

  cylinderTimeline.to('.line', { 
    rotateX: "+=1080", 
    ease: "power2.inOut", 
    onUpdate: function(){ updateProps(this.targets()); } 
  })
  .to('.tube__inner', { 
    scale: 0.25, 
    yPercent: -200, 
    ease: "power2.inOut" 
  }, "<");

  // --- Cards ---
  const cards = gsap.utils.toArray('.card-inner');

  cards.forEach(card => {
    const front = card.querySelector('.card-front');
    const back = card.querySelector('.card-back');

    gsap.timeline({
      scrollTrigger: {
        trigger: card.parentElement,
        start: "top 85%",
        end: "top 30%",
        scrub: 0.4
      }
    })
    .to(card, { rotationY: 180, scale: 1.05, ease: "power1.inOut" })
    .to([front, back], { boxShadow: "0 20px 60px rgba(0,0,0,0.6)", filter: "brightness(0.7)", ease: "power1.inOut" }, 0);

    // Disable hover on touch devices
    if (!('ontouchstart' in window)) {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, { rotationY: card._gsap?.rotationY + 5 || 5, rotationX: 3, scale: 1.02, duration: 0.3, ease: "power1.out" });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotationY: card._gsap?.rotationY || 0, rotationX: 0, scale: 1, duration: 0.3, ease: "power1.out" });
      });
    }
  });
});
