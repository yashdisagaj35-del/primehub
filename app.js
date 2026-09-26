import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


/* ================================
   FIREBASE
================================ */

const firebaseConfig = {
  apiKey: "AIzaSyCqZVROZOMbmHA3-cXZ8ql5LFnKkTr9jzk",
  authDomain: "primehub-12dde.firebaseapp.com",
  projectId: "primehub-12dde",
  storageBucket: "primehub-12dde.firebasestorage.app",
  messagingSenderId: "1081645394839",
  appId: "1:1081645394839:web:796cc1c3de6d1ce201b2d2",
  measurementId: "G-878ZB4S1LP"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


/* ================================
   HELPERS
================================ */

function escapeHTML(value) {

  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


function safeURL(value) {

  if (!value) {
    return "";
  }

  try {

    const url = new URL(value);

    if (
      url.protocol === "https:" ||
      url.protocol === "http:"
    ) {
      return url.href;
    }

  } catch (error) {
    return "";
  }

  return "";
}


/* ================================
   DEFAULT DATA
================================ */

const defaultData = {

  about: {
    title: "About PrimeHub",
    text:
      "PrimeHub is a modern digital space for creative work, professional services, projects, ideas and useful content."
  },

  services: [
    {
      title: "Video Editing",
      description:
        "Professional video editing for reels, short videos, social media and creative projects."
    },
    {
      title: "Creative Work",
      description:
        "Creative digital work designed to communicate ideas clearly and professionally."
    },
    {
      title: "Digital Projects",
      description:
        "Modern digital solutions, websites and project-focused creative work."
    }
  ],

  content: [],

  media: [],

  contact: {
    email: "",
    phone: "",
    instagram: ""
  }

};


/* ================================
   NORMALIZE DATA
================================ */

function normalizeData(data) {

  return {

    about: {
      title:
        data?.about?.title ||
        defaultData.about.title,

      text:
        data?.about?.text ||
        defaultData.about.text
    },

    services:
      Array.isArray(data?.services)
        ? data.services
        : defaultData.services,

    content:
      Array.isArray(data?.content)
        ? data.content
        : [],

    media:
      Array.isArray(data?.media)
        ? data.media
        : [],

    contact: {
      email:
        data?.contact?.email || "",

      phone:
        data?.contact?.phone || "",

      instagram:
        data?.contact?.instagram || ""
    }

  };
}


/* ================================
   ABOUT
================================ */

function renderAbout(data) {

  const element =
    document.getElementById("aboutText");

  if (!element) {
    return;
  }

  element.innerHTML = escapeHTML(
    data.about.text
  ).replace(/\n/g, "<br>");
}


/* ================================
   SERVICES
================================ */

function renderServices(data) {

  const grid =
    document.getElementById("servicesGrid");

  if (!grid) {
    return;
  }


  if (
    !Array.isArray(data.services) ||
    data.services.length === 0
  ) {

    grid.innerHTML = `
      <div class="loading">
        No services available yet.
      </div>
    `;

    return;
  }


  grid.innerHTML = data.services
    .map((service, index) => {

      return `
        <article class="service-card">

          <div class="service-number">
            ${String(index + 1).padStart(2, "0")}
          </div>

          <h3>
            ${escapeHTML(service.title || "Service")}
          </h3>

          <p>
            ${escapeHTML(
              service.description || ""
            )}
          </p>

        </article>
      `;

    })
    .join("");
}


/* ================================
   CONTENT
================================ */

function renderContent(data) {

  const grid =
    document.getElementById("contentGrid");

  if (!grid) {
    return;
  }


  if (
    !Array.isArray(data.content) ||
    data.content.length === 0
  ) {

    grid.innerHTML = `
      <div class="loading">
        No content available yet.
      </div>
    `;

    return;
  }


  grid.innerHTML = data.content
    .map(item => {

      return `
        <article class="content-card">

          <h3>
            ${escapeHTML(
              item.title || "Content"
            )}
          </h3>

          <p>
            ${escapeHTML(
              item.text || ""
            )}
          </p>

        </article>
      `;

    })
    .join("");
}


/* ================================
   MEDIA
================================ */

function getMediaIcon(item) {

  const resourceType =
    String(item?.resourceType || "").toLowerCase();

  const format =
    String(item?.format || "").toLowerCase();


  if (resourceType === "video") {
    return "▶";
  }


  if (
    resourceType === "image" ||
    ["jpg", "jpeg", "png", "webp", "gif"].includes(format)
  ) {
    return "✦";
  }


  if (
    format === "pdf" ||
    resourceType === "raw"
  ) {
    return "▣";
  }


  return "◆";
}


function renderMedia(data) {

  const grid =
    document.getElementById("mediaGrid");

  if (!grid) {
    return;
  }


  if (
    !Array.isArray(data.media) ||
    data.media.length === 0
  ) {

    grid.innerHTML = `
      <div class="loading">
        No media uploaded yet.
      </div>
    `;

    return;
  }


  grid.innerHTML = data.media
    .map((item, index) => {

      const url =
        safeURL(item.url);

      const title =
        escapeHTML(
          item.title ||
          `Media ${index + 1}`
        );

      const description =
        escapeHTML(
          item.description || ""
        );


      const resourceType =
        String(
          item.resourceType || ""
        ).toLowerCase();


      let thumbnail = `
        <div class="media-placeholder">
          ${getMediaIcon(item)}
        </div>
      `;


      if (
        url &&
        resourceType === "image"
      ) {

        thumbnail = `
          <img
            src="${url}"
            alt="${title}"
            loading="lazy"
          >
        `;

      }


      if (
        url &&
        resourceType === "video"
      ) {

        thumbnail = `
          <video
            src="${url}"
            controls
            preload="metadata"
          ></video>
        `;

      }


      return `
        <article class="media-card">

          <div class="media-thumb">
            ${thumbnail}
          </div>

          <div class="media-info">

            <h3>
              ${title}
            </h3>

            <p>
              ${description}
            </p>

            ${
              url
                ? `
                  <a
                    class="media-open-btn"
                    href="${url}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Media
                  </a>
                `
                : ""
            }

          </div>

        </article>
      `;

    })
    .join("");
}


/* ================================
   CONTACT
================================ */

function renderContact(data) {

  const card =
    document.getElementById("contactCard");

  if (!card) {
    return;
  }


  const email =
    data.contact.email;

  const phone =
    data.contact.phone;

  const instagram =
    data.contact.instagram;


  const items = [];


  if (email) {

    const emailSafe =
      escapeHTML(email);

    items.push(`
      <div class="contact-item">

        <span class="contact-label">
          EMAIL
        </span>

        <a
          class="contact-value"
          href="mailto:${emailSafe}"
        >
          ${emailSafe}
        </a>

      </div>
    `);

  }


  if (phone) {

    const phoneSafe =
      escapeHTML(phone);

    items.push(`
      <div class="contact-item">

        <span class="contact-label">
          PHONE
        </span>

        <a
          class="contact-value"
          href="tel:${phoneSafe}"
        >
          ${phoneSafe}
        </a>

      </div>
    `);

  }


  if (instagram) {

    const instagramSafe =
      safeURL(instagram);


    if (instagramSafe) {

      items.push(`
        <div class="contact-item">

          <span class="contact-label">
            INSTAGRAM
          </span>

          <a
            class="contact-value"
            href="${instagramSafe}"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>

        </div>
      `);

    }

  }


  if (items.length === 0) {

    card.innerHTML = `
      <div class="contact-item">

        <span class="contact-label">
          CONTACT
        </span>

        <div class="contact-value">
          Contact details will be available soon.
        </div>

      </div>
    `;

    return;
  }


  card.innerHTML =
    items.join("");
}


/* ================================
   LOAD FIREBASE DATA
================================ */

async function loadSite() {

  try {

    const reference =
      doc(db, "siteData", "main");


    const snapshot =
      await getDoc(reference);


    let data;


    if (snapshot.exists()) {

      data =
        normalizeData(
          snapshot.data()
        );

    } else {

      data =
        normalizeData(
          defaultData
        );

    }


    renderAbout(data);

    renderServices(data);

    renderContent(data);

    renderMedia(data);

    renderContact(data);


    console.log(
      "PrimeHub loaded successfully."
    );

  } catch (error) {

    console.error(
      "PrimeHub Firebase error:",
      error
    );


    const services =
      document.getElementById(
        "servicesGrid"
      );

    if (services) {

      services.innerHTML = `
        <div class="loading">
          Services could not be loaded.
        </div>
      `;

    }


    const content =
      document.getElementById(
        "contentGrid"
      );

    if (content) {

      content.innerHTML = `
        <div class="loading">
          Content could not be loaded.
        </div>
      `;

    }


    const media =
      document.getElementById(
        "mediaGrid"
      );

    if (media) {

      media.innerHTML = `
        <div class="loading">
          Media could not be loaded.
        </div>
      `;

    }


    const contact =
      document.getElementById(
        "contactCard"
      );

    if (contact) {

      contact.innerHTML = `
        <div class="contact-item">

          <span class="contact-label">
            PRIMEHUB
          </span>

          <div class="contact-value">
            Please try refreshing the page.
          </div>

        </div>
      `;

    }

  }

}


/* ================================
   YEAR
================================ */

const year =
  document.getElementById("year");

if (year) {

  year.textContent =
    new Date().getFullYear();

}


/* ================================
   START
================================ */

loadSite();
