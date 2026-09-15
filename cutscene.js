import { elementos, sprites, atualizarAnimacao, definirFrame } from './animation.js';
import { falas } from './falas.js';

// ---------- primitivas ----------

export function esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// move um elemento (player/flower) até um destino em linha reta,
// atualizando a animação de "andar" na direção certa a cada frame
export function moverAte(nomeSprite, destinoX, destinoY, velocidade) {
    return new Promise(resolve => {
        const el = elementos[nomeSprite];

        function passo() {
            const x = parseFloat(el.style.left) || 0;
            const y = parseFloat(el.style.top) || 0;

            const dx = destinoX - x;
            const dy = destinoY - y;
            const dist = Math.hypot(dx, dy);

            if (dist < velocidade) {
                el.style.left = `${destinoX}px`;
                el.style.top = `${destinoY}px`;
                atualizarAnimacao(nomeSprite, false, 's');
                resolve();
                return;
            }

            const dirX = dx / dist;
            const dirY = dy / dist;
            el.style.left = `${x + dirX * velocidade}px`;
            el.style.top = `${y + dirY * velocidade}px`;

            const direcao = Math.abs(dx) > Math.abs(dy)
                ? (dx > 0 ? 'd' : 'a')
                : (dy > 0 ? 's' : 'w');

            atualizarAnimacao(nomeSprite, true, direcao);
            requestAnimationFrame(passo);
        }
        passo();
    });
}

// Toca uma animação com controle total: se ela fica em loop (e por quanto
// tempo) e em qual frame ela começa. Cobre os dois casos que você precisa:
//
//   await tocarAnimacao('flower', 'LookUp');
//     -> loop desligado (padrão): passa do frame 0 até o último, uma vez
//        só, e resolve sozinha ao chegar no fim — sem precisar chutar ms
//
//   await tocarAnimacao('flower', 'condense', { loop: true, duracaoMs: 1100 });
//     -> fica repetindo os frames em loop até completar 1100ms
//
//   await tocarAnimacao('flower', 'PUtransition', { frameInicial: 3 });
//     -> começa direto no frame 3 (em vez do 0) e toca até o fim, uma vez
//
// (pra só travar num frame parado, sem tocar nada, use definirFrame — essa
// função aqui é só pra quando você quer ver os frames passando de verdade)
export function tocarAnimacao(nomeSprite, direcao, { loop = false, duracaoMs = 0, frameInicial = 0 } = {}) {
    return new Promise(resolve => {
        const dados = sprites[nomeSprite];
        const totalFrames = dados.direcoes[direcao].frames.length;
        let frameAtual = frameInicial;
        let contador = 0;
        const inicio = performance.now();

        function passo() {
            definirFrame(nomeSprite, direcao, frameAtual);

            contador++;
            if (contador >= dados.velocidade) {
                contador = 0;
                frameAtual++;

                if (frameAtual >= totalFrames) {
                    if (!loop) {
                        resolve();
                        return;
                    }
                    frameAtual = 0; // loop ligado — recomeça o ciclo
                }
            }

            // em modo loop, só para quando a duração pedida acabar
            if (loop && (performance.now() - inicio) >= duracaoMs) {
                resolve();
                return;
            }

            requestAnimationFrame(passo);
        }
        passo();
    });
}

// ---------- maestro ----------

// true enquanto uma cutscene está rodando — o mover() do codex.js
// consulta isso pra pausar o input do player sem precisar saber
// nada sobre o que a cutscene faz por dentro
export let cutsceneAtiva = false;

export async function rodarCutscene(fn, falaStop = 100) {
    if (cutsceneAtiva) return; // evita rodar duas cutscenes ao mesmo tempo
    cutsceneAtiva = true;
    
    await fn(falaStop);

    cutsceneAtiva = false;
    
}

// ---------- cenas ----------
// adicione aqui as cutscenes do jogo, compondo as primitivas acima.
export async function cutsceneIntroducao(falaStop) {
    await esperar(300);
    await moverAte('flower', 540, 250, 6);
    await esperar(300);
    await falas(1, 1);
    await tocarAnimacao('flower', 'condense', { loop: true, duracaoMs: 1100 })
    await falas(1, 2);
    await tocarAnimacao('flower', 'PUtransition')
    await tocarAnimacao('flower', 'LookUp')
    await tocarAnimacao('flower', 'Idle', {loop: true, duracaoMs: 1000})
    await esperar(3000);
    await moverAte('flower', 540, -1000, 10);

}