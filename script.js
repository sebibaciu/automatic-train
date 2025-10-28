gsap.registerPlugin(ScrollTrigger);

// Rainbow scroll speed (smooth subtle acceleration)
let baseSpeed = 50;
let maxBoost = 25;
let scrollTimeout;

window.addEventListener('scroll', () => {
  const scrollFactor = Math.min(window.scrollY / 500, 1);
  const currentSpeed = baseSpeed - scrollFactor * maxBoost;
  document.body.style.setProperty('--rainbow-speed', currentSpeed + 's');

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    document.body.style.setProperty('--rainbow-speed', baseSpeed + 's');
  }, 1000);
});

// Card flip animation
function animateCards() {
  const cards = document.querySelectorAll('.card-inner');
  cards.forEach(card => {
    gsap.set(card, { transformStyle: "preserve-3d" });
    const back = card.querySelector('.card-back');
    gsap.set(back, { rotationY: 180 });
    gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        end: "top 15%",
        scrub: 0.5,
      }
    }).to(card, { rotationY: 180, ease: "power1.inOut", duration: 1 });
  });
}
window.addEventListener('load', animateCards);

// Logo parallax
const logo = document.querySelector('.logo-section img');
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 40;
  const y = (e.clientY / window.innerHeight - 0.5) * 40;
  const rz = (e.clientX / window.innerWidth - 0.5) * 15;
  logo.style.transform = `translate(${x}px, ${y}px) rotateZ(${rz}deg) scale(1.02)`;
});

// Companies slider seamless loop
const slider = document.querySelector('.companies-slider');
const logos = Array.from(slider.children);
const sliderWidth = slider.offsetWidth;
let totalWidth = 0;
logos.forEach(logo => totalWidth += logo.offsetWidth + 40);
let i = 0;
while (slider.scrollWidth < sliderWidth * 2) {
  const clone = logos[i % logos.length].cloneNode(true);
  slider.appendChild(clone);
  i++;
}

// GSAP horizontal scroll
gsap.to(".companies-slider", {
  xPercent: -50,
  repeat: -1,
  ease: "linear",
  duration: 20
});
