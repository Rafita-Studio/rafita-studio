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

  var palette = ["#ff9418", "#66b6e9", "#099947", "#f193c9", "#ff3122", "#ffc21a", "#0d73c8", "#ffbcf2"];
  var stripCount = 3;
  var minCellsPerStrip = 8;
  var secondsPerCell = 7;

  function pickColor() {
    return palette[Math.floor(Math.random() * palette.length)];
  }

  function renderCell(project, isClone) {
    var link = document.createElement("a");
    link.className = "featured-project-cell";
    link.href = projectHref(project);
    link.style.setProperty("--cell-color", pickColor());
    if (isClone) {
      link.setAttribute("aria-hidden", "true");
      link.tabIndex = -1;
    }
    link.addEventListener("mouseenter", function () {
      link.style.setProperty("--cell-color", pickColor());
    });

    var media = document.createElement("span");
    media.className = "featured-project-media";
    var image = document.createElement("img");
    image.src = localAssetPath(project.cover);
    image.alt = isClone ? "" : coverAlt(project);
    image.loading = "lazy";
    image.decoding = "async";
    media.appendChild(image);
    link.appendChild(media);

    var meta = document.createElement("span");
    meta.className = "featured-project-meta";

    var name = document.createElement("span");
    name.className = "featured-project-name";
    name.textContent = project.title || "Proyecto";
    meta.appendChild(name);

    var year = document.createElement("span");
    year.className = "featured-project-year";
    year.textContent = project.year || "";
    meta.appendChild(year);

    link.appendChild(meta);
    return link;
  }

  function stripItems(projects, stripIndex) {
    // Cada tira parte en un punto distinto de la lista para que no se vean iguales
    var offset = Math.floor((projects.length / stripCount) * stripIndex);
    var count = Math.max(projects.length, minCellsPerStrip);
    var items = [];
    for (var i = 0; i < count; i++) {
      items.push(projects[(offset + i) % projects.length]);
    }
    return items;
  }

  function renderProjects(section, container, projects) {
    var source = projects.length > 0 ? projects : fallbackProjects;
    var visibleProjects = source.filter(function (project) {
      return project && project.cover;
    });

    if (visibleProjects.length === 0) return;

    container.innerHTML = "";
    for (var stripIndex = 0; stripIndex < stripCount; stripIndex++) {
      var items = stripItems(visibleProjects, stripIndex);
      var strip = document.createElement("div");
      strip.className = "featured-strip";
      var track = document.createElement("div");
      track.className = "featured-strip-track";
      track.style.setProperty("--strip-duration", (items.length * secondsPerCell + stripIndex * 6) + "s");

      // Se duplica la secuencia para que el loop sea continuo (translateX -50%)
      [false, true].forEach(function (isClone) {
        items.forEach(function (project) {
          track.appendChild(renderCell(project, isClone));
        });
      });

      strip.appendChild(track);
      container.appendChild(strip);
    }

    section.hidden = false;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var section = document.querySelector(".featured-projects-section");
    var container = document.getElementById("featured-projects-strips");

    if (!section || !container) return;

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

        renderProjects(section, container, featured);
      })
      .catch(function () {
        renderProjects(section, container, []);
      });
  });
})();
