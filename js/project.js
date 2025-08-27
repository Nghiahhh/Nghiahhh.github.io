const projects = [
  {
    title: "Narcissus",
    image: "images/Narcissus.png",
    link: "https://github.com/VuH0ngQuang/Narcissus",
    caption: "E-commerce flower site with JS frontend and a Java backend.",
  },
  {
    title: "Jewelry Shopping",
    image: "images/JewelryShopping.png",
    link: "https://github.com/ltdoanh2004/SE-project",
    caption: "React + Nodejs + MySQL shop with AI recommendations, real-time chatbot, 3D customization, and payment(MoMo/ZaloPay).",
  },
  {
    title: "Clash Royale Game",
    image: "images/Clash_royale-game.png",
    link: "https://github.com/Nghiahhh/Clash_Royale-game",
    caption: "Clash Royale–style game with a WebSocket server and a multi-language stack (Go/TypeScript/Dart).",
  },
  {
    title: "Data Mining – Coffee Quality",
    image: "images/Data_mining.png",
    link: "https://github.com/Nghiahhh/Data_Mining-project",
    caption: "Data mining pipeline to predict coffee roasting quality (Kaggle dataset; Java + notebook).",
  },
  {
    title: "Parking System",
    image: "images/Parking_System.png",
    link: "https://github.com/TanTaiHa/Parking-System",
    caption: "Java-based parking management system (slots, vehicles, history; DB-backed).",
  },
  {
    title: "NinjaDie",
    image: "images/NinjaDie.png",
    link: "https://github.com/VuH0ngQuang/NinjaDie",
    caption: "2D Java OOP ninja action game (maze, keys, doors) — runnable via NinjaDie.jar.",
  },
];

let currentSlide = 0;

function setTitleWithIndex(titleEl, idxZeroBased, titleText) {
  if (!titleEl) return;
  titleEl.textContent = "";

  const numSpan = document.createElement("span");
  numSpan.className = "project-index";
  numSpan.textContent = `${idxZeroBased + 1}. `;

  titleEl.appendChild(numSpan);
  titleEl.appendChild(document.createTextNode(titleText));
}

function showSlide(index) {
  const projectImage  = document.getElementById("project-image");
  const projectTitle  = document.getElementById("project-title");
  const projectLink   = document.getElementById("project-link");
  const projectCaption = document.getElementById("project-caption");

  if (!projectImage || !projectTitle || !projectLink) return false;

  const safeIndex = ((index % projects.length) + projects.length) % projects.length;
  const project = projects[safeIndex];

  projectImage.src = project.image;
  projectImage.alt = project.title;
  projectImage.title = project.caption || project.title;
  projectTitle.textContent = project.title;
  projectLink.title = `${safeIndex + 1}. ${project.caption || project.title}`;

  projectLink.href = project.link;
  projectLink.title = project.caption || project.title;

  setTitleWithIndex(projectTitle, safeIndex, project.title);

  if (projectCaption) {
    projectCaption.textContent = project.caption || "";
    projectCaption.style.display = project.caption ? "" : "none";
  }

  currentSlide = safeIndex;
  return true;
}

function changeSlide(direction) {
  showSlide(currentSlide + direction);
}

function ensureCarouselHydrated() {
  const img   = document.getElementById("project-image");
  const title = document.getElementById("project-title");
  const link  = document.getElementById("project-link");

  if (!img || !title || !link) return;

  if (!img.dataset.onerrorBound) {
    img.onerror = () => { img.src = "images/fallback.png"; img.onerror = null; };
    img.dataset.onerrorBound = "1";
  }

  const hasSrc  = !!img.getAttribute("src");
  const hasText = !!(title.textContent && title.textContent.trim());
  if (!hasSrc || !hasText) {
    currentSlide = 0;
    showSlide(0);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ensureCarouselHydrated();
});

const persistentObserver = new MutationObserver((mutations) => {
  for (const m of mutations) {
    if (m.addedNodes && m.addedNodes.length) {
      if (document.getElementById("project-image")) {
        ensureCarouselHydrated();
        break;
      }
    }
  }
});
persistentObserver.observe(document.body, { childList: true, subtree: true });

window.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") ensureCarouselHydrated();
});