export const teclas = {
    a: false,
    s: false,
    d: false,
    w: false
};

addEventListener('keydown', (tecla) => {
    const key = tecla.key.toLowerCase();
    if (key in teclas) teclas[key] = true;
});

addEventListener('keyup', (tecla) => {
    const key = tecla.key.toLowerCase();
    if (key in teclas) teclas[key] = false;
});

// evita tecla "presa" quando o usuário troca de aba/janela no meio do movimento
window.addEventListener('blur', () => {
    teclas.w = false;
    teclas.a = false;
    teclas.s = false;
    teclas.d = false;
});
