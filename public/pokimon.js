const botonMascotaJugador = document.getElementById('boton-mascota')
const spanMascotaJugador = document.getElementById('mascotapropia')
const spanMascotaRival = document.getElementById('mascotarival')
const spanVictoriaPropia = document.getElementById('vidapropia')
const spanVictoriaRival = document.getElementById('vidarival')
const botonReiniciar = document.getElementById('botonReiniciar')
const seccionMensajes = document.getElementById('resultado')
const ataquesDelJugador = document.getElementById('ataquesDelJugador')
const ataquesDelrival = document.getElementById('ataquesDelRival')
const contenedorTarjetas = document.getElementById('contenedorPokimones')
const contenedorDeAtaques = document.getElementById('contenedorAtaques')
const sectionVerMapa = document.getElementById('verMapa')
const mapa = document.getElementById('mapa')

let jugadorId = null
let enemigoId = null
let pokimones =[]
let pokimonesEnemigos = []
let victoriaPropia = 0
let victoriaRival = 0
let opcionDePokimones
let opcionDeAtaques
let inputMudkip
let inputTreecko
let inputTorchic
let botonFuego
let botonAgua 
let botonPlanta 
let botones = []
let mascotaPropia
let mascotaPropiaObjeto
let iAtaqueJugador
let iAtaqueRival
let ataquesJugador = []
let ataquesPokimonRival = []
let ataquePokimonRival = []
let resultado
let lienzo = mapa.getContext("2d")
let intervalo
let mapaBackground = new Image()
mapaBackground.src = './assets/mapaPokimon.png'
let alturaBuscada
let anchoMapa = window.innerWidth - 30
const anchoMaximoMapa = 500

if(anchoMapa > anchoMaximoMapa){
    anchoMapa = anchoMaximoMapa - 20
}

alturaBuscada = anchoMapa * 600 / 800

mapa.width = anchoMapa
mapa.height = alturaBuscada

class Pokimon{
    constructor(nombre, foto, vida, id = null) { 
        this.id = id
        this.nombre = nombre
        this.foto = foto
        this.vida = vida
        this.ataques = []
        this.ancho = 60
        this.alto = 60
        this.x = aleatorio(0, mapa.width - this.ancho)
        this.y = aleatorio(0, mapa.height - this.alto)
        this.mapaFoto = new Image()
        this.mapaFoto.src = foto
        this.velocidadX = 0
        this.velocidadY = 0
    }
    pintarPokimon(){
        lienzo.drawImage(
            this.mapaFoto,
            this.x,
            this.y,
            this.ancho,
            this.alto
        )
    }
}

let pokimonMudkip = new Pokimon('Mudkip', './assets/mudkip.png', 5)

let pokimonTreecko = new Pokimon('Treecko', './assets/treecko.png', 5)

let pokimonTorchic = new Pokimon('Torchic', './assets/torchic.png',5)


const pokimonMudkipAtaques = [
    {nombre:'💧', id: 'boton-agua'},
    {nombre:'🔥', id: 'boton-fuego'},
    {nombre:'💧', id: 'boton-agua'},
    {nombre:'🍃', id: 'boton-planta'}
]

pokimonMudkip.ataques.push(...pokimonMudkipAtaques)

const pokimonTreeckoAtaques = [
    {nombre:'🍃', id: 'boton-planta'},
    {nombre:'🍃', id: 'boton-planta'},
    {nombre:'🔥', id: 'boton-fuego'},
    {nombre:'💧', id: 'boton-agua'}
]

pokimonTreecko.ataques.push(...pokimonTreeckoAtaques)

const pokimonTorchicAtaques = [
    {nombre:'🔥', id: 'boton-fuego'},
    {nombre:'🍃', id: 'boton-planta'},
    {nombre:'💧', id: 'boton-agua'},
    {nombre:'🔥', id: 'boton-fuego'}
]

pokimonTorchic.ataques.push(...pokimonTorchicAtaques)

pokimones.push(pokimonMudkip,pokimonTreecko,pokimonTorchic)

sectionVerMapa.style.display = 'none'

pokimones.forEach((Pokimon) => {
    opcionDePokimones = `
    <input type="radio" name="mascota" id=${Pokimon.nombre} />
    <label class="tarjetaDePokimon" for=${Pokimon.nombre}>
        <p>${Pokimon.nombre}</p>
        <img src=${Pokimon.foto} alt=${Pokimon.nombre}>
    </label>
    `
    contenedorTarjetas.innerHTML += opcionDePokimones

    inputMudkip = document.getElementById('Mudkip')
    inputTreecko = document.getElementById('Treecko')
    inputTorchic = document.getElementById('Torchic')
})

botonMascotaJugador.addEventListener('click',seleccionarMascotaJugador)
botonReiniciar.style.display = 'none'
botonReiniciar.addEventListener('click',reiniciar)

unirseAlJuego()

function unirseAlJuego() {
    fetch("http://192.168.80.17:8080/unirse")
    .then(function (res) {
        if(res.ok){
            res.text()
                .then(function (respuesta) {
                    console.log(respuesta)
                    jugadorId = respuesta
                })
        }
    })
}

function seleccionarMascotaJugador(){

    sectionVerMapa.style.display = 'flex'

    if(inputMudkip.checked){
        spanMascotaJugador.innerHTML = inputMudkip.id
        mascotaPropia = inputMudkip.id
    } else if(inputTreecko.checked){
        spanMascotaJugador.innerHTML = inputTreecko.id
        mascotaPropia = inputTreecko.id
    } else if(inputTorchic.checked ){
        spanMascotaJugador.innerHTML = inputTorchic.id
        mascotaPropia = inputTorchic.id
    } else {
        alert("selecciona mascota")
        return
    }
    inputMudkip.id.disabled =true
    inputTreecko.id.disabled =true
    inputTorchic.id.disabled =true
    botonMascotaJugador.disabled = true

    extraerAtaques(mascotaPropia)
    iniciarMapa()
    seleccionarPokimon.style.display = 'none'

    seleccionarPokimonBack(mascotaPropia)
}

function seleccionarPokimonBack(mascotaPropia) {
    fetch(`http://192.168.80.17:8080/Pokimon/${jugadorId}` ,{
        method: "post",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            pokimon: mascotaPropia
        })
    })
}

function extraerAtaques(mascotaPropia){
    let ataques
    for (let i = 0; i < pokimones.length; i++) {
        if (mascotaPropia == pokimones[i].nombre){
            ataques = pokimones[i].ataques
        }
    }
    mostrarAtaques(ataques)
}

function mostrarAtaques(ataques){
    ataques.forEach((ataque) => {
        opcionDeAtaques = `
        <button id=${ataque.id} class="botonesDeAtaque">${ataque.nombre}</button>`
        contenedorDeAtaques.innerHTML += opcionDeAtaques
    })
    botonFuego = document.getElementById('boton-fuego')
    botonAgua = document.getElementById('boton-agua')
    botonPlanta = document.getElementById('boton-planta')
    botones = document.querySelectorAll('.botonesDeAtaque')
}

function secuenciaAtaques() {
    botones.forEach((boton) => {
        boton.addEventListener('click', (e) => {
            if (e.target.textContent === '🔥') {
                ataquesJugador.push('Fuego')
                console.log(ataquesJugador)
                boton.style.background = 'black'
                boton.disabled = true
            } else if (e.target.textContent  == '💧') {
                ataquesJugador.push ('Agua')
                console.log(ataquesJugador)
                boton.style.background = 'black'
                boton.disabled = true
            } else {
                ataquesJugador.push ('Planta')
                console.log(ataquesJugador)
                boton.style.background = 'black'
                boton.disabled = true
            }
            if(ataquesJugador.length == 4){
                enviarAtaques()
            }
        })
    })
}

function enviarAtaques() {
    fetch(`http://192.168.80.17:8080/pokimon/${jugadorId}/ataques`,{
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            ataques: ataquesJugador
        })
    })

    intervalo = setInterval(obtenerAtaques, 50)
}

function obtenerAtaques(){
    fetch(`http://192.168.80.17:8080/pokimon/${enemigoId}/ataques`)
        .then(function (res) {
            if (res.ok) {
                res.json()
                    .then(function ({ ataques }){
                        if(ataques.length == 4){
                            ataquePokimonRival = ataques
                            combate()
                        }
                    })
            }
        })
}

function seleccionarMascotaRival(rival){
    spanMascotaRival.innerHTML = rival.nombre
    ataquesPokimonRival = rival.ataques
    secuenciaAtaques()
}
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function seleccionAtaqueRival(){
    ataqueRival= aleatorio(0,ataquesPokimonRival.length -1)
    if(ataqueRival === 0 || ataqueRival === 1){
        ataquePokimonRival.push ("Fuego")
        console.log(ataquePokimonRival)
    } else if (ataqueRival === 2){
        ataquePokimonRival.push ("Agua")
        console.log(ataquePokimonRival)
    } else{
        ataquePokimonRival.push ("Planta")
        console.log(ataquePokimonRival)
    }
    iniciarPelea()
}

function iniciarPelea(){
    if (ataquesJugador.length == 4) {
        combate()
    }
}

function crearMensajeFinal(resultadoFinal){
    let seccionMensajes = document.getElementById('resultado')
    if (victoriaPropia == victoriaRival) {
        seccionMensajes.innerHTML = ("Empate")
    } else if ( victoriaPropia > victoriaRival){
        seccionMensajes.innerHTML = ("Ganaste")
    } else {
        seccionMensajes.innerHTML = ("Perdiste")
    }
}

function iAmbosOponentes(jugador, rival){
    iAtaqueJugador = ataquesJugador[jugador]
    iAtaqueRival = ataquePokimonRival[rival]
}

function combate(){
    clearInterval(intervalo)

    for (let i = 0; i < ataquesJugador.length; i++) {
        if(ataquesJugador[i] == ataquePokimonRival[i] ){
            iAmbosOponentes(i, i)
            crearMensaje()
        } else if ((ataquesJugador[i] == "Fuego"  && ataquePokimonRival[i] == "Planta") || (ataquesJugador[i] == "Agua" && ataquePokimonRival[i] == "Fuego") || (ataquesJugador[i] == "Planta" && ataquePokimonRival[i] == "Agua")) {
            iAmbosOponentes(i, i)
            crearMensaje()
            victoriaPropia++
            spanVictoriaPropia.innerHTML =victoriaPropia
        } else {
            iAmbosOponentes(i, i)
            crearMensaje()
            victoriaRival++
            spanVictoriaRival.innerHTML =victoriaRival
        }
    } crearMensajeFinal()
}
function crearMensaje(){

    let nuevoAtaqueDelJugador = document.createElement('p')
    let nuevoAtaqueDelRival = document.createElement('p')

    nuevoAtaqueDelJugador.innerHTML = iAtaqueJugador
    nuevoAtaqueDelRival.innerHTML = iAtaqueRival

    ataquesDelJugador.appendChild(nuevoAtaqueDelJugador)
    ataquesDelrival.appendChild(nuevoAtaqueDelRival)
}

function pintarCanvas() {

    mascotaPropiaObjeto.x += mascotaPropiaObjeto.velocidadX
    mascotaPropiaObjeto.y += mascotaPropiaObjeto.velocidadY
    lienzo.clearRect(0, 0, mapa.width, mapa.height)
    lienzo.drawImage(
        mapaBackground,
        0,
        0,
        mapa.width,
        mapa.height
    )
    mascotaPropiaObjeto.pintarPokimon()
    
    enviarPosicion(mascotaPropiaObjeto.x, mascotaPropiaObjeto.y)

    pokimonesEnemigos.forEach(function (pokimon) {
        pokimon.pintarPokimon()
        revisarColision(pokimon)
    })


}

function enviarPosicion(x, y) {
    fetch(`http://192.168.80.17:8080/pokimon/${jugadorId}/posicion`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function (res) {
        if (res.ok){
            res.json()
                .then(function ({ enemigos }) {
                    console.log(enemigos)
                    pokimonesEnemigos = enemigos.map(function (enemigo) {
                        let pokimonEnemigo = null
                        const pokimonNombre = enemigo.pokimon.nombre || ""
                        if (pokimonNombre == "Mudkip") {
                                pokimonEnemigo = new Pokimon('Mudkip', './assets/mudkip.png', 5, enemigo.id)
                        } else if (pokimonNombre == "Treecko"){
                                pokimonEnemigo = new Pokimon('Treecko', './assets/treecko.png', 5, enemigo.id)
                        } else if (pokimonNombre == "Torchic"){
                                pokimonEnemigo = new Pokimon('Torchic', './assets/torchic.png', 5, enemigo.id)
                        }
                        
                        pokimonEnemigo.x = enemigo.x
                        pokimonEnemigo.y = enemigo.y
                        return pokimonEnemigo
                    })
                })
        }
    })
}

function moverPokimonArriba(){
    mascotaPropiaObjeto.velocidadY = -5
}

function moverPokimonIzquierda(){
    mascotaPropiaObjeto.velocidadX = -5
}

function moverPokimonAbajo(){
    mascotaPropiaObjeto.velocidadY = +5

}

function moverPokimonDerecha(){
    mascotaPropiaObjeto.velocidadX = +5
    
}

function detenerMovimiento(){
    mascotaPropiaObjeto.velocidadX = 0
    mascotaPropiaObjeto.velocidadY = 0
}

function teclaPresionada(event) {
    switch (event.key) {
        case 'ArrowUp':
            moverPokimonArriba()
            break
        case 'ArrowLeft':
        moverPokimonIzquierda()
            break
        case 'ArrowDown':
            moverPokimonAbajo()
            break
        case 'ArrowRight':
        moverPokimonDerecha()
            break
        default:
            break
    }
}

function iniciarMapa(){
    mascotaPropiaObjeto = obtenerObjetoMascota(mascotaPropia)
    intervalo = setInterval(pintarCanvas,50)

    window.addEventListener('keydown', teclaPresionada)
    window.addEventListener('keyup', detenerMovimiento)
}

function obtenerObjetoMascota(){
    for (let i = 0; i < pokimones.length; i++) {
        if (mascotaPropia == pokimones[i].nombre){
            return pokimones[i]
        }
    }
}

function revisarColision(rival){
    const arribaRival = rival.y
    const abajoRival = rival.y + rival.alto
    const derechaRival = rival.x + rival.ancho
    const izquierdaRival = rival.x

    const arribaMascota = mascotaPropiaObjeto.y
    const abajoMascota = mascotaPropiaObjeto.y + mascotaPropiaObjeto.alto
    const derechaMascota = mascotaPropiaObjeto.x + mascotaPropiaObjeto.ancho
    const izquierdaMascota = mascotaPropiaObjeto.x
    if(
        abajoMascota < arribaRival || arribaMascota > abajoRival || derechaMascota < izquierdaRival || izquierdaMascota > derechaRival
    ){
        return
    }
    detenerMovimiento()
    clearInterval(intervalo)
    enemigoId = rival.id
    seleccionarMascotaRival(rival)
    seleccionarAtaque.style.display = 'flex'
    verMapa.style.display = 'none'

}

function reiniciar(){
    location.reload()
}