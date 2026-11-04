(() => {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const bookingDialog = document.querySelector('.booking-dialog');
  const bookingForm = document.querySelector('#booking-form');
  const bookingMessage = document.querySelector('#booking-message');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelector('#current-year').textContent = new Date().getFullYear();

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    menuToggle.innerHTML = `<i class="fa-solid ${isOpen ? 'fa-bars' : 'fa-xmark'}" aria-hidden="true"></i>`;
    navMenu.classList.toggle('is-open', !isOpen);
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation menu');
      menuToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    });
  });

  document.querySelectorAll('.js-booking-open').forEach((button) => {
    button.addEventListener('click', () => {
      if (navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation menu');
        menuToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
      }
      if (typeof bookingDialog.showModal === 'function') {
        bookingDialog.showModal();
        window.setTimeout(() => document.querySelector('#booking-name').focus(), 0);
      }
    });
  });

  bookingDialog.querySelector('.dialog-close').addEventListener('click', () => bookingDialog.close());
  bookingDialog.addEventListener('click', (event) => {
    if (event.target === bookingDialog) bookingDialog.close();
  });

  bookingForm.addEventListener('submit', (event) => {
    event.preventDefault();
    bookingMessage.textContent = 'Thanks for reaching out. Connect this demo form to your email or booking service to receive requests.';
    bookingForm.reset();
  });

  const slides = [...document.querySelectorAll('.testimonial-slide')];
  const dots = [...document.querySelectorAll('.carousel-dot')];
  let activeSlide = 0;

  function showSlide(nextIndex) {
    activeSlide = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const isActive = index === activeSlide;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
      dots[index].classList.toggle('is-active', isActive);
      dots[index].setAttribute('aria-pressed', String(isActive));
    });
  }

  document.querySelector('[data-carousel-prev]').addEventListener('click', () => showSlide(activeSlide - 1));
  document.querySelector('[data-carousel-next]').addEventListener('click', () => showSlide(activeSlide + 1));
  dots.forEach((dot, index) => dot.addEventListener('click', () => showSlide(index)));

  const counters = [...document.querySelectorAll('.counter')];
  function animateCounter(counter) {
    const target = Number(counter.dataset.target);
    if (reduceMotion) {
      counter.textContent = String(target);
      return;
    }
    const duration = 1400;
    const startedAt = performance.now();
    function update(now) {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - (1 - progress) ** 3;
      counter.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((counter) => counterObserver.observe(counter));
  } else {
    counters.forEach(animateCounter);
  }

  const newsletterForm = document.querySelector('#newsletter-form');
  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();
    document.querySelector('#newsletter-message').textContent = 'Thank you. Connect this form to your email platform to manage subscriptions.';
    newsletterForm.reset();
  });

  if (window.AOS && !reduceMotion) {
    AOS.init({ duration: 650, easing: 'ease-out-cubic', once: true, offset: 45 });
  } else {
    document.querySelectorAll('[data-aos]').forEach((element) => element.classList.add('aos-animate'));
  }
})();
