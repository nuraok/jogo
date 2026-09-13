const player = document.getElementById('player')
const debugHit = document.getElementById('hitboxPlayer')
const room = document.getElementById('background')
const tela = document.getElementById('tela')

let roomInfo = room.getBoundingClientRect()
const playerInfo = player.getBoundingClientRect()
const telaInfo = tela.getBoundingClientRect()

let roomX = (telaInfo.width - roomInfo.width) / 2;
let roomY = telaInfo.height - roomInfo.height - 100
let playerX = (telaInfo.width - playerInfo.width) / 2;
let playerY = telaInfo.height - playerInfo.height - 200

let playerHitbox = {};
let pH = {};

let hitboxLaw = null

let direcaoAtual = 's';
let indexFrame = 0;
let contadorFrames = 0;

let hitboxNoCenarioX = playerX - roomX;
let hitboxNoCenarioY = (playerY + 96) - roomY;

const rooms = [
    {
        name: "roomStart",
        status: true,
        back: "url('./schoolFront.png')",
        x1: 0, x2: 0, y1: 0, y2: 0
    },
    {
        name: "corredor",
        status: false,
        back: "url('./corredor.png')",
        x1: 0, x2: 0, y1: 0, y2: 0
    },
    {
        name: "room1", // Primeiro bloco (Originalmente X >= 1010)
        status: false,
        back: "url('./roomBase.png')",
        x1: 1010, x2: 1160, y1: 1580, y2: 1625
    },
    {
        name: "room2", // Segundo bloco
        status: false,
        back: "url('./roomBase.png')",
        x1: 1010, x2: 1160, y1: 1580, y2: 1625
    },
    {
        name: "room3", // Terceiro bloco
        status: false,
        back: "url('./roomBase.png')",
        x1: 1010, x2: 1160, y1: 1580, y2: 1625
    },
    {
        name: "room4", // Quarto bloco
        status: false,
        back: "url('./roomBase.png')",
        x1: 1010, x2: 1160, y1: 1580, y2: 1625
    },
    {
        name: "room5", // Quinto bloco (X >= 1012)
        status: false,
        back: "url('./roomBase.png')",
        x1: 1012, x2: 1096, y1: 1580, y2: 1625
    },
    {
        name: "room6", // Sexto bloco (X >= 245)
        status: false,
        back: "url('./roomBase.png')",
        x1: 245, x2: 329, y1: 1580, y2: 1625
    },
    {
        name: "room7", // Sétimo bloco (X >= 2229)
        status: false,
        back: "url('./roomBase.png')",
        x1: 2229, x2: 2314, y1: 1580, y2: 1625
    },
    {
        name: "room8", // Oitavo bloco (X >= 2996)
        status: false,
        back: "url('./roomBase.png')",
        x1: 2996, x2: 3081, y1: 1580, y2: 1625
    }
];

const SPRITES = {
    s: [
        { x: 0, y: 0 },
        { x: -68, y: 0 },
        { x: 0, y: 0 },
        { x: -136, y: 0 }
    ],
    w: [
        { x: -204, y: 0 },
        { x: -272, y: 0 },
        { x: -204, y: 0 },
        { x: -340, y: 0 }
    ],
    d: [
        { x: 0, y: -116 },
        { x: -68, y: -116 }
    ],
    a: [
        { x: -136, y: -116 },
        { x: -204, y: -116 }
    ]
};

let moveStatus = true

const teclas = {
    a: false,
    s: false,
    d: false,
    w: false
}

function moverBack() {
    room.style.left = `${roomX}px`;
    room.style.top = `${roomY}px`;
}
function moverPlayer() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`
}

function configurarEnquadramento(roomIdx) {

    //style padrão
    rooms.forEach(element => element.status = false);

    roomX = (telaInfo.width - roomInfo.width) / 2;
    roomY = telaInfo.height - roomInfo.height - 100
    playerX = (telaInfo.width - playerInfo.width) / 2;
    playerY = telaInfo.height - playerInfo.height - 200

    switch (roomIdx) {
        case 0:
            //roomStart

            moveStatus = true

            rooms[roomIdx].status = true;

            cenario();

            room.style.width = `${1540}px`;
            room.style.height = `${1468}px`;
            roomX = (telaInfo.width - 1540) / 2;
            roomY = telaInfo.height - 1468 + 350;

            break
        case 1:
            //style corredor

            moveStatus = true

            rooms[roomIdx].status = true;

            cenario();

            room.style.width = `${3516}px`;
            room.style.height = `${2116}px`;
            roomX = (telaInfo.width - 3516) / 2;
            roomY = -1400;


            break
        case 2:
            //room[?]

            moveStatus = false

            rooms.slice(2).forEach(element => {
                if (hitboxNoCenarioX >= element.x1 && hitboxNoCenarioX <= element.x2 &&
                    hitboxNoCenarioY >= element.y1 && hitboxNoCenarioY <= element.y2) {
                    element.status = true
                }
                else {
                    element.status = false
                }
            });

            

            cenario();

            room.style.width = `${1036}px`;
            room.style.height = `${804}px`;
            roomX = (telaInfo.width - 1036) / 2;
            roomY = (telaInfo.height - 804) / 2;


            playerX = (telaInfo.width + playerInfo.width + roomInfo.width / 2) / 2
            playerY = (telaInfo.height - playerInfo.height + 500) / 2

            break
    }
    moverBack()
    moverPlayer()
}

function hitbox() {
    playerHitbox = {
        p1x: playerX,
        p1y: playerY + 96,
        p2x: playerX + playerInfo.width,
        p2y: playerY + playerInfo.height
    }
    debugHit.style.width = `${playerInfo.width}px`
    debugHit.style.height = `${playerInfo.height - 96}px`
    debugHit.style.left = `${playerHitbox.p1x}px`
    debugHit.style.top = `${playerHitbox.p1y}px`
    pH = playerHitbox
}

function cenario() {
    rooms.forEach(element => {
        if (element.status === true) {
            room.style.backgroundImage = element.back
        }
    });
}

function atualizarAnimacao(andando, direcao) {
    const listaFrames = SPRITES[direcao] || SPRITES['s'];

    if (indexFrame >= listaFrames.length) {
        indexFrame = 0;
    }

    if (andando) {
        contadorFrames++;
        if (contadorFrames >= 10) {
            indexFrame = (indexFrame + 1) % listaFrames.length;
            contadorFrames = 0;
        }
    } else {
        indexFrame = 0;
        contadorFrames = 0;
    }

    const frameAtual = listaFrames[indexFrame];
    player.style.backgroundPosition = `${frameAtual.x}px ${frameAtual.y}px`;
}

function mover() {
    let moveX = 0;
    let moveY = 0;

    if (teclas.a) { moveX -= 1; direcaoAtual = 'a'; }
    if (teclas.d) { moveX += 1; direcaoAtual = 'd'; }
    if (teclas.w) { moveY -= 1; direcaoAtual = 'w'; }
    if (teclas.s) { moveY += 1; direcaoAtual = 's'; }

    let passoX = moveX * 8;
    let passoY = moveY * 8;

    if (moveX !== 0 && moveY !== 0) {
        passoX = Math.round(moveX * 8 * 0.7071);
        passoY = Math.round(moveY * 8 * 0.7071);
    }

    const andando = (moveX !== 0 || moveY !== 0);

    if (moveStatus === true) {
        roomX -= passoX;
        roomY -= passoY;
        room.style.left = `${roomX}px`;
        room.style.top = `${roomY}px`;
        moverBack()
    }
    else {
        playerX += passoX;
        playerY += passoY;
        moverPlayer()
    }

    hitbox()
    atualizarAnimacao(andando, direcaoAtual);

    let atualNoCenarioY = (playerY + 96) - roomY;

    requestAnimationFrame(mover)
}

const getSalaAtual = () => rooms.find(element => element.status === true);

addEventListener('keydown', (tecla) => {
    const key = tecla.key.toLowerCase();
    if (key in teclas) teclas[key] = true;

    if (key === 'enter') {
        hitboxNoCenarioX = playerX - roomX;
        hitboxNoCenarioY = (playerY + 96) - roomY;
        console.log(`X no cenário: ${hitboxNoCenarioX.toFixed(1)} | Y no cenário: ${hitboxNoCenarioY.toFixed(1)}`);
        alert(`Posição no cenário:\nX: ${hitboxNoCenarioX.toFixed(1)}\nY: ${hitboxNoCenarioY.toFixed(1)}`);

        const salaAtiva = getSalaAtual();

        if (!salaAtiva) return;

        if (salaAtiva.name === "roomStart") {


            if (hitboxNoCenarioY <= 852) {

                configurarEnquadramento(1)
            }
        }
        else if (salaAtiva.name === "corredor") {

            if (hitboxNoCenarioY >= 2110) {

                configurarEnquadramento(0)
            }
            else if (rooms.slice(2).some(element => (hitboxNoCenarioX >= element.x1 && hitboxNoCenarioX <= element.x2 &&
                    hitboxNoCenarioY >= element.y1 && hitboxNoCenarioY <= element.y2))) {
                configurarEnquadramento(2)
            }
        }
        if (rooms.slice(2).some(element => element.status === true)) {
            if (hitboxNoCenarioX >= 936 && hitboxNoCenarioX <= 1033 &&
                hitboxNoCenarioY >= 592 && hitboxNoCenarioY <= 714) {

                configurarEnquadramento(1)
            }
        }
    }
});


addEventListener('keyup', (tecla) => {
    const key = tecla.key.toLowerCase();
    if (key in teclas) teclas[key] = false;
})

room.style.left = `${roomX}px`;
room.style.top = `${roomY}px`;
player.style.left = `${playerX}px`;
player.style.top = `${playerY}px`;

cenario()
requestAnimationFrame(mover)

window.addEventListener('blur', () => {
    teclas.w = false;
    teclas.a = false;
    teclas.s = false;
    teclas.d = false;
});
