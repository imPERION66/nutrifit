function nfGetSession() {
  try {
    return JSON.parse(localStorage.getItem("nf_session") || "null");
  } catch {
    return null;
  }
}

function nfRequireSession(redirectPath = "../login.html") {
  const session = nfGetSession();

  if (!session) {
    window.location.href = redirectPath;
    return null;
  }

  return session;
}

function nfToggleSidebar() {
  document.getElementById("sidebar")?.classList.toggle("open");
  document.getElementById("overlay")?.classList.toggle("show");
  document.getElementById("btn-menu")?.classList.toggle("open");
}

function nfCloseSidebar() {
  document.getElementById("sidebar")?.classList.remove("open");
  document.getElementById("overlay")?.classList.remove("show");
  document.getElementById("btn-menu")?.classList.remove("open");
}

function nfLogout() {
  if (confirm("Estas seguro de que deseas cerrar sesion?")) {
    localStorage.removeItem("nf_session");
    window.location.href = "../login.html";
  }
}

function nfInitApp(activePage) {
  const session = nfRequireSession("../login.html");

  if (!session) {
    return null;
  }

  const name = session.nombre || "Usuario";
  const email = session.email || "";
  const initial = name.charAt(0).toUpperCase();

  document.querySelectorAll("[data-user-avatar]").forEach((el) => {
    el.textContent = initial;
  });
  document.querySelectorAll("[data-user-name]").forEach((el) => {
    el.textContent = name;
  });
  document.querySelectorAll("[data-user-email]").forEach((el) => {
    el.textContent = email;
  });
  document.querySelectorAll("[data-user-first-name]").forEach((el) => {
    el.textContent = name.split(" ")[0];
  });

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.page === activePage);
  });

  nfEnhanceSidebar(activePage);
  nfPrefetchLinks();

  return session;
}

function nfEnhanceSidebar(activePage) {
  document.querySelectorAll(".nav-item").forEach((item) => {
    if (!item.querySelector(".nav-item__content")) {
      const icon = item.querySelector("i");
      const text = item.textContent.trim();
      const content = document.createElement("span");
      content.className = "nav-item__content";

      if (icon) {
        content.appendChild(icon.cloneNode(true));
      }

      const label = document.createElement("span");
      label.textContent = text;
      content.appendChild(label);

      item.innerHTML = "";
      item.appendChild(content);

      const indicator = document.createElement("span");
      indicator.className = "nav-item__indicator";
      indicator.setAttribute("aria-hidden", "true");
      item.appendChild(indicator);
    }

    item.classList.toggle("active", item.dataset.page === activePage);

    item.addEventListener("click", () => {
      document.querySelectorAll(".nav-item").forEach((link) => {
        link.classList.remove("is-pending");
      });
      item.classList.add("is-pending");
      document.body.classList.add("is-transitioning");
      sessionStorage.setItem("nf_last_page", item.dataset.page || "");
    });
  });
}

function nfPrefetchLinks() {
  const seen = new Set();

  function prefetch(url) {
    if (!url || seen.has(url) || url.startsWith("http") || url.startsWith("#")) {
      return;
    }

    const link = document.createElement("link");
    link.rel = "prefetch";
    link.href = url;
    document.head.appendChild(link);
    seen.add(url);
  }

  document.querySelectorAll(".nav-item, .module-card, .nf-link-button").forEach((link) => {
    const url = link.getAttribute("href");
    if (!url) {
      return;
    }

    link.addEventListener("mouseenter", () => prefetch(url), { once: true });
    link.addEventListener("touchstart", () => prefetch(url), { once: true });
  });
}
