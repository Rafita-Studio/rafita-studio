# CMS Notes

La carpeta `admin/` fue eliminada de este repositorio porque el CMS vivira en el repo externo `Rafita-Studio/rafita-studio-cms`.

La configuracion anterior de Decap CMS apuntaba a:

- Backend: `github`
- Repo: `rafita-studio/website`
- Branch: `main`
- Media folder: `assets/uploads`
- Public folder: `assets/uploads`
- Coleccion: `projects`, escrita en `content/projects`

Campos configurados para proyectos:

- `title`
- `client`
- `year`
- `category`
- `image`
- `published`
- `body`

Al recrear esta configuracion en el CMS externo, actualizar el repo destino y alinear `media_folder` con la estructura actual recomendada: `assets/images/uploads`.
