const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Variables de estado del juego
let projectiles = [];
let enemies = [];
let score = 0;
let gameOver = false;
let level = 1;
let isPaused = false;

// Variables de control de bucles (GLOBALES)
let spawnInterval = null;
let animationFrameId = null;

let playerColor = '#d43792';
let playerTargetColor = '#d43792';
let colorTransition = 1;

const pointsPerLevel = 100;

var player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 50,
    color: '#d43792'
};

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
};

canvas.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

canvas.addEventListener('click', () => {
    if (gameOver || isPaused) return;

    const angle = Math.atan2(
        mouse.y - player.y,
        mouse.x - player.x
    );

    const speed = 8;

    projectiles.push({
        x: player.x,
        y: player.y,
        width: 8,
        height: 3,
        angle: angle,
        velocity: {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed
        }
    });
});

function checkLevelUp() {
    if (score >= level * pointsPerLevel) {
        level++;
        isPaused = true;
        clearInterval(spawnInterval);
        showModal();
    }
}

function checkCollision(x1, y1, r1, x2, y2, r2) {
    const dist = Math.hypot(x2 - x1, y2 - y1);
    return dist < r1 + r2;
}

function randomEnemyColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 40 + Math.floor(Math.random() * 30); 
    const lightness = 40 + Math.floor(Math.random() * 25); 
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function parseToRgb(colorStr) {
    const ctxTemp = canvas.getContext('2d');
    ctxTemp.fillStyle = colorStr;
    const computed = ctxTemp.fillStyle;
    
    if (computed.startsWith('#')) {
        const hex = computed.slice(1);
        return [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16)
        ];
    }
    const match = computed.match(/\d+/g);
    return match ? match.slice(0, 3).map(Number) : [212, 55, 146];
}

function lerpColor(a, b, t) {
    const [r1, g1, b1] = parseToRgb(a);
    const [r2, g2, b2] = parseToRgb(b);

    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const blue = Math.round(b1 + (b2 - b1) * t);

    return `rgb(${r}, ${g}, ${blue})`;
}

function spawnEnemy(){
    if (isPaused || gameOver) return;
    const radius = 20;
    let x, y;

    if(Math.random() < 0.5){
        x = Math.random() < 0.5 ? -radius : canvas.width + radius;
        y = Math.random() * canvas.height;
    } else { 
        x = Math.random() * canvas.width;
        y = Math.random() < 0.5 ? -radius : canvas.height + radius;
    }

    const types = ['circle', 'triangle', 'square'];
    const type = types[Math.floor(Math.random() * types.length)];
    const hpMap = {circle: 2, triangle: 3, square: 4};

    enemies.push({
        x, y,
        radius,
        type,
        hp: hpMap[type],
        speed: 1 + level * 0.3,
        color: randomEnemyColor()
    });
}

function drawCircleEnemy(x, y, radius){
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
}

function drawTriangleEnemy(x, y, radius){
    ctx.beginPath();
    ctx.moveTo(x, y - radius);
    ctx.lineTo(x - radius, y + radius);
    ctx.lineTo(x + radius, y + radius);
    ctx.closePath();
    ctx.fill();
}

function drawSquareEnemy(x, y, radius){
    ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
}

const levelInfo = {
    2: { title: '¡Nivel 2!', text: 'Información genérica sobre mí. Nivel 2.' },
    3: { title: '¡Nivel 3!', text: 'Información genérica sobre mí. Nivel 3.' },
    4: { title: '¡Nivel 4!', text: 'Información genérica sobre mí. Nivel 4.' },
    5: { title: '¡Nivel 5!', text: 'Información genérica sobre mí. Nivel 5.' },
};

function showModal() {
    const modal = document.getElementById('levelModal');
    const info = levelInfo[level] || { title: '¡Seguís jugando!', text: 'El juego continúa...' };

    document.getElementById('modalTitle').textContent = info.title;
    document.getElementById('modalInfo').textContent = info.text;
    modal.classList.add('active');
}

document.getElementById('nextLevelBtn').addEventListener('click', () => {
    document.getElementById('levelModal').classList.remove('active');
    isPaused = false;
    clearInterval(spawnInterval);
    spawnInterval = setInterval(spawnEnemy, Math.max(400, 1500 - level * 150));
});

function animate(){
    animationFrameId = requestAnimationFrame(animate);
    if (gameOver || isPaused) return;

    // Transición de color del jugador
    if (colorTransition < 1) {
        colorTransition = Math.min(1, colorTransition + 1 / 48);
        playerColor = lerpColor(playerColor, playerTargetColor, colorTransition);
        player.color = playerColor;
    }

    ctx.fillStyle = '#f1f1f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dibujar Jugador
    ctx.save();
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.restore();

    // Línea de apuntado
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.strokeStyle = playerColor;
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Proyectiles
    projectiles.forEach((proj, index) => {
        proj.x += proj.velocity.x;
        proj.y += proj.velocity.y;

        ctx.save();
        ctx.translate(proj.x, proj.y);
        ctx.rotate(proj.angle);

        ctx.fillStyle = playerColor; 
        ctx.shadowColor = playerColor;
        ctx.shadowBlur = 10;
        ctx.fillRect(-proj.width / 2, -proj.height / 2, proj.width, proj.height);

        ctx.restore();

        if (
            proj.x < 0 || proj.x > canvas.width ||
            proj.y < 0 || proj.y > canvas.height
        ) {
            projectiles.splice(index, 1);
        }
    });

    // Enemigos
    enemies.forEach((enemy, eIndex) => {
        const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
        enemy.x += Math.cos(angle) * enemy.speed;
        enemy.y += Math.sin(angle) * enemy.speed;

        if (checkCollision(player.x, player.y, player.radius, enemy.x, enemy.y, enemy.radius)) {
            gameOver = true;
            clearInterval(spawnInterval); // Detener generación al perder
        }

        ctx.save();
        ctx.fillStyle = enemy.color;

        if(enemy.type === 'circle') drawCircleEnemy(enemy.x, enemy.y, enemy.radius);
        if(enemy.type === 'triangle') drawTriangleEnemy(enemy.x, enemy.y, enemy.radius);
        if(enemy.type === 'square') drawSquareEnemy(enemy.x, enemy.y, enemy.radius);
        ctx.restore();

        // Colisiones proyectil-enemigo
        projectiles.forEach((proj, pIndex) => {
            if(checkCollision(proj.x, proj.y, 5, enemy.x, enemy.y, enemy.radius)){
                enemy.hp -= 1;
                projectiles.splice(pIndex, 1);

                if (enemy.hp <= 0){
                    playerTargetColor = enemy.color;
                    colorTransition = 0;

                    enemies.splice(eIndex, 1);
                    score += 10;
                    checkLevelUp();
                }
            }
        });
    });

    // Score UI
    ctx.fillStyle = playerColor;
    ctx.font = 'bold 25px Quicksand';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + score, 20, 40);

    // Pantalla de Game Over
    if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px Quicksand';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);

        ctx.font = '24px Quicksand';
        ctx.fillText('Score: ' + score, canvas.width / 2, canvas.height / 2 + 50);
    }

    document.documentElement.style.setProperty('--color-primary', playerColor);
    document.documentElement.style.setProperty('--color-primary-opacity', playerColor + '8d');
}

// Inicialización / Reinicio del juego
let startBtn = document.getElementById('startGame');

startBtn.addEventListener('click', () => {
    // 1. Limpiar estados previos
    clearInterval(spawnInterval);
    if (animationFrameId) cancelAnimationFrame(animationFrameId);

    projectiles = [];
    enemies = [];
    score = 0;
    level = 1;
    gameOver = false;
    isPaused = false;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;

    // 2. Iniciar timers y animación
    spawnInterval = setInterval(spawnEnemy, 2000);
    animate();
});