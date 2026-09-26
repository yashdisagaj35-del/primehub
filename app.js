import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


/* =========================================
   FIREBASE CONFIG
========================================= */

const firebaseConfig = {

  apiKey:
    "AIzaSyBCx_8R-fGh9CiM4-0Fk57dQnRfXe74YSY",

  authDomain:
    "primehub-12dde.firebaseapp.com",

  projectId:
    "primehub-12dde",

  storageBucket:
    "primehub-12dde.firebasestorage.app",

  messagingSenderId:
    "1081645394839",

  appId:
    "1:1081645394839:web:796cc1c3de6d1ce201b2d2",

  measurementId:
    "G-878ZB4S1LP"
};


/* =========================================
   FIREBASE
========================================= */

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const dataRef = doc(
  db,
  "siteData",
  "main"
);


/* =========================================
   DEFAULT DATA
========================================= */

const defaultData = {

  about:
    "Welcome to PrimeHub — my personal and business digital space.",

  services: [
    {
      title: "Video Editing",
      text: "Professional short-form and video editing."
    },
    {
      title: "Creative Work",
      text: "Design, content and digital projects."
    },
    {
      title: "Business",
      text: "A space for services and future business ideas."
    }
  ],

  content: [],

  contact: {
    email: "",
    instagram: "",
    phone: ""
  },

  media: []
};


/* =========================================
   ESCAPE HTML
========================================= */

function esc(value) {

  return String(value ?? "")
    .replace(
      /[&<>"']/g,
      m => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
      }[m])
    );
}


/* =========================================
   SAFE URL
========================================= */

function safeUrl(value) {

  try {

    const url =
      new URL(value);

    if (
      url.protocol === "http:" ||
      url.protocol === "https:"
    ) {
      return url.href;
    }

  } catch {}

  return "";
}


/* =========================================
   INSTAGRAM URL
========================================= */

function instagramUrl(value) {

  if (!value) return "";

  const clean =
    String(value).trim();

  if (
    clean.startsWith("http://") ||
    clean.startsWith("https://")
  ) {
    return safeUrl(clean);
  }

  const username =
    clean
      .replace("@", "")
      .replace(/\s/g, "");

  return username
    ? `https://instagram.com/${encodeURIComponent(username)}`
    : "";
}


/* =========================================
   WHATSAPP URL
========================================= */

function whatsappUrl(value) {

  if (!value) return "";

  const phone =
    String(value)
      .replace(/[^\d]/g, "");

  if (!phone) return "";

  return `https://wa.me/${phone}`;
}


/* =========================================
   GET DATA
========================================= */

async function getData() {

  try {

    const snapshot =
      await getDoc(dataRef);

    if (snapshot.exists()) {

      const firebaseData =
        snapshot.data();

      return {
        ...defaultData,
        ...firebaseData,
        services:
          Array.isArray(firebaseData.services)
            ? firebaseData.services
            : [],
        content:
          Array.isArray(firebaseData.content)
            ? firebaseData.content
            : [],
        media:
          Array.isArray(firebaseData.media)
            ? firebaseData.media
            : [],
        contact:
          firebaseData.contact || defaultData.contact
      };
    }

    return defaultData;

  } catch (error) {

    console.error(
      "Firebase error:",
      error
    );

    return defaultData;
  }
}


/* =========================================
   RENDER
========================================= */

async function render() {

  const data =
    await getData();


  /* ABOUT */

  const aboutText =
    document.getElementById(
      "aboutText"
    );

  if (aboutText) {

    aboutText.textContent =
      data.about ||
      defaultData.about;
  }


  /* SERVICES */

  const servicesGrid =
    document.getElementById(
      "servicesGrid"
    );

  if (servicesGrid) {

    const services =
      data.services;

    if (!services.length) {

      servicesGrid.innerHTML =
        `<p class="muted">
          No services added yet.
        </p>`;

    } else {

      servicesGrid.innerHTML =
        services.map(
          (item, index) => `

            <article
              class="service-card reveal"
              style="--delay:${index * 80}ms"
            >

              <div class="service-icon">
                ${serviceIcon(index)}
              </div>

              <h3>
                ${esc(item.title)}
              </h3>

              <p>
                ${esc(item.text)}
              </p>

            </article>

          `
        ).join("");
    }
  }


  /* CONTENT */

  const contentGrid =
    document.getElementById(
      "contentGrid"
    );

  if (contentGrid) {

    const content =
      data.content;

    if (!content.length) {

      contentGrid.innerHTML =
        `<p class="muted">
          No content added yet.
        </p>`;

    } else {

      contentGrid.innerHTML =
        content.map(
          (item, index) => `

            <article
              class="content-card reveal"
              style="--delay:${index * 80}ms"
            >

              <span class="card-number">
                ${String(index + 1).padStart(2, "0")}
              </span>

              <h3>
                ${esc(item.title)}
              </h3>

              <p>
                ${esc(item.text)}
              </p>

            </article>

          `
        ).join("");
    }
  }


  /* MEDIA */

  renderMedia(data.media);


  /* CONTACT */

  renderContact(data.contact);


  /* YEAR */

  const year =
    document.getElementById("year");

  if (year) {

    year.textContent =
      new Date().getFullYear();
  }


  setupReveal();
}


/* =========================================
   SERVICE ICON
========================================= */

function serviceIcon(index) {

  const icons = [
    "✦",
    "◈",
    "◆",
    "✧",
    "●",
    "◇"
  ];

  return icons[index % icons.length];
}


/* =========================================
   CONTACT
========================================= */

function renderContact(contact) {

  const contactCard =
    document.getElementById(
      "contactCard"
    );

  if (!contactCard) return;

  const email =
    String(contact?.email || "").trim();

  const instagram =
    String(contact?.instagram || "").trim();

  const phone =
    String(contact?.phone || "").trim();


  let html = "";


  if (email) {

    html += `

      <div class="contact-item">

        <span class="contact-label">
          Email
        </span>

        <div class="contact-value">
          <a href="mailto:${esc(email)}">
            ${esc(email)}
          </a>
        </div>

      </div>

    `;
  }


  if (phone) {

    html += `

      <div class="contact-item">

        <span class="contact-label">
          WhatsApp / Phone
        </span>

        <div class="contact-value">
          <a
            href="${esc(whatsappUrl(phone))}"
            target="_blank"
            rel="noopener"
          >
            ${esc(phone)}
          </a>
        </div>

      </div>

    `;
  }


  if (instagram) {

    const ig =
      instagramUrl(instagram);

    html += `

      <div class="contact-item">

        <span class="contact-label">
          Instagram
        </span>

        <div class="contact-value">

          ${
            ig
              ? `
                <a
                  href="${esc(ig)}"
                  target="_blank"
                  rel="noopener"
                >
                  ${esc(instagram)}
                </a>
              `
              : esc(instagram)
          }

        </div>

      </div>

    `;
  }


  if (!html) {

    html = `

      <div class="contact-empty">

        <span>CONTACT</span>

        <p>
          Contact details will be added soon.
        </p>

      </div>

    `;
  }


  contactCard.innerHTML = html;
}


/* =========================================
   MEDIA
========================================= */

function renderMedia(media) {

  const mediaGrid =
    document.getElementById(
      "mediaGrid"
    );

  if (!mediaGrid) return;


  if (
    !Array.isArray(media) ||
    media.length === 0
  ) {

    mediaGrid.innerHTML =
      `<p class="muted">
        No media uploaded yet.
      </p>`;

    return;
  }


  mediaGrid.innerHTML =
    media.map(
      (item, index) => {

        const url =
          esc(item.url || "");

        const title =
          esc(item.title || "Untitled");

        const description =
          esc(item.description || "");

        const type =
          item.resourceType || "";

        let preview = "";


        /* IMAGE */

        if (
          type === "image" ||
          /\.(jpg|jpeg|png|gif|webp|avif)$/i
            .test(item.url || "")
        ) {

          preview = `

            <div class="media-preview">

              <img
                src="${url}"
                alt="${title}"
                loading="lazy"
              >

            </div>

          `;
        }


        /* VIDEO */

        else if (
          type === "video" ||
          /\.(mp4|webm|mov|m4v)$/i
            .test(item.url || "")
        ) {

          preview = `

            <div class="media-preview">

              <video
                controls
                preload="metadata"
              >

                <source
                  src="${url}"
                >

                Your browser does not support video.

              </video>

            </div>

          `;
        }


        /* PDF */

        else {

          preview = `

            <div class="media-preview pdf-preview">

              <div>
                📄
                <small>DOCUMENT</small>
              </div>

            </div>

          `;
        }


        return `

          <article
            class="media-card reveal"
            style="--delay:${index * 80}ms"
          >

            ${preview}

            <div class="media-info">

              <h3>
                ${title}
              </h3>

              ${
                description
                  ? `<p>${description}</p>`
                  : ""
              }

              <a
                href="${url}"
                target="_blank"
                rel="noopener"
              >
                ${
                  type === "video"
                    ? "Open video →"
                    : type === "image"
                    ? "Open image →"
                    : "Open document →"
                }
              </a>

            </div>

          </article>

        `;
      }
    ).join("");


  setupReveal();
}


/* =========================================
   SCROLL REVEAL
========================================= */

function setupReveal() {

  const elements =
    document.querySelectorAll(
      ".reveal:not(.visible)"
    );

  if (!elements.length) return;


  if (!("IntersectionObserver" in window)) {

    elements.forEach(
      el => el.classList.add("visible")
    );

    return;
  }


  const observer =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (
              entry.isIntersecting
            ) {

              const delay =
                entry.target.style
                  .getPropertyValue("--delay");

              if (delay) {

                entry.target.style.transitionDelay =
                  delay;
              }

              entry.target.classList.add(
                "visible"
              );

              observer.unobserve(
                entry.target
              );
            }
          }
        );

      },
      {
        threshold: 0.12
      }
    );


  elements.forEach(
    element =>
      observer.observe(element)
  );
}


/* =========================================
   MOBILE MENU
========================================= */

const menuBtn =
  document.getElementById(
    "menuBtn"
  );

const mainNav =
  document.getElementById(
    "mainNav"
  );


if (menuBtn && mainNav) {

  menuBtn.addEventListener(
    "click",
    () => {

      const open =
        mainNav.classList.toggle(
          "mobile-open"
        );

      menuBtn.classList.toggle(
        "active",
        open
      );

      menuBtn.setAttribute(
        "aria-expanded",
        String(open)
      );
    }
  );


  mainNav
    .querySelectorAll("a")
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {

          mainNav.classList.remove(
            "mobile-open"
          );

          menuBtn.classList.remove(
            "active"
          );

          menuBtn.setAttribute(
            "aria-expanded",
            "false"
          );
        }
      );
    });
}


/* =========================================
   START
========================================= */

render();
