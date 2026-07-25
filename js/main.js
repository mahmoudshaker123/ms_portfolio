(function () {
  const root = document.documentElement;
  const header = document.getElementById('siteHeader');
  const progress = document.getElementById('progress');
  const themeToggle = document.getElementById('themeToggle');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  const phoneNumber = '201020817237';

  function updateChrome() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const percent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (header) {
      header.classList.toggle('scrolled', scrollTop > 15);
    }
    if (progress) {
      progress.style.width = `${percent}%`;
    }
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }

  function toggleMenu(forceClose) {
    if (!navLinks || !menuToggle) return;
    const shouldOpen = forceClose ? false : !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', shouldOpen);
    document.body.classList.toggle('menu-open', shouldOpen);
    menuToggle.setAttribute('aria-expanded', String(shouldOpen));
  }

  function markActiveLink() {
    const sections = [...document.querySelectorAll('main section[id]')];
    const links = [...document.querySelectorAll('.nav-links a')];
    const current = sections
      .filter((section) => section.getBoundingClientRect().top <= 160)
      .pop();

    links.forEach((link) => {
      link.classList.toggle('active', current && link.getAttribute('href') === `#${current.id}`);
    });
  }

  function buildWhatsAppMessage(data) {
    return [
      '👋 Hello Mahmoud Shaker,',
      '',
      `👤 *Name:* ${data.get('name')}`,
      `📞 *Contact:* ${data.get('contactWay')}`,
      `🛠️ *Service Requested:* ${data.get('service')}`,
      '',
      `📋 *Project Details:*`,
      `${data.get('message')}`,
      '',
      'Sent via your Portfolio Website.'
    ].join('\n');
  }

  // Initialize theme
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    setTheme(savedTheme);
  } else {
    setTheme('dark');
  }

  // Event Listeners
  window.addEventListener('scroll', () => {
    updateChrome();
    markActiveLink();
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) toggleMenu(true);
  });

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
    });
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => toggleMenu(false));
  }

  if (navLinks) {
    navLinks.addEventListener('click', (event) => {
      if (event.target.matches('a')) toggleMenu(true);
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        formNote.textContent = 'Please complete all required fields.';
        return;
      }

      const data = new FormData(contactForm);
      const message = encodeURIComponent(buildWhatsAppMessage(data));
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

      formNote.textContent = 'Opening WhatsApp with your formatted inquiry...';
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  updateChrome();
  markActiveLink();
})();
