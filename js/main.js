// Adiciona efeitos de scroll suave
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".section");

  function checkScroll() {
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const scrollTop = window.pageYOffset;
      const windowHeight = window.innerHeight;

      if (scrollTop > sectionTop - windowHeight + sectionHeight / 3) {
        section.style.opacity = "1";
        section.style.transform = "translateY(0)";
      }
    });
  }

  window.addEventListener("scroll", checkScroll);
  checkScroll(); // Executa uma vez no carregamento
});

// Efeito de hover nos cards
document.querySelectorAll(".metric-card").forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-5px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});
