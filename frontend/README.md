# 🎲 Generador de Bingo para Baby Shower

Una aplicación web moderna para crear y personalizar cartones de bingo temáticos para baby showers. Incluye un banco de imágenes predefinidas y la capacidad de añadir imágenes personalizadas.

## ✨ Características

- **Banco de Imágenes Rico**: Más de 100 imágenes predefinidas organizadas por categorías (bebé, animalitos, alimentos)
- **Generación Automática**: Crea múltiples cartones (hasta 100) con distribución aleatoria
- **Exportación PDF**: Descarga los cartones como PDF listos para imprimir (2 cartones por página)
- **Impresión Directa**: Imprime directamente desde el navegador con estilos optimizados
- **Interfaz Intuitiva**: Diseño moderno y fácil de usar con validaciones de entrada
- **Responsive**: Funciona perfectamente en dispositivos móviles y desktop
- **Manejo de Errores**: Validaciones robustas y mensajes informativos
- **Carga Optimizada**: Imágenes con lazy loading y manejo de errores de carga

## 🚀 Instalación y Uso

**Prerrequisitos:** Node.js (versión 16 o superior)

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar la aplicación:**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador:**
   La aplicación estará disponible en `http://localhost:5173`

## 🎯 Cómo Usar

1. **Configurar el Bingo:**
   - Ingresa el nombre del bebé (opcional, máximo 50 caracteres)
   - Selecciona el número de cartones a generar (1-100)

2. **Generar Cartones:**
   - La aplicación usa automáticamente el banco de imágenes predefinidas
   - Cada cartón se genera con una combinación aleatoria única
   - Haz clic en "🎲 Generar Cartones" para crear los cartones

3. **Exportar:**
   - **📄 Descargar PDF**: Genera un archivo PDF con 2 cartones por página
   - **🖨️ Imprimir**: Imprime directamente desde el navegador

## 🎮 Modo de Juego

- El centro de la columna N muestra "BIENVENIDA" con el nombre del bebé
- Cada cartón tiene un número único para identificación
- Los cartones están listos para usar en el baby shower

## 📁 Estructura del Proyecto

```
├── components/
│   ├── BingoCard.tsx      # Componente del cartón de bingo
│   ├── Controls.tsx       # Controles de la aplicación
│   ├── PrintLayout.tsx    # Layout para impresión
│   └── icons/            # Iconos SVG personalizados
├── imagenes/              # Banco de imágenes predefinidas
│   ├── alimentos/        # Imágenes de comidas
│   ├── animalitos/       # Imágenes de animales
│   └── bebe/            # Artículos de bebé
├── App.tsx               # Componente principal
├── constants.ts          # Banco de datos con 100+ imágenes
├── types.ts             # Definiciones de tipos TypeScript
├── index.css            # Estilos globales y de impresión
└── vite.config.ts       # Configuración de Vite
```

## 🎨 Personalización

### Añadir Nuevas Imágenes al Banco

1. Añade las imágenes a la carpeta `imagenes/` en la subcarpeta apropiada:
   - `alimentos/` - Para comidas y bebidas
   - `animalitos/` - Para animales  
   - `bebe/` - Para artículos de bebé
2. Actualiza el archivo `constants.ts` en el grupo BINGO_GROUPS correspondiente
3. Asigna la imagen a la columna B, I, N, G, u O según el tema

### Modificar el Diseño

- Los estilos están en Tailwind CSS inline y en `index.css`
- Colores principales: Rosa (#E59BB4), Morado (#8A8BC3), Verde (#4DB6AC)
- Fuente principal: Pacifico para títulos, Poppins para texto
- Los estilos de impresión están optimizados en `index.css`

## 🛠️ Tecnologías Utilizadas

- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y servidor de desarrollo
- **Tailwind CSS** - Framework de estilos
- **jsPDF** - Generación de PDFs
- **html2canvas** - Captura de elementos HTML

## 📝 Notas Técnicas

- **Imágenes**: Todas las imágenes están optimizadas y organizadas por categorías
- **Rendimiento**: Lazy loading para imágenes y manejo de errores de carga
- **Validaciones**: 
  - Número de cartones: 1-100
  - Nombre del bebé: máximo 50 caracteres, filtrado de caracteres especiales
- **PDF**: Generación optimizada con 2 cartones por página formato carta
- **Impresión**: Estilos CSS optimizados para impresión directa
- **Compatibilidad**: Funciona en navegadores modernos (Chrome, Firefox, Safari, Edge)

## 🐛 Resolución de Problemas

- **Las imágenes no cargan**: Verifica que las rutas en `constants.ts` sean correctas
- **El PDF no se genera**: Asegúrate de que hay cartones generados antes de descargar
- **Problemas de impresión**: Usa la función "Descargar PDF" para mejores resultados
