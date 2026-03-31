const FILAS = 10;
const COLUMNAS = 10;

//Creamos el arreglo en 2D vacio
let mapa = [];

for (let i = 0; i < FILAS; i++) {
    let fila = [];
    for (let j = 0; j < COLUMNAS; j++){
        fila.push(null);  //cada celda empieza vacía
    }
    mapa.push(fila);
}

console.log("Mapa creado:", mapa);

// Función para crear una planta
function crearPlanta(fila, columna) {
  return {
    tipo: "planta",
    energia: 30,
    fila: fila,
    columna: columna
  };
}

// Función para crear un herbívoro
function crearHerbivoro(fila, columna) {
  return {
    tipo: "herbivoro",
    energia: 100,
    velocidad: Math.floor(Math.random() * 3) + 2, // velocidad entre 1 y 3
    consumoEnergia: 2,
    hambre: 0,
    fila: fila,
    columna: columna
  };
}

// Función para crear un carnívoro
function crearCarnivoro(fila, columna) {
  return {
    tipo: "carnivoro",
    energia: 150,
    velocidad: Math.floor(Math.random() * 3) + 3, // velocidad entre 3 y 5
    consumoEnergia: 4,
    hambre: 0,
    fila: fila,
    columna: columna
  };
}

console.log("Ejemplo herbívoro:", crearHerbivoro(0, 0));