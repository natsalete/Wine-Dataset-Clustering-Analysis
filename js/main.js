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
  
  // Inicializa efeitos de hover responsivos
  initResponsiveHover();
});

// Efeito de hover responsivo nos cards
function initResponsiveHover() {
  const cards = document.querySelectorAll(".metric-card");
  const isMobile = window.innerWidth <= 768;
  
  cards.forEach((card) => {
    if (!isMobile) {
      card.addEventListener("mouseenter", function () {
        this.style.transform = "translateY(-5px) scale(1.02)";
        this.style.transition = "all 0.3s ease";
      });

      card.addEventListener("mouseleave", function () {
        this.style.transform = "translateY(0) scale(1)";
      });
    }
  });
}

// Função para inicializar o modal de imagens com melhor responsividade
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
    background-color: rgba(0, 0, 0, 0.95);
    cursor: pointer;
    overflow: hidden;
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
    padding: 20px;
    box-sizing: border-box;
  `;

  // Cria a imagem do modal
  const modalImage = document.createElement('img');
  modalImage.id = 'modalImage';
  modalImage.style.cssText = `
    max-width: 100%;
    max-height: 85vh;
    width: auto;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    object-fit: contain;
  `;

  // Cria o botão de fechar
  const closeBtn = document.createElement('span');
  closeBtn.innerHTML = '&times;';
  closeBtn.style.cssText = `
    position: absolute;
    top: 15px;
    right: 25px;
    color: #fff;
    font-size: 35px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 1001;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
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
    line-height: 1.4;
  `;

  // Cria indicador de loading
  const loadingIndicator = document.createElement('div');
  loadingIndicator.id = 'loadingIndicator';
  loadingIndicator.innerHTML = 'Carregando...';
  loadingIndicator.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 18px;
    display: none;
  `;

  // Monta o modal
  modalContent.appendChild(modalImage);
  modalContent.appendChild(caption);
  modal.appendChild(closeBtn);
  modal.appendChild(modalContent);
  modal.appendChild(loadingIndicator);
  document.body.appendChild(modal);

  // Adiciona event listeners para todas as imagens
  const images = document.querySelectorAll('.analysis-image img');
  images.forEach(img => {
    img.style.cursor = 'pointer';
    img.style.transition = 'transform 0.3s ease';
    
    // Adiciona indicador visual de que a imagem é clicável
    img.addEventListener('mouseenter', function() {
      if (window.innerWidth > 768) {
        this.style.transform = 'scale(1.05)';
      }
    });
    
    img.addEventListener('mouseleave', function() {
      if (window.innerWidth > 768) {
        this.style.transform = 'scale(1)';
      }
    });
    
    img.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      openModal(this);
    });
  });

  // Função para abrir o modal
  function openModal(img) {
    modal.style.display = 'block';
    loadingIndicator.style.display = 'block';
    modalImage.style.display = 'none';
    
    // Previne scroll do body
    document.body.style.overflow = 'hidden';
    
    // Carrega a imagem
    const tempImg = new Image();
    tempImg.onload = function() {
      modalImage.src = this.src;
      modalImage.style.display = 'block';
      loadingIndicator.style.display = 'none';
      caption.textContent = img.alt || 'Análise de Dados - Wine Dataset';
    };
    
    tempImg.onerror = function() {
      loadingIndicator.innerHTML = 'Erro ao carregar imagem';
      setTimeout(() => {
        closeModal();
      }, 2000);
    };
    
    tempImg.src = img.src;
  }

  // Fecha o modal quando clica no X
  closeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    closeModal();
  });

  // Fecha o modal quando clica fora da imagem
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Previne fechamento quando clica na imagem ou conteúdo
  modalContent.addEventListener('click', function(e) {
    e.stopPropagation();
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
    document.body.style.overflow = 'auto';
    modalImage.src = '';
    loadingIndicator.style.display = 'none';
    loadingIndicator.innerHTML = 'Carregando...';
  }

  // Efeito de hover no botão de fechar
  closeBtn.addEventListener('mouseenter', function() {
    this.style.color = '#ff6b6b';
    this.style.background = 'rgba(255, 107, 107, 0.2)';
    this.style.transform = 'scale(1.1)';
  });

  closeBtn.addEventListener('mouseleave', function() {
    this.style.color = '#fff';
    this.style.background = 'rgba(0, 0, 0, 0.5)';
    this.style.transform = 'scale(1)';
  });

  // Adiciona suporte a gestos de touch para dispositivos móveis
  let touchStartY = 0;
  let touchStartX = 0;

  modal.addEventListener('touchstart', function(e) {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  });

  modal.addEventListener('touchend', function(e) {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchStartY - touchEndY;
    const deltaX = touchStartX - touchEndX;

    // Se o swipe for vertical (para cima ou para baixo) com amplitude suficiente
    if (Math.abs(deltaY) > 50 && Math.abs(deltaX) < 100) {
      closeModal();
    }
  });

  // Ajusta o modal quando a orientação muda
  window.addEventListener('orientationchange', function() {
    setTimeout(() => {
      if (modal.style.display === 'block') {
        // Reajusta o tamanho da imagem após mudança de orientação
        modalImage.style.maxHeight = '85vh';
        modalImage.style.maxWidth = '95vw';
      }
    }, 100);
  });

  // Ajusta o modal quando a janela é redimensionada
  window.addEventListener('resize', function() {
    if (modal.style.display === 'block') {
      // Reajusta elementos responsivos
      if (window.innerWidth <= 768) {
        closeBtn.style.fontSize = '30px';
        closeBtn.style.right = '15px';
        closeBtn.style.top = '10px';
        caption.style.fontSize = '14px';
        caption.style.padding = '0 15px';
      } else {
        closeBtn.style.fontSize = '35px';
        closeBtn.style.right = '25px';
        closeBtn.style.top = '15px';
        caption.style.fontSize = '16px';
        caption.style.padding = '0 20px';
      }
    }
  });
}

// Adiciona lazy loading para imagens
function initLazyLoading() {
  const images = document.querySelectorAll('.analysis-image img');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            observer.unobserve(img);
          }
        }
      });
    });

    images.forEach(img => {
      if (img.dataset.src) {
        imageObserver.observe(img);
      }
    });
  }
}

// Adiciona smooth scroll para navegação interna
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Inicializa funcionalidades adicionais quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
  initLazyLoading();
  initSmoothScroll();
});

// Performance: debounce para eventos de scroll e resize
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Aplica debounce aos eventos de scroll
window.addEventListener('scroll', debounce(checkScroll, 10));
window.addEventListener('resize', debounce(initResponsiveHover, 250));