gsap.registerPlugin(ScrollTrigger);

const heroWord = document.querySelector(".hero-word");
const navbar = document.querySelector(".navbar");
const logo = navbar.querySelector(".logo");

// Sync navbar logo text
logo.textContent = heroWord.textContent;

// Pin the hero wrapper so word stays in place initially
ScrollTrigger.create({
  trigger: ".hero-wrapper",
  start: "top top",
  end: "+=100%",
  pin: true,
  pinSpacing: false
});

// Animate hero word to shrink and move into navbar
gsap.to(heroWord, {
  scrollTrigger: {
    trigger: ".hero-wrapper",
    start: "top top",
    end: "bottom top",
    scrub: true
  },
  scale: 0.15,              // shrink
  yPercent: -250,           // move to top
  xPercent: -50,            // slightly move left
  letterSpacing: "2px",
  transformOrigin: "center center",
  ease: "power1.inOut"
});

// Fade in navbar only after word reaches the top
ScrollTrigger.create({
  trigger: ".hero-wrapper",
  start: "top top+=50%",
  onEnter: () => navbar.classList.add("visible"),
  onLeaveBack: () => navbar.classList.remove("visible")
});


// --- Flip Cards ---
const cards = gsap.utils.toArray('.card-inner');

cards.forEach(card => {
  const front = card.querySelector('.card-front');
  const back = card.querySelector('.card-back');

  // Create a timeline for the card tied to scroll
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: card.parentElement,
      start: "top 80%",
      end: "top 30%",
      scrub: 0.3
    }
  });

  // Hinge-style flip with mid-flip rotation
  tl.to(card, { rotationX: 12, scale: 1.05, ease: "power1.inOut" })      // slight hinge
    .to(card, { rotationY: 90, ease: "power2.inOut" })                   // mid-flip
    .to(card, { rotationY: 180, rotationX: 0, ease: "back.out(0.6)" });  // complete flip

  // Shadow + brightness animation
  tl.to([front, back], { boxShadow: "0 20px 60px rgba(0,0,0,0.6)", filter: "brightness(0.7)", ease: "power1.inOut" }, 0);

  // Hover tilt (single listener per card)
  card.addEventListener('mouseenter', () => {
    gsap.to(card, { rotationY: card._gsap?.rotationY || 0 + 5, rotationX: 3, scale: 1.02, duration: 0.3, ease: "power1.out" });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(card, { rotationY: card._gsap?.rotationY || 0, rotationX: 0, scale: 1, duration: 0.3, ease: "power1.out" });
  });
});
