#!/bin/bash

# Script para corregir las rutas de los assets en el HTML generado
echo "Corrigiendo rutas de assets..."

# Navegar al directorio dist
cd frontend/dist

# Reemplazar las rutas absolutas con rutas relativas al subdirectorio BINGO
sed -i 's|src="/assets/|src="/BINGO/assets/|g' index.html
sed -i 's|href="/assets/|href="/BINGO/assets/|g' index.html

echo "Rutas corregidas exitosamente!"
