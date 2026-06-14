(function () {
  var fallbackProjects = [
    { title: "Digital Doggies", slug: "digital-doggies", year: 2026, category: "print", cover: "assets/catalogo/A4-digitaldoggies.png" },
    { title: "Perritos A4", slug: "perritos-a4", year: 2026, category: "ilustracion", cover: "assets/catalogo/A4_dogs.png" },
    { title: "Sticker Club", slug: "sticker-club", year: 2026, category: "stickers", cover: "assets/catalogo/sticker_01.png" },
    { title: "Aurora", slug: "aurora", year: 2025, category: "identidad", cover: "assets/images/RS_aurora_fondo.png" },
    { title: "Doggies Pack", slug: "doggies-pack", year: 2025, category: "pack", cover: "assets/images/trabajos_new-04.jpg" },
    { title: "Rafita Prints", slug: "rafita-prints", year: 2025, category: "prints", cover: "assets/images/trabajos_new-05.jpg" },
    { title: "Mini Posters", slug: "mini-posters", year: 2025, category: "poster", cover: "assets/images/trabajos_new-06.jpg" },
    { title: "Perrito Azul", slug: "perrito-azul", year: 2024, category: "ilustracion", cover: "assets/catalogo/08.jpg" },
    { title: "Amistad", slug: "amistad", year: 2024, category: "ilustracion", cover: "assets/catalogo/09.jpg" },
    { title: "Kiosco", slug: "kiosco", year: 2024, category: "producto", cover: "assets/catalogo/10.png" },
  ];

  var desktopLayout = {
    top: 120,
    bottom: 120,
    rowHeight: 570,
    minX: 9,
    maxX: 91,
    cellPadX: 4,
    cellPadY: 46,
    width: 24,
  };
  var mobileLayout = {
    top: 230,
    bottom: 150,
    rowHeight: 440,
    minX: 50,
    maxX: 50,
    cellPadX: 0,
    cellPadY: 32,
    width: 78,
  };

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
    if (project.slug) return "pages/proyectos/" + encodeURIComponent(project.slug) + ".html";
    if (project.url) return String(project.url).replace(/^\/?pages\//, "pages/");
    return "pages/proyectos.html";
  }

  function localAssetPath(value) {
    if (!value) return "";
    if (/^(https?:)?\/\//.test(value) || value.startsWith("data:")) return value;
    return String(value).replace(/^\/+/, "");
  }

  function coverAlt(project) {
    if (project.coverAlt) return project.coverAlt;
    if (Array.isArray(project.gallery)) {
      var cover = String(project.cover || "").replace(/^\/+/, "");
      var match = project.gallery.find(function (item) {
        if (!item || typeof item !== "object") return false;
        return String(item.image || item.src || item.url || "").replace(/^\/+/, "") === cover;
      });
      if (match && match.alt) return match.alt;
    }
    return project.title || project.category || "Proyecto Rafita Studio";
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function shuffleItems(items) {
    var shuffled = items.slice();
    for (var index = shuffled.length - 1; index > 0; index--) {
      var swapIndex = Math.floor(Math.random() * (index + 1));
      var current = shuffled[index];
      shuffled[index] = shuffled[swapIndex];
      shuffled[swapIndex] = current;
    }
    return shuffled;
  }

  function createLayout(count) {
    var isMobile = window.matchMedia("(max-width: 720px)").matches;
    var config = isMobile ? mobileLayout : desktopLayout;

    if (isMobile) {
      var mobilePositions = Array.from({ length: count }, function (_, index) {
        return {
          x: "50.00",
          y: config.top + index * config.rowHeight,
          w: config.width + "vw",
          mw: config.width + "vw",
          z: 4 + index,
        };
      });

      return {
        config,
        positions: mobilePositions,
        height: Math.max(620, config.top + Math.max(0, count - 1) * config.rowHeight + config.bottom + 170),
      };
    }

    var columns = isMobile ? 1 : Math.min(3, Math.max(2, Math.ceil(Math.sqrt(count + 1))));
    var rows = Math.max(1, Math.ceil(count / columns));
    var cells = [];
    var positions = [];
    var xStep = columns > 1 ? (config.maxX - config.minX) / columns : 0;

    for (var row = 0; row < rows; row++) {
      for (var column = 0; column < columns; column++) {
        cells.push({ row, column });
      }
    }

    shuffleItems(cells).slice(0, count).forEach(function (cell, index) {
      var width = config.width;
      var xMin = isMobile ? config.minX : config.minX + xStep * cell.column + config.cellPadX;
      var xMax = isMobile ? config.maxX : config.minX + xStep * (cell.column + 1) - config.cellPadX;
      positions.push({
        x: randomBetween(xMin, xMax).toFixed(2),
        y: Math.round(config.top + cell.row * config.rowHeight + randomBetween(config.cellPadY, config.rowHeight - config.cellPadY)),
        w: width + "vw",
        mw: mobileLayout.width + "vw",
        z: 4 + index,
      });
    });

    return {
      config,
      positions,
      height: Math.max(720, config.top + rows * config.rowHeight + config.bottom - 70),
    };
  }

  function renderThumb(project, index, positions) {
    var position = positions[index];
    var link = document.createElement("a");
    link.className = "featured-project-thumb";
    link.href = projectHref(project);
    link.setAttribute("aria-label", "Proyecto destacado " + (project.title || "Rafita Studio"));
    link.style.setProperty("--x", position.x + "%");
    link.style.setProperty("--y", position.y + "px");
    link.style.setProperty("--w", position.w);
    link.style.setProperty("--mobile-w", position.mw);
    link.style.setProperty("--z", position.z);

    var image = document.createElement("img");
    image.src = localAssetPath(project.cover);
    image.alt = coverAlt(project);
    image.loading = "lazy";
    link.appendChild(image);

    var caption = document.createElement("span");
    caption.className = "featured-project-caption";

    var title = document.createElement("span");
    title.textContent = project.title || "Proyecto";
    caption.appendChild(title);

    var year = document.createElement("span");
    year.textContent = project.year || project.category || "";
    caption.appendChild(year);

    link.appendChild(caption);
    return link;
  }

  function renderProjects(section, inner, stage, projects) {
    var source = projects.length > 0 ? projects : fallbackProjects.slice(0, 5);
    var visibleProjects = source.filter(function (project) {
      return project && project.cover;
    });

    if (visibleProjects.length === 0) return;

    var layout = createLayout(visibleProjects.length);
    stage.innerHTML = "";
    inner.style.setProperty("--featured-height", Math.round(layout.height) + "px");
    visibleProjects.forEach(function (project, index) {
      stage.appendChild(renderThumb(project, index, layout.positions));
    });

    section.hidden = false;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var section = document.querySelector(".featured-projects-section");
    var inner = document.querySelector(".featured-projects-inner");
    var stage = document.getElementById("featured-projects-stage");

    if (!section || !inner || !stage) return;

    fetch("./data/projects.json", { cache: "no-cache" })
      .then(function (response) {
        if (!response.ok) throw new Error("No se pudo cargar projects.json");
        return response.json();
      })
      .then(function (projects) {
        var featured = Array.isArray(projects)
          ? projects.filter(function (project) {
              return project && project.featured === true && project.published !== false;
            }).sort(sortProjects)
          : [];

        renderProjects(section, inner, stage, featured);
      })
      .catch(function () {
        renderProjects(section, inner, stage, []);
      });
  });
})();
