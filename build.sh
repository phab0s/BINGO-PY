#!/bin/bash

# Instalar dependencias de Python
echo "Instalando dependencias de Python..."
pip install -r requirements.txt

# Construir el frontend
echo "Construyendo frontend..."
cd frontend
npm install
npm run build

# Crear directorio para archivos estáticos
echo "Copiando archivos del frontend al backend..."
mkdir -p ../backend/static
cp -r dist/* ../backend/static/

echo "Build completado exitosamente!"