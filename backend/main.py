import os
from pathlib import Path
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fpdf import FPDF
from typing import List, Optional
from PIL import Image

# Importar la clase Balotera
from balotera import Balotera

# --- Modelos de Datos (Pydantic) ---
class BingoItem(BaseModel):
    id: int
    name: str
    imageUrl: Optional[str] = None

class CardData(BaseModel):
    B: List[BingoItem]
    I: List[BingoItem]
    N: List[BingoItem]
    G: List[BingoItem]
    O: List[BingoItem]

class PDFRequest(BaseModel):
    cards: List[CardData]
    babyName: Optional[str] = None

# Nuevo modelo para iniciar el juego
class GameStartRequest(BaseModel):
    cards: List[CardData]

# --- Instancia Global para la Balotera ---
# Esta variable mantendrá el estado del juego mientras el servidor esté activo.
balotera_instance: Optional[Balotera] = None

# --- Inicialización de la App FastAPI ---
app = FastAPI()

# --- Configuración de CORS ---
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://www.psicometrica.co", # Dominio de producción
    "https://bingo-app-ub52.onrender.com", # Render URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Endpoints para el Juego de Bingo ---

@app.post("/api/game/start")
async def start_game(request: GameStartRequest):
    """
    Inicia una nueva partida de bingo.
    Crea una instancia de la balotera con los cartones proporcionados.
    """
    global balotera_instance
    # Pydantic asegura que `request.cards` es una lista de `CardData`.
    # Necesitamos convertirla a una lista de diccionarios para la Balotera.
    cartones_dict = [card.dict() for card in request.cards]
    balotera_instance = Balotera(cartones_dict)
    return {"message": "El juego ha comenzado. La balotera está lista."}

@app.post("/api/game/reset")
async def reset_game():
    """
    Reinicia la partida actual, barajando nuevamente los objetos.
    """
    global balotera_instance
    if balotera_instance is None:
        raise HTTPException(status_code=404, detail="El juego no ha sido iniciado. No se puede reiniciar.")
    
    balotera_instance.reiniciar()
    return {"message": "El juego ha sido reiniciado."}

@app.get("/api/game/next")
async def get_next_item():
    """
    Obtiene el siguiente objeto de la balotera y el estado actualizado.
    """
    global balotera_instance
    if balotera_instance is None:
        raise HTTPException(status_code=404, detail="El juego no ha sido iniciado.")
    
    siguiente_objeto = balotera_instance.llamar_objeto()
    
    if siguiente_objeto is None:
        raise HTTPException(status_code=404, detail="No quedan más objetos en la balotera.")
    
    letras = ['B', 'I', 'N', 'G', 'O']
    siguiente_letra_despues_de_esta_llamada = letras[balotera_instance.letra_actual_idx]

    return {
        "llamado": siguiente_objeto, # El objeto que se acaba de llamar
        "siguiente_letra": siguiente_letra_despues_de_esta_llamada # La letra para la PRÓXIMA llamada
    }

@app.get("/api/game/state")
async def get_game_state():
    """
    Devuelve el estado completo y detallado del juego.
    """
    global balotera_instance
    if balotera_instance is None:
        raise HTTPException(status_code=404, detail="El juego no ha sido iniciado.")
    
    letras = ['B', 'I', 'N', 'G', 'O']
    siguiente_letra = letras[balotera_instance.letra_actual_idx]
    
    return {
        "llamados": balotera_instance.ver_llamados(),
        "siguiente_letra": siguiente_letra,
        "disponibles_por_columna": balotera_instance.columnas_disponibles
    }

# --- Clase para la Generación del PDF ---
class PDF(FPDF):
    def header(self):
        pass

    def footer(self):
        self.set_y(-10)
        self.set_font("Helvetica", "I", 8)
        self.cell(0, 10, f"Cartón {self.page_no()}", 0, 0, "R")

def create_bingo_pdf(request: PDFRequest):
    pdf = PDF(orientation="P", unit="mm", format="Letter")
    pdf.set_auto_page_break(auto=True, margin=15)

    # --- Constantes de Diseño ---
    CARD_MARGIN = 15
    CARD_WIDTH = pdf.w - 2 * CARD_MARGIN
    HEADER_HEIGHT = 20
    CELL_WIDTH = CARD_WIDTH / 5
    GRID_HEIGHT = CARD_WIDTH
    CELL_HEIGHT = GRID_HEIGHT / 5
    CARD_Y_START = (pdf.h - (HEADER_HEIGHT + GRID_HEIGHT)) / 2

    # Intentar primero la ruta de producción (static), luego desarrollo (frontend/public)
    static_path = Path(__file__).parent / "static"
    dev_path = Path(__file__).parent.parent / "frontend" / "public"
    base_image_path = static_path if static_path.exists() else dev_path

    for card_data in request.cards:
        pdf.add_page()

        # --- Título BINGO (letra por columna) ---
        pdf.set_font("Helvetica", "B", 36)
        pdf.set_text_color(138, 139, 195)
        pdf.set_x(CARD_MARGIN)
        for letter in "BINGO":
            pdf.cell(CELL_WIDTH, HEADER_HEIGHT, letter, border=0, align="C")
        pdf.ln(HEADER_HEIGHT)

        # --- Dibujar el Grid del Bingo ---
        x_start = CARD_MARGIN
        y_start = CARD_Y_START

        pdf.set_line_width(0.8)
        pdf.set_draw_color(229, 155, 180)
        pdf.rect(x_start, y_start, CARD_WIDTH, GRID_HEIGHT)
        pdf.set_line_width(0.2)
        pdf.set_draw_color(180, 180, 180)

        letters = ["B", "I", "N", "G", "O"]
        
        for i, letter in enumerate(letters):
            col_items = getattr(card_data, letter)
            for j in range(5):
                x = x_start + i * CELL_WIDTH
                y = y_start + j * CELL_HEIGHT
                
                # --- Lógica de la celda ---
                pdf.rect(x, y, CELL_WIDTH, CELL_HEIGHT)

                if i == 2 and j == 2: # Celda del centro
                    # "BIENVENIDA" en HotPink
                    pdf.set_font("Helvetica", "B", 10)
                    pdf.set_text_color(255, 105, 180)  # HotPink
                    pdf.set_xy(x, y + (CELL_HEIGHT / 2) - 8)
                    pdf.cell(CELL_WIDTH, 5, "BIENVENIDA", align="C")
                    
                    # Ajustar tamaño de fuente según longitud del nombre
                    baby_name = request.babyName or ""
                    if len(baby_name) > 12:
                        font_size = 14
                    elif len(baby_name) > 8:
                        font_size = 16
                    else:
                        font_size = 20
                    
                    # Nombre en HotPink - Reducir espacio entre textos
                    pdf.set_font("Helvetica", "B", font_size)
                    pdf.set_text_color(255, 105, 180)  # HotPink
                    pdf.set_xy(x, y + (CELL_HEIGHT / 2) - 2)
                    pdf.cell(CELL_WIDTH, 5, baby_name, align="C")
                    continue

                item_index = j - 1 if i == 2 and j > 2 else j
                item = col_items[item_index]

                # --- Lógica de Posicionamiento Robusta ---
                image_area_h = CELL_HEIGHT * 0.75
                text_area_h = CELL_HEIGHT * 0.25

                # --- 1. Insertar Imagen (Sin deformar) ---
                if item.imageUrl:
                    image_path = base_image_path / item.imageUrl.lstrip('/')
                    if image_path.exists():
                        with Image.open(image_path) as img:
                            w_orig, h_orig = img.size
                            ratio = w_orig / h_orig
                        
                        padding = 2
                        box_w = CELL_WIDTH - 2 * padding
                        box_h = image_area_h - 2 * padding
                        
                        # Calcular nuevo tamaño manteniendo la proporción
                        if (box_w / box_h) > ratio:
                            h_new = box_h
                            w_new = box_h * ratio
                        else:
                            w_new = box_w
                            h_new = box_w / ratio

                        # Centrar la imagen en su área
                        img_x = x + (CELL_WIDTH - w_new) / 2
                        img_y = y + (image_area_h - h_new) / 2
                        pdf.image(str(image_path), x=img_x, y=img_y, w=w_new, h=h_new)

                # --- 2. Insertar Texto (En su lugar correcto) ---
                pdf.set_font("Helvetica", "B", 9)
                pdf.set_text_color(138, 139, 195)

                text_y_start = y + image_area_h + (text_area_h / 2) - 3 # Centrado vertical
                
                # Usamos cell() que es más predecible para el posicionamiento
                pdf.set_xy(x, text_y_start)
                pdf.cell(CELL_WIDTH, 6, item.name, align="C")

    return bytes(pdf.output())

# --- Endpoint de la API (PDF) ---
@app.post("/api/generate-pdf")
async def generate_pdf_endpoint(request: PDFRequest):
    pdf_bytes = create_bingo_pdf(request)
    file_name = f"Bingo_Baby_Shower_{request.babyName or 'Juego'}.pdf"
    headers = {'Content-Disposition': f'inline; filename="{file_name}"'}
    return StreamingResponse(iter([pdf_bytes]), media_type="application/pdf", headers=headers)

# --- Servir archivos estáticos del frontend (DEBE IR AL FINAL) ---
# Verificar si existe el directorio static (para producción)
static_path = Path(__file__).parent / "static"
if static_path.exists():
    app.mount("/BINGO", StaticFiles(directory=str(static_path), html=True), name="static")
    # También servir en la raíz para facilitar el acceso
    app.mount("/", StaticFiles(directory=str(static_path), html=True), name="root")
else:
    # Para desarrollo local, servir desde el directorio frontend
    frontend_path = Path(__file__).parent.parent / "frontend" / "dist"
    if frontend_path.exists():
        app.mount("/BINGO", StaticFiles(directory=str(frontend_path), html=True), name="static")
        app.mount("/", StaticFiles(directory=str(frontend_path), html=True), name="root")
