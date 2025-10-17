/* Main JavaScript for MEDAN static website */

const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('header nav');
const scrollTopBtn = document.querySelector('.scroll-top');
const body = document.body;

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    navToggle.setAttribute(
      'aria-expanded',
      navMenu.classList.contains('open') ? 'true' : 'false'
    );
    body.classList.toggle('nav-open');
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      body.classList.remove('nav-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const header = document.querySelector('header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  if (!header) return;
  const currentScroll = window.scrollY;
  if (currentScroll > lastScrollY && currentScroll > 120) {
    header.style.transform = 'translateY(-100%)';
  } else {
    header.style.transform = 'translateY(0)';
  }
  lastScrollY = currentScroll;

  if (scrollTopBtn) {
    if (currentScroll > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }
});

if (scrollTopBtn) {
  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

window.addEventListener('load', () => {
  if (window.AOS) {
    AOS.init({
      duration: 900,
      once: true,
      offset: 120,
      easing: 'ease-out-cubic',
    });
  }
});

const tabButtons = document.querySelectorAll('[data-tab-target]');
const tabPanels = document.querySelectorAll('[data-tab-content]');

if (tabButtons.length && tabPanels.length) {
  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = button.getAttribute('data-tab-target');

      tabButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      tabPanels.forEach((panel) => {
        if (panel.getAttribute('data-tab-content') === target) {
          panel.removeAttribute('hidden');
          panel.classList.add('active');
          panel.setAttribute('aria-hidden', 'false');
        } else {
          panel.setAttribute('hidden', 'hidden');
          panel.classList.remove('active');
          panel.setAttribute('aria-hidden', 'true');
        }
      });
    });
  });
}

const filterButtons = document.querySelectorAll('[data-filter]');
const projectItems = document.querySelectorAll('.project-card');

if (filterButtons.length && projectItems.length) {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');

      filterButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');

      projectItems.forEach((item) => {
        const category = item.getAttribute('data-category');
        const shouldShow = filter === 'all' || filter === category;
        item.style.display = shouldShow ? 'block' : 'none';
      });
    });
  });
}

const lightboxOverlay = document.querySelector('.lightbox-overlay');
const lightboxImage = document.querySelector('.lightbox-overlay img');
const lightboxClose = document.querySelector('.lightbox-overlay button');

const galleryTriggers = document.querySelectorAll('[data-lightbox]');

if (lightboxOverlay && lightboxImage && galleryTriggers.length) {
  galleryTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const src = trigger.getAttribute('href') || trigger.dataset.lightbox;
      lightboxOverlay.classList.add('active');
      lightboxImage.setAttribute('src', src);
      lightboxImage.setAttribute('alt', trigger.getAttribute('data-title') || 'Gallery image');
      body.style.overflow = 'hidden';
    });
  });

  const closeLightbox = () => {
    lightboxOverlay.classList.remove('active');
    body.style.overflow = '';
  };

  lightboxClose?.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', (event) => {
    if (event.target === lightboxOverlay) {
      closeLightbox();
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
      closeLightbox();
    }
  });
}

const contactForm = document.querySelector('#contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const recaptchaInput = contactForm.querySelector('input[name="g-recaptcha-response"]');
    const recaptchaToken = recaptchaInput ? recaptchaInput.value : '';

    if (!recaptchaToken) {
      alert('Please complete the reCAPTCHA verification.');
      return;
    }

    if (window.emailjs) {
      const formData = new FormData(contactForm);
      const params = Object.fromEntries(formData.entries());

      emailjs
        .send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', params)
        .then(() => {
          alert('Thank you! We will be in touch shortly.');
          contactForm.reset();
        })
        .catch(() => {
          alert('Something went wrong. Please try again later.');
        });
    }
  });
}
