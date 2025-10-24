# 🐘 Arimaa vs AI

Proyecto académico desarrollado para la asignatura **Introducción a la Inteligencia Artificial** en la **Universidad del Valle – Sede Tuluá**.  
Este proyecto implementa el juego **Arimaa**, enfrentando a un **jugador humano** contra una **Inteligencia Artificial** basada en el algoritmo **Minimax** con heurísticas personalizadas.

---

## 🎯 Objetivo General

Desarrollar el juego **Arimaa** en JavaScript donde:
- Las fichas **doradas** son controladas por una **IA**.
- Las fichas **plateadas** son controladas por un **jugador humano**.

---

## 🧩 Objetivos Específicos

- Programar un **agente inteligente** que minimice la pérdida esperada en cada turno.
- Implementar todas las **reglas oficiales del juego Arimaa**.
- Desarrollar una **interfaz gráfica interactiva** que permita visualizar y manipular las piezas sobre el tablero.

---

## 🧠 Inteligencia Artificial

El agente de IA utiliza el **algoritmo Minimax**, un método clásico de decisión en entornos adversarios (juegos de dos jugadores).

### Proceso:
1. **Generación de estados**  
   Se simulan todas las posibles permutaciones de movimientos de las piezas de un color sobre el tablero.
2. **Construcción del árbol Minimax**  
   Se alterna entre niveles *Max* (IA) y *Min* (jugador humano) para explorar posibles jugadas.
3. **Evaluación heurística**  
   En los nodos terminales, cada estado del tablero se evalúa usando una función heurística que considera:
   - Posición central de las piezas.
   - Distancia de los conejos hacia la meta.
   - Estado de congelación o bloqueo de piezas.
4. **Selección de movimiento óptimo**  
   La IA elige el movimiento con el **mayor valor (Max)** en su nivel, considerando que el oponente intentará minimizarlo.

---

## 🕹️ Reglas del Juego

- El tablero es de **8x8**.
- Cada jugador controla **16 piezas** con diferentes pesos:
  - 1 Elefante 🐘  
  - 1 Camello 🐪  
  - 2 Caballos 🐎  
  - 2 Perros 🐕  
  - 2 Gatos 🐈  
  - 8 Conejos 🐇
- Las piezas se mueven en direcciones cardinales (↑ ↓ ← →).  
  Los conejos **no pueden retroceder**.
- Cada turno permite **hasta 4 movimientos**.
- Las piezas pueden **empujar (push)** o **halar (pull)** oponentes más débiles.
- Existen **casillas trampa** que eliminan piezas si no tienen un aliado adyacente.
- **Formas de ganar:**
  1. Un conejo llega al extremo contrario del tablero.
  2. Se eliminan todos los conejos enemigos.
  3. Se inmoviliza al oponente (sin movimientos posibles).

---

## 💻 Estructura del Proyecto

```
arimaa-vs-ai/
├─ public/                  # Recursos estáticos e imágenes de las piezas
├─ src/
│  ├─ class/                # Clases del juego y sus piezas
│  ├─ utils/
│  │  ├─ minmax/            # Lógica de IA y heurísticas
│  │  └─ ui/                # Funciones para la interfaz
│  ├─ constants/            # Pesos y valores heurísticos
│  ├─ types/                # Tipos y definiciones TypeScript
│  └─ main.ts               # Punto de entrada principal
├─ index.html               # Interfaz del tablero
├─ tailwind.config.js       # Configuración de estilos
└─ Arimaa.pdf               # Documento explicativo del proyecto
```

---

## ⚙️ Tecnologías Utilizadas

- **TypeScript** – Tipado y estructura de clases.  
- **HTML5 Canvas** – Renderizado del tablero y piezas.  
- **Tailwind CSS** – Estilización rápida y responsiva.  
- **Vite** – Entorno de desarrollo y bundling moderno.  
- **JavaScript (ES6+)** – Lógica general y simulación de IA.

---

## 🚀 Ejecución del Proyecto

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/arimaa-vs-ai.git
cd arimaa-vs-ai
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Iniciar el servidor de desarrollo
```bash
npm run dev
```

### 4️⃣ Abrir en el navegador
Accede a [http://localhost:5173](http://localhost:5173)

---

## 👨‍💻 Autores

- **Andrés Felipe Cabal Correa** – 2160339  
- **Daniel José Cuestas Parada** – 2067550  
- **Johan Alejandro Moreno Gil** – 2160052  

**Facultad de Ingeniería – Universidad del Valle**  
**Docente:** Mtr. Joshua David Triana Madrid  
**Diciembre 2024**

---

## 📚 Referencias

- [Arimaa / Información y reglas (Wikibooks)](https://es.m.wikibooks.org/wiki/Arimaa/Información/Reglas)

---

## 🧾 Licencia

Este proyecto se desarrolló con fines académicos.  
Puedes usar el código con propósitos educativos citando a los autores originales.
