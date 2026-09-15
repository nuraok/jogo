import { elementos, definirFrame } from "./animation.js";

const { caixaDialogo, textoDialogo } = elementos;

// esconde o balão assim que o módulo carrega — sem isso ele aparece vazio
// na tela antes de qualquer cutscene rodar (o index.html não define display:none)
caixaDialogo.style.display = "none";

// dialogos[cena] = lista de falas daquela cena, na ordem em que aparecem.
// cada fala é um array de linhas (pode ter mais de uma linha na mesma caixa,
// como no Deltarune) + qual sprite estático da flower aparece durante ela.
// `sprite.direcao` é uma das linhas geradas em sprites.flowerDialog.direcoes
// (f1~f4, ver animation.js) e `sprite.frame` é o índice dentro dela — é só
// uma pose fixa, sem animação.
// A chave de `dialogos` é o número da cena, o mesmo número usado
// em rodarCutscene/playAllCutscenes no codex.js (cena 1 = cutsceneIntroducao).
const dialogos = {
    1: [
        { linhas: ["Eai, amiguinho!"], sprite: { direcao: "f1", frame: 0 } },
        { linhas: ["Sou eu, Mr flowery!"], sprite: { direcao: "f2", frame: 0 } },
    ],
};

// true enquanto o balão estiver na tela — o codex.js usa isso pra não deixar
// o Enter de interação com o cenário disparar junto com o Enter de avançar fala
export let dialogoAberto = false;

let resolverFala = null;

function mostrarFala(fala) {
    textoDialogo.textContent = fala.linhas.join("\n");

    const { direcao, frame } = fala.sprite || { direcao: "f1", frame: 0 };
    definirFrame("flowerDialog", direcao, frame);
}

function encerrarDialogo() {
    caixaDialogo.style.display = "none";
    removeEventListener("keydown", avancar, { capture: true });
    dialogoAberto = false;

    const resolve = resolverFala;
    resolverFala = null;
    if (resolve) resolve();
}

// Enter confirma a fala atual e fecha o balão — cada chamada de falas()
// mostra só UMA fala, então aqui não tem "próxima fala" pra ir, é sempre
// fechar e devolver o controle pra cutscene.
function avancar(tecla) {
    if (tecla.key !== "Enter") return;
    tecla.preventDefault();
    tecla.stopImmediatePropagation(); // não deixa o Enter também mexer no cenário (codex.js)

    encerrarDialogo();
}

// Mostra a fala `indice` (numerada a partir de 1, tipo `falas(1, 1)` pra
// primeira fala da cena 1, `falas(1, 2)` pra segunda) e devolve uma Promise
// que só resolve quando o jogador aperta Enter pra confirmar aquela fala.
//
// Diferente de antes, essa função NÃO avança sozinha pras próximas falas —
// é assim que dá pra intercalar animações entre uma fala e outra dentro da
// cutscene:
//
//   await falas(1, 1);
//   await moverAte('flower', ...);   // animação no meio, sem diálogo na tela
//   await falas(1, 2);
export function falas(cena, indice) {
    return new Promise((resolve) => {
        const dialogoDaCena = dialogos[cena];
        const fala = dialogoDaCena && dialogoDaCena[indice - 1];

        if (!fala) {
            caixaDialogo.style.display = "none";
            resolve();
            return;
        }

        resolverFala = resolve;
        dialogoAberto = true;

        caixaDialogo.style.display = "flex";
        mostrarFala(fala);
        // capture: true — garante que esse listener roda ANTES do listener de
        // Enter registrado no codex.js (que fica no window desde o load da
        // página), mesmo com stopImmediatePropagation como reforço
        addEventListener("keydown", avancar, { capture: true });
    });
}