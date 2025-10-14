console.clear();
gsap.registerPlugin(ScrollTrigger);

/* ---------------- ROTATING HERO WORD ---------------- */
const stage = document.querySelector(".stage");
const tubeInner = document.querySelector(".tube__inner");
const clone = document.getElementsByClassName("line");
const navbar = document.querySelector(".navbar");

const numLines = 10;
const angle = 360 / numLines;
let radius = 0;
let origin = 0;

function set3D() {
    const width = window.innerWidth;
    const fontSizePx = width * 0.08;
    radius = (fontSizePx / 2) / Math.sin((180 / numLines) * (Math.PI / 180));
    origin = `50% 50% -${radius}px`;
}

function cloneNode() {
    for (let i = 0; i < numLines - 1; i++) {
        let newClone = clone[0].cloneNode(true);
        newClone.classList.add("line--" + (i + 2));
        tubeInner.appendChild(newClone);
    }
    clone[0].classList.add("line--1");
}

function positionTxt() {
    gsap.set(".line", {
        rotationX: (i) => -angle * i,
        z: radius,
        transformOrigin: origin
    });
}

function setProps(targets) {
    targets.forEach((target) => {
        let degrees = gsap.getProperty(target, "rotateX");
        let radians = degrees * (Math.PI / 180);
        let conversion = Math.abs(Math.cos(radians) / 2 + 0.5);
        let fontW = 200 + 700 * conversion;
        gsap.set(target, {
            opacity: conversion + 0.1,
            fontWeight: fontW
        });
    });
}

function scrollRotate() {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: ".stage",
            start: "top top",
            end: "bottom top",
            scrub: 1,
            pin: window.innerWidth > 768,
            onUpdate: (self) => {
                if (self.progress > 0.2) navbar.classList.add("visible");
            }
        }
    });

    tl.to(".line", {
        rotateX: "+=1440",
        ease: "power2.inOut",
        onUpdate: function () { setProps(this.targets()) }
    }).to(".tube__inner", {
        scale: 0.25,
        yPercent: -250,
        ease: "power2.inOut"
    }, "<");
}

/* ---------------- PREMIUM CARDS ---------------- */
function animateCards() {
const cards = gsap.utils.toArray('.card-inner');

cards.forEach((card) => {
    const front = card.querySelector('.card-front');
    const back = card.querySelector('.card-back');

    gsap.set(card.parentElement, { perspective: 1000 });
    gsap.set(card, { transformStyle: "preserve-3d" });
    gsap.set(back, { rotationY: 180 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: card.parentElement,
            start: "top 75%",
            end: "top 25%",
            toggleActions: "play reverse play reverse",
            scrub: 0.5
        }
    });

    tl.fromTo(card,
        { rotationY: 0, z: 0 },
        { rotationY: 180, z: 50, duration: 1.4, ease: "power3.inOut" }
    );

    tl.to(front, { filter: "brightness(0.7)", duration: 0.3 }, 0.1);
    tl.to(back, { filter: "brightness(1)", duration: 0.3 }, 0.6);
    tl.fromTo(card, { rotationX: 3 }, { rotationX: -3, duration: 1.4, ease: "sine.inOut", yoyo: true }, 0);
});
}

/* ---------------- INIT ---------------- */
function init() {
    cloneNode();
    set3D();
    positionTxt();
    setProps(gsap.utils.toArray(".line"));
    scrollRotate();
    animateCards();
    gsap.to(stage, { autoAlpha: 1, duration: 1.5, delay: 1 });

    window.onresize = () => {
        set3D();
        positionTxt();
    };
}

window.onload = init;
