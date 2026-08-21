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

if (strBtn) {
    strBtn.addEventListener('click', () => {
        const welcomeModal = document.getElementById('welcome');
        const gameModeSection = document.getElementById('gameMode');

        welcomeModal.classList.add('closing');
        setTimeout(() => {
            welcomeModal.classList.remove('active', 'closing');
            welcomeModal.style.display = 'none';
        }, 800);

        if (gameModeSection) {
            gameModeSection.style.display = 'block'; 
        }

        if (typeof initGame === 'function') {
            initGame();
        }
    });
}


function generarColorAleatorio() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 40 + Math.floor(Math.random() * 30); 
    const lightness = 40 + Math.floor(Math.random() * 25); 
    return {
        solid: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
        opacity: `hsla(${hue}, ${saturation}%, ${lightness}%, 0.4)`
    };
}

function cambiarColor() {
    const nuevoColor = generarColorAleatorio();
    
    document.documentElement.style.setProperty('--color-primary', nuevoColor.solid);
    document.documentElement.style.setProperty('--color-primary-opacity', nuevoColor.opacity);
}

setInterval(cambiarColor, 2000);

webBtn.addEventListener('click', () => {
    const welcomeModal = document.getElementById('welcome');
    welcomeModal.classList.add('closing');
    setTimeout(() => {
        welcomeModal.classList.remove('active', 'closing');
        welcomeModal.style.display = 'none';
    }, 800);

    const webMode = document.getElementById('web-mode');
    if (webMode) {
        webMode.style.display = 'block';
    }
});


const accordions = document.querySelectorAll('.editorial-accordion');

accordions.forEach(accordion => {
    const rowItems = accordion.querySelectorAll('.accordion-item');

    rowItems.forEach(item => {
        const activateItem = () => {
            rowItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        };

        item.addEventListener('mouseenter', activateItem);
        item.addEventListener('click', activateItem);
    });
});