gsap.registerPlugin(ScrollTrigger);

// Hero fade-in on load
gsap.from(".hero-content", {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power2.out"
});

// Projects: Stagger animation on scroll
gsap.from(".project-card", {
    scrollTrigger: {
        trigger: "#projects",
        start: "top 80%",
        toggleActions: "play none none reverse"
    },
    opacity: 0,
    y: 100,
    duration: 0.8,
    stagger: 0.2, // Animate cards one by one
    ease: "back.out(1.7)"
});

// Parallax for about section
gsap.to("#about", {
    scrollTrigger: {
        trigger: "#about",
        start: "top bottom",
        end: "bottom top",
        scrub: true // Smooth scroll-linked
    },
    yPercent: -50 // Parallax shift
});

// Pin hero content briefly
ScrollTrigger.create({
    trigger: "#hero",
    start: "top top",
    end: "bottom top",
    pin: ".hero-content",
    pinSpacing: false
});