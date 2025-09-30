#!/bin/bash

echo "========================================"
echo "  Build BINGO-PY Completo para Koyeb"
echo "========================================"
echo ""

echo "[1/4] Instalando dependencias del frontend..."
cd frontend
npm install

echo ""
echo "[2/4] Construyendo frontend..."
npm run build

echo ""
echo "[3/4] Verificando build del frontend..."
if [ ! -d "dist" ]; then
    echo "❌ Error: El build del frontend falló"
    exit 1
fi
echo "✅ Frontend build exitoso"

echo ""
echo "[4/4] Preparando para deployment..."
cd ..

echo ""
echo "========================================"
echo "  Build completado!"
echo "  Listo para deploy en Koyeb"
echo "========================================"
echo ""
echo "Archivos listos:"
echo "✅ backend/Dockerfile"
echo "✅ backend/.dockerignore"
echo "✅ koyeb.yaml"
echo "✅ frontend/dist/ (build del frontend)"
echo ""
echo "Próximos pasos:"
echo "1. git add ."
echo "2. git commit -m 'Add Koyeb deployment files'"
echo "3. git push origin main"
echo "4. Deploy en Koyeb con dockerfile: backend/Dockerfile"
