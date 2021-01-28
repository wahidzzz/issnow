gsap.fromTo(".navMenu", { y: -200 }, { duration: 1.5, y: 0 });

gsap.fromTo(
  ".dataDiv",
  { y: 200 },
  { duration: 1.5, ease: "power2.out", y: 0 }
);
function openModalPop() {
  document.getElementById("pipDiv").style.display = "block";
  gsap.fromTo(
    ".pipDiv",
    { y: 50 },
    { duration: 1.5, ease: "power2.out", y: 150 }
  );
}
