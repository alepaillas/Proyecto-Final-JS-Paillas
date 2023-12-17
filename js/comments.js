class comentario {
    constructor(autor, mensaje) {
	this.autor = autor
	this.mensaje = mensaje
    }
}

function crearComentario(comentario) {
    let fragmentComentario = document.createDocumentFragment()
    let divComentario = document.createElement("div")
    divComentario.classList.add("comment")
    fragmentComentario.appendChild(divComentario)
    let mensajeComentario = document.createElement("p")
    mensajeComentario.textContent = comentario.mensaje
    divComentario.appendChild(mensajeComentario)
    let autorComentario = document.createElement("p")
    autorComentario.classList.add("author")
    autorComentario.textContent = comentario.autor
    divComentario.appendChild(autorComentario)

    const comentariosWrapper = document.querySelector(".comentariosWrapper")
    comentariosWrapper.prepend(fragmentComentario) // prepend añade el elemento como primer hijo
}

// receta de cocina obtenida de docs fetch en MDN
// usamos mockAPI para guardar nuestros comentarios
async function postComentario(data) {
    try {
	const response = await fetch("https://657a8f911acd268f9afb39a2.mockapi.io/api/v1/Comments", {
	    method: "POST", // or 'PUT'
	    headers: {
		"Content-Type": "application/json",
	    },
	    body: JSON.stringify(data),
	});

	const result = await response.json();
	console.log("Success:", result);

	crearComentario(data)
    } catch (error) {
	console.error("Error:", error);
    }
}

// para testear nuestra UI, en este caso, mostrar un spinner cuando el backend se demora en resolver
async function stall(stallTime = 3000) {
  await new Promise(resolve => setTimeout(resolve, stallTime));
}

// obtenemos los comentarios guardados en la base de datos
async function getComentarios() {
    try {
	// fetch sin method es GET por defecto
	const response = await fetch("https://657a8f911acd268f9afb39a2.mockapi.io/api/v1/Comments")
	await stall()
	
	if (!response.ok) {
	    throw new Error("Network response was not OK");
	}
	const json = await response.json()

	json.forEach((comentarioJson) => {
	    crearComentario(comentarioJson)
	})

	const loader = document.querySelector(".loader")
	loader.style.display = "none"
    } catch (error) {
	console.error("Error:", error)
    }
}

getComentarios()

const formComentarios = document.querySelector(".formComentarios")
const formAutor = formComentarios.elements['autor']
const formMensaje = formComentarios.elements['mensaje']

formComentarios.addEventListener('submit', (event) => {
    event.preventDefault()

    const nuevoComentario = new comentario(formAutor.value, formMensaje.value)
    //console.log(nuevoComentario)
    postComentario(nuevoComentario)

    // reseteamos los valores del form
    // formComentarios.reset()

    // mejor solo resetear el mensaje y conservar el autor
    formMensaje.value = ""
})
