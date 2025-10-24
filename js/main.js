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

// Perbaikan implementasi tab products
const tabButtons = document.querySelectorAll('[data-tab-target]');
const tabPanels = document.querySelectorAll('[data-tab-content]');

if (tabButtons.length && tabPanels.length) {
  // Sembunyikan semua panel kecuali yang pertama
  tabPanels.forEach((panel, index) => {
    if (index !== 0) {
      panel.setAttribute('hidden', '');
      panel.setAttribute('aria-hidden', 'true');
    }
  });

  tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-tab-target');

      // Nonaktifkan semua button
      tabButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      // Aktifkan button yang diklik
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // Sembunyikan semua panel produk
      tabPanels.forEach((panel) => {
        if (panel.id === targetId) {
          panel.removeAttribute('hidden');
          panel.setAttribute('aria-hidden', 'false');
        } else {
          panel.setAttribute('hidden', '');
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

// Hapus implementasi lightbox lama
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

// Implementasi lightbox baru
(function() {
  const overlay = document.querySelector('.lightbox-overlay');
  if (!overlay) return;

  const img = overlay.querySelector('.lb-img');
  const caption = overlay.querySelector('.lb-caption');
  const btnClose = overlay.querySelector('.lb-close');
  const btnPrev = overlay.querySelector('.lb-prev');
  const btnNext = overlay.querySelector('.lb-next');

  let currentGallery = [];
  let currentTitles = [];
  let currentIndex = 0;

  function showImage(index) {
    img.src = currentGallery[index];
    caption.textContent = currentTitles[index] || '';
    btnPrev.style.display = currentGallery.length > 1 ? '' : 'none';
    btnNext.style.display = currentGallery.length > 1 ? '' : 'none';
  }

  // Event listener untuk gallery triggers
  document.querySelectorAll('.gallery-trigger').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      try {
        currentGallery = JSON.parse(trigger.dataset.images);
        currentTitles = trigger.dataset.titles ? JSON.parse(trigger.dataset.titles) : [];
        currentIndex = 0;
        
        showImage(currentIndex);
        overlay.classList.add('open');
        overlay.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
      } catch (err) {
        console.error('Failed to parse gallery data:', err);
      }
    });
  });

  // Navigation controls
  btnNext?.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentGallery.length;
    showImage(currentIndex);
  });

  btnPrev?.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
    showImage(currentIndex);
  });

  function closeGallery() {
    overlay.classList.remove('open');
    overlay.setAttribute('hidden', '');
    document.body.style.overflow = '';
  }

  btnClose?.addEventListener('click', closeGallery);

  // Close on outside click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeGallery();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!overlay.classList.contains('open')) return;
    if (e.key === 'Escape') closeGallery();
    if (e.key === 'ArrowRight') btnNext?.click();
    if (e.key === 'ArrowLeft') btnPrev?.click();
  });
})();

function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slider .slide');
  if (!slides.length) return;

  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  setInterval(nextSlide, 3000);
}

document.addEventListener('DOMContentLoaded', initHeroSlider);

  // Nomor WhatsApp tujuan (gunakan format internasional tanpa +)
  const whatsappNumber = "6281290677726";

  document.getElementById("contact-form").addEventListener("submit", function (event) {
    event.preventDefault(); // mencegah reload halaman

    // Ambil data dari form
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const message = document.getElementById("message").value.trim();

    // Format pesan ke WhatsApp
    const whatsappMessage = 
      `Halo Tangerang uPVC,%0A%0A` +
      `Nama: ${name}%0A` +
      `Email: ${email}%0A` +
      `Telepon: ${phone}%0A` +
      `Pesan:%0A${message}%0A%0A` +
      `Dikirim via Form Website`;

    // Buat URL WhatsApp
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    // ✅ Tambahkan alert sebelum membuka WA
    alert("Mengalihkan ke WhatsApp...");

    // Buka WhatsApp di tab baru
    window.open(whatsappURL, "_blank");
  });

  // Accordion single-open + ARIA sync
(function () {
  const faqs = document.querySelectorAll('.faq');
  faqs.forEach(d => {
    const summary = d.querySelector('.faq__summary');
    d.addEventListener('toggle', () => {
      const expanded = d.open;
      if (summary) summary.setAttribute('aria-expanded', String(expanded));
      if (expanded) {
        // tutup yang lain
        faqs.forEach(other => {
          if (other !== d && other.open) other.open = false;
        });
      }
    });
  });
})();
