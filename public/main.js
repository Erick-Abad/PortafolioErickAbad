/**
 * Template Name: iPortfolio
 * Updated: Feb 2025 with Bootstrap v5.3.2
 * Template URL: https://bootstrapmade.com/iportfolio-bootstrap-portfolio-websites-template/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */

(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    return all ? [...document.querySelectorAll(el)] : document.querySelector(el);
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      navbarlink.classList.toggle(
        "active",
        position >= section.offsetTop && position <= section.offsetTop + section.offsetHeight
      );
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = el => {
    let elementPos = select(el).offsetTop;
    window.scrollTo({ top: elementPos, behavior: "smooth" });
  };

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      backtotop.classList.toggle("active", window.scrollY > 100);
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function () {
    select("body").classList.toggle("mobile-nav-active");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Scroll with offset on links with class name .scrollto
   */
  on("click", ".scrollto", function (e) {
    if (select(this.hash)) {
      e.preventDefault();
      let body = select("body");
      if (body.classList.contains("mobile-nav-active")) {
        body.classList.remove("mobile-nav-active");
        let navbarToggle = select(".mobile-nav-toggle");
        navbarToggle.classList.toggle("bi-list");
        navbarToggle.classList.toggle("bi-x");
      }
      scrollto(this.hash);
    }
  }, true);

  /**
   * Scroll with offset on page load with hash links in the URL
   */
  window.addEventListener("load", () => {
    if (window.location.hash && select(window.location.hash)) {
      scrollto(window.location.hash);
    }
  });

  /**
   * Hero type effect
   */
  const typed = select(".typed");
  if (typed) {
    let typed_strings = typed.getAttribute("data-typed-items").split(",");
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Testimonials slider
   */
  new Swiper(".testimonials-slider", {
    speed: 600,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false },
    slidesPerView: 1,
    pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }
  });

  /**
   * Configuración del formulario de contacto con servidor en Vercel
   */
  const API_URL = window.location.origin.includes("localhost")
    ? "http://localhost:3000/api/send-email"
    : "https://presentacion-green.vercel.app/api/send-email";

  document.addEventListener("DOMContentLoaded", function () {
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) {
      console.error("❌ No se encontró el formulario con el ID 'contactForm'");
      return;
    }

    contactForm.addEventListener("submit", async function (event) {
      event.preventDefault();

      const formData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        subject: document.getElementById("subject").value.trim(),
        message: document.getElementById("message").value.trim()
      };

      if (!formData.name || !formData.email || !formData.subject || !formData.message) {
        document.querySelector(".error-message").textContent = "⚠️ Todos los campos son obligatorios.";
        document.querySelector(".error-message").style.display = "block";
        return;
      }

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (result.success) {
          document.querySelector(".sent-message").textContent = "✅ ¡Mensaje enviado con éxito!";
          document.querySelector(".sent-message").style.display = "block";
          document.querySelector(".error-message").style.display = "none";
          contactForm.reset();
        } else {
          document.querySelector(".error-message").textContent = `❌ ${result.message}`;
          document.querySelector(".error-message").style.display = "block";
        }
      } catch (error) {
        console.error("❌ Error en la solicitud fetch:", error);
        document.querySelector(".error-message").textContent = "❌ Error en la conexión con el servidor.";
        document.querySelector(".error-message").style.display = "block";
      }
    });
  });

  /**
   * Animation on scroll
   */
  window.addEventListener("load", () => {
    /**
     * Skills animation - Corrección de la animación de la barra de habilidades
     */
    let skillsContent = select(".skills-content");
    if (skillsContent) {
      new Waypoint({
        element: skillsContent,
        offset: "80%",
        handler: function () {
          let progress = select(".progress .progress-bar", true);
          progress.forEach(el => {
            el.style.width = el.getAttribute("aria-valuenow") + "%";
          });
        }
      });
    }

    AOS.init({ duration: 1000, easing: "ease-in-out", once: true, mirror: false });
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();

})();
