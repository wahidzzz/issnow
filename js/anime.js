gsap.fromTo(".navMenu", { y: -200 }, { duration: 1.5, y: 0 });

gsap.fromTo(
  ".dataDiv",
  { y: 200 },
  { duration: 1.5, ease: "power2.out", y: 0 }
);
function openModalPop(divId) {
  document.getElementById(divId).style.display = "block";
  gsap.fromTo(
    "." + divId,
    { y: 30 },
    { duration: 1, ease: "power2.out", y: 130 }
  );
}
function closeModalPop(divId) {
  document.getElementById(divId).style.display = "none";
}
