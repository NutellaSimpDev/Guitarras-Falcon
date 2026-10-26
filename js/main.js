/* Guitarras Falcón — interacciones y animaciones */
(function () {
  "use strict";

  /* ---------- Menú móvil ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- Header al hacer scroll ---------- */
  var header = document.querySelector(".site-header");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- Enlace activo ---------- */
  var path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav a").forEach(function (a) {
    var href = (a.getAttribute("href") || "").split("#")[0].toLowerCase();
    if (href && href === path) a.classList.add("is-active");
  });

  /* ---------- Reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Contadores animados ---------- */
  var contadores = document.querySelectorAll("[data-contador]");
  if ("IntersectionObserver" in window && contadores.length) {
    var ioNum = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          ioNum.unobserve(el);
          var objetivo = parseFloat(el.getAttribute("data-contador")) || 0;
          var sufijo = el.getAttribute("data-sufijo") || "";
          var dur = 1400;
          var inicio = performance.now();
          function tick(now) {
            var t = Math.min(1, (now - inicio) / dur);
            var eased = 1 - Math.pow(1 - t, 3);
            var valor = Math.round(objetivo * eased);
            el.textContent = valor + sufijo;
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = objetivo + sufijo;
          }
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.4 }
    );
    contadores.forEach(function (el) {
      ioNum.observe(el);
    });
  }

  /* ---------- Parallax suave en la banda del hero ---------- */
  var parallax = document.querySelector(".hero__band img");
  if (parallax && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          var rect = parallax.parentElement.getBoundingClientRect();
          var offset = Math.max(-40, Math.min(40, rect.top * 0.12));
          parallax.style.setProperty("--parallax", offset + "px");
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  /* ---------- Formulario de contacto → WhatsApp + CRM ---------- */
  var form = document.getElementById("form-contacto");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var datos = {
        id: "L" + Date.now().toString(36).toUpperCase(),
        fecha: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
        nombres: (form.nombres.value || "").trim(),
        apellidos: (form.apellidos.value || "").trim(),
        telefono: (form.telefono.value || "").trim(),
        email: (form.email.value || "").trim(),
        mensaje: (form.mensaje.value || "").trim(),
        modelo: form.modelo ? form.modelo.value : "",
        origen: form.origen ? form.origen.value : "",
        estado: "Nuevo",
        proxima: "Responder en menos de 24 h",
        historial: [
          new Date().toLocaleString("es-PE") +
            " · Lead creado desde la web (" +
            (form.origen ? form.origen.value : "contacto") +
            ")",
        ],
      };

      try {
        var KEY = "falcon_crm_leads";
        var leads = JSON.parse(localStorage.getItem(KEY) || "[]");
        leads.unshift(datos);
        localStorage.setItem(KEY, JSON.stringify(leads));
      } catch (err) {
        /* almacenamiento no disponible */
      }

      var wa = "https://wa.me/51997842063?text=";
      var texto =
        "Hola Guitarras Falcón, me interesa una guitarra.%0A%0A" +
        "Nombre: " + encodeURIComponent(datos.nombres + " " + datos.apellidos) + "%0A" +
        "Teléfono: " + encodeURIComponent(datos.telefono) + "%0A" +
        "Modelo de interés: " + encodeURIComponent(datos.modelo || "Por definir") + "%0A" +
        "Mensaje: " + encodeURIComponent(datos.mensaje || "-");

      var exito = document.getElementById("form-exito");
      if (exito) {
        form.style.display = "none";
        exito.classList.add("is-visible");
        exito.scrollIntoView({ behavior: "smooth", block: "center" });
        var link = exito.querySelector("[data-wa-link]");
        if (link) link.href = wa + texto;
      } else {
        window.open(wa + texto, "_blank", "noopener");
      }
    });
  }

  /* ---------- Año dinámico en el pie ---------- */
  document.querySelectorAll("[data-anio]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
