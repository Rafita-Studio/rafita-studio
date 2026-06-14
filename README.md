# Rafita Studio Website

## Que es

Este repo contiene la web publica de Rafita Studio. Es un sitio estatico con paginas HTML, estilos, scripts, imagenes y contenido preparado para ser administrado desde un CMS externo.

## Estructura del proyecto

- `assets/`: imagenes, videos y otros recursos publicos usados por la web.
- `styles/`: estilos compartidos entre paginas.
- `scripts/`: scripts auxiliares y utilidades del sitio.
- `pages/`: paginas internas publicas de la web.
- `content/`: contenido editable que podra escribir el CMS externo.
- `docs/`: documentacion tecnica y notas de integracion.
- `data/`: espacio reservado para JSON generado o consumido por el frontend estatico.

Los archivos HTML de la raiz mantienen compatibilidad con URLs simples. `about.html`, `contact.html`, `catalogo.html` y `proyectos.html` redirigen a sus equivalentes dentro de `pages/`.

## Contenido editable por CMS

El CMS externo escribira en:

- `content/projects/`
- `content/illustrations/`
- `content/settings/site.yml`

`content/settings/site.yml` contiene ajustes generales no privados del sitio.

## Imagenes

Las imagenes subidas desde el CMS deberian guardarse en:

- `assets/images/uploads/`
- `assets/images/projects/`
- `assets/images/illustrations/`

Las imagenes historicas usadas por el sitio actual siguen en `assets/catalogo/`, `assets/images/`, `assets/inicio/` y `assets/stickers/` para no romper referencias existentes.

## CMS externo

El CMS no vive en este repo. El repo del CMS externo sera:

`Rafita-Studio/rafita-studio-cms`

Este repositorio es solo el destino de contenido y assets para la web publica. No se deben guardar tokens, secrets ni credenciales aqui.

## Contenido pendiente de migrar

Todavia hay contenido hardcodeado en la web publica:

- `index.html`: bio del hero, textos de servicios, enlaces principales, footer y lista de imagenes usada por el scroll de catalogo.
- `pages/proyectos.html`: grilla de proyectos, nombres, anos, clientes, categorias visuales e imagenes.
- `pages/catalogo.html`: galeria de ilustraciones, prints y stickers.
- `pages/about.html`: texto de presentacion y video.
- `pages/contact.html`: texto de contacto, email visible y formulario estatico.
- `pages/index_backup.html`: version antigua de inicio con galeria generada desde `assets/images/`.

Una migracion posterior podria mover proyectos a `content/projects/`, ilustraciones a `content/illustrations/` y configuracion global a `content/settings/site.yml`. Si el sitio se mantiene 100% estatico sin build system, conviene generar archivos JSON en `data/` para que el frontend los lea.

## Desarrollo local

No hay build system configurado. Puedes abrir `index.html` directamente en el navegador o servir el sitio con un servidor estatico simple:

```sh
python3 -m http.server 8000
```

Luego abre `http://localhost:8000`.

Tambien funciona una extension como Live Server de VS Code.

## GitHub Pages

El sitio esta pensado para publicarse en GitHub Pages como sitio estatico. Mantener rutas relativas ayuda a que funcione tanto en local como publicado.
