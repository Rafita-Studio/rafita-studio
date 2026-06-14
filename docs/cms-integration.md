# CMS Integration Notes

El CMS externo sera `Rafita-Studio/rafita-studio-cms`.

Decap CMS escribira contenido en este repo, que funciona como destino de contenido y assets para la web publica.

Las colecciones esperadas son:

- `projects` -> `content/projects/`
- `illustrations` -> `content/illustrations/`
- `settings` -> `content/settings/site.yml`

Las imagenes se guardaran inicialmente en:

- `assets/images/uploads/`

El frontend de la web todavia debe adaptarse para leer Markdown directamente o transformar Markdown a JSON.

Si la web se mantiene 100% estatica sin build system, la opcion recomendada es generar archivos JSON como:

- `data/projects.json`
- `data/illustrations.json`

No guardar tokens ni credenciales en este repositorio.
