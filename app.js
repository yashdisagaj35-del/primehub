import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc
}
from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


/* =========================
   FIREBASE CONFIG
========================= */

const firebaseConfig = {
  apiKey: "AIzaSyBCx8R-fGh9Ci4M-0Fk57dQnRfXe74YSY",
  authDomain: "primehub-12dde.firebaseapp.com",
  projectId: "primehub-12dde",
  storageBucket: "primehub-12dde.firebasestorage.app",
  messagingSenderId: "1081645394839",
  appId: "1:1081645394839:web:796cc1c3de6d1ce201b2d2",
  measurementId: "G-878ZB4S1LP"
};


/* =========================
   INITIALIZE FIREBASE
========================= */

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


/* =========================
   DEFAULT DATA
========================= */

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

  content: [
    {
      title: "Notes & PDFs",
      text: "Useful documents and resources."
    },
    {
      title: "Photos",
      text: "Showcase images and projects."
    },
    {
      title: "Updates",
      text: "New work, ideas and announcements."
    }
  ],

  contact: {
    email: "your@email.com",
    instagram: "@yourusername",
    phone: "+91 XXXXX XXXXX"
  }

};


/* =========================
   ESCAPE HTML
========================= */

function esc(value) {

  return String(value ?? "").replace(/[&<>"']/g, m => ({

    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"

  }[m]));

}


/* =========================
   LOAD FIREBASE DATA
========================= */

async function getData() {

  try {

    const ref = doc(db, "siteData", "main");

    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {

      return snapshot.data();

    }

    return defaultData;

  } catch (error) {

    console.error("Firebase error:", error);

    return defaultData;

  }

}


/* =========================
   RENDER WEBSITE
========================= */

async function render() {

  const data = await getData();


  /* ABOUT */

  const aboutText =
    document.getElementById("aboutText");

  if (aboutText) {

    aboutText.textContent =
      data.about || defaultData.about;

  }


  /* SERVICES */

  const servicesGrid =
    document.getElementById("servicesGrid");

  if (servicesGrid) {

    const services =
      Array.isArray(data.services)
        ? data.services
        : defaultData.services;

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


  /* CONTENT */

  const contentGrid =
    document.getElementById("contentGrid");

  if (contentGrid) {

    const content =
      Array.isArray(data.content)
        ? data.content
        : defaultData.content;

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


  /* CONTACT */

  const contactCard =
    document.getElementById("contactCard");

  if (contactCard) {

    const contact =
      data.contact || defaultData.contact;


    contactCard.innerHTML = `

      <p>
        <b>Email:</b>
        <a href="mailto:${esc(contact.email)}">
          ${esc(contact.email)}
        </a>
      </p>

      <p>
        <b>Instagram:</b>
        ${esc(contact.instagram)}
      </p>

      <p>
        <b>Phone:</b>
        ${esc(contact.phone)}
      </p>

    `;

  }


  /* YEAR */

  const year =
    document.getElementById("year");

  if (year) {

    year.textContent =
      new Date().getFullYear();

  }

}


/* =========================
   START
========================= */

render();
