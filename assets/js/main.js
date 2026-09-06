/* NAUTA DOMA — interactions du site */
(function () {
  "use strict";

  /* --- En-tête collant --------------------------------------------------- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* --- Menu mobile ------------------------------------------------------- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector(".nav__links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("is-open")) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* --- Apparition au défilement ------------------------------------------ */
  var revealables = document.querySelectorAll(".reveal");
  if (revealables.length) {
    if (!("IntersectionObserver" in window)) {
      revealables.forEach(function (el) { el.classList.add("is-in"); });
    } else {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
      );
      revealables.forEach(function (el) { io.observe(el); });
    }
  }

  /* --- Année courante dans le pied de page -------------------------------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();

  /* --- Formulaire de contact ---------------------------------------------- */
  var form = document.querySelector("#contact-form");
  if (form) {
    var status = document.querySelector("#form-status");
    var submit = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", function (e) {
      var endpoint = form.getAttribute("action") || "";

      // Tant que l'endpoint Formspree n'est pas renseigné, on bascule sur un
      // envoi par le client mail du visiteur plutôt que d'échouer en silence.
      if (endpoint.indexOf("VOTRE_ID") !== -1 || endpoint === "") {
        e.preventDefault();
        var data = new FormData(form);
        var body =
          "Nom : " + (data.get("nom") || "") + "\n" +
          "Email : " + (data.get("email") || "") + "\n" +
          "Téléphone : " + (data.get("telephone") || "") + "\n" +
          "Sujet : " + (data.get("sujet") || "") + "\n\n" +
          (data.get("message") || "");
        window.location.href =
          "mailto:nautadoma@gmail.com" +
          "?subject=" + encodeURIComponent("Demande via nautadoma.com — " + (data.get("sujet") || "Contact")) +
          "&body=" + encodeURIComponent(body);
        return;
      }

      e.preventDefault();
      if (submit) { submit.disabled = true; submit.textContent = "Envoi en cours…"; }

      fetch(endpoint, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      })
        .then(function (res) {
          if (!res.ok) throw new Error("http " + res.status);
          form.reset();
          if (status) {
            status.textContent =
              "Merci, votre message est parti. Je vous réponds sous 24 h ouvrées.";
            status.style.color = "var(--gold-bright)";
          }
        })
        .catch(function () {
          if (status) {
            status.textContent =
              "L'envoi a échoué. Écrivez-moi directement à nautadoma@gmail.com.";
            status.style.color = "#E58B7B";
          }
        })
        .finally(function () {
          if (submit) { submit.disabled = false; submit.textContent = "Envoyer ma demande"; }
        });
    });
  }
})();
