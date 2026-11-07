// Custom cursor
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
  if (cursor) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  }
});
document.querySelectorAll('a, button, .service-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => { if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(2.5)'; });
  el.addEventListener('mouseleave', () => { if (cursor) cursor.style.transform = 'translate(-50%, -50%) scale(1)'; });
});

// Scroll progress bar
const scrollBar = document.getElementById('scrollBar');
window.addEventListener('scroll', () => {
  if (scrollBar) {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    scrollBar.style.width = pct + '%';
  }
});

// Back to top button
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (backToTop) {
    backToTop.classList.toggle('visible', window.scrollY > 400);
  }
});
if (backToTop) {
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Hamburger mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });
}

// Scroll reveal
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
  section.classList.add('reveal');
  observer.observe(section);
});

// Counter animation for stats
function animateCounter(el) {
  const target = +el.dataset.target;
  const duration = 1500;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = Math.floor(current);
    }
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// Contact form with Formspree
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('.submit-btn');
    const original = btn.innerHTML;

    btn.innerHTML = `<span class="code-bracket">&lt;</span> Sending... <span class="code-bracket">/&gt;</span> <span class="code-cursor">_</span>`;
    btn.disabled = true;

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        btn.innerHTML = `<span class="code-bracket">&lt;</span> Message Sent ✓ <span class="code-bracket">/&gt;</span>`;
        contactForm.reset();
      } else {
        throw new Error();
      }
    } catch {
      btn.innerHTML = `<span class="code-bracket">&lt;</span> Error — Try Again <span class="code-bracket">/&gt;</span>`;
    }

    setTimeout(() => {
      btn.innerHTML = original;
      btn.disabled = false;
    }, 3500);
  });
}

/**
 * PROJECTS DATA FOR POPUP MODALS
 */
const PROJECTS = {
  n8n: {
    summary: "An automated blog publishing pipeline built with n8n and OpenAI that fetches trending tech news, generates structured markdown articles, and publishes them automatically.",
    tools: ["n8n", "OpenAI API", "Python", "Markdown", "REST APIs"],
    components: [
      "Schedule Trigger",
      "RSS / News API Fetcher",
      "OpenAI LLM Content Generator",
      "Automated Markdown / CMS Writer"
    ],
    howItWorks: [
      "Schedule trigger activates the workflow daily at a set time.",
      "HTTP Request fetches top tech news headlines and metadata.",
      "OpenAI API processes the article and drafts a developer blog post.",
      "Workflow automatically saves and pushes the generated post to the production CMS."
    ],
    challenge: "Handling rate limits and maintaining consistent article formatting from variable news RSS schemas.",
    status: "Active and running in production on technyfire.net",
    live: "https://technyfire.net",
    github: "https://github.com/For2otune/Blog-post-n8n-Automation"
  },
  stress: {
    summary: "A machine learning predictive system that assesses student stress levels based on behavioral and academic inputs, served via a FastAPI backend and interactive frontend.",
    tools: ["HTML", "CSS", "JavaScript", "Machine Learning", "FastAPI"],
    components: [
      "Interactive User Form",
      "FastAPI Prediction Endpoint",
      "Trained ML Classification Model",
      "Results Dashboard"
    ],
    challenge: "Optimizing model inference time and ensuring accurate feature scaling for real-time user predictions.",
    status: "Deployed and fully functional",
    live: "https://stress-level-prediction-system.netlify.app/",
    github: ""
  },
  technest: {
    summary: "A responsive tech ecosystem website replica built with clean modern UI components, structured layouts, and smooth navigation.",
    tools: ["HTML", "CSS", "JavaScript", "Bootstrap 5"],
    components: [
      "Responsive Navigation",
      "Hero Banner & Feature Grid",
      "Interactive UI Components",
      "Mobile Hamburger Menu"
    ],
    challenge: "Replicating complex layout alignment and pixel-perfection across mobile and desktop breakpoints.",
    status: "Completed & Live",
    live: "https://technest-website-replica.onrender.com",
    github: ""
  },
  telegram: {
    summary: "An intelligent assistant agent that bridges Telegram and email channels, processing messages and automating responses using Claude AI and n8n workflows.",
    tools: ["JavaScript", "n8n", "Claude AI", "Telegram Bot API", "Email API"],
    components: [
      "Telegram Webhook Trigger",
      "Claude AI Message Parser",
      "Automated Email Dispatcher",
      "Error Handling & Logging"
    ],
    challenge: "Securing webhook authentication and managing asynchronous multi-turn conversation states.",
    status: "Completed & Ready for deployment",
    live: "",
    github: "https://github.com/For2otune/Telegram-Email-Agent"
  }
};

// Project Popup Modal function
function openProjectPopup(projKey) {
  const data = PROJECTS[projKey];
  if (!data) return;

  const existing = document.getElementById('projectPopupBackdrop');
  if (existing) existing.remove();

  const backdrop = document.createElement('div');
  backdrop.id = 'projectPopupBackdrop';
  backdrop.className = 'pm-backdrop';

  const modal = document.createElement('div');
  modal.className = 'pm-modal';
  modal.setAttribute('data-project', projKey);

  const closeBtn = document.createElement('button');
  closeBtn.className = 'pm-close';
  closeBtn.textContent = '✕';
  closeBtn.setAttribute('aria-label', 'Close modal');
  closeBtn.addEventListener('click', () => closePopup());
  modal.appendChild(closeBtn);

  const card = document.querySelector(`.project-card[data-project="${projKey}"]`);
  const imgSrc = card ? card.querySelector('img').src : '';
  const imgAlt = card ? card.querySelector('img').alt : '';

  if (imgSrc) {
    const imgWrap = document.createElement('div');
    imgWrap.className = 'pm-img-wrap';
    const img = document.createElement('img');
    img.className = 'pm-img';
    img.src = imgSrc;
    img.alt = imgAlt;
    imgWrap.appendChild(img);
    modal.appendChild(imgWrap);
  }

  const titleEl = document.createElement('h2');
  titleEl.className = 'pm-title';
  titleEl.textContent = card ? card.querySelector('h3').textContent : projKey;
  modal.appendChild(titleEl);

  if (data.summary) {
    const sumEl = document.createElement('p');
    sumEl.className = 'pm-summary';
    sumEl.textContent = data.summary;
    modal.appendChild(sumEl);
  }

  if (data.tools && data.tools.length > 0) {
    const tTitle = document.createElement('div');
    tTitle.className = 'pm-section-title';
    tTitle.textContent = 'Tools Used';
    modal.appendChild(tTitle);

    const toolsWrap = document.createElement('div');
    toolsWrap.className = 'pm-tools';
    data.tools.forEach(t => {
      const tag = document.createElement('span');
      tag.className = 'skill-tag';
      tag.textContent = t;
      toolsWrap.appendChild(tag);
    });
    modal.appendChild(toolsWrap);
  }

  if (data.components && data.components.length > 0) {
    const cTitle = document.createElement('div');
    cTitle.className = 'pm-section-title';
    cTitle.textContent = 'Key Components';
    modal.appendChild(cTitle);

    const ul = document.createElement('ul');
    ul.className = 'pm-list';
    data.components.forEach(c => {
      const li = document.createElement('li');
      li.textContent = c;
      ul.appendChild(li);
    });
    modal.appendChild(ul);
  }

  if (data.howItWorks && data.howItWorks.length > 0) {
    const hTitle = document.createElement('div');
    hTitle.className = 'pm-section-title';
    hTitle.textContent = 'How It Works';
    modal.appendChild(hTitle);

    const ol = document.createElement('ol');
    ol.className = 'pm-list';
    data.howItWorks.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s;
      ol.appendChild(li);
    });
    modal.appendChild(ol);
  }

  if (data.challenge) {
    const chTitle = document.createElement('div');
    chTitle.className = 'pm-section-title';
    chTitle.textContent = 'Challenge & Fix';
    modal.appendChild(chTitle);

    const chEl = document.createElement('p');
    chEl.className = 'pm-summary';
    chEl.textContent = data.challenge;
    modal.appendChild(chEl);
  }

  if (data.status) {
    const stEl = document.createElement('div');
    stEl.className = 'pm-status';
    stEl.textContent = 'Status: ' + data.status;
    modal.appendChild(stEl);
  }

  if (data.live || data.github) {
    const linksDiv = document.createElement('div');
    linksDiv.className = 'pm-links';

    if (data.live) {
      const liveBtn = document.createElement('a');
      liveBtn.className = 'pm-btn';
      liveBtn.href = data.live;
      liveBtn.target = '_blank';
      liveBtn.rel = 'noopener noreferrer';
      liveBtn.textContent = 'Live Demo →';
      linksDiv.appendChild(liveBtn);
    }

    if (data.github) {
      const ghBtn = document.createElement('a');
      ghBtn.className = 'pm-btn github';
      ghBtn.href = data.github;
      ghBtn.target = '_blank';
      ghBtn.rel = 'noopener noreferrer';
      ghBtn.textContent = 'GitHub →';
      linksDiv.appendChild(ghBtn);
    }

    modal.appendChild(linksDiv);
  }

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
  document.body.style.overflow = 'hidden';

  setTimeout(() => backdrop.classList.add('is-active'), 10);

  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closePopup();
  });
}

function closePopup() {
  const backdrop = document.getElementById('projectPopupBackdrop');
  if (backdrop) {
    backdrop.classList.remove('is-active');
    setTimeout(() => backdrop.remove(), 300);
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closePopup();
});
