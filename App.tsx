
import React, { useEffect, useRef } from 'react';

declare const gsap: any;
declare const ScrollTrigger: any;

const App: React.FC = () => {
  const logoRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // --- Scroll Progress ---
    const scrollListener = () => {
      const scrollProgress = document.querySelector('.scroll-progress') as HTMLElement;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = (scrollTop / scrollHeight) * 100;
      if(scrollProgress) scrollProgress.style.width = progress + '%';
    };
    window.addEventListener('scroll', scrollListener);

    // --- Logo Parallax ---
    const xTo = gsap.quickTo(logoRef.current, "x", { duration: 1, ease: "power3.out" });
    const yTo = gsap.quickTo(logoRef.current, "y", { duration: 1, ease: "power3.out" });
    const rotTo = gsap.quickTo(logoRef.current, "rotationZ", { duration: 1.2, ease: "power3.out" });

    const logoMoveListener = (e: MouseEvent) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 40;
        const y = (e.clientY / window.innerHeight - 0.5) * 40;
        xTo(x);
        yTo(y);
        rotTo(x * 0.1);
    };
    document.addEventListener('mousemove', logoMoveListener);
    
    // --- GSAP Animations ---

    // Parallax orbs
    gsap.utils.toArray('.orb').forEach((orb: any, i: number) => {
      gsap.to(orb, {
        scrollTrigger: {
          trigger: 'body',
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        },
        y: (i + 1) * 150,
        rotation: (i % 2 === 0 ? 360 : -360),
        ease: 'none'
      });
    });

    // Section reveals
    gsap.from('.middle-section h2', { scrollTrigger: { trigger: '.middle-section', start: 'top 75%' }, y: 60, opacity: 0, duration: 1.2, ease: 'power3.out' });
    gsap.from('.middle-section p', { scrollTrigger: { trigger: '.middle-section', start: 'top 75%' }, y: 40, opacity: 0, duration: 1, delay: 0.3, ease: 'power3.out' });
    gsap.from('.companies-section h2', { scrollTrigger: { trigger: '.companies-section', start: 'top 80%' }, y: 50, opacity: 0, duration: 1, ease: 'power3.out' });

    // Card animations
    gsap.utils.toArray('.card').forEach((card: any, i: number) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 60%',
          toggleActions: 'play none none reverse'
        },
        y: 100,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        delay: i * 0.15
      });

      ScrollTrigger.create({
        trigger: card,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: () => card.classList.add('flipped'),
        onLeaveBack: () => card.classList.remove('flipped')
      });

      // Card 3D tilt
      const cardInner = card.querySelector('.card-inner');
      const cardMouseMove = (e: MouseEvent) => {
        if (card.classList.contains('flipped')) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        cardInner.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      };
      const cardMouseLeave = () => {
        if (card.classList.contains('flipped')) {
          cardInner.style.transform = 'rotateY(180deg)';
        } else {
          cardInner.style.transform = 'rotateX(0) rotateY(0) scale(1)';
        }
      };
      card.addEventListener('mousemove', cardMouseMove);
      card.addEventListener('mouseleave', cardMouseLeave);
    });
    
    // Cleanup function
    return () => {
      document.removeEventListener('mousemove', logoMoveListener);
      window.removeEventListener('scroll', scrollListener);
      ScrollTrigger.getAll().forEach((st: any) => st.kill());
    };
  }, []);

  const companies = [
    { name: "Suzuki", src: "https://upload.wikimedia.org/wikipedia/commons/e/ee/Suzuki_logo_2025_%28vertical%29.svg" },
    { name: "KIA", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/KIA_logo3.svg/2560px-KIA_logo3.svg.png" },
    { name: "MG", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/MG_Motor_2021_logo.svg/1200px-MG_Motor_2021_logo.svg.png" },
    { name: "Peugeot", src: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9d/Peugeot_2021_Logo.svg/1095px-Peugeot_2021_Logo.svg.png" },
    { name: "Geely", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Geely_logo.svg/2560px-Geely_logo.svg.png" },
  ];

  return (
    <>
      <div className="scroll-progress fixed top-0 left-0 h-0.5 z-50 bg-gradient-to-r from-[rgba(138,43,226,0.8)] to-[rgba(220,20,60,0.8)] transition-all duration-100 ease-linear"></div>

      <div className="logo-section min-h-screen flex items-center justify-center relative p-5">
        <div className="logo-container relative w-full max-w-6xl">
          <img ref={logoRef} src="https://raw.githubusercontent.com/sebibaciu/automatic-train/refs/heads/main/Logoarc2-2JQmkxo5Y2lx7ejC_nXVUg.png" alt="ARC Digital Logo" className="w-full logo-chromatic" />
        </div>
      </div>

      <div className="middle-section py-48 px-5 max-w-7xl mx-auto text-center relative">
        <h2 className="font-['Roboto_Slab'] text-[clamp(3rem,8vw,5.5rem)] font-bold mb-10 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tighter leading-tight">Digital solutions for your business</h2>
        <p className="text-[clamp(1.1rem,2vw,1.5rem)] text-gray-400 tracking-widest font-light relative inline-block">contact@arcdigital.ro</p>
      </div>

      <div id="services" className="cards-section py-36 px-5 pb-72 max-w-[1600px] mx-auto">
        <div className="cards-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-[1400px] mx-auto">
          
          <div className="card group relative h-[550px] md:h-[450px] lg:h-[550px] [perspective:2000px]">
            <div className="card-glow absolute -inset-0.5 bg-gradient-to-br from-[rgba(138,43,226,0.4)] to-[rgba(220,20,60,0.4)] rounded-[30px] opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-0 filter blur-xl"></div>
            <div className="card-inner relative w-full h-full [transform-style:preserve-3d] transition-transform duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]">
              <div className="card-front absolute w-full h-full rounded-[30px] [backface-visibility:hidden] overflow-hidden bg-cover bg-center" style={{backgroundImage: "url('https://raw.githubusercontent.com/sebibaciu/automatic-train/refs/heads/main/1.png')"}}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10 transition-opacity duration-500 group-hover:opacity-90"></div>
                <div className="card-front-content absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-20">
                  <div className="card-number absolute top-8 right-10 text-8xl font-bold text-white/10 leading-none font-['Roboto_Slab']">01</div>
                  <h3 className="text-4xl font-bold tracking-tight">Branding & Identity</h3>
                </div>
              </div>
              <div className="card-back absolute w-full h-full rounded-[30px] [backface-visibility:hidden] overflow-hidden bg-black/95 backdrop-blur-xl border border-white/10 [transform:rotateY(180deg)] flex flex-col justify-center p-8 md:p-12">
                <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Branding & Identity</h3>
                <p className="text-lg leading-relaxed text-gray-300 font-light">We create logos, visual identity, brand story, and cohesive designs that make your brand unforgettable.</p>
              </div>
            </div>
          </div>

          <div className="card group relative h-[550px] md:h-[450px] lg:h-[550px] [perspective:2000px]">
            <div className="card-glow absolute -inset-0.5 bg-gradient-to-br from-[rgba(138,43,226,0.4)] to-[rgba(220,20,60,0.4)] rounded-[30px] opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-0 filter blur-xl"></div>
            <div className="card-inner relative w-full h-full [transform-style:preserve-3d] transition-transform duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]">
              <div className="card-front absolute w-full h-full rounded-[30px] [backface-visibility:hidden] overflow-hidden bg-cover bg-center" style={{backgroundImage: "url('https://raw.githubusercontent.com/sebibaciu/automatic-train/refs/heads/main/2.png')"}}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10 transition-opacity duration-500 group-hover:opacity-90"></div>
                <div className="card-front-content absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-20">
                  <div className="card-number absolute top-8 right-10 text-8xl font-bold text-white/10 leading-none font-['Roboto_Slab']">02</div>
                  <h3 className="text-4xl font-bold tracking-tight">Brand Strategy</h3>
                </div>
              </div>
              <div className="card-back absolute w-full h-full rounded-[30px] [backface-visibility:hidden] overflow-hidden bg-black/95 backdrop-blur-xl border border-white/10 [transform:rotateY(180deg)] flex flex-col justify-center p-8 md:p-12">
                <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Brand Strategy</h3>
                <p className="text-lg leading-relaxed text-gray-300 font-light">Naming, brand personality, messaging, and aligning your business strategy with your brand identity for maximum impact.</p>
              </div>
            </div>
          </div>

          <div className="card group relative h-[550px] md:h-[450px] lg:h-[550px] [perspective:2000px]">
            <div className="card-glow absolute -inset-0.5 bg-gradient-to-br from-[rgba(138,43,226,0.4)] to-[rgba(220,20,60,0.4)] rounded-[30px] opacity-0 group-hover:opacity-60 transition-opacity duration-500 z-0 filter blur-xl"></div>
            <div className="card-inner relative w-full h-full [transform-style:preserve-3d] transition-transform duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)]">
              <div className="card-front absolute w-full h-full rounded-[30px] [backface-visibility:hidden] overflow-hidden bg-cover bg-center" style={{backgroundImage: "url('https://raw.githubusercontent.com/sebibaciu/automatic-train/refs/heads/main/3.png')"}}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 z-10 transition-opacity duration-500 group-hover:opacity-90"></div>
                <div className="card-front-content absolute inset-0 p-8 md:p-12 flex flex-col justify-end z-20">
                  <div className="card-number absolute top-8 right-10 text-8xl font-bold text-white/10 leading-none font-['Roboto_Slab']">03</div>
                  <h3 className="text-4xl font-bold tracking-tight">Brand Experience</h3>
                </div>
              </div>
              <div className="card-back absolute w-full h-full rounded-[30px] [backface-visibility:hidden] overflow-hidden bg-black/95 backdrop-blur-xl border border-white/10 [transform:rotateY(180deg)] flex flex-col justify-center p-8 md:p-12">
                <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Brand Experience</h3>
                <p className="text-lg leading-relaxed text-gray-300 font-light">Ensuring every touchpoint reflects your brand, from documents, signage, packaging to digital presence for a consistent experience.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="clients" className="companies-section py-48 px-5 overflow-hidden relative">
        <h2 className="text-center mb-24 text-[clamp(2rem,5vw,3rem)] font-bold bg-gradient-to-r from-white to-gray-600 bg-clip-text text-transparent tracking-tight">Companies We Work With</h2>
        <div className="flex gap-24 items-center hover:[animation-play-state:paused] whitespace-nowrap">
            <div className="companies-slider flex gap-24 items-center">
              {[...companies, ...companies].map((company, index) => (
                  <img key={index} src={company.src} alt={company.name} className="h-16 md:h-20 object-contain grayscale brightness-50 opacity-60 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:grayscale-0 hover:brightness-100 hover:opacity-100 hover:scale-125" />
              ))}
            </div>
        </div>
      </div>

      <footer id="contact" className="py-24 px-5 bg-black/50 backdrop-blur-2xl border-t border-white/5 text-center relative">
        <p className="my-4 text-gray-500 text-base font-light tracking-wider">Contact us: <a href="mailto:contact@arcdigital.ro" className="text-white relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-px after:bg-white after:transition-all after:duration-300 hover:after:w-full">contact@arcdigital.ro</a> | Phone: +1 234 567 890</p>
        <p className="my-4 text-gray-600 text-sm font-light tracking-wider">&copy; 2025 ARC Digital. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;
