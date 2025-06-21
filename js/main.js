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

  // Inicializa o modal para imagens
  initImageModal();
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

// Função para inicializar o modal de imagens
function initImageModal() {
  // Cria o modal
  const modal = document.createElement('div');
  modal.id = 'imageModal';
  modal.style.cssText = `
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.9);
    cursor: pointer;
  `;

  // Cria o conteúdo do modal
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: 95%;
    max-height: 95%;
    text-align: center;
  `;

  // Cria a imagem do modal
  const modalImage = document.createElement('img');
  modalImage.id = 'modalImage';
  modalImage.style.cssText = `
    max-width: 100%;
    max-height: 90vh;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  `;

  // Cria o botão de fechar
  const closeBtn = document.createElement('span');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
    position: absolute;
    top: 15px;
    right: 35px;
    color: #fff;
    font-size: 40px;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s;
  `;

  // Cria a legenda
  const caption = document.createElement('div');
  caption.id = 'modalCaption';
  caption.style.cssText = `
    color: #fff;
    font-size: 16px;
    margin-top: 15px;
    padding: 0 20px;
    font-weight: 500;
  `;

  // Monta o modal
  modalContent.appendChild(modalImage);
  modalContent.appendChild(caption);
  modal.appendChild(closeBtn);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Adiciona event listeners para todas as imagens
  const images = document.querySelectorAll('.analysis-image img');
  images.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', function() {
      modal.style.display = 'block';
      modalImage.src = this.src;
      caption.textContent = this.alt || 'Análise de Dados';
      document.body.style.overflow = 'hidden'; // Previne scroll do body
    });
  });

  // Fecha o modal quando clica no X
  closeBtn.addEventListener('click', closeModal);

  // Fecha o modal quando clica fora da imagem
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Fecha o modal com a tecla ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });

  // Função para fechar o modal
  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restaura o scroll do body
  }

  // Efeito de hover no botão de fechar
  closeBtn.addEventListener('mouseenter', function() {
    this.style.color = '#ff6b6b';
  });

  closeBtn.addEventListener('mouseleave', function() {
    this.style.color = '#fff';
  });
}