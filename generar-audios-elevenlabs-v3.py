#!/usr/bin/env python3
import os
import json
import requests
import random
import time
from pathlib import Path

# ————————————————————————
# CONFIGURACIÓN
# ————————————————————————

ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY', 'sk_35899c71cf08c78b2adcba4baa1b5d8d681cbd757ecb3bab')
OUTPUT_DIR = Path('audios_bingo_v3_tags')
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

VOICE_ID = "tTdCI0IDTgFa2iLQiWu4"  # ajusta la voz que estás usando
MODEL_ID = "eleven_v3"

# Lista de tags que elegiste
AUDIO_TAGS = [
    "[laughs]",
    "[starts laughing]",
    "[sarcastic]",
    "[exhales]",
    "[mischievously]",
    "[wheezing]",
    "[laughs harder]",
    "[impressed]",
    "[amazed]",
    "[giggling]",
    "[sighs]"
]

# Aquí defines tus 133 ítems (letra, nombre, id)
# Ejemplo reducido; reemplaza con los 133 ítems completos que tienes
BINGO_ITEMS = {
    'B': [
        {'id': 1, 'name': 'Babero'},
        {'id': 2, 'name': 'Bañera'},
        {'id': 3, 'name': 'Biberón'},
        {'id': 4, 'name': 'Body'},
        {'id': 5, 'name': 'Chupo'},
        {'id': 6, 'name': 'Cigüeña'},
        {'id': 7, 'name': 'Coche'},
        {'id': 8, 'name': 'Cuna'},
        {'id': 101, 'name': 'Abeja'},
        {'id': 102, 'name': 'Araña'},
        {'id': 103, 'name': 'Ardilla'},
        {'id': 104, 'name': 'Ave'},
        {'id': 105, 'name': 'Avestruz'},
        {'id': 106, 'name': 'Ballena'},
        {'id': 107, 'name': 'Búho'},
        {'id': 108, 'name': 'Burro'},
        {'id': 109, 'name': 'Caballo'},
        {'id': 110, 'name': 'Cisne'},
        {'id': 111, 'name': 'Conejo'},
        {'id': 112, 'name': 'Delfín'},
        {'id': 113, 'name': 'Dinosaurio'},
        {'id': 114, 'name': 'Elefante'},
        {'id': 115, 'name': 'Erizo'},
        {'id': 116, 'name': 'Flamenco'},
        {'id': 117, 'name': 'Foca'},
        {'id': 118, 'name': 'Aguacate'},
        {'id': 119, 'name': 'Banano'},
        {'id': 120, 'name': 'Cereza'},
        {'id': 121, 'name': 'Durazno'},
        {'id': 122, 'name': 'Frambuesa'},
        {'id': 123, 'name': 'Fresa'},
    ],
    'I': [
        {'id': 9, 'name': 'Gancho'},
        {'id': 10, 'name': 'Gimnasio'},
        {'id': 11, 'name': 'Gorrito'},
        {'id': 12, 'name': 'Guantes'},
        {'id': 13, 'name': 'Huellas'},
        {'id': 14, 'name': 'Impermeable'},
        {'id': 15, 'name': 'Jabón'},
        {'id': 16, 'name': 'Juguetes'},
        {'id': 201, 'name': 'Gacela'},
        {'id': 202, 'name': 'Gallo'},
        {'id': 203, 'name': 'Ganso'},
        {'id': 204, 'name': 'Gato'},
        {'id': 205, 'name': 'Gaviota'},
        {'id': 206, 'name': 'Gorila'},
        {'id': 207, 'name': 'Guepardo'},
        {'id': 208, 'name': 'Halcón'},
        {'id': 209, 'name': 'Hámster'},
        {'id': 210, 'name': 'Hiena'},
        {'id': 211, 'name': 'Hipopótamo'},
        {'id': 212, 'name': 'Hormiga'},
        {'id': 213, 'name': 'Iguana'},
        {'id': 214, 'name': 'Jaguar'},
        {'id': 215, 'name': 'Jirafa'},
        {'id': 216, 'name': 'Canguro'},
        {'id': 217, 'name': 'Koala'},
        {'id': 218, 'name': 'Galletas'},
        {'id': 219, 'name': 'Hamburguesa'},
        {'id': 220, 'name': 'Huevo'},
        {'id': 221, 'name': 'Kiwi'},
    ],
    'N': [
        {'id': 17, 'name': 'Libro de cuentos'},
        {'id': 18, 'name': 'Mamá'},
        {'id': 19, 'name': 'Medias'},
        {'id': 20, 'name': 'Móvil de cuna'},
        {'id': 21, 'name': 'Oso de peluche'},
        {'id': 22, 'name': 'Pañal'},
        {'id': 23, 'name': 'Pañalera'},
        {'id': 24, 'name': 'Pato de hule'},
        {'id': 301, 'name': 'Lémur'},
        {'id': 302, 'name': 'León'},
        {'id': 303, 'name': 'Lince'},
        {'id': 304, 'name': 'Lobo'},
        {'id': 305, 'name': 'Loro'},
        {'id': 306, 'name': 'Mariposa'},
        {'id': 307, 'name': 'Marmota'},
        {'id': 308, 'name': 'Mono'},
        {'id': 309, 'name': 'Murciélago'},
        {'id': 310, 'name': 'Narval'},
        {'id': 311, 'name': 'Nutria'},
        {'id': 312, 'name': 'Orca'},
        {'id': 313, 'name': 'Oruga'},
        {'id': 314, 'name': 'Oso'},
        {'id': 315, 'name': 'Oveja'},
        {'id': 316, 'name': 'Panda'},
        {'id': 317, 'name': 'Pantera'},
        {'id': 318, 'name': 'Perro'},
        {'id': 319, 'name': 'Pez'},
        {'id': 320, 'name': 'Pingüino'},
        {'id': 321, 'name': 'Leche'},
        {'id': 322, 'name': 'Manzana'},
        {'id': 323, 'name': 'Naranja'},
        {'id': 324, 'name': 'Pera'},
        {'id': 325, 'name': 'Piña'},
    ],
    'G': [
        {'id': 25, 'name': 'Silla para carro'},
        {'id': 26, 'name': 'Silla para comer'},
        {'id': 27, 'name': 'Sonajero'},
        {'id': 28, 'name': 'Talco'},
        {'id': 29, 'name': 'Termómetro'},
        {'id': 30, 'name': 'Teteros'},
        {'id': 31, 'name': 'Toalla'},
        {'id': 32, 'name': 'Toallas húmedas'},
        {'id': 401, 'name': 'Rana'},
        {'id': 402, 'name': 'Ratón'},
        {'id': 403, 'name': 'Rinoceronte'},
        {'id': 404, 'name': 'Salamandra'},
        {'id': 405, 'name': 'Sapo'},
        {'id': 406, 'name': 'Serpiente'},
        {'id': 407, 'name': 'Suricata'},
        {'id': 408, 'name': 'Tapir'},
        {'id': 409, 'name': 'Tigre'},
        {'id': 410, 'name': 'Tortuga'},
        {'id': 411, 'name': 'Tucán'},
        {'id': 412, 'name': 'Queso'},
        {'id': 413, 'name': 'Rúcula'},
        {'id': 414, 'name': 'Sandía'},
        {'id': 415, 'name': 'Tomate'},
    ],
    'O': [
        {'id': 33, 'name': 'Ungüento'},
        {'id': 34, 'name': 'Vacuna'},
        {'id': 35, 'name': 'Vajilla para bebé'},
        {'id': 36, 'name': 'Vestido'},
        {'id': 37, 'name': 'Vitaminas'},
        {'id': 38, 'name': 'Xilófono'},
        {'id': 39, 'name': 'Yoyo'},
        {'id': 40, 'name': 'Zapatitos'},
        {'id': 501, 'name': 'Unicornio'},
        {'id': 502, 'name': 'Vaca'},
        {'id': 503, 'name': 'Venado'},
        {'id': 504, 'name': 'Víbora'},
        {'id': 505, 'name': 'Zorro'},
        {'id': 506, 'name': 'Uvas'},
        {'id': 507, 'name': 'Verduras'},
        {'id': 508, 'name': 'Yogurt'},
        {'id': 509, 'name': 'Zanahoria'},
    ]
}

def sanitize_filename(name: str) -> str:
    replacements = {
        'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
        'ñ': 'n', 'ü': 'u', ' ': '_', '/': '_', '\\': '_'
    }
    clean = name.lower()
    for old, new in replacements.items():
        clean = clean.replace(old, new)
    return ''.join(c for c in clean if c.isalnum() or c == '_')

def generate_audio(letter, item_name, item_id, voice_id):
    tag = random.choice(AUDIO_TAGS)
    text = f"Letra {letter} {tag}, ¡{item_name}!"

    print(f"Generando: {letter}-{item_id}-{item_name}")
    print(f"  Tag usado: {tag}")
    print(f"  Texto: \"{text}\"")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "Accept": "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": ELEVENLABS_API_KEY
    }
    payload = {
        "text": text,
        "model_id": MODEL_ID,
        "voice_settings": {
            "stability": 0.5
        }
    }

    response = requests.post(url, json=payload, headers=headers)
    try:
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"  ❌ Error: {e}")
        if response is not None:
            print("    Respuesta API:", response.text)
        return None, None

    return response.content, {"tag": tag, "text": text}

def main():
    audio_map = {}
    log_info = {}
    total = sum(len(items) for items in BINGO_ITEMS.values())
    count = 0

    for letter, items in BINGO_ITEMS.items():
        for item in items:
            count += 1
            item_id = item['id']
            item_name = item['name']
            print(f"[{count}/{total}] Procesando: {letter} - {item_name} (ID {item_id})")
            audio, info = generate_audio(letter, item_name, item_id, VOICE_ID)
            if audio:
                filename = f"{letter}-{item_id}-{sanitize_filename(item_name)}.mp3"
                filepath = OUTPUT_DIR / filename
                with open(filepath, "wb") as f:
                    f.write(audio)
                audio_map[item_id] = str(filepath)
                log_info[item_id] = info
                print(f"   ✅ Guardado: {filename} ({len(audio)} bytes)")
            else:
                print("   ❌ Falló para este item")

            time.sleep(0.5)

    # Guardar mapeo
    map_file = OUTPUT_DIR / "audio_map.json"
    with open(map_file, "w", encoding="utf-8") as f:
        json.dump(audio_map, f, indent=2, ensure_ascii=False)

    log_file = OUTPUT_DIR / "tag_log.json"
    with open(log_file, "w", encoding="utf-8") as f:
        json.dump(log_info, f, indent=2, ensure_ascii=False)

    print()
    print("✅ Generación completada.")
    print(f"📁 Archivos en: {OUTPUT_DIR}")
    print(f"📋 Mapeo guardado en: {map_file}")
    print(f"🔍 Log de tags guardado en: {log_file}")

if __name__ == "__main__":
    main()
