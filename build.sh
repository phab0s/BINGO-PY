#!/bin/bash

# Instalar dependencias del frontend
cd frontend
npm install

# Construir el frontend
npm run build

# Mover archivos construidos al directorio público del backend
cd ..
mkdir -p backend/static
cp -r frontend/dist/* backend/static/

echo "Build completado. Archivos del frontend copiados a backend/static/"
