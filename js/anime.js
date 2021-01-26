gsap.fromTo(".navMenu", { y: -200 }, { duration: 1.5, y: 0 });

gsap.fromTo(
  ".dataDiv",
  { y: 200 },
  { duration: 1.5, ease: "power2.out", y: 0 }
);
