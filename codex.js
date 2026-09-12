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

const rooms = [
    {
        name: "roomStart",
        status: true,
        back: "url('./schoolFront.png')"
    },
    {
        name: "corredor",
        status: false,
        back: "url('./corredor.png')"
    },
    {
        name: "room1",
        status: false,
        back: "url('./roomBase.png')"
    },
    {
        name: "room2",
        status: false,
        back: "url('./roomBase.png')"
    },
    {
        name: "room3",
        status: false,
        back: "url('./roomBase.png')"
    }
]

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

const getSalaAtual = () => rooms.find(element => element.status === true);

addEventListener('keydown', (tecla) => {
    const key = tecla.key.toLowerCase();
    if (key in teclas) teclas[key] = true;

    if (key === 'enter') {
        let hitboxNoCenarioX = playerX - roomX;
        let hitboxNoCenarioY = (playerY + 96) - roomY;
        console.log(`X no cenário: ${hitboxNoCenarioX.toFixed(1)} | Y no cenário: ${hitboxNoCenarioY.toFixed(1)}`);
        alert(`Posição no cenário:\nX: ${hitboxNoCenarioX.toFixed(1)}\nY: ${hitboxNoCenarioY.toFixed(1)}`);

        const salaAtiva = getSalaAtual();

        if (!salaAtiva) return;

        if (salaAtiva.name === "roomStart") {
            hitboxLaw = 0;

            if (hitboxNoCenarioY <= 852) {
                moveStatus = true
                rooms.forEach(element => element.status = false);
                rooms[1].status = true;
                cenario();

                room.style.width = `${3516}px`;
                room.style.height = `${2116}px`;
                roomX = (telaInfo.width - 3516) / 2;
                roomY = -1400;

                room.style.left = `${roomX}px`;
                room.style.top = `${roomY}px`;
            }
        }
        else if (salaAtiva.name === "corredor") {
            hitboxLaw = 1;

            if (hitboxNoCenarioY >= 2110) {
                moveStatus = true
                rooms.forEach(element => element.status = false);
                rooms[0].status = true;
                cenario();

                room.style.width = `${1540}px`;
                room.style.height = `${1468}px`;
                roomX = (telaInfo.width - 1540) / 2;
                roomY = telaInfo.height - 1468 + 350;

                room.style.left = `${roomX}px`;
                room.style.top = `${roomY}px`;
            }
            else if (hitboxNoCenarioX >= 1010 && hitboxNoCenarioX <= 1160 &&
                hitboxNoCenarioY >= 1580 && hitboxNoCenarioY <= 1625) {
                moveStatus = false
                rooms.forEach(element => element.status = false);
                rooms[2].status = true;
                cenario();

                room.style.width = `${1036}px`;
                room.style.height = `${804}px`;

                roomX = (telaInfo.width - 1036) / 2;
                roomY = (telaInfo.height - 804) / 2;

                playerX = (roomInfo.width - playerInfo.width)
                playerY = 0;

                room.style.left = `${roomX}px`;
                room.style.top = `${roomY}px`;
                player.style.left = `${playerX}px`;
                player.style.top = `${playerY}px`;
            }

            else if (hitboxNoCenarioX >= 1010 && hitboxNoCenarioX <= 1160 &&
                hitboxNoCenarioY >= 1580 && hitboxNoCenarioY <= 1625) {
                moveStatus = false
                rooms.forEach(element => element.status = false);
                rooms[2].status = true;
                cenario();

                room.style.width = `${1036}px`;
                room.style.height = `${804}px`;

                roomX = (telaInfo.width - 1036) / 2;
                roomY = (telaInfo.height - 804) / 2;

                room.style.left = `${roomX}px`;
                room.style.top = `${roomY}px`;
            }

            else if (hitboxNoCenarioX >= 1010 && hitboxNoCenarioX <= 1160 &&
                hitboxNoCenarioY >= 1580 && hitboxNoCenarioY <= 1625) {
                moveStatus = false
                rooms.forEach(element => element.status = false);
                rooms[2].status = true;
                cenario();

                room.style.width = `${1036}px`;
                room.style.height = `${804}px`;

                roomX = (telaInfo.width - 1036) / 2;
                roomY = (telaInfo.height - 804) / 2;

                room.style.left = `${roomX}px`;
                room.style.top = `${roomY}px`;
            }

            else if (hitboxNoCenarioX >= 1010 && hitboxNoCenarioX <= 1160 &&
                hitboxNoCenarioY >= 1580 && hitboxNoCenarioY <= 1625) {
                moveStatus = false
                rooms.forEach(element => element.status = false);
                rooms[2].status = true;
                cenario();

                room.style.width = `${1036}px`;
                room.style.height = `${804}px`;

                roomX = (telaInfo.width - 1036) / 2;
                roomY = (telaInfo.height - 804) / 2;

                room.style.left = `${roomX}px`;
                room.style.top = `${roomY}px`;
            }

            else if (hitboxNoCenarioX >= 1012 && hitboxNoCenarioX <= 1096 &&
                hitboxNoCenarioY >= 1580 && hitboxNoCenarioY <= 1625) {
                moveStatus = false
                rooms.forEach(element => element.status = false);
                rooms[2].status = true;
                cenario();

                room.style.width = `${1036}px`;
                room.style.height = `${804}px`;

                roomX = (telaInfo.width - 1036) / 2;
                roomY = (telaInfo.height - 804) / 2;

                room.style.left = `${roomX}px`;
                room.style.top = `${roomY}px`;
            }

            else if (hitboxNoCenarioX >= 245 && hitboxNoCenarioX <= 329 &&
                hitboxNoCenarioY >= 1580 && hitboxNoCenarioY <= 1625) {
                moveStatus = false
                rooms.forEach(element => element.status = false);
                rooms[2].status = true;
                cenario();

                room.style.width = `${1036}px`;
                room.style.height = `${804}px`;

                roomX = (telaInfo.width - 1036) / 2;
                roomY = (telaInfo.height - 804) / 2;

                room.style.left = `${roomX}px`;
                room.style.top = `${roomY}px`;
            }

            else if (hitboxNoCenarioX >= 2229 && hitboxNoCenarioX <= 2314 &&
                hitboxNoCenarioY >= 1580 && hitboxNoCenarioY <= 1625) {
                moveStatus = false
                rooms.forEach(element => element.status = false);
                rooms[2].status = true;
                cenario();

                room.style.width = `${1036}px`;
                room.style.height = `${804}px`;

                roomX = (telaInfo.width - 1036) / 2;
                roomY = (telaInfo.height - 804) / 2;

                room.style.left = `${roomX}px`;
                room.style.top = `${roomY}px`;
            }

            else if (hitboxNoCenarioX >= 2996 && hitboxNoCenarioX <= 3081 &&
                hitboxNoCenarioY >= 1580 && hitboxNoCenarioY <= 1625) {
                moveStatus = false
                rooms.forEach(element => element.status = false);
                rooms[2].status = true;
                cenario();

                room.style.width = `${1036}px`;
                room.style.height = `${804}px`;

                roomX = (telaInfo.width - 1036) / 2;
                roomY = (telaInfo.height - 804) / 2;

                room.style.left = `${roomX}px`;
                room.style.top = `${roomY}px`;
            }

            else if (hitboxNoCenarioX >= 1010 && hitboxNoCenarioX <= 1160 &&
                hitboxNoCenarioY >= 1580 && hitboxNoCenarioY <= 1625) {
                moveStatus = false
                rooms.forEach(element => element.status = false);
                rooms[2].status = true;
                cenario();

                room.style.width = `${1036}px`;
                room.style.height = `${804}px`;

                roomX = (telaInfo.width - 1036) / 2;
                roomY = (telaInfo.height - 804) / 2;

                room.style.left = `${roomX}px`;
                room.style.top = `${roomY}px`;

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

    roomX -= passoX;
    roomY -= passoY;
    if (moveStatus === true) {
        room.style.left = `${roomX}px`;
        room.style.top = `${roomY}px`;
    }
    else {
        player.style.left = `${playerX}px`;
        player.style.top = `${playerY}px`;
    }

    hitbox()
    atualizarAnimacao(andando, direcaoAtual);

    let atualNoCenarioY = (playerY + 96) - roomY;

    requestAnimationFrame(mover)
}

cenario()
requestAnimationFrame(mover)

window.addEventListener('blur', () => {
    teclas.w = false;
    teclas.a = false;
    teclas.s = false;
    teclas.d = false;
});
