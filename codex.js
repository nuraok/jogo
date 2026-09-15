import { atualizarAnimacao, setElementos, elementos, sprites } from './animation.js';
import { rooms } from './room.js';
import { getSalaAtual, cenario } from './salas.js';
import { teclas } from './input.js';
import { falas } from './falas.js';
import {
    calcularAlturaHitbox,
    atualizarHitboxPlayer,
    atualizarHitboxFlower,
    atualizarProfundidade
} from './hitbox.js';
import { cutsceneAtiva, cutsceneIntroducao, rodarCutscene } from './cutscene.js';

// desestrutura pra manter o resto do código igual ao original
const { player, flower, room, tela, caixaDialogo } = elementos;

setElementos();

room.style.backgroundImage = "url('assets/img/schoolFront.png')"

const roomInfo = room.getBoundingClientRect()
const telaInfo = tela.getBoundingClientRect()
const dialogInfo = caixaDialogo.getBoundingClientRect()

caixaDialogo.style.left = `${(telaInfo.width - dialogInfo.width)/2}px`
caixaDialogo.style.bottom = "20px"

const playerInfo = player.getBoundingClientRect()

const alturaHitbox = calcularAlturaHitbox(playerInfo);

let roomX = (telaInfo.width - roomInfo.width) / 2;
let roomY = telaInfo.height - roomInfo.height - 100
let playerX = (telaInfo.width - sprites.player.frameW) / 2;
let playerY = telaInfo.height - sprites.player.frameH - 200

let playerHitbox = {};

let hitboxNoCenarioX = playerX - roomX;
let hitboxNoCenarioY = (playerY + 96) - roomY;

let moveStatus = true

let direcaoAtual = 's';

let salaAtiva = getSalaAtual();

// 0 = nenhuma cena pendente; cada número é uma cutscene a disparar
let cenaIdx = 0
let cFirstCena = true

function playAllCutscenes(cena) {
    falas(cena)
    if (cena === 1) {
        cenaIdx = 0;   // zera antes de rodar, pra não disparar de novo no próximo frame
        rodarCutscene(cutsceneIntroducao);
    }
    // futuras cenas:
    // if (cena === 2) { cenaIdx = 0; rodarCutscene(outraCena); }
}

function moverBack() {
    room.style.left = `${roomX}px`;
    room.style.top = `${roomY}px`;
}
function moverPlayer() {
    player.style.left = `${playerX}px`;
    player.style.top = `${playerY}px`
}

function configurarEnquadramento(roomIdx, config) {

    //style padrão
    salaAtiva = getSalaAtual();
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

            room.style.width = "1540px";
            room.style.height = "1468px";
            roomX = (telaInfo.width - 1540) / 2;
            roomY = telaInfo.height - 1468 + 350;

            break
        case 1:
            //style corredor

            moveStatus = true

            rooms[roomIdx].status = true;

            cenario();

            room.style.width = "3516px";
            room.style.height = "2116px";

            if (config) {
                roomX = playerX - (salaAtiva.x2 + salaAtiva.x1) / 2
                roomY = (playerY + 96) - (salaAtiva.y2 + salaAtiva.y1) / 2
                direcaoAtual = "s"

            }
            else {
                roomX = (telaInfo.width - 3516) / 2;
                roomY = -1400;
            }


            break
        case 2:
            //room[?]

            moveStatus = false

            rooms.slice(2).forEach(element => {
                if (hitboxNoCenarioX >= element.x1 && hitboxNoCenarioX <= element.x2 &&
                    hitboxNoCenarioY >= element.y1 && hitboxNoCenarioY <= element.y2) {
                    element.status = true
                    alert(element.name)
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

            direcaoAtual = 'a';

            break
    }
    moverBack()
    moverPlayer()
}

function mover() {
    // enquanto uma cutscene estiver rodando, o player não se move,
    // mas o loop continua vivo (a cutscene roda seu próprio requestAnimationFrame)
    if (cutsceneAtiva) {
        requestAnimationFrame(mover);
        return;
    }

    // checa se tem cutscene pendente pra disparar — sem return,
    // o movimento normal continua no mesmo frame
    playAllCutscenes(cenaIdx);

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

    playerHitbox = atualizarHitboxPlayer(playerX, playerY, playerInfo, alturaHitbox);
    atualizarHitboxFlower(alturaHitbox, salaAtiva);
    atualizarProfundidade(playerY, playerInfo);
    atualizarAnimacao('player', andando, direcaoAtual);

    let atualNoCenarioY = (playerY + 96) - roomY;

    requestAnimationFrame(mover)
}

addEventListener('keydown', (tecla) => {
    const key = tecla.key.toLowerCase();

    if (key === 'enter') {
        hitboxNoCenarioX = playerX - roomX;
        hitboxNoCenarioY = (playerY + 96) - roomY;
        console.log(`X no cenário: ${hitboxNoCenarioX.toFixed(1)} | Y no cenário: ${hitboxNoCenarioY.toFixed(1)}`);
        alert(`Posição no cenário:\nX: ${hitboxNoCenarioX.toFixed(1)}\nY: ${hitboxNoCenarioY.toFixed(1)}`);

        salaAtiva = getSalaAtual();

        if (!salaAtiva) return;

        if (salaAtiva.name === "roomStart") {

            if (hitboxNoCenarioY <= 876) {
                if (cFirstCena === true) {
                    cenaIdx = 1
                    cFirstCena = false
                }
                configurarEnquadramento(1)
            }
        }
        else if (salaAtiva.name === "corredor") {

            if (hitboxNoCenarioY >= 2000) {

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

                configurarEnquadramento(1, true)
            }
        }
    }
});

room.style.left = `${roomX}px`;
room.style.top = `${roomY}px`;
player.style.left = `${playerX}px`;
player.style.top = `${playerY}px`;

cenario()
requestAnimationFrame(mover)