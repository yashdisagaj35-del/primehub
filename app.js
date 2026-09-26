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
    "AIzaSyBCx_8R-fGh9Ci4M-0Fk57dQnRfXe74YSY",

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

const app =
  initializeApp(firebaseConfig);

const db =
  getFirestore(app);


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
   GET FIREBASE DATA
========================================= */

async function getData() {

  try {

    const ref =
      doc(db, "siteData", "main");

    const snapshot =
      await getDoc(ref);

    if (snapshot.exists()) {

      return {
        ...defaultData,
        ...snapshot.data()
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
      Array.isArray(data.services)
        ? data.services
        : [];

    if (!services.length) {

      servicesGrid.innerHTML =
        "<p class='muted'>No services added yet.</p>";

    } else {

      servicesGrid.innerHTML =
        services.map(item => `

          <article class="card">

            <h3>
              ${esc(item.title)}
            </h3>

            <p>
              ${esc(item.text)}
            </p>

          </article>

        `).join("");

    }

  }


  /* CONTENT */

  const contentGrid =
    document.getElementById(
      "contentGrid"
    );

  if (contentGrid) {

    const content =
      Array.isArray(data.content)
        ? data.content
        : [];

    if (!content.length) {

      contentGrid.innerHTML =
        "<p class='muted'>No content added yet.</p>";

    } else {

      contentGrid.innerHTML =
        content.map(item => `

          <article class="card">

            <h3>
              ${esc(item.title)}
            </h3>

            <p>
              ${esc(item.text)}
            </p>

          </article>

        `).join("");

    }

  }


  /* MEDIA */

  renderMedia(data.media);


  /* CONTACT */

  const contactCard =
    document.getElementById(
      "contactCard"
    );

  if (contactCard) {

    const contact =
      data.contact ||
      defaultData.contact;

    contactCard.innerHTML = `

      ${
        contact.email
          ? `
            <p>
              <b>Email:</b>
              <a
                href="mailto:${esc(contact.email)}"
              >
                ${esc(contact.email)}
              </a>
            </p>
          `
          : ""
      }

      ${
        contact.instagram
          ? `
            <p>
              <b>Instagram:</b>
              ${esc(contact.instagram)}
            </p>
          `
          : ""
      }

      ${
        contact.phone
          ? `
            <p>
              <b>Phone:</b>
              ${esc(contact.phone)}
            </p>
          `
          : ""
      }

    `;

  }


  /* YEAR */

  const year =
    document.getElementById(
      "year"
    );

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }

}


/* =========================================
   MEDIA RENDER
========================================= */

function renderMedia(media) {

  const mediaGrid =
    document.getElementById(
      "mediaGrid"
    );

  if (!mediaGrid) return;


  if (!Array.isArray(media) ||
      media.length === 0) {

    mediaGrid.innerHTML = `
      <p class="muted">
        No media uploaded yet.
      </p>
    `;

    return;

  }


  mediaGrid.innerHTML =
    media.map(item => {

      const url =
        esc(item.url);

      const title =
        esc(item.title);

      const description =
        esc(item.description || "");

      const type =
        item.resourceType || "";


      /* IMAGE */

      if (
        type === "image" ||
        /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(
          item.url || ""
        )
      ) {

        return `

          <article class="card media-card">

            <img
              src="${url}"
              alt="${title}"
              loading="lazy"
              style="
                width:100%;
                border-radius:12px;
                display:block;
              "
            >

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
              Open image
            </a>

          </article>

        `;

      }


      /* VIDEO */

      if (
        type === "video" ||
        /\.(mp4|webm|mov|m4v)$/i.test(
          item.url || ""
        )
      ) {

        return `

          <article class="card media-card">

            <video
              controls
              preload="metadata"
              style="
                width:100%;
                border-radius:12px;
                display:block;
              "
            >

              <source
                src="${url}"
              >

              Your browser does not support video.

            </video>

            <h3>
              ${title}
            </h3>

            ${
              description
                ? `<p>${description}</p>`
                : ""
            }

          </article>

        `;

      }


      /* PDF / OTHER */

      return `

        <article class="card media-card">

          <h3>
            📄 ${title}
          </h3>

          ${
            description
              ? `<p>${description}</p>`
              : ""
          }

          <a
            class="btn"
            href="${url}"
            target="_blank"
            rel="noopener"
          >
            Open document
          </a>

        </article>

      `;

    }).join("");

}


/* =========================================
   START
========================================= */

render();
