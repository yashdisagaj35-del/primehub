import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


/* ==============================
   FIREBASE
================================ */

const firebaseConfig = {
  apiKey: "AIzaSyBCx8_8R-fGh9CiM4-0Fk57dQnRfXe74YSY",
  authDomain: "primehub-12dde.firebaseapp.com",
  projectId: "primehub-12dde",
  storageBucket: "primehub-12dde.firebasestorage.app",
  messagingSenderId: "1081645394839",
  appId: "1:1081645394839:web:796cc1c3de6d1ce201b2d2",
  measurementId: "G-878ZB4S1LP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/* ==============================
   HELPERS
================================ */

function esc(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function safeUrl(value = "") {

  try {
    const url = new URL(value);

    if (
      url.protocol === "https:" ||
      url.protocol === "http:"
    ) {
      return url.href;
    }

  } catch {}

  return "#";
}


function normalizeType(item) {

  const type = String(
    item.type ||
    item.resourceType ||
    ""
  ).toLowerCase();

  const url = String(item.url || "").toLowerCase();

  if (
    type === "image" ||
    type === "photo" ||
    /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(url)
  ) {
    return "image";
  }

  if (
    type === "video" ||
    /\.(mp4|webm|mov|mkv)$/i.test(url)
  ) {
    return "video";
  }

  return "pdf";
}


/* ==============================
   ABOUT
================================ */

function renderAbout(data) {

  const box = document.getElementById("aboutBox");

  const title = data.about?.title || "Creative. Digital. Professional.";

  const text =
    data.about?.text ||
    "PrimeHub is a creative digital platform focused on professional work, content and media.";

  box.innerHTML = `
    <div class="about-number">PRIMEHUB</div>

    <div>
      <h3>${esc(title)}</h3>
      <p>${esc(text)}</p>
    </div>
  `;
}


/* ==============================
   SERVICES
================================ */

function renderServices(data) {

  const list = document.getElementById("servicesList");

  const services = Array.isArray(data.services)
    ? data.services
    : [];

  document.getElementById("serviceCount").textContent =
    services.length;

  if (!services.length) {

    list.innerHTML = `
      <div class="empty">
        No services added yet.
      </div>
    `;

    return;
  }

  list.innerHTML = services.map((item, index) => {

    const title = item.title || item.name || "Service";
    const description = item.description || "";

    return `
      <article class="service-card reveal">

        <div class="card-number">
          ${String(index + 1).padStart(2, "0")}
        </div>

        <h3>${esc(title)}</h3>

        <p>${esc(description)}</p>

        <span class="card-arrow">↗</span>

      </article>
    `;

  }).join("");

}


/* ==============================
   CONTENT
================================ */

function renderContent(data) {

  const list = document.getElementById("contentList");

  const content = Array.isArray(data.content)
    ? data.content
    : [];

  document.getElementById("contentCount").textContent =
    content.length;

  if (!content.length) {

    list.innerHTML = `
      <div class="empty">
        No content added yet.
      </div>
    `;

    return;
  }

  list.innerHTML = content.map((item, index) => {

    const title =
      item.title ||
      item.name ||
      `Content ${index + 1}`;

    const description =
      item.description ||
      item.text ||
      "";

    return `
      <article class="content-card reveal">

        <span class="content-tag">
          CONTENT
        </span>

        <h3>${esc(title)}</h3>

        <p>${esc(description)}</p>

      </article>
    `;

  }).join("");

}


/* ==============================
   MEDIA
================================ */

let allMedia = [];


function renderMedia(filter = "all") {

  const list = document.getElementById("mediaList");

  let media = [...allMedia];

  if (filter !== "all") {
    media = media.filter(
      item => normalizeType(item) === filter
    );
  }

  if (!media.length) {

    list.innerHTML = `
      <div class="empty">
        No ${filter === "all" ? "" : filter} media available.
      </div>
    `;

    return;
  }


  list.innerHTML = media.map((item, index) => {

    const type = normalizeType(item);

    const url = safeUrl(item.url || "");

    const title =
      item.title ||
      item.name ||
      (
        type === "image"
          ? "Photo"
          : type === "video"
          ? "Video"
          : "Notes"
      );

    const description =
      item.description || "";

    let preview = "";


    /* PHOTO */

    if (type === "image") {

      preview = `
        <div class="media-preview">
          <img
            src="${esc(url)}"
            alt="${esc(title)}"
            loading="lazy"
          >
        </div>
      `;

    }


    /* VIDEO */

    else if (type === "video") {

      preview = `
        <div class="media-preview video-preview">

          <video
            src="${esc(url)}"
            controls
            preload="metadata"
          ></video>

          <button
            class="open-media"
            data-url="${esc(url)}"
            data-type="video"
            data-title="${esc(title)}"
          >
            ▶ Open Video
          </button>

        </div>
      `;

    }


    /* PDF / NOTES */

    else {

      preview = `
        <div class="media-preview pdf-preview">

          <div class="pdf-icon">📄</div>

          <strong>PDF / NOTES</strong>

          <a
            href="${esc(url)}"
            target="_blank"
            rel="noopener"
            class="pdf-open"
          >
            Open Notes →
          </a>

        </div>
      `;
    }


    return `
      <article class="media-card reveal">

        ${preview}

        <div class="media-info">

          <span class="media-type">
            ${
              type === "image"
                ? "PHOTO"
                : type === "video"
                ? "VIDEO"
                : "NOTES"
            }
          </span>

          <h3>${esc(title)}</h3>

          ${
            description
              ? `<p>${esc(description)}</p>`
              : ""
          }

          ${
            type === "image"
              ? `
                <button
                  class="view-photo"
                  data-url="${esc(url)}"
                  data-title="${esc(title)}"
                >
                  View Photo →
                </button>
              `
              : ""
          }

        </div>

      </article>
    `;

  }).join("");


  activateMediaButtons();

}


/* ==============================
   MEDIA MODAL
================================ */

function activateMediaButtons() {

  document.querySelectorAll(".view-photo").forEach(button => {

    button.addEventListener("click", () => {

      openModal(
        button.dataset.url,
        "image",
        button.dataset.title
      );

    });

  });


  document.querySelectorAll(".open-media").forEach(button => {

    button.addEventListener("click", () => {

      openModal(
        button.dataset.url,
        "video",
        button.dataset.title
      );

    });

  });

}


function openModal(url, type, title) {

  const modal =
    document.getElementById("mediaModal");

  const content =
    document.getElementById("modalContent");

  if (type === "image") {

    content.innerHTML = `
      <img
        src="${esc(url)}"
        alt="${esc(title)}"
      >
      <h3>${esc(title)}</h3>
    `;

  } else {

    content.innerHTML = `
      <video
        src="${esc(url)}"
        controls
        autoplay
      ></video>

      <h3>${esc(title)}</h3>
    `;

  }

  modal.classList.add("show");

}


function closeModal() {

  const modal =
    document.getElementById("mediaModal");

  const content =
    document.getElementById("modalContent");

  modal.classList.remove("show");

  content.innerHTML = "";

}


document
  .getElementById("modalClose")
  .addEventListener("click", closeModal);


document
  .getElementById("mediaModal")
  .addEventListener("click", event => {

    if (event.target.id === "mediaModal") {
      closeModal();
    }

  });


/* ESC KEY */

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    closeModal();
  }

});


/* ==============================
   MEDIA TABS
================================ */

document.querySelectorAll(".media-tab").forEach(tab => {

  tab.addEventListener("click", () => {

    document
      .querySelectorAll(".media-tab")
      .forEach(t => t.classList.remove("active"));

    tab.classList.add("active");

    renderMedia(tab.dataset.filter);

  });

});


/* ==============================
   CONTACT
================================ */

function renderContact(data) {

  const contact = data.contact || {};

  const email = String(
    contact.email || ""
  ).trim();

  const phone = String(
    contact.phone || ""
  ).trim();

  const whatsapp = String(
    contact.whatsapp || phone
  ).trim();

  const instagram = String(
    contact.instagram || ""
  ).trim();


  /* EMAIL */

  if (email) {

    const mail =
      `mailto:${email}`;

    document.getElementById("emailLink").textContent =
      email;

    document.getElementById("emailLink").href =
      mail;

    document.getElementById("contactEmailBtn").href =
      mail;

  }


  /* PHONE */

  if (phone) {

    document.getElementById("phoneLink").textContent =
      phone;

    document.getElementById("phoneLink").href =
      `tel:${phone.replace(/[^\d+]/g, "")}`;

  }


  /* WHATSAPP */

  if (whatsapp) {

    const digits =
      whatsapp.replace(/\D/g, "");

    if (digits) {

      document.getElementById("whatsappLink").href =
        `https://wa.me/${digits}`;

    }

  }


  /* INSTAGRAM */

  if (instagram) {

    let instagramUrl = instagram;

    if (!instagram.startsWith("http")) {

      instagramUrl =
        `https://instagram.com/${instagram.replace("@", "")}`;

    }

    document.getElementById("instagramLink").href =
      safeUrl(instagramUrl);

  }

}


/* ==============================
   MOBILE MENU
================================ */

const menuBtn =
  document.getElementById("menuBtn");

const mobileMenu =
  document.getElementById("mobileMenu");


menuBtn.addEventListener("click", () => {

  mobileMenu.classList.toggle("show");

});


mobileMenu.querySelectorAll("a").forEach(link => {

  link.addEventListener("click", () => {

    mobileMenu.classList.remove("show");

  });

});


/* ==============================
   ANIMATIONS
================================ */

function startAnimations() {

  const elements =
    document.querySelectorAll(".reveal");

  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

          }

        });

      },
      {
        threshold: 0.12
      }
    );


  elements.forEach(element => {

    observer.observe(element);

  });

}


/* ==============================
   LOAD FIREBASE DATA
================================ */

async function loadWebsite() {

  try {

    const ref =
      doc(db, "siteData", "main");

    const snapshot =
      await getDoc(ref);


    if (!snapshot.exists()) {

      console.log("No siteData/main found.");

      return;

    }


    const data =
      snapshot.data();


    renderAbout(data);
    renderServices(data);
    renderContent(data);

    allMedia =
      Array.isArray(data.media)
        ? data.media
        : [];

    document.getElementById("mediaCount").textContent =
      allMedia.length;

    renderMedia("all");

    renderContact(data);

    document.getElementById("year").textContent =
      new Date().getFullYear();


    /* Start animation after dynamic content */

    document
      .querySelectorAll(".reveal")
      .forEach(el => {
        el.classList.add("ready");
      });

    startAnimations();


  } catch (error) {

    console.error(error);

    document.getElementById("servicesList").innerHTML =
      `<div class="error">Unable to load website data.</div>`;

  }

}


loadWebsite();
