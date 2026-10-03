// Favicon animado con los stickers (el mismo del home), compartido por todas las paginas.
// Las rutas se resuelven desde la ubicacion de este script.
(function () {
  var script = document.currentScript;
  var root = script ? new URL("../", script.src) : new URL("./", window.location.href);
  var stickers = [
    "assets/stickers/Recurso 21.png",
    "assets/stickers/Recurso 22.png",
    "assets/stickers/Recurso 23.png",
    "assets/stickers/Recurso 24.png",
    "assets/stickers/Recurso 25.png",
    "assets/stickers/Recurso 26.png"
  ].map(function (path) {
    return new URL(path, root).href;
  });

  var favicon = document.getElementById("dynamic-favicon") || document.querySelector('link[rel~="icon"]');
  if (!favicon) {
    favicon = document.createElement("link");
    favicon.id = "dynamic-favicon";
    favicon.rel = "icon";
    favicon.type = "image/png";
    document.head.appendChild(favicon);
  }
  favicon.setAttribute("sizes", "128x128");
  favicon.href = stickers[0];

  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var images = [];
  var index = 0;
  var angle = 0;

  canvas.width = 128;
  canvas.height = 128;

  function updateFavicon(img) {
    var size = 118;
    var center = canvas.width / 2;
    var wobble = Math.sin(angle) * 0.14;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(wobble);
    ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
    try {
      favicon.href = canvas.toDataURL("image/png");
    } catch (error) {
      // Canvas bloqueado (p. ej. abriendo el archivo local): se usa la imagen sin girar
      favicon.href = img.src;
    }
  }

  function rotateFavicon() {
    if (!images.length) return;
    angle += 0.9;
    updateFavicon(images[index % images.length]);
    index++;
  }

  stickers.forEach(function (src) {
    var img = new Image();
    img.onload = function () {
      images.push(img);
      if (images.length === 1) {
        rotateFavicon();
        setInterval(rotateFavicon, 650);
      }
    };
    img.src = src;
  });
})();
