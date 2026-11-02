// Lista de imágenes
const images = [
  "ilus_01.webp",
  "ilus_02.webp",
  "ilus_03.webp",
  "ilus_04.webp",
  "ilus_05.webp",
  "ilus_06.webp",
  "ilus_07.webp",
  "ilus_08.webp",
  "ilus_09.webp",
  "ilus_11.webp",
  "ilus_12.webp",
  "ilus_13.webp",
  "RS_aurora_fondo.webp",
  "trabajos_new-04.webp",
  "trabajos_new-05.webp",
  "trabajos_new-06.webp",
  "ilus_14.webp",
  "ilus_15.webp",
  "ilus_16.webp",
  "ilus_17.webp",
  "ilus_18.webp",
];

// Selecciona el contenedor
const gallery = document.getElementById("gallery");
const imageBase = new URL("../assets/images/", document.currentScript.src);

// Inserta las imágenes
images.forEach((file, index) => {
  const img = document.createElement("img");
  img.src = new URL(file, imageBase).href;
  img.alt = `Ilustración ${index + 1}`;
  gallery.appendChild(img);
});
