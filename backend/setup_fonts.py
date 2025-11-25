"""
Script para descargar y configurar fuentes de Google Fonts para FPDF
"""
import os
import urllib.request
from pathlib import Path

# Crear directorio de fuentes si no existe
fonts_dir = Path(__file__).parent / "fonts"
fonts_dir.mkdir(exist_ok=True)

# URLs de las fuentes desde Google Fonts
fonts_to_download = {
    "Pacifico-Regular.ttf": "https://github.com/google/fonts/raw/main/ofl/pacifico/Pacifico-Regular.ttf",
}

print("Descargando fuentes de Google Fonts...")

for font_name, url in fonts_to_download.items():
    font_path = fonts_dir / font_name
    
    if font_path.exists():
        print(f"✓ {font_name} ya existe")
        continue
    
    try:
        print(f"Descargando {font_name}...")
        urllib.request.urlretrieve(url, font_path)
        print(f"✓ {font_name} descargada exitosamente")
    except Exception as e:
        print(f"✗ Error descargando {font_name}: {e}")

print("\n¡Fuentes configuradas!")
print(f"Ubicación: {fonts_dir}")
