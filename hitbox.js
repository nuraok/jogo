import { elementos, sprites } from './animation.js';

const { player, flower, debugHit, debugHitFlower } = elementos;

// altura padrão de hitbox usada tanto pro player quanto pra flower
// (mesmo valor, já que a flower usa a mesma "área de pés" do player)
export function calcularAlturaHitbox(playerInfo) {
    return playerInfo.height - 96;
}

export function atualizarHitboxPlayer(playerX, playerY, playerInfo, alturaHitbox) {
    const p1x = playerX;
    const p1y = playerY + 96;
    const p2x = playerX + playerInfo.width;
    const p2y = playerY + playerInfo.height;

    debugHit.style.width = `${playerInfo.width}px`;
    debugHit.style.height = `${alturaHitbox}px`;
    debugHit.style.left = `${p1x}px`;
    debugHit.style.top = `${p1y}px`;

    // coordenada inferior-esquerda da hitbox (canto que "toca o chão")
    debugHit.textContent = `x: ${p1x.toFixed(0)} | y: ${p2y.toFixed(0)}`;

    return { p1x, p1y, p2x, p2y };
}

// ancorada na base do sprite (senão flutuaria no meio do corpo dela,
// já que ela é bem mais alta que o player)
export function atualizarHitboxFlower(alturaHitbox, salaAtiva) {
    const flowerLeft = parseFloat(flower.style.left) || 0;
    const flowerTop = parseFloat(flower.style.top) || 0;
    const hitboxTop = flowerTop + sprites.flower.frameH - alturaHitbox;

    debugHitFlower.style.width = `${sprites.flower.frameW}px`;
    debugHitFlower.style.height = `${alturaHitbox}px`;
    debugHitFlower.style.left = `${flowerLeft}px`;
    debugHitFlower.style.top = `${hitboxTop}px`;

    // mostra a mesma posição registrada em flowerPosition (room.js),
    // não o pixel recalculado — assim o texto reflete a "fonte" dos dados
    if (salaAtiva) {
        debugHitFlower.textContent = `x: ${salaAtiva.flowerPosition.x} | y: ${salaAtiva.flowerPosition.y}`;
    }
}

// compara os "pés" do player e da flower — quem estiver mais pra baixo
// na cena fica com z-index maior (aparece na frente)
export function atualizarProfundidade(playerY, playerInfo) {
    const pesPlayerY = playerY + playerInfo.height;
    const flowerTop = parseFloat(flower.style.top) || 0;
    const pesFlowerY = flowerTop + sprites.flower.frameH;

    if (pesPlayerY < pesFlowerY) {
        player.style.zIndex = 1;
        flower.style.zIndex = 2;
    } else {
        player.style.zIndex = 2;
        flower.style.zIndex = 1;
    }
}