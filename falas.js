import { elementos } from "./animation.js";
import { sprites } from "./animation.js";

const { caixaDialogo, textoDialogo, imgDialogo } = elementos
const { flowerDialog } = sprites

const dialogos = [
    [
        [

        ],
        [

        ],
        [

        ],
    ],
  
]

function trocarConteudo(cena) {
    const dialogoAtual = dialogos[cena]
    dialogoAtual[i]
}

export function falas(cenas) {
    switch (cenas) {
        case 1:
            caixaDialogo.style.display = "flex"
            
            textoDialogo.textContent = ''
            
            break;
        case 2:
            caixaDialogo.style.display = "flex"
            break
        default:
            caixaDialogo.style.display = "none"

    }
}

