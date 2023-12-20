class datos {
    constructor(horas, valorHora, costoMateriales, margenGanancia) {
        this.horas = horas
        this.valorHora = valorHora
        this.costoMateriales = costoMateriales
        this.margenGanancia = margenGanancia
        this.precio = 0
    }
    calcularPrecio() {
        this.precio = (((this.horas * this.valorHora)
                // +variable es unary plus operator
                // hace una suma de numeros
                // si le pasamos un string lo trata como un numero
                + +this.costoMateriales)
                * ((this.margenGanancia / 100) + 1))
            * 1.19 // 1.19 es el IVA en Chile que es el 19%
    }
}

class artista {
    constructor(nombre, seguidoresEnInstagram) {
        this.nombre = nombre
        this.seguidoresEnInstagram = parseInt(seguidoresEnInstagram)
        this.factorPopularidad = this.seguidoresEnInstagram * 15
    }
}

const datosUsuario = new datos()

// arreglo para almacenar objetos artista
const artistas= []
// agregamos algunos artistas para operar con ellos
artistas.push(new artista("Seba Calfuqueo", 17300))
artistas.push(new artista("Cecilia Vicuña", 66400))
artistas.push(new artista("Voluspa Jarpa", 2262))
artistas.push(new artista("Enrique Ramirez", 4868))

// FORMS

const formCalcularPrecio = document.querySelector(".formCalcularPrecio")
const formHoras = formCalcularPrecio.elements['horas']
const formValorHora = formCalcularPrecio.elements['valorHora']
const formCostoMateriales = formCalcularPrecio.elements['costoMateriales']
const formMargenGanancia = formCalcularPrecio.elements['margenGanancia']

const precioCalculado = document.querySelector(".precioCalculado")

// creamos un fragmento y le vamos agregando elementos
// de esa forma solo nos linkeamos con el DOM una vez
// despues de que toda la lógica este resuelta
let fragment = document.createDocumentFragment()

function crearP(texto) {
    let p = document.createElement("p")
    p.textContent = texto
    return p
}

formCalcularPrecio.addEventListener('submit', (event) => {
    // para evitar que ser recarge la página cuando el usuario hace submit
    event.preventDefault();

    // agregamos los datos del form a nuestra clase de datos
    datosUsuario.horas = parseFloat(formHoras.value)
    datosUsuario.valorHora = parseInt(formValorHora.value)
    datosUsuario.costoMateriales = parseInt(formCostoMateriales.value)
    datosUsuario.margenGanancia = parseInt(formMargenGanancia.value)
    
    datosUsuario.calcularPrecio()
    // console.table(datosUsuario)

    // template literal
    fragment.appendChild(crearP(`Tu precio de venta público sugerido es de: \$${datosUsuario.precio}`))

    // si tenemos datos en nuestro div, los reemplazamos por los nuevos
    precioCalculado.hasChildNodes() && precioCalculado.replaceChild(fragment, precioCalculado.firstChild)
    
    // agregamos nuestros datos al DOM
    precioCalculado.appendChild(fragment)
})

// console.table(artistas)

const tablaArtistas = document.querySelector(".tablaArtistas")
let fragmentTablaArtistas = document.createDocumentFragment()

function popularTablaArtistas(artistas) {
    artistas.forEach((artista) => {
        let tRow = document.createElement("tr")
        
        let tdName = document.createElement("td")
        tdName.textContent = artista.nombre
        tRow.appendChild(tdName)
        
        let tdFollowers = document.createElement("td")
        tdFollowers.textContent = artista.seguidoresEnInstagram
        tRow.appendChild(tdFollowers)
        
        let tdFP = document.createElement("td")
        // suma de strings
        tdFP.textContent = "$" + artista.factorPopularidad
        tRow.appendChild(tdFP)

        fragmentTablaArtistas.appendChild(tRow)
    })
    tablaArtistas.appendChild(fragmentTablaArtistas)
}

popularTablaArtistas(artistas)

// recuperamos los nuevos artistas que esten en el storage
let storageArtistas = localStorage.getItem('array de artistas')
//console.table(storageArtistas)
const arrayStorageArtistas = JSON.parse(storageArtistas)
//console.table(arrayStorageArtistas)

nuevosArtistas = []

// operador && funciona como un if simple invocado de esta forma
arrayStorageArtistas !== null && arrayStorageArtistas.forEach((artista) => {
    nuevosArtistas.push(artista)
})

//console.table(nuevosArtistas)
popularTablaArtistas(nuevosArtistas)

// form agregar artistas
const formAgregarArtista = document.querySelector(".formAgregarArtista")
const formNombre = formAgregarArtista.elements['nombre']
const formSeguidores = formAgregarArtista.elements['seguidores']
//console.log(botonAgregarArtista)

formAgregarArtista.addEventListener('submit', (e) => {
    // para evitar que ser recarge la página cuando el usuario hace submit
    e.preventDefault()

    const nuevoArtista = new artista(formNombre.value, formSeguidores.value)

    // agregamos nuestro nuevo artista a un array de objetos
    // porque la funcion popularArtistas espera un array
    // y necesitamos que este vacio para no duplicar entradas
    // que tenemos en el storage
    arrayConNuevoArtista = []
    arrayConNuevoArtista.push(nuevoArtista)
    popularTablaArtistas(arrayConNuevoArtista)

    // lo agregamos a nuestro arreglo de nuevos artistas
    nuevosArtistas.push(nuevoArtista)
    
    // por ultimo actualizamos el localStorage con los nuevos artistas
    const jsonNuevosArtistas = JSON.stringify(nuevosArtistas)
    localStorage.setItem("array de artistas", jsonNuevosArtistas)

    //console.table(artistas)
    //console.table(jsonNuevosArtistas)

    Toastify({
	text: "Se ha agregado el artista",
	duration: 3000,
	close: true,
	gravity: "bottom",
	position: "right",
	stopOnFocus: true
    }).showToast();
})