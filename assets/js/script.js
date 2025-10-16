// Loader - optimized for mobile (reduced duration for better performance)
window.addEventListener("load", () => {
  const loaderDuration = isMobile ? 800 : 1000;
  setTimeout(() => {
    const loader = document.getElementById("pageLoader");
    if (loader) {
      loader.classList.add("hidden");
      // Remove loader from DOM after animation
      setTimeout(() => {
        loader.remove();
      }, 500);
    }
    // Remove will-change after animations complete
    setTimeout(() => {
      document.querySelectorAll('.hero-content h1, .hero-subline, .hero-buttons').forEach(el => {
        el.classList.add('loaded');
      });
    }, 1000);
  }, loaderDuration);
});

// Custom cursor - disable on mobile and touch devices (optimized)
const isMobile = window.innerWidth <= 768;
const isTouch = 'ontouchstart' in window;

// Remove cursor immediately on mobile to reduce DOM size
if (isMobile || isTouch) {
  const cursor = document.getElementById("customCursor");
  if (cursor) cursor.remove();
} else if (window.innerWidth > 768) {
  const cursor = document.getElementById("customCursor");
  if (cursor) {
    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.classList.add("active");
    }, { passive: true });

    (function animate() {
      const dx = mouseX - cursorX, dy = mouseY - cursorY;
      cursorX += dx * 0.1;
      cursorY += dy * 0.1;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      requestAnimationFrame(animate);
    })();

    document.querySelectorAll("a, button, .service-card, .gallery-item").forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("hover"), { passive: true });
      el.addEventListener("mouseleave", () => cursor.classList.remove("hover"), { passive: true });
    });
  }
}

// Nav scroll
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  const y = window.pageYOffset;
  if (y > 100) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
}, { passive: true });

// Mobile menu
const menuToggle = document.getElementById("menuToggle");
const menuClose = document.getElementById("menuClose");
const navLinksContainer = document.querySelector(".nav-links-container");
const preventScroll = (e) => e.preventDefault();

const closeMenu = () => {
  if (navLinksContainer) {
    navLinksContainer.classList.remove("active");
  }
  menuToggle.classList.remove("active");
  document.body.style.overflow = "";
  document.removeEventListener("touchmove", preventScroll);
};

menuToggle.addEventListener("click", () => {
  const isActive = navLinksContainer.classList.toggle("active");
  menuToggle.classList.toggle("active");

  if (isActive) {
    document.body.style.overflow = "hidden";
    document.addEventListener("touchmove", preventScroll, { passive: false });
  } else {
    closeMenu();
  }
});

// Close button
if (menuClose) {
  menuClose.addEventListener("click", closeMenu);
}

// Close on link click
document.querySelectorAll(".nav-links a").forEach((link) =>
  link.addEventListener("click", closeMenu)
);

// Observer animations with fallback
const createObserver = () => {
  try {
    return new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const h2 = entry.target.querySelector("h2");
            if (h2) {
              h2.classList.add("animate");
            }
            const cards = entry.target.querySelectorAll(
              ".service-card, .why-us-item, .gallery-item, .footer-section"
            );
            cards.forEach((card, i) => {
              setTimeout(() => card.classList.add("animate"), i * 100);
            });
            const ci = entry.target.querySelector(".contact-info");
            const cf = entry.target.querySelector(".contact-form");
            if (ci) {
              ci.classList.add("animate");
            }
            if (cf) {
              setTimeout(() => cf.classList.add("animate"), 200);
            }
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
  } catch (error) {
    console.warn('IntersectionObserver not supported:', error);
    // Fallback: apply animations immediately
    document.querySelectorAll('.service-card, .why-us-item, .gallery-item, .footer-section, h2').forEach(el => {
      el.classList.add('animate');
    });
    return null;
  }
};

const observer = createObserver();
if (observer) {
  document
    .querySelectorAll("section, footer")
    .forEach((s) => observer.observe(s));
}

// Form fake submit
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector(".btn-primary");
  const t = btn.textContent;
  btn.textContent = "Envoi en cours...";
  btn.disabled = true;
  btn.style.transform = "scale(0.95)";
  setTimeout(() => {
    btn.textContent = "✓ Envoyé avec succès!";
    btn.style.background = "linear-gradient(135deg,#10b981,#059669)";
    setTimeout(() => {
      contactForm.reset();
      btn.textContent = t;
      btn.disabled = false;
      btn.style.background = "";
      btn.style.transform = "";
      alert(
        "Merci pour votre demande ! Nous vous contacterons dans les plus brefs délais."
      );
    }, 2000);
  }, 1500);
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    const tgt = document.querySelector(a.getAttribute("href"));
    if (tgt) {
      window.scrollTo({ top: tgt.offsetTop - 80, behavior: "smooth" });
    }
  });
});

// Gallery hover origin and tap toggle
document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("mousemove", (e) => {
    const r = item.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    item.style.transformOrigin = `${x}% ${y}%`;
  });
  
  // Tap to toggle overlay on touch devices
  if (isTouch) {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      item.classList.toggle("active");
    });
  }
});

// Optional scroll progress hook
window.addEventListener("scroll", () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const p = (window.pageYOffset / total) * 100; /* hook */
});
