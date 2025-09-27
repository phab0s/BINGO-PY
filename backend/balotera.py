import random
from collections import defaultdict

class Balotera:
    """
    Simula una balotera de Bingo que sigue el ciclo B-I-N-G-O.
    """

    def __init__(self, cartones_generados: list[dict]):
        """
        Inicializa la balotera, separando los objetos por columnas (B, I, N, G, O),
        barajando cada columna de forma independiente.

        Args:
            cartones_generados (list[dict]): Lista de cartones de la partida.
        """
        if not isinstance(cartones_generados, list):
            raise TypeError("El argumento debe ser una lista de cartones generados.")

        self._letras = ['B', 'I', 'N', 'G', 'O']
        self._original_items_por_columna = self._extraer_y_organizar_objetos(cartones_generados)
        
        self.columnas_disponibles = {letra: list(items) for letra, items in self._original_items_por_columna.items()}
        self._barajar_columnas()
        
        self.llamados = []
        self.letra_actual_idx = 0

    def _extraer_y_organizar_objetos(self, cartones: list[dict]) -> dict[str, list]:
        """Extrae objetos únicos y los organiza por columna."""
        objetos_unicos_por_columna = defaultdict(set)
        
        for carton in cartones:
            for letra, columna_items in carton.items():
                if letra in self._letras:
                    for item in columna_items:
                        # Convertir dict a tupla de items para que sea hasheable
                        objetos_unicos_por_columna[letra].add(tuple(item.items()))
        
        # Convertir de nuevo a lista de dicts
        return {
            letra: [dict(item_tuple) for item_tuple in sorted(list(items))]
            for letra, items in objetos_unicos_por_columna.items()
        }

    def _barajar_columnas(self):
        """Baraja los objetos dentro de cada columna."""
        for letra in self.columnas_disponibles:
            random.shuffle(self.columnas_disponibles[letra])

    def llamar_objeto(self) -> dict | None:
        """
        Llama el siguiente objeto siguiendo la secuencia B-I-N-G-O.
        Si una columna está vacía, salta a la siguiente en el ciclo.

        Returns:
            dict: Un diccionario con la 'letra' y el 'objeto' llamado.
            None: Si todas las columnas están vacías.
        """
        # Primero, verificar si quedan objetos en alguna columna
        if not any(self.columnas_disponibles.values()):
            return None

        # Usar un índice de búsqueda para no alterar el estado hasta el final
        search_idx = self.letra_actual_idx
        
        # Iterar un máximo de len(_letras) veces para evitar un bucle infinito
        for _ in range(len(self._letras)):
            letra_a_llamar = self._letras[search_idx]
            
            # Verificar si la columna actual tiene objetos disponibles
            if self.columnas_disponibles.get(letra_a_llamar):
                # Si hay objetos, seleccionar uno
                objeto_seleccionado = self.columnas_disponibles[letra_a_llamar].pop()
                
                resultado = {'letra': letra_a_llamar, 'objeto': objeto_seleccionado}
                self.llamados.append(resultado)
                
                # Actualizar el índice principal para la *próxima* llamada
                self.letra_actual_idx = (search_idx + 1) % len(self._letras)
                
                return resultado
            
            # Si la columna está vacía, avanzar el índice de búsqueda al siguiente
            search_idx = (search_idx + 1) % len(self._letras)
            
        # Este punto solo se alcanzaría si el chequeo inicial de any() falla,
        # lo cual no debería suceder. Es una salvaguarda.
        return None

    def ver_llamados(self) -> list:
        """Devuelve la lista de los objetos que ya han sido llamados."""
        return self.llamados

    def reiniciar(self):
        """Restaura la balotera a su estado inicial y vuelve a barajar."""
        self.columnas_disponibles = {letra: list(items) for letra, items in self._original_items_por_columna.items()}
        self._barajar_columnas()
        self.llamados = []
        self.letra_actual_idx = 0

# --- Bloque de demostración ---
if __name__ == "__main__":
    cartones_de_juego = [
        {'B': [{'id': 1, 'name': 'B1'}], 'I': [{'id': 16, 'name': 'I16'}], 'N': [{'id': 31, 'name': 'N31'}], 'G': [{'id': 46, 'name': 'G46'}], 'O': [{'id': 61, 'name': 'O61'}]},
        {'B': [{'id': 2, 'name': 'B2'}], 'I': [{'id': 17, 'name': 'I17'}], 'N': [{'id': 32, 'name': 'N32'}], 'G': [{'id': 47, 'name': 'G47'}], 'O': [{'id': 62, 'name': 'O62'}]},
        {'B': [{'id': 1, 'name': 'B1'}], 'I': [{'id': 18, 'name': 'I18'}], 'N': [{'id': 33, 'name': 'N33'}], 'G': [{'id': 48, 'name': 'G48'}], 'O': [{'id': 63, 'name': 'O63'}]},
    ]

    print("--- Creando una instancia de la Balotera con 3 cartones ---")
    balotera = Balotera(cartones_de_juego)
    
    for letra, items in balotera.columnas_disponibles.items():
        print(f"Columna {letra} (barajada): {[obj['name'] for obj in items]}")
    print("-" * 20)

    print("\n--- Llamando los siguientes 7 objetos (deberían seguir el ciclo B-I-N-G-O) ---")
    for i in range(7):
        resultado = balotera.llamar_objeto()
        if resultado:
            print(f"Llamada {i+1}: Letra {resultado['letra']}, Objeto: {resultado['objeto']['name']}")
        else:
            print("¡No quedan más objetos para llamar!")
            break
    print("-" * 20)

    print("\n--- Lista de objetos llamados ---")
    for res in balotera.ver_llamados():
        print(f"Letra: {res['letra']}, Objeto: {res['objeto']['name']}")
    print("-" * 20)

    print("\n--- Reiniciando la balotera ---")
    balotera.reiniciar()
    print("¡Balotera reiniciada!")
    print(f"Objetos llamados después de reiniciar: {len(balotera.ver_llamados())}")
    
    print("\n--- Verificando que las columnas están llenas y re-barajadas de nuevo ---")
    for letra, items in balotera.columnas_disponibles.items():
        print(f"Columna {letra} (re-barajada): {[obj['name'] for obj in items]}")
    print("-" * 20)

    print("\nLlamando un objeto después de reiniciar para confirmar:")
    resultado = balotera.llamar_objeto()
    print(f"Llamada: Letra {resultado['letra']}, Objeto: {resultado['objeto']['name']}")
    assert resultado['letra'] == 'B'
    print("\n¡La lógica de la balotera secuencial funciona correctamente!")