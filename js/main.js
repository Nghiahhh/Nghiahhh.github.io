const sections = ["home", "about", "skills", "projects", "contact"];
let currentIndex = 0;

let isScrollingOrDragging = false;
const scrollCooldown = 800;
const scrollThreshold = 50;

const dragThreshold = 20;
let dragging = false;
let dragStartY = 0;
let gestureFired = false;

function toggleMenu() {
  const menu = document.getElementById("popup-menu");
  const icon = document.getElementById("menu-icon");
  const isActive = menu.classList.contains("active");

  if (isActive) {
    menu.classList.remove("active");
    icon.textContent = "☰";
    document.body.classList.remove("menu-open");
  } else {
    menu.classList.add("active");
    icon.textContent = "✕";
    document.body.classList.add("menu-open");
  }
}

function loadSection(sectionName, direction = "down") {
  const content = document.getElementById("content");

  content.classList.add(direction === "down" ? "slide-out-up" : "slide-out-down");

  setTimeout(() => {
    fetch(`pages/${sectionName}.html`)
      .then((res) => {
        if (!res.ok) throw new Error("Page not found");
        return res.text();
      })
      .then((data) => {
        content.innerHTML = data;

        const index = sections.indexOf(sectionName);
        if (index !== -1) currentIndex = index;

        if (sectionName === "home" || sectionName === "projects") {
          content.classList.remove("container");
        } else {
          content.classList.add("container");
        }

        const sectionElement = content.querySelector("section");
        if (sectionElement) {
          sectionElement.classList.add("active");
        }

        const menu = document.getElementById("popup-menu");
        if (menu.classList.contains("active")) toggleMenu();

        setupExploreButton();

        const exploreBtn = document.getElementById("explore-btn");
        if (exploreBtn) {
          exploreBtn.style.display = sectionName === "contact" ? "none" : "flex";
        }
      })
      .catch((err) => {
        console.error("❌ Fetch error:", err);
        content.innerHTML = "<p>Failed to load section.</p>";
      })
      .finally(() => {
        content.classList.remove("slide-out-up", "slide-out-down");
        content.classList.add(direction === "down" ? "slide-in-up" : "slide-in-down");
        setTimeout(() => {
          content.classList.remove("slide-in-up", "slide-in-down");
        }, 300);
      });
  }, 300);
}

function switchSectionBy(direction) {
  const nextIndex = currentIndex + (direction === "down" ? 1 : -1);
  if (nextIndex < 0 || nextIndex >= sections.length) return;

  isScrollingOrDragging = true;
  currentIndex = nextIndex;
  loadSection(sections[currentIndex], direction);

  setTimeout(() => { isScrollingOrDragging = false; }, scrollCooldown);
}

function handleScroll(e) {
  if (isScrollingOrDragging || Math.abs(e.deltaY) < scrollThreshold) return;

  const direction = e.deltaY > 0 ? "down" : "up";
  switchSectionBy(direction);
}

function onPointerDown(e) {
  if (isScrollingOrDragging) return;
  dragging = true;
  gestureFired = false;
  dragStartY = e.clientY;
}

function onPointerMove(e) {
  if (!dragging || isScrollingOrDragging || gestureFired) return;
  const dy = e.clientY - dragStartY;
  if (Math.abs(dy) >= dragThreshold) {
    const direction = dy < 0 ? "down" : "up";
    gestureFired = true;
    switchSectionBy(direction);
  }
}

function onPointerUpOrCancel() {
  dragging = false;
  gestureFired = false;
}

function setupExploreButton() {
  const exploreBtn = document.getElementById("explore-btn");
  if (exploreBtn) {
    const newBtn = exploreBtn.cloneNode(true);
    exploreBtn.parentNode.replaceChild(newBtn, exploreBtn);

    newBtn.addEventListener("click", () => {
      if (currentIndex < sections.length - 1) {
        currentIndex++;
        loadSection(sections[currentIndex], "down");
      }
    });
  }
}

function onTouchStart(e) {
  if (isScrollingOrDragging) return;
  dragging = true;
  gestureFired = false;
  dragStartY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
}

function onTouchMove(e) {
  if (!dragging || isScrollingOrDragging || gestureFired) return;
  const y = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
  const dy = y - dragStartY;
  if (Math.abs(dy) >= dragThreshold) {
    const direction = dy < 0 ? "down" : "up";
    gestureFired = true;
    try { e.preventDefault(); } catch (_) {}
    switchSectionBy(direction);
  }
}

function onTouchEndOrCancel() {
  dragging = false;
  gestureFired = false;
}

window.addEventListener("DOMContentLoaded", () => {
  loadSection(sections[currentIndex]);

  const toggleBtn = document.getElementById("menu-toggle");
  if (toggleBtn) toggleBtn.addEventListener("click", toggleMenu);

  document.querySelectorAll("[data-section]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = e.currentTarget.getAttribute("data-section");
      const index = sections.indexOf(section);
      if (index !== -1 && index !== currentIndex) {
        const direction = index > currentIndex ? "down" : "up";
        currentIndex = index;
        loadSection(section, direction);
      }
    });
  });

  const content = document.getElementById("content");
  if (content) {
    if (window.PointerEvent) {
      content.addEventListener("pointerdown", onPointerDown);
      content.addEventListener("pointermove", onPointerMove, { passive: true });
      content.addEventListener("pointerup", onPointerUpOrCancel);
      content.addEventListener("pointercancel", onPointerUpOrCancel);
      content.addEventListener("pointerleave", onPointerUpOrCancel);
    } else {
      content.addEventListener("touchstart", onTouchStart, { passive: true });
      content.addEventListener("touchmove", onTouchMove, { passive: false });
      content.addEventListener("touchend", onTouchEndOrCancel);
      content.addEventListener("touchcancel", onTouchEndOrCancel);
    }
  }

});
