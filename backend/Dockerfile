# Usar Node.js para build del frontend
FROM node:18-alpine AS frontend-builder

# Establecer directorio de trabajo para frontend
WORKDIR /app/frontend

# Copiar package.json y package-lock.json
COPY frontend/package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código del frontend
COPY frontend/ ./

# Build del frontend
RUN npm run build

# Usar Python 3.12 como imagen base para el backend
FROM python:3.12-slim

# Instalar dependencias del sistema para PDF y imágenes
RUN apt-get update && apt-get install -y \
    libgl1-mesa-dri \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    libglib2.0-dev \
    && rm -rf /var/lib/apt/lists/*

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY backend/requirements.txt .

# Instalar dependencias Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código del backend
COPY backend/ ./

# Copiar archivos estáticos del frontend
COPY --from=frontend-builder /app/frontend/dist ./static

# Exponer puerto 8000
EXPOSE 8000

# Comando para ejecutar la aplicación
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
