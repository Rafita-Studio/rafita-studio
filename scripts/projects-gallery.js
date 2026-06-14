(function () {
  var palette = ["#ff9418", "#66b6e9", "#099947", "#f193c9", "#ff3122", "#ffc21a", "#0d73c8", "#5833a3"];
  var rowPalettes = [
    ["#66b6e9", "#0d73c8", "#099947", "#ff9418"],
    ["#ff3122", "#5833a3", "#ffc21a", "#f193c9"],
  ];

  function randomHover(item) {
    var color = palette[Math.floor(Math.random() * palette.length)];
    var rotate = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 2.4);
    item.style.setProperty("--link-hover-color", color);
    item.style.setProperty("--link-hover-rotate", rotate.toFixed(2) + "deg");
  }

  function paintProjectCards() {
    var cards = Array.prototype.slice.call(document.querySelectorAll(".project-card"));
    var columns = window.matchMedia("(max-width: 720px)").matches ? 2 : 4;

    cards.forEach(function (card, index) {
      var row = Math.floor(index / columns);
      var column = index % columns;
      var rowColors = rowPalettes[row % rowPalettes.length];
      var color = rowColors[column % rowColors.length];
      card.style.setProperty("--card-color", color);
    });
  }

  function hydrateInteractions() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".projects-home, .project-card"));

    paintProjectCards();
    items.forEach(function (item) {
      randomHover(item);
      item.addEventListener("mouseenter", function () {
        randomHover(item);
      });
      item.addEventListener("focus", function () {
        randomHover(item);
      });
    });
  }

  function normalizeCategory(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function sortProjects(a, b) {
    var aOrder = Number(a.order);
    var bOrder = Number(b.order);
    var aHasOrder = Number.isFinite(aOrder);
    var bHasOrder = Number.isFinite(bOrder);

    if (aHasOrder && bHasOrder && aOrder !== bOrder) return aOrder - bOrder;
    if (aHasOrder !== bHasOrder) return aHasOrder ? -1 : 1;
    return String(a.title || "").localeCompare(String(b.title || ""), "es", { sensitivity: "base" });
  }

  function projectHref(project) {
    if (project.slug) return "./proyectos/" + encodeURIComponent(project.slug) + ".html";
    if (project.url) return project.url.replace(/^\/pages\//, "./");
    return "#";
  }

  function renderCard(project) {
    var link = document.createElement("a");
    link.className = "project-card";
    link.href = projectHref(project);
    link.setAttribute("aria-label", "Proyecto " + (project.title || "Rafita Studio"));

    if (project.cover) {
      var img = document.createElement("img");
      img.src = project.cover;
      img.alt = project.title || project.category || "Proyecto Rafita Studio";
      img.loading = "lazy";
      link.appendChild(img);
    }

    var title = document.createElement("h2");
    title.className = "project-title";
    title.textContent = project.title || "Proyecto";
    link.appendChild(title);

    var meta = document.createElement("div");
    meta.className = "project-meta";

    var year = document.createElement("span");
    year.textContent = project.year || project.category || "";
    meta.appendChild(year);

    var client = document.createElement("span");
    client.className = "project-client";
    client.textContent = project.client || project.category || "";
    meta.appendChild(client);

    link.appendChild(meta);
    return link;
  }

  function showMessage(grid, message) {
    var notice = document.createElement("p");
    notice.className = "projects-gallery-message";
    notice.textContent = message;
    grid.appendChild(notice);
  }

  function setActiveFilter(filters, activeFilter) {
    filters.forEach(function (button) {
      var filterValue = button.getAttribute("data-project-filter") || "all";
      var normalizedFilter = filterValue === "all" ? "all" : normalizeCategory(filterValue);
      var isActive = normalizedFilter === activeFilter;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function projectsForFilter(projects, activeFilter) {
    if (activeFilter === "all") return projects;
    return projects.filter(function (project) {
      return normalizeCategory(project.category) === activeFilter;
    });
  }

  function renderProjects(grid, projects, activeFilter) {
    var filteredProjects = projectsForFilter(projects, activeFilter);
    grid.innerHTML = "";

    if (filteredProjects.length === 0) {
      showMessage(grid, "No hay proyectos en este filtro por ahora.");
      return;
    }

    filteredProjects.forEach(function (project) {
      grid.appendChild(renderCard(project));
    });
    hydrateInteractions();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var grid = document.querySelector("[data-projects-grid]");
    var filters = Array.prototype.slice.call(document.querySelectorAll("[data-project-filter]"));
    var activeFilter = "all";
    var loadedProjects = [];
    if (!grid) return;

    hydrateInteractions();
    window.addEventListener("resize", paintProjectCards);

    filters.forEach(function (button) {
      button.addEventListener("click", function () {
        var filterValue = button.getAttribute("data-project-filter") || "all";
        activeFilter = filterValue === "all" ? "all" : normalizeCategory(filterValue);
        setActiveFilter(filters, activeFilter);

        if (loadedProjects.length > 0) {
          renderProjects(grid, loadedProjects, activeFilter);
        }
      });
    });

    fetch("../data/projects.json", { cache: "no-cache" })
      .then(function (response) {
        if (!response.ok) throw new Error("No se pudo cargar projects.json");
        return response.json();
      })
      .then(function (projects) {
        if (!Array.isArray(projects) || projects.length === 0) return;

        var visibleProjects = projects
          .filter(function (project) {
            return project.published !== false;
          })
          .sort(sortProjects);

        if (visibleProjects.length === 0) return;

        loadedProjects = visibleProjects;
        renderProjects(grid, loadedProjects, activeFilter);
      })
      .catch(function () {
        if (!grid.children.length) {
          showMessage(grid, "No se pudieron cargar los proyectos por ahora.");
        }
      });
  });
})();
