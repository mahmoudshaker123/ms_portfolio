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

    header.classList.toggle('scrolled', scrollTop > 12);
    progress.style.width = `${percent}%`;
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    themeToggle.textContent = theme === 'dark' ? 'Light' : 'Dark';
  }

  function toggleMenu(forceClose) {
    const shouldOpen = forceClose ? false : !navLinks.classList.contains('open');
    navLinks.classList.toggle('open', shouldOpen);
    document.body.classList.toggle('menu-open', shouldOpen);
    menuToggle.setAttribute('aria-expanded', String(shouldOpen));
  }

  function markActiveLink() {
    const sections = [...document.querySelectorAll('main section[id]')];
    const links = [...document.querySelectorAll('.nav-links a')];
    const current = sections
      .filter((section) => section.getBoundingClientRect().top <= 130)
      .pop();

    links.forEach((link) => {
      link.classList.toggle('active', current && link.getAttribute('href') === `#${current.id}`);
    });
  }

  function buildWhatsAppMessage(data) {
    return [
      'Hello Mahmoud Shaker,',
      '',
      `Name: ${data.get('name')}`,
      `Contact: ${data.get('contactWay')}`,
      `Service: ${data.get('service')}`,
      '',
      `Project details: ${data.get('message')}`,
      '',
      'Sent from your portfolio website.'
    ].join('\n');
  }

  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') {
    setTheme(savedTheme);
  } else {
    setTheme(root.getAttribute('data-theme') || 'dark');
  }

  window.addEventListener('scroll', () => {
    updateChrome();
    markActiveLink();
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) toggleMenu(true);
  });

  themeToggle.addEventListener('click', () => {
    const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });

  menuToggle.addEventListener('click', () => toggleMenu(false));

  navLinks.addEventListener('click', (event) => {
    if (event.target.matches('a')) toggleMenu(true);
  });

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      formNote.textContent = 'Please complete the required fields.';
      return;
    }

    const data = new FormData(contactForm);
    const message = encodeURIComponent(buildWhatsAppMessage(data));
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    formNote.textContent = 'Opening WhatsApp with your message...';
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });

  updateChrome();
  markActiveLink();
})();
