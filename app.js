import {
  initializeApp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";

import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";


const firebaseConfig = {

  apiKey:"AIzaSyCqZVROZOMbmHA3-cXZ8ql5LFnKkTr9jzk",

  authDomain:"primehub-12dde.firebaseapp.com",

  projectId:"primehub-12dde",

  storageBucket:"primehub-12dde.firebasestorage.app",

  messagingSenderId:"1081645394839",

  appId:"1:1081645394839:web:796cc1c3de6d1ce201b2d2",

  measurementId:"G-878ZB4S1LP"

};


const app=initializeApp(firebaseConfig);

const db=getFirestore(app);


/* DATA */

let siteData={

  about:{
    title:"About Me",
    text:""
  },

  contact:{
    email:"",
    phone:"",
    instagram:""
  },

  services:[],

  content:[],

  media:[]

};


/* LOAD DATA */

async function loadSite(){

  try{

    const snap=await getDoc(
      doc(db,"siteData","main")
    );

    if(snap.exists()){

      const d=snap.data();

      siteData={

        about:
          typeof d.about==="object"
          ?d.about
          :{
            title:"About Me",
            text:d.about||""
          },

        contact:d.contact||{},

        services:Array.isArray(d.services)
          ?d.services
          :[],

        content:Array.isArray(d.content)
          ?d.content
          :[],

        media:Array.isArray(d.media)
          ?d.media
          :[]

      };

    }


    renderAll();

  }

  catch(error){

    console.error(
      "Firebase error:",
      error
    );

  }

}


/* RENDER */

function renderAll(){

  renderAbout();

  renderServices();

  renderContent();

  renderMedia();

  renderContact();

  setupMenu();

  setupReveal();

  const year=document.getElementById("year");

  if(year){

    year.textContent=
      new Date().getFullYear();

  }

}


/* ABOUT */

function renderAbout(){

  const title=
    document.getElementById("aboutTitle");

  const text=
    document.getElementById("aboutText");


  if(title){

    title.textContent=
      siteData.about?.title||
      "About Me";

  }


  if(text){

    text.textContent=
      siteData.about?.text||
      "";

  }

}


/* SERVICES */

function renderServices(){

  const box=
    document.getElementById("servicesList");

  if(!box)return;

  box.innerHTML="";


  siteData.services.forEach(service=>{

    const div=
      document.createElement("div");

    div.className="service-card";


    div.innerHTML=`

      <h3>
        ${escapeHtml(service.title||"")}
      </h3>

      <p>
        ${escapeHtml(
          service.description||
          service.text||
          ""
        )}
      </p>

    `;


    box.appendChild(div);

  });

}


/* CONTENT */

function renderContent(){

  const box=
    document.getElementById("contentList");

  if(!box)return;

  box.innerHTML="";


  siteData.content.forEach(item=>{

    const div=
      document.createElement("div");

    div.className="content-card";


    div.innerHTML=`

      <h3>
        ${escapeHtml(item.title||"")}
      </h3>

      <p>
        ${escapeHtml(
          item.text||
          item.description||
          ""
        )}
      </p>

    `;


    box.appendChild(div);

  });

}


/* MEDIA */

function renderMedia(){

  const box=
    document.getElementById("mediaGrid");

  if(!box)return;


  box.innerHTML="";


  siteData.media.forEach((media,index)=>{

    const type=
      getMediaType(media);


    const card=
      document.createElement("article");

    card.className=
      "media-card";


    let visual="";


    if(type==="image"){

      visual=`

        <div class="media-thumb image-thumb">

          <img
            src="${media.url}"
            alt="${escapeHtml(media.title||"Photo")}"
            loading="lazy"
          >

        </div>

      `;

    }

    else if(type==="video"){

      visual=`

        <div class="media-thumb video-thumb">

          <video
            src="${media.url}"
            preload="metadata"
          ></video>

          <span class="play-icon">
            ▶
          </span>

        </div>

      `;

    }

    else{

      visual=`

        <div class="media-thumb pdf-thumb">

          <span>📄</span>

          <strong>PDF / NOTES</strong>

        </div>

      `;

    }


    card.innerHTML=`

      ${visual}

      <div class="media-info">

        <h3>
          ${escapeHtml(
            media.title||
            "Untitled"
          )}
        </h3>

        <p>
          ${escapeHtml(
            media.description||
            ""
          )}
        </p>

        <button
          class="media-open-btn"
          data-media-index="${index}">
          Open
        </button>

      </div>

    `;


    box.appendChild(card);

  });


  document
    .querySelectorAll(
      "[data-media-index]"
    )
    .forEach(button=>{

      button.onclick=()=>{

        const index=
          Number(
            button.dataset.mediaIndex
          );

        openMedia(
          siteData.media[index]
        );

      };

    });


  setupMediaFilters();

}


/* MEDIA TYPE */

function getMediaType(media){

  if(media.resourceType){

    return media.resourceType;

  }


  if(media.type==="photo"){

    return "image";

  }


  if(media.type==="video"){

    return "video";

  }


  if(
    media.format==="pdf"||
    media.url?.toLowerCase().includes(".pdf")
  ){

    return "raw";

  }


  return "image";

}


/* MEDIA FILTERS */

function setupMediaFilters(){

  const buttons=
    document.querySelectorAll(
      "[data-media-filter]"
    );

  if(!buttons.length)return;


  buttons.forEach(button=>{

    button.onclick=()=>{

      buttons.forEach(b=>
        b.classList.remove("active")
      );

      button.classList.add("active");


      const filter=
        button.dataset.mediaFilter;


      document
        .querySelectorAll(".media-card")
        .forEach((card,index)=>{

          const media=
            siteData.media[index];

          const type=
            getMediaType(media);


          let show=true;


          if(
            filter!=="all"&&
            filter!==type
          ){

            show=false;

          }


          card.style.display=
            show
            ?""
            :"none";

        });

    };

  });

}


/* OPEN MEDIA */

function openMedia(media){

  const modal=
    document.getElementById("mediaModal");

  if(!modal)return;


  const body=
    document.getElementById("mediaModalBody");

  const title=
    document.getElementById("mediaModalTitle");

  const download=
    document.getElementById("mediaDownload");


  const type=
    getMediaType(media);


  title.textContent=
    media.title||
    "Media";


  body.innerHTML="";


  if(type==="image"){

    body.innerHTML=`

      <img
        src="${media.url}"
        class="modal-image"
        alt=""
      >

    `;

    download.textContent=
      "⬇ Download Photo";

  }

  else if(type==="video"){

    body.innerHTML=`

      <video
        src="${media.url}"
        class="modal-video"
        controls
        autoplay
      ></video>

    `;

    download.textContent=
      "⬇ Download Video";

  }

  else{

    body.innerHTML=`

      <iframe
        src="${media.url}"
        class="modal-pdf">
      </iframe>

    `;

    download.textContent=
      "⬇ Download PDF";

  }


  download.href=
    makeDownloadUrl(media.url);


  download.target="_blank";


  modal.classList.add("show");

}


/* CLOUDINARY DOWNLOAD URL */

function makeDownloadUrl(url){

  if(!url)return "#";


  /*
    Cloudinary files can use fl_attachment
    for browser download.
  */

  if(
    url.includes("res.cloudinary.com")&&
    url.includes("/upload/")
  ){

    return url.replace(
      "/upload/",
      "/upload/fl_attachment/"
    );

  }


  return url;

}


/* CONTACT */

function renderContact(){

  const email=
    document.getElementById(
      "contactEmail"
    );

  const phone=
    document.getElementById(
      "contactPhone"
    );

  const instagram=
    document.getElementById(
      "contactInstagram"
    );


  if(email){

    const value=
      siteData.contact?.email||
      "";

    email.href=
      value
      ?"mailto:"+value
      :"#";

  }


  if(phone){

    const value=
      siteData.contact?.phone||
      "";

    phone.href=
      value
      ?"https://wa.me/"+
       value.replace(/\D/g,"")
      :"#";

  }


  if(instagram){

    instagram.href=
      siteData.contact?.instagram||
      "#";

  }

}


/* MENU */

function setupMenu(){

  const toggle=
    document.querySelector(
      ".menu-toggle"
    );

  const menu=
    document.querySelector(
      ".mobile-menu"
    );


  if(
    !toggle||
    !menu
  )return;


  toggle.onclick=()=>{

    menu.classList.toggle(
      "open"
    );

  };

}


/* MODAL CLOSE */

const modal=
  document.getElementById(
    "mediaModal"
  );


if(modal){

  const close=
    document.getElementById(
      "mediaModalClose"
    );


  close.onclick=()=>{

    modal.classList.remove(
      "show"
    );

  };


  modal.onclick=e=>{

    if(e.target===modal){

      modal.classList.remove(
        "show"
      );

    }

  };

}


/* REVEAL */

function setupReveal(){

  const items=
    document.querySelectorAll(
      ".reveal"
    );


  if(
    !("IntersectionObserver" in window)
  ){

    items.forEach(i=>
      i.classList.add("visible")
    );

    return;

  }


  const observer=
    new IntersectionObserver(
      entries=>{

        entries.forEach(entry=>{

          if(entry.isIntersecting){

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold:.12
      }
    );


  items.forEach(item=>
    observer.observe(item)
  );

}


/* ESCAPE HTML */

function escapeHtml(value){

  return String(value??"")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");

}


loadSite();
