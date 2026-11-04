(() => {
  const CONFIG = Object.freeze({
    WEB3FORMS_ACCESS_KEY: '2bb12316-f565-48da-a5c9-1b7c5f37b1ed',
    GA4_MEASUREMENT_ID: ''
  });
  const WHATSAPP_NUMBER = "918983382986";
  const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
  const SUCCESS_TEXT = 'Thank you! Your enquiry has been submitted successfully. Our team will contact you shortly.';
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const bookingDialog = document.querySelector('.booking-dialog');
  const bookingForm = document.querySelector('#booking-form');
  const bookingMessage = document.querySelector('#booking-message');
  const bookingSubmit = bookingForm.querySelector('button[type="submit"]');
  const newsletterForm = document.querySelector('#newsletter-form');
  const newsletterMessage = document.querySelector('#newsletter-message');
  const toastContainer = document.querySelector('#toast-container');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelector('#current-year').textContent = new Date().getFullYear();

  function initializeAnalytics() {
    const measurementId = CONFIG.GA4_MEASUREMENT_ID.trim();
    if (!measurementId || window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', measurementId);
    const analyticsScript = document.createElement('script');
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    document.head.append(analyticsScript);
  }

  function trackAnalyticsEvent(eventName, parameters = {}) {
    if (typeof window.gtag === 'function') window.gtag('event', eventName, parameters);
  }

  function trackFormSubmission(formType) {
    trackAnalyticsEvent('form_submission', { form_type: formType });
  }

  function trackWhatsAppClick(source = 'unknown') {
    trackAnalyticsEvent('whatsapp_click', { click_source: source });
  }

  function trackConsultationButton(source = 'unknown') {
    trackAnalyticsEvent('consultation_click', { click_source: source });
  }

  initializeAnalytics();

  function getWhatsAppUrl(message = 'Hello, I would like to book a free 15-minute tax consultation.') {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  const defaultWhatsAppUrl = getWhatsAppUrl();
  document.querySelectorAll('#whatsapp-float, .js-consultation-button').forEach((link) => {
    link.href = defaultWhatsAppUrl;
  });

  const whatsappSchema = document.querySelector('#whatsapp-contact-schema');
  if (whatsappSchema) {
    try {
      const schema = JSON.parse(whatsappSchema.textContent);
      schema.url = `https://wa.me/${WHATSAPP_NUMBER}`;
      schema.telephone = `+${WHATSAPP_NUMBER}`;
      whatsappSchema.textContent = JSON.stringify(schema);
    } catch (error) {
      console.error('WhatsApp contact schema could not be initialized.', error);
    }
  }

  function showToast(message, type = 'success', action = null) {
    const toast = document.createElement('div');
    toast.className = `site-toast${type === 'error' ? ' is-error' : ''}`;
    toast.setAttribute('role', type === 'error' ? 'alert' : 'status');
    const icon = document.createElement('i');
    icon.className = type === 'error' ? 'fa-solid fa-circle-exclamation' : 'fa-solid fa-circle-check';
    icon.setAttribute('aria-hidden', 'true');
    const text = document.createElement('span');
    text.textContent = message;
    toast.append(icon, text);
    if (action) {
      const link = document.createElement('a');
      link.href = action.href;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = action.label;
      link.addEventListener('click', () => trackWhatsAppClick('submission_toast'));
      toast.append(link);
    }
    toastContainer.append(toast);
    window.setTimeout(() => toast.remove(), 7000);
  }

  function configuredAccessKey() {
    const key = CONFIG.WEB3FORMS_ACCESS_KEY.trim();
    return key && !key.includes('PASTE_YOUR_') ? key : '';
  }

  function addSharedSubmissionFields(formData, subject) {
    formData.append('access_key', configuredAccessKey());
    formData.append('subject', subject);
    formData.append('from_name', 'CA & Associates Website');
    formData.append('page_url', window.location.href);
    formData.append('submitted_at', new Date().toISOString());
  }

  async function sendToWeb3Forms(formData) {
    const response = await fetch(WEB3FORMS_ENDPOINT, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' }
    });
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || 'The enquiry could not be submitted.');
    return result;
  }

  function setFormLoading(form, isLoading, button) {
    form.dataset.submitting = String(isLoading);
    form.setAttribute('aria-busy', String(isLoading));
    button.disabled = isLoading;
    button.classList.toggle('is-loading', isLoading);
  }

  const bookingFields = [
    { input: document.querySelector('#booking-name'), error: document.querySelector('#booking-name-error'), message: 'Please enter your full name.' },
    { input: document.querySelector('#booking-phone'), error: document.querySelector('#booking-phone-error'), message: 'Please enter a valid mobile number.' },
    { input: document.querySelector('#booking-email'), error: document.querySelector('#booking-email-error'), message: 'Please enter a valid email address.' }
  ];

  function validationMessage(field) {
    const value = field.input.value.trim();
    if (!value) return field.input.id === 'booking-name' ? 'Please enter your full name.' : field.input.id === 'booking-phone' ? 'Please enter your mobile number.' : 'Please enter your email address.';
    if (field.input.id === 'booking-phone') {
      const digitCount = value.replace(/\D/g, '').length;
      if (digitCount < 7 || digitCount > 15) return field.message;
    }
    if (field.input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return field.message;
    return '';
  }

  function validateBookingForm() {
    let firstInvalid = null;
    bookingFields.forEach((field) => {
      const message = validationMessage(field);
      field.error.textContent = message;
      field.input.setAttribute('aria-invalid', String(Boolean(message)));
      if (message && !firstInvalid) firstInvalid = field.input;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  bookingFields.forEach((field) => {
    field.input.addEventListener('input', () => {
      if (field.input.getAttribute('aria-invalid') === 'true' || field.input.value.trim()) {
        const message = validationMessage(field);
        field.error.textContent = message;
        field.input.setAttribute('aria-invalid', String(Boolean(message)));
      }
    });
  });

  function applyServiceFromPath() {
    const path = window.location.pathname.replace(/\/+$/, '');
    const serviceRoutes = [
      ['/gst-registration', 'GST Registration'],
      ['/income-tax-filing', 'Income Tax Filing'],
      ['/company-registration', 'Company Registration']
    ];
    const match = serviceRoutes.find(([route]) => path.endsWith(route));
    if (match) document.querySelector('#booking-service').value = match[1];
  }

  applyServiceFromPath();

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    menuToggle.innerHTML = `<i class="fa-solid ${isOpen ? 'fa-bars' : 'fa-xmark'}" aria-hidden="true"></i>`;
    navMenu.classList.toggle('is-open', !isOpen);
  });

  function closeMobileNavigation() {
    navMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    menuToggle.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
  }

  navMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileNavigation));

  document.querySelectorAll('.js-booking-open').forEach((button) => {
    button.addEventListener('click', () => {
      closeMobileNavigation();
      applyServiceFromPath();
      if (typeof bookingDialog.showModal === 'function') {
        bookingDialog.showModal();
        window.setTimeout(() => document.querySelector('#booking-name').focus(), 0);
      }
    });
  });

  document.querySelectorAll('.js-consultation-button').forEach((button) => {
    button.addEventListener('click', () => {
      trackConsultationButton(button.classList.contains('mobile-consultation-bar') ? 'mobile_sticky' : button.classList.contains('desktop-consultation') ? 'desktop_floating' : 'section_cta');
      trackWhatsAppClick('consultation_button');
    });
  });

  document.querySelector('#whatsapp-float').addEventListener('click', () => trackWhatsAppClick('floating_button'));

  bookingDialog.querySelector('.dialog-close').addEventListener('click', () => bookingDialog.close());
  bookingDialog.addEventListener('click', (event) => {
    if (event.target === bookingDialog) bookingDialog.close();
  });

  function formatCurrentDateTime() {
    return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Kolkata' }).format(new Date());
  }

  function makeWhatsAppEnquiry(form) {
    const values = new FormData(form);
    return [
      '🔔 New CA Consultation Enquiry',
      '',
      `Name: ${String(values.get('name') || '').trim()}`,
      '',
      `Phone: ${String(values.get('phone') || '').trim()}`,
      '',
      `Email: ${String(values.get('email') || '').trim()}`,
      '',
      `Service Required: ${String(values.get('service') || 'Not specified').trim()}`,
      '',
      'Message:',
      String(values.get('message') || '').trim() || 'Not provided',
      '',
      'Website:',
      window.location.href,
      '',
      'Date:',
      formatCurrentDateTime()
    ].join('\n');
  }

  bookingForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (bookingForm.dataset.submitting === 'true' || !validateBookingForm()) return;
    bookingMessage.textContent = '';
    bookingMessage.classList.remove('is-error');

    const accessKey = configuredAccessKey();
    if (!accessKey) {
      showToast('Add your Web3Forms access key in the CONFIG section of script.js to enable submissions.', 'error');
      return;
    }

    const whatsappWindow = window.open('about:blank', '_blank');
    if (whatsappWindow) whatsappWindow.opener = null;
    setFormLoading(bookingForm, true, bookingSubmit);

    try {
      const formData = new FormData(bookingForm);
      addSharedSubmissionFields(formData, 'New CA Consultation Enquiry');
      await sendToWeb3Forms(formData);
      trackFormSubmission('consultation');
      trackWhatsAppClick('form_success');
      const whatsappUrl = getWhatsAppUrl(makeWhatsAppEnquiry(bookingForm));
      if (whatsappWindow && !whatsappWindow.closed) {
        whatsappWindow.location.href = whatsappUrl;
        showToast(SUCCESS_TEXT);
      } else {
        showToast(SUCCESS_TEXT, 'success', { href: whatsappUrl, label: 'Open WhatsApp' });
      }
      bookingDialog.close();
      bookingForm.reset();
      bookingFields.forEach((field) => {
        field.error.textContent = '';
        field.input.removeAttribute('aria-invalid');
      });
      applyServiceFromPath();
    } catch (error) {
      if (whatsappWindow && !whatsappWindow.closed) whatsappWindow.close();
      bookingMessage.textContent = 'We could not submit your enquiry. Please try again or contact us on WhatsApp.';
      bookingMessage.classList.add('is-error');
      showToast('We could not submit your enquiry. Please try again or contact us on WhatsApp.', 'error', { href: defaultWhatsAppUrl, label: 'Contact us' });
      console.error('Web3Forms consultation submission failed.', error);
    } finally {
      setFormLoading(bookingForm, false, bookingSubmit);
    }
  });

  const newsletterEmail = document.querySelector('#newsletter-email');
  newsletterEmail.addEventListener('input', () => {
    newsletterMessage.textContent = '';
    newsletterMessage.classList.remove('is-error');
    newsletterEmail.removeAttribute('aria-invalid');
  });

  newsletterForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (newsletterForm.dataset.submitting === 'true') return;
    if (!newsletterEmail.value.trim() || !newsletterEmail.validity.valid) {
      newsletterEmail.setAttribute('aria-invalid', 'true');
      newsletterMessage.textContent = newsletterEmail.value.trim() ? 'Enter a valid email address.' : 'Enter your email address.';
      newsletterMessage.classList.add('is-error');
      newsletterEmail.focus();
      return;
    }
    newsletterMessage.textContent = '';
    newsletterMessage.classList.remove('is-error');
    const accessKey = configuredAccessKey();
    if (!accessKey) {
      newsletterMessage.textContent = 'Add your Web3Forms access key in script.js to enable subscriptions.';
      newsletterMessage.classList.add('is-error');
      showToast('Web3Forms is not configured yet.', 'error');
      return;
    }

    const submitButton = newsletterForm.querySelector('button[type="submit"]');
    setFormLoading(newsletterForm, true, submitButton);
    try {
      const formData = new FormData(newsletterForm);
      addSharedSubmissionFields(formData, 'CA & Associates Newsletter Signup');
      formData.append('message', 'Please add this email address to the CA & Associates updates list.');
      await sendToWeb3Forms(formData);
      trackFormSubmission('newsletter');
      newsletterMessage.textContent = 'Thank you for subscribing.';
      showToast('Thank you for subscribing.');
      newsletterForm.reset();
    } catch (error) {
      newsletterMessage.textContent = 'Subscription failed. Please try again shortly.';
      newsletterMessage.classList.add('is-error');
      showToast('Subscription failed. Please try again shortly.', 'error');
      console.error('Web3Forms newsletter submission failed.', error);
    } finally {
      setFormLoading(newsletterForm, false, submitButton);
    }
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

  if (window.AOS && !reduceMotion) {
    AOS.init({ duration: 650, easing: 'ease-out-cubic', once: true, offset: 45 });
  } else {
    document.querySelectorAll('[data-aos]').forEach((element) => element.classList.add('aos-animate'));
  }
})();
