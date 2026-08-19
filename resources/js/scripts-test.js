/* ── PRELOADER Y APERTURA DE MODAL ── */
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('preloader').classList.add('gone');
        setTimeout(triggerCustomizeReveal, 200);
    }, 2000);
});

function triggerCustomizeReveal() {
    const welcomeModal = document.getElementById('welcome');
    if (welcomeModal) {
        welcomeModal.classList.remove('closing');
        welcomeModal.classList.add('active');
    }
}

/* ── MANIPULACIÓN Y CIERRE DE MODALES ── */
function initModals() {
    document.querySelectorAll('[target-modal]').forEach(trigger => {
        trigger.addEventListener('click', e => {
            e.preventDefault();
            const targetId = trigger.getAttribute('target-modal');
            const modal = document.getElementById(targetId);
            if (modal) {
                modal.classList.remove('closing');
                modal.classList.add('active');
            }
        });
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', e => {
            if (e.target.classList.contains('close')) {
                if (modal.classList.contains('closing')) return;

                modal.classList.add('closing');

                setTimeout(() => {
                    modal.classList.remove('active', 'closing');
                }, 800);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', initModals);

/* ── CUSTOM CURSOR ── */
const dot  = document.getElementById('curDot');
const ring = document.getElementById('curRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { 
    mx = e.clientX; 
    my = e.clientY; 
});

(function animCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animCursor);
})();

document.addEventListener('mouseover', e => {
    if (e.target.closest('a, button, input, label, .product-card, .cat-card, .gal-item, .close')) {
        dot.classList.add('hovered');
        ring.classList.add('hovered');
    }
});

document.addEventListener('mouseout', e => {
    if (e.target.closest('a, button, input, label, .product-card, .cat-card, .gal-item, .close')) {
        dot.classList.remove('hovered');
        ring.classList.remove('hovered');
    }
});


/* ── SELECTOR DE MODO ── */
let webSelector = document.getElementById('web-selector');
let gameSelector = document.getElementById('game-mode-selected');
let gameBtn = document.getElementById('btn-game');
let webBtn = document.getElementById('btn-web');
let strBtn = document.getElementById('startGame');

gameBtn.addEventListener('click', () => {
    gameSelector.classList.add('active');
    webSelector.style.display = 'none';
});

webBtn.addEventListener('click', () => {
    gameSelector.classList.remove('active');
    webSelector.style.display = 'flex';
});

/* ── INICIO DEL MODO JUEGO ── */
if (strBtn) {
    strBtn.addEventListener('click', () => {
        const welcomeModal = document.getElementById('welcome');
        const gameModeSection = document.getElementById('gameMode');

        // 1. Ocultar el modal de bienvenida
        welcomeModal.classList.add('closing');
        setTimeout(() => {
            welcomeModal.classList.remove('active', 'closing');
            welcomeModal.style.display = 'none';
        }, 800);

        // 2. Mostrar la sección del juego
        if (gameModeSection) {
            gameModeSection.style.display = 'block'; // O 'flex' según tus estilos
        }

        // 3. Inicializar el loop o canvas del juego (si existe en game-script.js)
        if (typeof initGame === 'function') {
            initGame();
        }
    });
}


// Función para generar un color HSL aleatorio armónico
function generarColorAleatorio() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 40 + Math.floor(Math.random() * 30); 
    const lightness = 40 + Math.floor(Math.random() * 25); 
    return {
        solid: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        opacity: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.4)`
    };
}

// Función principal que aplica el cambio de color al CSS
function cambiarColor() {
    const nuevoColor = generarColorAleatorio();
    
    // Aplicar a las CSS Variables del documento
    document.documentElement.style.setProperty('--color-primary', nuevoColor.solid);
    document.documentElement.style.setProperty('--color-primary-opacity', nuevoColor.opacity);
}

setInterval(cambiarColor, 2000);

/* ── APERTURA DEL MODO WEB CLÁSICA ── */
webBtn.addEventListener('click', () => {
    // Cerrar el modal de bienvenida
    const welcomeModal = document.getElementById('welcome');
    welcomeModal.classList.add('closing');
    setTimeout(() => {
        welcomeModal.classList.remove('active', 'closing');
        welcomeModal.style.display = 'none';
    }, 800);

    // Mostrar el hero editorial
    const webMode = document.getElementById('web-mode');
    if (webMode) {
        webMode.style.display = 'flex';
    }
});