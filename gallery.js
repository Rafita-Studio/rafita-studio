// Lista de imágenes
const images = [
  "ilus_01.jpg",
  "ilus_02.jpg",
  "ilus_03.jpg",
  "ilus_04.jpg",
  "ilus_05.jpg",
  "ilus_06.jpg",
  "ilus_07.jpg",
  "ilus_08.jpg",
  "ilus_09.jpg",
  "ilus_11.png",
  "ilus_12.png",
  "ilus_13.png",
  "RS_aurora_fondo.png",
  "trabajos_new-04.jpg",
  "trabajos_new-05.jpg",
  "trabajos_new-06.jpg",
  "ilus_14.PNG",
  "ilus_15.PNG",
  "ilus_16.PNG",
  "ilus_17.JPG",
  "ilus_18.JPG",
];

// Selecciona el contenedor
const gallery = document.getElementById("gallery");

// Inserta las imágenes
images.forEach((file, index) => {
  const img = document.createElement("img");
  img.src = `assets/images/${file}`;
  img.alt = `Ilustración ${index + 1}`;
  gallery.appendChild(img);
});
