import type { CardData, VictoryModeOption } from './types';

export const BINGO_LETTERS = ['B', 'I', 'N', 'G', 'O'];

export const VICTORY_MODES: VictoryModeOption[] = [
  {
    value: 'full_card',
    label: 'Cartón Lleno',
    description: 'Completar todo el cartón (24 objetos)'
  },
  {
    value: 'line',
    label: 'Línea',
    description: 'Completar cualquier línea horizontal, vertical o diagonal'
  },
  {
    value: 'square',
    label: 'Cuadrado',
    description: 'Completar todo el borde del cartón (perímetro completo)'
  },
  {
    value: 'l_shape',
    label: 'Forma de L',
    description: 'Completar borde izquierdo + borde inferior'
  },
  {
    value: 'diagonal',
    label: 'Diagonal',
    description: 'Completar cualquier diagonal (principal o secundaria)'
  }
];

export const BINGO_GROUPS: CardData = {
  B: [
    // Objetos de bebé existentes
    { id: 1, name: 'Babero', imageUrl: '/imagenes/bebe/Babero.png' },
    { id: 2, name: 'Bañera', imageUrl: '/imagenes/bebe/Bañera.png' },
    { id: 3, name: 'Biberón', imageUrl: '/imagenes/bebe/Biberón.png' },
    { id: 4, name: 'Body', imageUrl: '/imagenes/bebe/Body.png' },
    { id: 5, name: 'Chupo', imageUrl: '/imagenes/bebe/Chupo.png' },
    { id: 6, name: 'Cigüeña', imageUrl: '/imagenes/bebe/Cigueña.png' },
    { id: 7, name: 'Coche', imageUrl: '/imagenes/bebe/Coche.png' },
    { id: 8, name: 'Cuna', imageUrl: '/imagenes/bebe/Cuna.png' },
    // Animalitos para columna B (A-F)
    { id: 101, name: 'Abeja', imageUrl: '/imagenes/animalitos/Abeja.png' },
    { id: 102, name: 'Araña', imageUrl: '/imagenes/animalitos/Araña.png' },
    { id: 103, name: 'Ardilla', imageUrl: '/imagenes/animalitos/Ardilla.png' },
    { id: 104, name: 'Ave', imageUrl: '/imagenes/animalitos/Ave.png' },
    { id: 105, name: 'Avestruz', imageUrl: '/imagenes/animalitos/Avestruz.png' },
    { id: 106, name: 'Ballena', imageUrl: '/imagenes/animalitos/Ballena.png' },
    { id: 107, name: 'Buho', imageUrl: '/imagenes/animalitos/Buho.png' },
    { id: 108, name: 'Burro', imageUrl: '/imagenes/animalitos/Burro.png' },
    { id: 109, name: 'Caballo', imageUrl: '/imagenes/animalitos/Caballo.png' },
    { id: 110, name: 'Cisne', imageUrl: '/imagenes/animalitos/Cisne.png' },
    { id: 111, name: 'Conejo', imageUrl: '/imagenes/animalitos/Conejo.png' },
    { id: 112, name: 'Delfin', imageUrl: '/imagenes/animalitos/Delfin.png' },
    { id: 113, name: 'Dinosaurio', imageUrl: '/imagenes/animalitos/Dinosaurio.png' },
    { id: 114, name: 'Elefante', imageUrl: '/imagenes/animalitos/Elefante.png' },
    { id: 115, name: 'Erizo', imageUrl: '/imagenes/animalitos/Erizo.png' },
    { id: 116, name: 'Flamenco', imageUrl: '/imagenes/animalitos/Flamenco.png' },
    { id: 117, name: 'Foca', imageUrl: '/imagenes/animalitos/Foca.png' },
    // Alimentos para columna B (A-F)
    { id: 118, name: 'Aguacate', imageUrl: '/imagenes/alimentos/Aguacate.png' },
    { id: 119, name: 'Banano', imageUrl: '/imagenes/alimentos/Banano.png' },
    { id: 120, name: 'Cereza', imageUrl: '/imagenes/alimentos/Cereza.png' },
    { id: 121, name: 'Durazno', imageUrl: '/imagenes/alimentos/Durazno.png' },
    { id: 122, name: 'Frambuesa', imageUrl: '/imagenes/alimentos/Frambuesa.png' },
    { id: 123, name: 'Fresa', imageUrl: '/imagenes/alimentos/Fresa.png' },
  ],
  I: [
    // Objetos de bebé existentes
    { id: 9, name: 'Gancho', imageUrl: '/imagenes/bebe/Gancho.png' },
    { id: 10, name: 'Gimnasio', imageUrl: '/imagenes/bebe/Gimnasio.png' },
    { id: 11, name: 'Gorrito', imageUrl: '/imagenes/bebe/Gorrito.png' },
    { id: 12, name: 'Guantes', imageUrl: '/imagenes/bebe/Guantes.png' },
    { id: 13, name: 'Huellas', imageUrl: '/imagenes/bebe/Huellas.png' },
    { id: 14, name: 'Impermeable', imageUrl: '/imagenes/bebe/Impermeable.png' },
    { id: 15, name: 'Jabón', imageUrl: '/imagenes/bebe/Jabón.png' },
    { id: 16, name: 'Juguetes', imageUrl: '/imagenes/bebe/Juguetes.png' },
    // Animalitos para columna I (G-K)
    { id: 201, name: 'Gacela', imageUrl: '/imagenes/animalitos/Gacela.png' },
    { id: 202, name: 'Gallo', imageUrl: '/imagenes/animalitos/Gallo.png' },
    { id: 203, name: 'Ganso', imageUrl: '/imagenes/animalitos/Ganso.png' },
    { id: 204, name: 'Gato', imageUrl: '/imagenes/animalitos/Gato.png' },
    { id: 205, name: 'Gaviota', imageUrl: '/imagenes/animalitos/Gaviota.png' },
    { id: 206, name: 'Gorila', imageUrl: '/imagenes/animalitos/Gorila.png' },
    { id: 207, name: 'Guepardo', imageUrl: '/imagenes/animalitos/Guepardo.png' },
    { id: 208, name: 'Halcon', imageUrl: '/imagenes/animalitos/Halcon.png' },
    { id: 209, name: 'Hamster', imageUrl: '/imagenes/animalitos/Hamster.png' },
    { id: 210, name: 'Hiena', imageUrl: '/imagenes/animalitos/Hiena.png' },
    { id: 211, name: 'Hipopotamo', imageUrl: '/imagenes/animalitos/Hipopotamo.png' },
    { id: 212, name: 'Hormiga', imageUrl: '/imagenes/animalitos/Hormiga.png' },
    { id: 213, name: 'Iguana', imageUrl: '/imagenes/animalitos/Iguana.png' },
    { id: 214, name: 'Jaguar', imageUrl: '/imagenes/animalitos/Jaguar.png' },
    { id: 215, name: 'Jirafa', imageUrl: '/imagenes/animalitos/Jirafa.png' },
    { id: 216, name: 'Kangaroo', imageUrl: '/imagenes/animalitos/Kangaroo.png' },
    { id: 217, name: 'Koala', imageUrl: '/imagenes/animalitos/Koala.png' },
    // Alimentos para columna I (G-K)
    { id: 218, name: 'Galletas', imageUrl: '/imagenes/alimentos/Galletas.png' },
    { id: 219, name: 'Hamburguesa', imageUrl: '/imagenes/alimentos/Hamburguesa.png' },
    { id: 220, name: 'Huevo', imageUrl: '/imagenes/alimentos/Huevo.png' },
    { id: 221, name: 'Kiwi', imageUrl: '/imagenes/alimentos/Kiwi.png' },
  ],
  N: [
    // Objetos de bebé existentes
    { id: 17, name: 'Libro de cuentos', imageUrl: '/imagenes/bebe/Libro de cuentos.png' },
    { id: 18, name: 'Mamá', imageUrl: '/imagenes/bebe/Mamá.png' },
    { id: 19, name: 'Medias', imageUrl: '/imagenes/bebe/Medias.png' },
    { id: 20, name: 'Móvil de cuna', imageUrl: '/imagenes/bebe/Móvil de cuna.png' },
    { id: 21, name: 'Oso de peluche', imageUrl: '/imagenes/bebe/Oso de peluche.png' },
    { id: 22, name: 'Pañal', imageUrl: '/imagenes/bebe/Pañal.png' },
    { id: 23, name: 'Pañalera', imageUrl: '/imagenes/bebe/Pañalera.png' },
    { id: 24, name: 'Pato de hule', imageUrl: '/imagenes/bebe/Pato de hule.png' },
    // Animalitos para columna N (L-P)
    { id: 301, name: 'Lemur', imageUrl: '/imagenes/animalitos/Lemur.png' },
    { id: 302, name: 'Leon', imageUrl: '/imagenes/animalitos/Leon.png' },
    { id: 303, name: 'Lince', imageUrl: '/imagenes/animalitos/Lince.png' },
    { id: 304, name: 'Lobo', imageUrl: '/imagenes/animalitos/Lobo.png' },
    { id: 305, name: 'Loro', imageUrl: '/imagenes/animalitos/Loro.png' },
    { id: 306, name: 'Mariposa', imageUrl: '/imagenes/animalitos/Mariposa.png' },
    { id: 307, name: 'Marmota', imageUrl: '/imagenes/animalitos/Marmota.png' },
    { id: 308, name: 'Mono', imageUrl: '/imagenes/animalitos/Mono.png' },
    { id: 309, name: 'Murcielago', imageUrl: '/imagenes/animalitos/Murcielago.png' },
    { id: 310, name: 'Narval', imageUrl: '/imagenes/animalitos/Narval.png' },
    { id: 311, name: 'Nutria', imageUrl: '/imagenes/animalitos/Nutria.png' },
    { id: 312, name: 'Orca', imageUrl: '/imagenes/animalitos/Orca.png' },
    { id: 313, name: 'Oruga', imageUrl: '/imagenes/animalitos/Oruga.png' },
    { id: 314, name: 'Oso', imageUrl: '/imagenes/animalitos/Oso.png' },
    { id: 315, name: 'Oveja', imageUrl: '/imagenes/animalitos/Oveja.png' },
    { id: 316, name: 'Panda', imageUrl: '/imagenes/animalitos/Panda.png' },
    { id: 317, name: 'Pantera', imageUrl: '/imagenes/animalitos/Pantera.png' },
    { id: 318, name: 'Perro', imageUrl: '/imagenes/animalitos/Perro.png' },
    { id: 319, name: 'Pez', imageUrl: '/imagenes/animalitos/Pez.png' },
    { id: 320, name: 'Pinguino', imageUrl: '/imagenes/animalitos/Pinguino.png' },
    // Alimentos para columna N (L-P)
    { id: 321, name: 'Leche', imageUrl: '/imagenes/alimentos/Leche.png' },
    { id: 322, name: 'Manzana', imageUrl: '/imagenes/alimentos/Manzana.png' },
    { id: 323, name: 'Naranja', imageUrl: '/imagenes/alimentos/Naranja.png' },
    { id: 324, name: 'Pera', imageUrl: '/imagenes/alimentos/Pera.png' },
    { id: 325, name: 'Piña', imageUrl: '/imagenes/alimentos/Piña.png' },
  ],
  G: [
    // Objetos de bebé existentes
    { id: 25, name: 'Silla para carro', imageUrl: '/imagenes/bebe/Silla para carro.png' },
    { id: 26, name: 'Silla para comer', imageUrl: '/imagenes/bebe/Silla para comer.png' },
    { id: 27, name: 'Sonajero', imageUrl: '/imagenes/bebe/Sonajero.png' },
    { id: 28, name: 'Talco', imageUrl: '/imagenes/bebe/Talco.png' },
    { id: 29, name: 'Termómetro', imageUrl: '/imagenes/bebe/Termómetro.png' },
    { id: 30, name: 'Teteros', imageUrl: '/imagenes/bebe/Teteros.png' },
    { id: 31, name: 'Toalla', imageUrl: '/imagenes/bebe/Toalla.png' },
    { id: 32, name: 'Toallas húmedas', imageUrl: '/imagenes/bebe/Toallas humedas.png' },
    // Animalitos para columna G (Q-T)
    { id: 401, name: 'Rana', imageUrl: '/imagenes/animalitos/Rana.png' },
    { id: 402, name: 'Raton', imageUrl: '/imagenes/animalitos/Raton.png' },
    { id: 403, name: 'Rinoceronte', imageUrl: '/imagenes/animalitos/Rinoceronte.png' },
    { id: 404, name: 'Salamandra', imageUrl: '/imagenes/animalitos/Salamandra.png' },
    { id: 405, name: 'Sapo', imageUrl: '/imagenes/animalitos/Sapo.png' },
    { id: 406, name: 'Serpiente', imageUrl: '/imagenes/animalitos/Serpiente.png' },
    { id: 407, name: 'Suricata', imageUrl: '/imagenes/animalitos/Suricata.png' },
    { id: 408, name: 'Tapir', imageUrl: '/imagenes/animalitos/Tapir.png' },
    { id: 409, name: 'Tigre', imageUrl: '/imagenes/animalitos/Tigre.png' },
    { id: 410, name: 'Tortuga', imageUrl: '/imagenes/animalitos/Tortuga.png' },
    { id: 411, name: 'Tucan', imageUrl: '/imagenes/animalitos/Tucan.png' },
    // Alimentos para columna G (Q-T)
    { id: 412, name: 'Queso', imageUrl: '/imagenes/alimentos/Queso.png' },
    { id: 413, name: 'Rucula', imageUrl: '/imagenes/alimentos/Rucula.png' },
    { id: 414, name: 'Sandia', imageUrl: '/imagenes/alimentos/Sandia.png' },
    { id: 415, name: 'Tomate', imageUrl: '/imagenes/alimentos/Tomate.png' },
  ],
  O: [
    // Objetos de bebé existentes
    { id: 33, name: 'Ungüento', imageUrl: '/imagenes/bebe/Unguento.png' },
    { id: 34, name: 'Vacuna', imageUrl: '/imagenes/bebe/Vacuna.png' },
    { id: 35, name: 'Vajilla para bebé', imageUrl: '/imagenes/bebe/Vajilla para bebé.png' },
    { id: 36, name: 'Vestido', imageUrl: '/imagenes/bebe/Vestido.png' },
    { id: 37, name: 'Vitaminas', imageUrl: '/imagenes/bebe/Vitaminas.png' },
    { id: 38, name: 'Xilófono', imageUrl: '/imagenes/bebe/Xilófono.png' },
    { id: 39, name: 'Yoyo', imageUrl: '/imagenes/bebe/Yoyo.png' },
    { id: 40, name: 'Zapatitos', imageUrl: '/imagenes/bebe/Zapatitos.png' },
    // Animalitos para columna O (U-Z)
    { id: 501, name: 'Unicornio', imageUrl: '/imagenes/animalitos/Unicornio.png' },
    { id: 502, name: 'Vaca', imageUrl: '/imagenes/animalitos/Vaca.png' },
    { id: 503, name: 'Venado', imageUrl: '/imagenes/animalitos/Venado.png' },
    { id: 504, name: 'Vivora', imageUrl: '/imagenes/animalitos/Vivora.png' },
    { id: 505, name: 'Zorro', imageUrl: '/imagenes/animalitos/Zorro.png' },
    // Alimentos para columna O (U-Z)
    { id: 506, name: 'Uvas', imageUrl: '/imagenes/alimentos/Uvas.png' },
    { id: 507, name: 'Verduras', imageUrl: '/imagenes/alimentos/Verduras.png' },
    { id: 508, name: 'Yogurt', imageUrl: '/imagenes/alimentos/Yogurt.png' },
    { id: 509, name: 'Zanahoria', imageUrl: '/imagenes/alimentos/Zanahoria.png' },
  ],
};