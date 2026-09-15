// animation.js

// Elementos DOM centralizados aqui — o módulo já os captura ao ser carregado,
// não precisa de nenhuma função pra "buscar" eles.
export const elementos = {
    debugHitFlower: document.getElementById('hitboxFlower'),
    player: document.getElementById('player'),
    flower: document.getElementById('mrFlowery'),
    debugHit: document.getElementById('hitboxPlayer'),
    room: document.getElementById('background'),
    tela: document.getElementById('tela'),
    caixaDialogo: document.getElementById('dialog'),
    textoDialogo: document.getElementById('dialogText'),
    imgDialogo: document.getElementById('dialogSprite')

};

// gera N frames em sequência horizontal a partir de uma linha da spritesheet
function gerarFrames(linha, quantidade, frameW, frameH) {
    const frames = [];
    for (let i = 0; i < quantidade; i++) {
        frames.push({ x: -frameW * i, y: -frameH * linha });
    }
    return frames;
}

const F_W = 104;  // 26px na fonte × 4 (escala)
const F_H = 244;  // 61px na fonte × 4
const Fs_W = 148; 
const Fs_H = 192; 

// Dados de sprite por personagem: tamanho do frame, velocidade da animação
// e as coordenadas de cada direção dentro do spritesheet.
export const sprites = {
    player: {
        frameW: 68,
        frameH: 116,
        velocidade: 10,
        direcoes: {
            s: [{ x: 0, y: 0 }, { x: -68, y: 0 }, { x: 0, y: 0 }, { x: -136, y: 0 }],
            w: [{ x: -204, y: 0 }, { x: -272, y: 0 }, { x: -204, y: 0 }, { x: -340, y: 0 }],
            d: [{ x: 0, y: -116 }, { x: -68, y: -116 }],
            a: [{ x: -136, y: -116 }, { x: -204, y: -116 }]
        }
    },
    flower: {
        frameW: F_W,
        frameH: F_H,
        velocidade: 14,
        direcoes: {
            s: gerarFrames(0, 4, F_W, F_H),  // linha 0 — de frente
            d: gerarFrames(1, 4, F_W, F_H),  // linha 1 — perfil direito
            a: gerarFrames(2, 4, F_W, F_H),  // linha 2 — perfil esquerdo
            w: gerarFrames(3, 4, F_W, F_H)   // linha 3 — de costas
        }
    },
    flowerDialog: {
        frameW: Fs_W,
        frameH: Fs_H,
        velocidade: 14,
        direcoes: {
            f1: gerarFrames(0, 11, Fs_W, Fs_H),  // linha 0 — 
            f2: gerarFrames(1, 10, Fs_W, Fs_H),  // linha 1 — 
            f3: gerarFrames(2, 9, Fs_W, Fs_H),  // linha 2 —
            f4: gerarFrames(3, 5, Fs_W, Fs_H)   // linha 3 — 
        }
    },
};

// Aplica o estilo inicial (tamanho, imagem, background-size) em cada elemento
// animado, usando os dados do objeto `sprites` acima.
export function setElementos() {
    const p = sprites.player;
    const f = sprites.flower;
    const fd = sprites.flowerDialog

    // flowery settings (pre-edits)
    elementos.flower.style.width = `${f.frameW}px`;
    elementos.flower.style.height = `${f.frameH}px`;
    elementos.flower.style.backgroundImage = "url('assets/img/flowery-walking.png')";
    elementos.flower.style.backgroundPosition = "0px 0px";
    elementos.flower.style.backgroundSize = `${f.frameW * 8}px ${f.frameH * 4}px`;

    // player settings (pre-edits)
    elementos.player.style.width = `${p.frameW}px`;
    elementos.player.style.height = `${p.frameH}px`;
    elementos.player.style.backgroundImage = "url('assets/img/krisK.png')";
    elementos.player.style.backgroundPosition = "0px 0px";
    elementos.player.style.backgroundSize = `${p.frameW * 6}px ${p.frameH * 2}px`;

    // dialogSprite fica no tamanho real do frame (sem cortar nem vazar pro
    // frame vizinho) — o wrapper no index.html que vira o quadrado, centralizando
    elementos.imgDialogo.style.width = `${fd.frameW}px`;
    elementos.imgDialogo.style.height = `${fd.frameH}px`;
    elementos.imgDialogo.style.backgroundImage = "url('assets/img/floweryDialog.png')";
    elementos.imgDialogo.style.backgroundRepeat = "no-repeat";
    elementos.imgDialogo.style.backgroundPosition = "0px 0px";
    elementos.imgDialogo.style.backgroundSize = `${fd.frameW * 11}px ${fd.frameH * 4}px`;
}

// Estado de animação por personagem (indexFrame/contadorFrames), guardado num
// Map pra não misturar a animação de um personagem com a de outro.
const estados = new Map();

function getEstado(nomeSprite) {
    if (!estados.has(nomeSprite)) {
        estados.set(nomeSprite, { indexFrame: 0, contadorFrames: 0 });
    }
    return estados.get(nomeSprite);
}

// nomeSprite deve ser a mesma chave usada em `sprites` e `elementos`
// (ex: 'player', 'flower').
export function atualizarAnimacao(nomeSprite, andando, direcao) {
    const dados = sprites[nomeSprite];
    const listaFrames = dados.direcoes[direcao] || dados.direcoes['s'];
    const estado = getEstado(nomeSprite);

    if (estado.indexFrame >= listaFrames.length) {
        estado.indexFrame = 0;
    }

    if (andando) {
        estado.contadorFrames++;
        if (estado.contadorFrames >= dados.velocidade) {
            estado.indexFrame = (estado.indexFrame + 1) % listaFrames.length;
            estado.contadorFrames = 0;
        }
    } else {
        estado.indexFrame = 0;
        estado.contadorFrames = 0;
    }

    const frameAtual = listaFrames[estado.indexFrame];
    elementos[nomeSprite].style.backgroundPosition = `${frameAtual.x}px ${frameAtual.y}px`;
}