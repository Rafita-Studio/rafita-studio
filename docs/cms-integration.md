# CMS Integration Notes

El CMS externo sera `Rafita-Studio/rafita-studio-cms`.

Decap CMS escribira contenido en este repo, que funciona como destino de contenido y assets para la web publica.

Las colecciones esperadas son:

- `projects` -> `content/projects/`
- `illustrations` -> `content/illustrations/`
- `settings` -> `content/settings/site.yml`

Las imagenes se guardaran inicialmente en:

- `assets/images/uploads/`

La web publica transforma los Markdown de `content/projects/` con:

```bash
npm run build
```

Ese comando ejecuta `scripts/build-projects.js` y genera:

- `data/projects.json`
- paginas HTML en `pages/proyectos/[slug].html`

`pages/proyectos.html` carga `../data/projects.json` para pintar la galeria publica. Si el JSON no carga o esta vacio, mantiene las tarjetas hardcodeadas actuales como fallback visual.

Si la web se mantiene 100% estatica sin build system, la opcion recomendada es generar archivos JSON como:

- `data/projects.json`
- `data/illustrations.json`

No guardar tokens ni credenciales en este repositorio.

## Rutas y GitHub Pages

La URL publica usa dominio raiz (`https://rafita-studio.cl/`), por eso las imagenes guardadas como `/assets/images/uploads/archivo.jpg` funcionan correctamente en produccion.

En previews de GitHub Pages publicados bajo subcarpeta, las rutas absolutas que empiezan con `/assets/` apuntaran a la raiz del dominio y pueden no resolver. Para previews en subcarpeta, conviene usar rutas relativas en el contenido o publicar el preview con dominio/base path equivalente al sitio final.
