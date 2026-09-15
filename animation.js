// animation.js

export const elementos = {
    debugHitFlower: document.getElementById('hitboxFlower'),
    player: document.getElementById('player'),
    flower: document.getElementById('mrFlowery'),
    debugHit: document.getElementById('hitboxPlayer'),
    room: document.getElementById('background'),
    tela: document.getElementById('tela'),
    caixaDialogo: document.getElementById('dialog'),
    textoDialogo: document.getElementById('dialogText'),
    imgDialogo: document.getElementById('dialogSprite'),
    flowerDialog: document.getElementById('dialogSprite')
};

function gerarFrames(linha, quantidade, frameW, frameH) {
    const frames = [];
    for (let i = 0; i < quantidade; i++) {
        frames.push({ x: -frameW * i, y: -frameH * linha });
    }
    return frames;
}

const F_W = 104;
const F_H = 244;
const Fs_W = 148;
const Fs_H = 192;

export const folhas = {
    playerAndar: {
        imagem: "assets/img/krisK.png",
        frameW: 68, frameH: 116,
        colunas: 6, linhas: 2
    },
    flowerAndar: {
        imagem: "assets/img/flowery-walking.png",
        frameW: F_W, frameH: F_H,
        colunas: 8, linhas: 4
    },
    flowerCondense: {
        imagem: "assets/img/floweryCondense.png",
        frameW: 136, frameH: 256,
        colunas: 7, linhas: 1
    },
    flowerLookUp: {
        imagem: "assets/img/floweryLookUp.png",
        frameW: 88, frameH: 236,
        colunas: 2, linhas: 1
    },
    // CORRIGIDO — arquivo real é 696x74px. 696 / 8 = 87 exato,
    // então frameW=87 / frameH=74 fecham certinho com o grid real.
    flowerPUtransition: {
        imagem: "assets/img/floweryPowerUpTransition.png",
        frameW: 342, frameH: 296,
        colunas: 8, linhas: 1
    },
    flowerDialog: {
        imagem: "assets/img/floweryDialog.png",
        frameW: Fs_W, frameH: Fs_H,
        colunas: 11, linhas: 4
    }
};

export const sprites = {
    player: {
        velocidade: 10,
        direcoes: {
            s: { folha: 'playerAndar', frames: [{ x: 0, y: 0 }, { x: -68, y: 0 }, { x: 0, y: 0 }, { x: -136, y: 0 }] },
            w: { folha: 'playerAndar', frames: [{ x: -204, y: 0 }, { x: -272, y: 0 }, { x: -204, y: 0 }, { x: -340, y: 0 }] },
            d: { folha: 'playerAndar', frames: [{ x: 0, y: -116 }, { x: -68, y: -116 }] },
            a: { folha: 'playerAndar', frames: [{ x: -136, y: -116 }, { x: -204, y: -116 }] }
        }
    },
    flower: {
        velocidade: 10,
        direcoes: {
            s: { folha: 'flowerAndar', frames: gerarFrames(0, 4, F_W, F_H) },
            d: { folha: 'flowerAndar', frames: gerarFrames(1, 4, F_W, F_H) },
            a: { folha: 'flowerAndar', frames: gerarFrames(2, 4, F_W, F_H) },
            w: { folha: 'flowerAndar', frames: gerarFrames(3, 4, F_W, F_H) },

            condense: { folha: 'flowerCondense', frames: gerarFrames(0, 7, 136, 256) },
            // frames recalculados com o frameW/frameH real da folha corrigida (87x74)
            PUtransition: { folha: 'flowerPUtransition', frames: gerarFrames(0, 8, 342, 296) },
            LookUp: { folha: 'flowerLookUp', frames: gerarFrames(0, 2, 88, 236,) }
        }
    },
    flowerDialog: {
        velocidade: 14,
        direcoes: {
            f1: { folha: 'flowerDialog', frames: gerarFrames(0, 11, Fs_W, Fs_H) },
            f2: { folha: 'flowerDialog', frames: gerarFrames(1, 10, Fs_W, Fs_H) },
            f3: { folha: 'flowerDialog', frames: gerarFrames(2, 9, Fs_W, Fs_H) },
            f4: { folha: 'flowerDialog', frames: gerarFrames(3, 5, Fs_W, Fs_H) }
        }
    }
};

const estados = new Map();

function getEstado(nomeSprite) {
    if (!estados.has(nomeSprite)) {
        estados.set(nomeSprite, { indexFrame: 0, contadorFrames: 0, folhaAtual: null });
    }
    return estados.get(nomeSprite);
}

function aplicarFolha(nomeSprite, nomeFolha) {
    const estado = getEstado(nomeSprite);
    if (estado.folhaAtual === nomeFolha) return;

    const novaFolha = folhas[nomeFolha];
    const el = elementos[nomeSprite];
    const folhaAnterior = estado.folhaAtual ? folhas[estado.folhaAtual] : null;

    // ao trocar pra uma folha com dimensões diferentes, o left/top (canto
    // superior-esquerdo) não muda sozinho — então o sprite "cresce" a partir
    // do 0,0 e parece deslocar/destorcer. Aqui recalculamos left/top pra
    // manter o mesmo ponto de ancoragem: centro horizontal e base (pés).
    if (folhaAnterior) {
        const left = parseFloat(el.style.left) || 0;
        const top = parseFloat(el.style.top) || 0;

        const novoLeft = left - (novaFolha.frameW - folhaAnterior.frameW) / 2;
        const novoTop = top - (novaFolha.frameH - folhaAnterior.frameH);

        el.style.left = `${novoLeft}px`;
        el.style.top = `${novoTop}px`;
    }

    el.style.width = `${novaFolha.frameW}px`;
    el.style.height = `${novaFolha.frameH}px`;
    el.style.backgroundImage = `url('${novaFolha.imagem}')`;
    el.style.backgroundRepeat = "no-repeat";
    el.style.backgroundSize = `${novaFolha.frameW * novaFolha.colunas}px ${novaFolha.frameH * novaFolha.linhas}px`;

    estado.folhaAtual = nomeFolha;
}

export function setElementos() {
    aplicarFolha('player', 'playerAndar');
    aplicarFolha('flower', 'flowerAndar');
    aplicarFolha('flowerDialog', 'flowerDialog');
}

export function atualizarAnimacao(nomeSprite, andando, direcao) {
    const dados = sprites[nomeSprite];
    const entrada = dados.direcoes[direcao] || dados.direcoes['s'];
    const { folha, frames: listaFrames } = entrada;
    const estado = getEstado(nomeSprite);

    aplicarFolha(nomeSprite, folha);

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

export function definirFrame(nomeSprite, direcao, frame) {
    const { folha, frames: listaFrames } = sprites[nomeSprite].direcoes[direcao];
    aplicarFolha(nomeSprite, folha);
    const frameAtual = listaFrames[frame] || listaFrames[0];
    elementos[nomeSprite].style.backgroundPosition = `${frameAtual.x}px ${frameAtual.y}px`;
}