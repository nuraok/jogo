import { elementos, sprites, atualizarAnimacao } from './animation.js';
// import { falas } from './falas.js';

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

// toca uma animação por uma duração fixa, sem mover o personagem
export function tocarAnimacao(nomeSprite, direcao, duracaoMs) {
    return new Promise(resolve => {
        const inicio = performance.now();
        function passo() {
            const decorrido = performance.now() - inicio;
            atualizarAnimacao(nomeSprite, true, direcao);
            if (decorrido < duracaoMs) {
                requestAnimationFrame(passo);
            } else {
                atualizarAnimacao(nomeSprite, false, direcao);
                resolve();
            }
        }
        passo();
    });
}

// ---------- maestro ----------

// true enquanto uma cutscene está rodando — o mover() do codex.js
// consulta isso pra pausar o input do player sem precisar saber
// nada sobre o que a cutscene faz por dentro
export let cutsceneAtiva = false;

export async function rodarCutscene(fn) {
    if (cutsceneAtiva) return; // evita rodar duas cutscenes ao mesmo tempo
    cutsceneAtiva = true;
    
    await fn();

    cutsceneAtiva = false;
    
}

// ---------- cenas ----------
// adicione aqui as cutscenes do jogo, compondo as primitivas acima.
// exemplo:
//
export async function cutsceneIntroducao() {
    await esperar(300);
    await moverAte('flower', 540, 270, 8);
    await esperar(800);
    await moverAte('flower', 540, 200, 1);
    await esperar(1000);

}
