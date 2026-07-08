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
    : "https://portafolio-erick-abad.vercel.app/api/send-email";

  document.addEventListener("DOMContentLoaded", function () {
    // ===== Contacto =====
    const contactForm = document.getElementById("contactForm");

    if (!contactForm) {
      console.error("❌ No se encontró el formulario con el ID 'contactForm'");
    } else {
      contactForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        if (!name || !email || !subject || !message) {
          showErrorMessage("⚠️ Todos los campos son obligatorios.");
          return;
        }

        try {
          const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, subject, message })
          });

          let result = {};
          try {
            result = await response.json();
          } catch (_) {
            result = { success: false, message: "Respuesta inválida del servidor." };
          }

          if (response.ok && result.success) {
            showSuccessMessage("✅ ¡Mensaje enviado con éxito!");
            contactForm.reset();
          } else {
            showErrorMessage(`❌ ${result.message || "No se pudo enviar el mensaje."}`);
          }
        } catch (error) {
          console.error("❌ Error en la solicitud fetch:", error);
          showErrorMessage("❌ Error en la conexión con el servidor.");
        }
      });
    }

    // ===== Testimonios (propios) =====
    const testimonialItems = document.getElementById("testimonialItems");
    const testimonialEmpty = document.getElementById("testimonialEmpty");
    const tNombre = document.getElementById("t_nombre");
    const tCargo = document.getElementById("t_cargo");
    const tTexto = document.getElementById("t_texto");
    const tFoto = document.getElementById("t_foto");
    const tEnviar = document.getElementById("t_enviar");
    const tMsg = document.getElementById("t_msg");

    const STORAGE_KEY = "erick_portafolio_testimonios_v1";

    const readTestimonials = () => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : [];
      } catch (_) {
        return [];
      }
    };

    const saveTestimonials = (items) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    };

    const escapeHtml = (str) => {
      const s = String(str);
      return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "<")
        .replace(/>/g, ">")
        .replace(/"/g, """)
        .replace(/'/g, "&#039;");
    };

    const renderTestimonials = () => {
      if (!testimonialItems) return;

      const items = readTestimonials();
      testimonialItems.innerHTML = "";

      if (!items.length) {
        if (testimonialEmpty) testimonialEmpty.style.display = "block";
        return;
      }

      if (testimonialEmpty) testimonialEmpty.style.display = "none";

      items
        .slice()
        .reverse()
        .forEach((t) => {
          const wrap = document.createElement("div");
          wrap.className = "testimonial-card";

          const fotoSrc = t.fotoBase64 ? `data:image/*;base64,${t.fotoBase64}` : "";
          wrap.innerHTML = `
            <div class="testimonial-card-inner">
              <img class="testimonial-avatar" src="${fotoSrc || ""}" alt="${escapeHtml(t.nombre || "Foto")}" />
              <div class="testimonial-body">
                <h4 class="testimonial-name">${escapeHtml(t.nombre || "Anónimo")}</h4>
                ${t.cargo ? `<div class="testimonial-role">${escapeHtml(t.cargo)}</div>` : ""}
                <p class="testimonial-text">${escapeHtml(t.texto || "")}</p>
                <div class="testimonial-date">${escapeHtml(t.fecha || "")}</div>
              </div>
            </div>
          `;

          testimonialItems.appendChild(wrap);
        });
    };

    const fileToBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          // reader.result: data:*/*;base64,XXXX
          const res = String(reader.result || "");
          const idx = res.indexOf("base64,");
          if (idx === -1) return resolve("");
          resolve(res.slice(idx + "base64,".length));
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    const showTestimonialMsg = (message, isError = false) => {
      if (!tMsg) return;
      tMsg.textContent = message;
      tMsg.style.display = "block";
      tMsg.style.color = isError ? "#b00020" : "#0b6b2f";
    };

    if (tEnviar && testimonialItems) {
      renderTestimonials();

      tEnviar.addEventListener("click", async function () {
        const nombre = (tNombre?.value || "").trim();
        const cargo = (tCargo?.value || "").trim();
        const texto = (tTexto?.value || "").trim();

        if (!nombre || !texto) {
          showTestimonialMsg("⚠️ Nombre y testimonio son obligatorios.", true);
          return;
        }

        let fotoBase64 = "";
        if (tFoto && tFoto.files && tFoto.files[0]) {
          const file = tFoto.files[0];
          if (file.size > 3 * 1024 * 1024) {
            showTestimonialMsg("⚠️ La foto debe pesar menos de 3MB.", true);
            return;
          }
          try {
            fotoBase64 = await fileToBase64(file);
          } catch (_) {
            showTestimonialMsg("❌ No se pudo leer la foto. Inténtalo nuevamente.", true);
            return;
          }
        }

        const fecha = new Date();
        const fechaStr = fecha.toLocaleString("es-EC");

        const items = readTestimonials();
        items.push({ nombre, cargo, texto, fotoBase64, fecha: fechaStr });
        saveTestimonials(items);

        // reset
        if (tNombre) tNombre.value = "";
        if (tCargo) tCargo.value = "";
        if (tTexto) tTexto.value = "";
        if (tFoto) tFoto.value = "";

        showTestimonialMsg("✅ Testimonio publicado (guardado en este navegador).");
        renderTestimonials();
      });
    }
  });

  /**
   * Función para mostrar mensajes de error
   */
  function showErrorMessage(message) {
    const errorMessage = document.querySelector(".error-message");
    if (errorMessage) {
      errorMessage.textContent = message;
      errorMessage.style.display = "block";
    }
  }

  /**
   * Función para mostrar mensajes de éxito
   */
  function showSuccessMessage(message) {
    const successMessage = document.querySelector(".sent-message");
    if (successMessage) {
      successMessage.textContent = message;
      successMessage.style.display = "block";
      const err = document.querySelector(".error-message");
      if (err) err.style.display = "none";
    }
  }

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
