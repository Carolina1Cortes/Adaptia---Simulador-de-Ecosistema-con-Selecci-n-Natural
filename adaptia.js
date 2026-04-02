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


// Poblar el mapa con criaturas y plantas
function poblarMapa() {
  // Crear 10 plantas
  for (let i = 0; i < 10; i++) {
    let fila = Math.floor(Math.random() * FILAS);   //Elige una fila al azar entre 0 y 9.
    let columna = Math.floor(Math.random() * COLUMNAS);
    if (mapa[fila][columna] === null) {       //=== significa "exactamente igual a"
      mapa[fila][columna] = crearPlanta(fila, columna);
    }
  }

  // Crear 5 herbívoros
  for (let i = 0; i < 5; i++) {
    let fila = Math.floor(Math.random() * FILAS);
    let columna = Math.floor(Math.random() * COLUMNAS);
    if (mapa[fila][columna] === null) {
      mapa[fila][columna] = crearHerbivoro(fila, columna);
    }
  }

  // Crear 3 carnívoros
  for (let i = 0; i < 3; i++) {
    let fila = Math.floor(Math.random() * FILAS);
    let columna = Math.floor(Math.random() * COLUMNAS);
    if (mapa[fila][columna] === null) {
      mapa[fila][columna] = crearCarnivoro(fila, columna);
    }
  }
}

poblarMapa();
console.log("Mapa poblado:", mapa);

//Dibujamos el mapa
function dibujarMapa(){
  let ctx = document.getElementById("canvas").getContext("2d")
  ctx.font = "18px Arial";  // tamaño del emoji

  for (let i = 0; i < FILAS; i++) {
    for (let j = 0; j < COLUMNAS; j++){
      let x = j * 50;   
      let y = i * 50;
      
      // Primero limpia la celda
      ctx.fillStyle = "#0d1117";
      ctx.fillRect(x, y, 50, 50);

      // Luego dibuja el emoji
      if (mapa[i][j] === null){
        ctx.fillText("🌿", x + 13, y + 30);
      } else if (mapa[i][j].tipo === "planta"){
        ctx.fillText("🌱", x + 13, y + 30);
      } else if (mapa[i][j].tipo === "herbivoro"){
        ctx.fillText("🐰", x + 13, y + 30);
      } else if (mapa[i][j].tipo === "carnivoro"){
        ctx.fillText("🦁", x + 13, y + 30);
      }

      ctx.strokeStyle = "lightgray";
      ctx.strokeRect(x, y, 50, 50);
    }
  }
}

dibujarMapa()
console.log("Mapa dibujado")

//Cola de prioridad --> decide el orden en que actúan las criaturas cada turno.
class ColaPrioridad {
  //Arreglo donde se guardan las criaturas
  elementos = [];
  
  // Insertamos la criatura al arreglo y ordenamos por velocidad 
  insertarCriatura(criatura){
    this.elementos.push(criatura);
    this.elementos.sort((a, b) => b.velocidad - a.velocidad);
  }

  //Saca y devuelve el primer elemento del arreglo
  extraer(){
    return this.elementos.shift();
  }

  //Devuelve true si el arreglo está vacío
  estaVacia(){
    return this.elementos.length === 0;
  }
}

/* Prueba de la Cola de Prioridad
let cola = new ColaPrioridad();

cola.insertarCriatura(crearHerbivoro(0, 0)); // velocidad aleatoria
cola.insertarCriatura(crearCarnivoro(1, 1)); // velocidad aleatoria
cola.insertarCriatura(crearHerbivoro(2, 2)); // velocidad aleatoria

console.log("Cola ordenada por velocidad:");
console.log(cola.elementos); */


//Cola circular --> Gestiona los turnos de la simulación.
class ColaCircular{
  elementos = [];
  actual = 0;   // índice --> quién actúa en este turno

  insertarCriatura(criatura){
    this.elementos.push(criatura);
  }

  //Devuelve la criatura actual y avanza el índice
  siguiente(){
    this.actual = (this.actual + 1) % this.elementos.length;   // Para volver al inicio usamos el operador módulo %
    return this.elementos[this.actual];  
  }
  
  estaVacia(){
    return this.elementos.length === 0;
  }
}

//Creamos la cola circular vacia
let turnos = new ColaCircular();

function poblarCola() {
  for (let i = 0; i < FILAS; i++) {
    for (let j = 0; j < COLUMNAS; j++) {
      let celda = mapa[i][j];
      if (celda !== null && celda.tipo !== "planta") {    //Las plantas no entran porque no actúan
        turnos.insertarCriatura(celda);   //mete la criatura a la cola circular
      }
    }
  }
}

poblarCola();
console.log("Criaturas en cola:", turnos.elementos);

//Antes de usar la cola de prioridad para el movimiento, necesitamos crear el movimiento
function moverCriatura(criatura) {
  let direcciones = [
  {df: -1, dc: 0},  // arriba
  {df: 1, dc: 0},   // abajo
  {df: 0, dc: -1},  // izquierda
  {df: 0, dc: 1}    // derecha
  ];

  //Elegir una direccion al azar
  let dir = direcciones[Math.floor(Math.random() * 4)];   //genera un número entero entre 0 y 3.
  let nuevaFila = criatura.fila + dir.df;
  let nuevaColumna = criatura.columna + dir.dc;

  //Verificar si la nueva celda esta en el mapa 
  if (nuevaFila >= 0 && nuevaFila < FILAS && nuevaColumna >= 0 && nuevaColumna < COLUMNAS && mapa[nuevaFila][nuevaColumna] === null) {
      mapa[criatura.fila][criatura.columna] = null;  // borrarla de donde estaba
      criatura.fila = nuevaFila;                      // actualizar su posición
      criatura.columna = nuevaColumna;
      mapa[nuevaFila][nuevaColumna] = criatura;       // ponerla en la nueva celda
    }
}

//Implementamos la cola de prioridad
function ejecutarTurno() {
  let colaPrioridad = new ColaPrioridad();
  
  // Meter todas las criaturas a la cola de prioridad
  for (let criatura of turnos.elementos) {
    colaPrioridad.insertarCriatura(criatura);
  }
  
  // Sacarlas en orden de velocidad y que actúen
  while (!colaPrioridad.estaVacia()) {
    let criatura = colaPrioridad.extraer();
    moverCriatura(criatura);
  }
}

//Simulacion 
function iniciarSimulacion() {
  simulacion = setInterval(() => {    // "cada X milisegundos, haz esto:"
    ejecutarTurno();     // mueve todas las criaturas
    dibujarMapa();       // redibuja el mapa con las nuevas posiciones
  }, 500);               // X = 500ms = medio segundo
}

function detenerSimulacion() {
  clearInterval(simulacion);  //detiene el intervalo que guardado en 'simulacion'
}