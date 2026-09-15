import { rooms } from './room.js';
import { elementos } from './animation.js';

const { room, flower } = elementos;

export const getSalaAtual = () => rooms.find(element => element.status === true);

// aplica o background da sala ativa e reposiciona a flower conforme
// o flowerPosition definido em room.js
export function cenario() {
    rooms.forEach(element => {
        if (element.status === true) {
            room.style.backgroundImage = element.back;
            flower.style.left = `${element.flowerPosition.x}px`;
            flower.style.top = `${element.flowerPosition.y}px`;
        }
    });
}