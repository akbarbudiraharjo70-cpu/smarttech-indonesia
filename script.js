/* =========================================================
   SMARTTECH INDONESIA - MAIN SCRIPT
   File: assets/js/script.js
========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* =======================================================
     1. NAVBAR BERUBAH SAAT DISCROLL
  ======================================================= */
  const navbar = document.querySelector('.navbar');

  function handleNavbarScroll() {
    if (!navbar) return;
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll);


  /* =======================================================
     2. SMOOTH SCROLL UNTUK LINK ANCHOR (#id)
  ======================================================= */
  const anchorLinks = document.querySelectorAll('a[href*="#"]');

  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href) return;

      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;

      const targetId = href.substring(hashIndex + 1);
      const targetPage = href.substring(0, hashIndex);
      const currentPage = window.location.pathname.split('/').pop();

      // Hanya lakukan smooth scroll jika link menuju halaman yang sama (atau tanpa nama file)
      const isSamePage =
        targetPage === '' ||
        targetPage === currentPage ||
        (targetPage === 'index.html' && (currentPage === '' || currentPage === 'index.html'));

      if (isSamePage && targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          e.preventDefault();

          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          const targetPosition =
            targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Tutup navbar collapse di mode mobile setelah klik
          const navbarCollapse = document.querySelector('.navbar-collapse.show');
          if (navbarCollapse) {
            const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navbarCollapse);
            bsCollapse.hide();
          }
        }
      }
    });
  });


  /* =======================================================
     3. ANIMASI SEDERHANA SAAT HALAMAN DIBUKA (FADE IN)
  ======================================================= */
  function initPageLoadAnimation() {
    const heroContent = document.querySelectorAll(
      '.hero-section h1, .hero-section .lead, .hero-section .d-flex.flex-wrap, .hero-img, .page-banner .container'
    );

    heroContent.forEach(function (el, index) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(25px)';
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

      setTimeout(function () {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, 150 * (index + 1));
    });
  }

  initPageLoadAnimation();


  /* =======================================================
     3B. ANIMASI SAAT ELEMEN MASUK VIEWPORT (SCROLL REVEAL)
  ======================================================= */
  const revealTargets = document.querySelectorAll(
    '.card, .feature-card, .service-card, .stats-section [class*="col-"], .company-photo, .gallery-photo'
  );

  if ('IntersectionObserver' in window && revealTargets.length > 0) {
    revealTargets.forEach(function (el) {
      el.classList.add('reveal');
    });

    const observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }


  /* =======================================================
     4 & 5. VALIDASI FORM KONTAK + VALIDASI EMAIL
  ======================================================= */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const namaInput = document.getElementById('nama');
    const emailInput = document.getElementById('email');
    const pesanInput = document.getElementById('pesan');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setFieldValidity(field, isValid) {
      if (!field) return;
      if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
      } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
      }
    }

    function validateNama() {
      const isValid = namaInput.value.trim().length >= 3;
      setFieldValidity(namaInput, isValid);
      return isValid;
    }

    function validateEmail() {
      const isValid = emailRegex.test(emailInput.value.trim());
      setFieldValidity(emailInput, isValid);
      return isValid;
    }

    function validatePesan() {
      const isValid = pesanInput.value.trim().length >= 10;
      setFieldValidity(pesanInput, isValid);
      return isValid;
    }

    // Validasi real-time saat mengetik
    if (namaInput) {
      namaInput.addEventListener('input', validateNama);
    }
    if (emailInput) {
      emailInput.addEventListener('input', validateEmail);
    }
    if (pesanInput) {
      pesanInput.addEventListener('input', validatePesan);
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const isNamaValid = validateNama();
      const isEmailValid = validateEmail();
      const isPesanValid = validatePesan();

      contactForm.classList.add('was-validated');

      if (isNamaValid && isEmailValid && isPesanValid) {
        showSuccessAlert();

        // Reset form setelah berhasil
        contactForm.reset();
        contactForm.classList.remove('was-validated');
        [namaInput, emailInput, pesanInput].forEach(function (field) {
          if (field) field.classList.remove('is-valid', 'is-invalid');
        });
      } else {
        // Fokus ke field pertama yang tidak valid
        if (!isNamaValid) {
          namaInput.focus();
        } else if (!isEmailValid) {
          emailInput.focus();
        } else if (!isPesanValid) {
          pesanInput.focus();
        }
      }
    });
  }


  /* =======================================================
     6. ALERT SUKSES KETIKA FORM VALID
  ======================================================= */
  function showSuccessAlert() {
    // Hapus alert lama jika masih ada
    const existingAlert = document.getElementById('formSuccessAlert');
    if (existingAlert) {
      existingAlert.remove();
    }

    const alertBox = document.createElement('div');
    alertBox.id = 'formSuccessAlert';
    alertBox.className = 'alert alert-success alert-dismissible fade show mt-3';
    alertBox.setAttribute('role', 'alert');
    alertBox.innerHTML =
      '<i class="bi bi-check-circle-fill me-2"></i>' +
      'Pesan Anda berhasil terkirim! Tim kami akan segera menghubungi Anda.' +
      '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';

    if (contactFormExists()) {
      const form = document.getElementById('contactForm');
      form.parentNode.insertBefore(alertBox, form);
    }

    // Otomatis hilang setelah 5 detik
    setTimeout(function () {
      if (alertBox && alertBox.parentNode) {
        alertBox.classList.remove('show');
        setTimeout(function () {
          alertBox.remove();
        }, 300);
      }
    }, 5000);
  }

  function contactFormExists() {
    return document.getElementById('contactForm') !== null;
  }


  /* =======================================================
     7. SCROLL TO TOP BUTTON
  ======================================================= */
  let scrollTopBtn = document.querySelector('.scroll-top-btn');

  // Buat tombol secara otomatis jika belum ada di HTML
  if (!scrollTopBtn) {
    scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.setAttribute('aria-label', 'Kembali ke atas');
    scrollTopBtn.innerHTML = '<i class="bi bi-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);
  }

  function toggleScrollTopBtn() {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  }

  toggleScrollTopBtn();
  window.addEventListener('scroll', toggleScrollTopBtn);

  scrollTopBtn.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });


  /* =======================================================
     8. ACTIVE NAVBAR (BERDASARKAN HALAMAN & SCROLL POSISI)
  ======================================================= */
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  function setActiveByPage() {
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href) return;

      const linkPage = href.split('#')[0];

      if (
        linkPage === currentPage ||
        (currentPage === '' && linkPage === 'index.html') ||
        (currentPage === 'index.html' && linkPage === 'index.html')
      ) {
        if (!href.includes('#')) {
          navLinks.forEach(function (l) {
            l.classList.remove('active');
          });
          link.classList.add('active');
        }
      }
    });
  }

  setActiveByPage();

  // Active navbar berdasarkan section yang sedang terlihat (khusus index.html)
  const sections = document.querySelectorAll('section[id], header[id]');

  function setActiveBySection() {
    if (sections.length === 0) return;

    let currentSectionId = '';
    const scrollPosition = window.scrollY + (navbar ? navbar.offsetHeight : 0) + 50;

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(function (link) {
        const href = link.getAttribute('href') || '';
        const hashPart = href.includes('#') ? href.split('#')[1] : null;

        if (hashPart === currentSectionId) {
          navLinks.forEach(function (l) {
            l.classList.remove('active');
          });
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', setActiveBySection);
  setActiveBySection();

});