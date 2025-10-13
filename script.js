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
cards.forEach((card)=>{
  gsap.timeline({
    scrollTrigger:{
      trigger: card.parentElement,
      start: "top 80%",
      end: "top 30%",
      toggleActions: "play reverse play reverse"
    }
  })
  .fromTo(card,
    {rotationY:0},
    {rotationY:180, duration:1, ease:"power2.inOut"}
  )
  .to(card.querySelectorAll('.card-front, .card-back'), {
    filter: "brightness(0.6)",
    duration:0.3,
    yoyo:true,
    repeat:1,
    ease:"power1.inOut"
  }, 0.3);
});
