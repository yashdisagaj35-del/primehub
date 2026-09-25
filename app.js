import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";


// ===============================
// FIREBASE CONFIG
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyBCx_8R-fGh9Ci4M-0Fk57dQnRfXe74YSY",
  authDomain: "primehub-12dde.firebaseapp.com",
  projectId: "primehub-12dde",
  storageBucket: "primehub-12dde.firebasestorage.app",
  messagingSenderId: "1081645394839",
  appId: "1:1081645394839:web:796cc1c3de6d1ce201b2d2",
  measurementId: "G-878ZB4S1LP"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);


// ===============================
// WEBSITE DATA
// ===============================

const defaultData = {
  about: "This section can be changed from the Admin panel.",

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
      text: "A space for your services and future business."
    }
  ],

  content: [
    {
      title: "Notes & PDFs",
      text: "Add useful documents and resources."
    },
    {
      title: "Photos",
      text: "Showcase your images and projects."
    },
    {
      title: "Updates",
      text: "Publish new work, ideas and announcements."
    }
  ],

  contact: {
    email: "your@email.com",
    instagram: "@yourusername",
    phone: "+91 XXXXX XXXXX"
  }
};


// ===============================
// GET DATA
// ===============================

function getData() {

  try {

    return JSON.parse(
      localStorage.getItem("yashSiteData")
    ) || defaultData;

  } catch (error) {

    return defaultData;

  }

}


// ===============================
// ESCAPE HTML
// ===============================

function esc(value) {

  return String(value).replace(
    /[&<>"']/g,
    function (m) {

      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"

      }[m];

    }
  );

}


// ===============================
// RENDER WEBSITE
// ===============================

function render() {

  const d = getData();

  const about = document.getElementById("aboutText");

  if (about) {
    about.textContent = d.about;
  }


  const services = document.getElementById("servicesGrid");

  if (services) {

    services.innerHTML = d.services.map(function (x) {

      return `
        <article class="card">
          <h3>${esc(x.title)}</h3>
          <p>${esc(x.text)}</p>
        </article>
      `;

    }).join("");

  }


  const content = document.getElementById("contentGrid");

  if (content) {

    content.innerHTML = d.content.map(function (x) {

      return `
        <article class="card">
          <h3>${esc(x.title)}</h3>
          <p>${esc(x.text)}</p>
        </article>
      `;

    }).join("");

  }


  const contact = document.getElementById("contactCard");

  if (contact) {

    contact.innerHTML = `
      <p>
        <b>Email:</b>
        <a href="mailto:${esc(d.contact.email)}">
          ${esc(d.contact.email)}
        </a>
      </p>

      <p>
        <b>Instagram:</b>
        ${esc(d.contact.instagram)}
      </p>

      <p>
        <b>Phone:</b>
        ${esc(d.contact.phone)}
      </p>
    `;

  }


  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

}


// ===============================
// START
// ===============================

render();


// Make Firebase available if needed
window.primehubAuth = auth;
window.primehubSignIn = signInWithEmailAndPassword;
window.primehubSignOut = signOut;
window.primehubAuthState = onAuthStateChanged;
