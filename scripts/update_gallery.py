import os
import re
from pathlib import Path

# === CONFIGURACIÓN ===
ROOT_DIR = Path(__file__).resolve().parents[1]
HTML_FILE = ROOT_DIR / "index.html"
BACKUP_FILE = ROOT_DIR / "pages" / "index_backup.html"
IMAGES_DIR = ROOT_DIR / "assets" / "images"
VALID_EXT = (".jpg", ".jpeg", ".png", ".webp", ".gif")

def get_image_files():
    """Devuelve una lista de nombres de archivo válidos dentro de assets/images"""
    files = sorted(
        [f.name for f in Path(IMAGES_DIR).iterdir() if f.suffix.lower() in VALID_EXT]
    )
    return files

def update_html():
    """Reemplaza el bloque FILES = [ ... ] en el index.html"""
    if not HTML_FILE.exists():
        print("❌ No se encontró el archivo index.html")
        return

    with open(HTML_FILE, "r", encoding="utf-8") as f:
        html = f.read()

    files = get_image_files()
    files_js = ", ".join([f'"{f}"' for f in files])

    # patrón que detecta el bloque const FILES = [...]
    pattern = re.compile(r"const FILES\s*=\s*\[.*?\];", re.DOTALL)
    new_block = f"const FILES = [{files_js}];"

    if pattern.search(html):
        new_html = pattern.sub(new_block, html)
        print(f"✅ Bloque FILES reemplazado con {len(files)} archivos.")
    else:
        print("⚠️ No se encontró el bloque const FILES = [...] en el HTML.")
        return

    with open(BACKUP_FILE, "w", encoding="utf-8") as backup:
        backup.write(html)
    print(f"💾 Copia de seguridad creada → {BACKUP_FILE.relative_to(ROOT_DIR)}")

    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(new_html)

    print("✨ index.html actualizado correctamente.")

if __name__ == "__main__":
    update_html()
