/**
 * משחק חרבות אור - אימון לוחם
 * גרסה: 0.0.1
 * תאריך: 2024
 */

// משתני משחק
const game = {
    energy: 100,
    maxEnergy: 100,
    score: 0,
    level: 1,
    combo: 1,
    maxCombo: 1,
    isPlaying: false,
    isPaused: false,
    targets: [],
    spawnInterval: null,
    gameLoop: null,
    difficulty: 1,
};

// הגדרות
const config = {
    baseSpawnRate: 2000, // מילישניות
    energyDrain: 5, // אנרגיה לתקיפה
    energyRecharge: 0.5, // אנרגיה לשנייה
    comboTimeout: 2000, // זמן לשמירת קומבו
    targetSpeed: 3000, // זמן נפילת מטרה
};

// רפרנסים ל-DOM
const elements = {
    energyBar: document.getElementById('energyBar'),
    energyValue: document.getElementById('energyValue'),
    scoreValue: document.getElementById('scoreValue'),
    levelValue: document.getElementById('levelValue'),
    comboValue: document.getElementById('comboValue'),
    leftSword: document.getElementById('leftSword'),
    rightSword: document.getElementById('rightSword'),
    targetsContainer: document.getElementById('targetsContainer'),
    effectsContainer: document.getElementById('effectsContainer'),
    instructions: document.getElementById('instructions'),
    gameOver: document.getElementById('gameOver'),
    gameArea: document.getElementById('gameArea'),
    btnStart: document.getElementById('btnStart'),
    btnPause: document.getElementById('btnPause'),
};

// התחלת משחק
function startGame() {
    if (game.isPlaying) return;
    
    game.isPlaying = true;
    game.isPaused = false;
    game.energy = 100;
    game.score = 0;
    game.level = 1;
    game.combo = 1;
    game.maxCombo = 1;
    
    // הסתר הוראות וגיים אובר
    elements.instructions.classList.add('hidden');
    elements.gameOver.classList.remove('show');
    
    // עדכן UI
    updateUI();
    
    // התחל spawn של מטרות
    startSpawning();
    
    // התחל game loop
    game.gameLoop = setInterval(gameUpdate, 100);
    
    // עדכן כפתורים
    elements.btnStart.textContent = 'משחק פעיל';
    elements.btnStart.disabled = true;
}

// עדכון משחק
function gameUpdate() {
    if (!game.isPlaying || game.isPaused) return;
    
    // טעינת אנרגיה
    if (game.energy < game.maxEnergy) {
        game.energy = Math.min(game.maxEnergy, game.energy + config.energyRecharge / 10);
        updateUI();
    }
    
    // בדיקת מטרות שיצאו מהמסך
    game.targets = game.targets.filter(target => {
        const element = target.element;
        const rect = element.getBoundingClientRect();
        
        if (rect.top > window.innerHeight) {
            // מטרה יצאה מהמסך
            if (target.type === 'dark') {
                // מטרת חושך שלא הותקפה - רע!
                createEffect('😢', rect.left, rect.top, 'bad');
                game.combo = 1; // אפס קומבו
            }
            element.remove();
            return false;
        }
        return true;
    });
}

// התחלת spawn מטרות
function startSpawning() {
    const spawnRate = config.baseSpawnRate / game.difficulty;
    
    game.spawnInterval = setInterval(() => {
        if (!game.isPlaying || game.isPaused) return;
        spawnTarget();
    }, spawnRate);
}

// יצירת מטרה חדשה
function spawnTarget() {
    const types = ['dark', 'light', 'special'];
    const weights = [0.6, 0.3, 0.1]; // סיכויים
    
    const type = weightedRandom(types, weights);
    const x = Math.random() * (elements.targetsContainer.clientWidth - 60);
    
    const target = document.createElement('div');
    target.className = `target ${type}`;
    target.style.left = `${x}px`;
    
    // סמל לפי סוג
    const icons = {
        dark: '☠️',
        light: '❌',
        special: '⭐'
    };
    target.textContent = icons[type];
    
    // זמן נפילה משתנה לפי רמת קושי
    const fallTime = config.targetSpeed / game.difficulty;
    target.style.animationDuration = `${fallTime}ms`;
    
    // הוסף אירוע לחיצה
    target.addEventListener('click', () => attackTarget(target, type));
    
    elements.targetsContainer.appendChild(target);
    
    // שמור רפרנס
    game.targets.push({ element: target, type: type });
}

// תקיפת מטרה
function attackTarget(targetElement, type) {
    if (!game.isPlaying || game.isPaused) return;
    
    // בדוק אם יש אנרגיה
    if (game.energy < config.energyDrain) {
        createEffect('אין אנרגיה!', targetElement.offsetLeft, targetElement.offsetTop, 'bad');
        return;
    }
    
    // צרוך אנרגיה
    game.energy -= config.energyDrain;
    
    // טיפול לפי סוג מטרה
    let points = 0;
    let effect = '';
    let effectType = '';
    
    if (type === 'dark') {
        // תקיפת אויב - טוב!
        points = 10 * game.combo;
        effect = `+${points} 💥`;
        effectType = 'good';
        game.combo++;
        if (game.combo > game.maxCombo) game.maxCombo = game.combo;
    } else if (type === 'light') {
        // תקיפת אור - רע!
        points = -20;
        effect = `${points} 💔`;
        effectType = 'bad';
        game.combo = 1;
    } else if (type === 'special') {
        // מטרה מיוחדת - בונוס!
        points = 50 * game.combo;
        effect = `+${points} ⭐`;
        effectType = 'combo';
        game.combo += 2;
        if (game.combo > game.maxCombo) game.maxCombo = game.combo;
    }
    
    // עדכן ניקוד
    game.score = Math.max(0, game.score + points);
    
    // צור אפקט
    createEffect(effect, targetElement.offsetLeft, targetElement.offsetTop, effectType);
    
    // הסר מטרה
    targetElement.classList.add('hit');
    setTimeout(() => targetElement.remove(), 500);
    
    // הסר מהמערך
    game.targets = game.targets.filter(t => t.element !== targetElement);
    
    // עדכן רמה
    updateLevel();
    
    // עדכן UI
    updateUI();
}

// עדכון רמה
function updateLevel() {
    const newLevel = Math.floor(game.score / 200) + 1;
    if (newLevel > game.level) {
        game.level = newLevel;
        game.difficulty = game.level * 0.5 + 0.5;
        
        // הודעה
        createEffect(`רמה ${game.level}! 🎉`, 
            elements.gameArea.clientWidth / 2, 
            elements.gameArea.clientHeight / 2, 
            'combo');
        
        // עדכן קצב spawn
        clearInterval(game.spawnInterval);
        startSpawning();
    }
}

// יצירת אפקט ויזואלי
function createEffect(text, x, y, type) {
    const effect = document.createElement('div');
    effect.className = `effect ${type}`;
    effect.textContent = text;
    effect.style.left = `${x}px`;
    effect.style.top = `${y}px`;
    
    elements.effectsContainer.appendChild(effect);
    
    setTimeout(() => effect.remove(), 1000);
}

// עדכון UI
function updateUI() {
    const energyPercent = (game.energy / game.maxEnergy) * 100;
    elements.energyBar.style.width = `${energyPercent}%`;
    elements.energyValue.textContent = `${Math.round(energyPercent)}%`;
    
    elements.scoreValue.textContent = game.score;
    elements.levelValue.textContent = game.level;
    elements.comboValue.textContent = `x${game.combo}`;
    
    // צבע קומבו
    if (game.combo > 5) {
        elements.comboValue.style.transform = 'scale(1.3)';
    } else {
        elements.comboValue.style.transform = 'scale(1)';
    }
}

// השהיה
function pauseGame() {
    if (!game.isPlaying) return;
    
    game.isPaused = !game.isPaused;
    elements.btnPause.textContent = game.isPaused ? 'המשך' : 'השהה';
}

// איפוס משחק
function resetGame() {
    // עצור כל הטיימרים
    clearInterval(game.spawnInterval);
    clearInterval(game.gameLoop);
    
    // נקה מטרות
    elements.targetsContainer.innerHTML = '';
    elements.effectsContainer.innerHTML = '';
    game.targets = [];
    
    // איפוס משתנים
    game.isPlaying = false;
    game.isPaused = false;
    
    // עדכן UI
    elements.btnStart.textContent = 'התחל';
    elements.btnStart.disabled = false;
    elements.gameOver.classList.remove('show');
    elements.instructions.classList.remove('hidden');
}

// הצגת הוראות
function showInstructions() {
    elements.instructions.classList.toggle('hidden');
}

// סיום משחק
function endGame() {
    game.isPlaying = false;
    
    // עצור טיימרים
    clearInterval(game.spawnInterval);
    clearInterval(game.gameLoop);
    
    // הצג מסך Game Over
    document.getElementById('finalScore').textContent = game.score;
    document.getElementById('finalLevel').textContent = game.level;
    document.getElementById('maxCombo').textContent = game.maxCombo;
    
    // הצג הישגים
    const achievementsDiv = document.getElementById('achievements');
    achievementsDiv.innerHTML = '';
    
    const achievements = checkAchievements();
    achievements.forEach(ach => {
        const div = document.createElement('div');
        div.className = 'achievement';
        div.textContent = `🏆 ${ach}`;
        achievementsDiv.appendChild(div);
    });
    
    elements.gameOver.classList.add('show');
}

// בדיקת הישגים
function checkAchievements() {
    const achievements = [];
    
    if (game.score >= 500) achievements.push('לוחם מתחיל - 500+ נקודות');
    if (game.score >= 1000) achievements.push('לוחם מנוסה - 1000+ נקודות');
    if (game.score >= 2000) achievements.push('מאסטר חרב - 2000+ נקודות');
    if (game.maxCombo >= 10) achievements.push('קומבו מאסטר - x10');
    if (game.maxCombo >= 20) achievements.push('קומבו אגדי - x20');
    if (game.level >= 5) achievements.push('רמה 5 - לוחם אור');
    if (game.level >= 10) achievements.push('רמה 10 - אלוף האור');
    
    return achievements.length > 0 ? achievements : ['המשך להתאמן! 💪'];
}

// פונקצית עזר - random משוקלל
function weightedRandom(items, weights) {
    const total = weights.reduce((a, b) => a + b, 0);
    const random = Math.random() * total;
    
    let sum = 0;
    for (let i = 0; i < items.length; i++) {
        sum += weights[i];
        if (random < sum) return items[i];
    }
    return items[0];
}

// טיפול במקלדת
document.addEventListener('keydown', (e) => {
    if (!game.isPlaying || game.isPaused) return;
    
    const key = e.key.toLowerCase();
    
    if (key === 'a') {
        // חרב שמאל
        elements.leftSword.classList.add('attacking');
        setTimeout(() => elements.leftSword.classList.remove('attacking'), 300);
        attackNearestTarget('left');
    } else if (key === 'd') {
        // חרב ימין
        elements.rightSword.classList.add('attacking');
        setTimeout(() => elements.rightSword.classList.remove('attacking'), 300);
        attackNearestTarget('right');
    } else if (key === ' ') {
        // מתקפה כפולה
        e.preventDefault();
        elements.leftSword.classList.add('attacking');
        elements.rightSword.classList.add('attacking');
        setTimeout(() => {
            elements.leftSword.classList.remove('attacking');
            elements.rightSword.classList.remove('attacking');
        }, 300);
        attackNearestTarget('both');
    } else if (key === 'q') {
        // מגן אור - מוסיף אנרגיה
        if (game.energy < game.maxEnergy) {
            game.energy = Math.min(game.maxEnergy, game.energy + 20);
            createEffect('+20 אנרגיה 🛡️', 
                elements.gameArea.clientWidth / 2, 
                100, 
                'good');
            updateUI();
        }
    }
});

// תקיפת המטרה הקרובה ביותר
function attackNearestTarget(side) {
    if (game.targets.length === 0) return;
    
    // מצא מטרה קרובה
    let closestTarget = null;
    let closestDistance = Infinity;
    
    const centerX = elements.gameArea.clientWidth / 2;
    
    game.targets.forEach(target => {
        const rect = target.element.getBoundingClientRect();
        const targetX = rect.left + rect.width / 2;
        const targetY = rect.top;
        
        // בדוק אם בצד הנכון
        if (side === 'left' && targetX > centerX) return;
        if (side === 'right' && targetX < centerX) return;
        
        // מרחק מהתחתית
        const distance = elements.gameArea.clientHeight - targetY;
        
        if (distance < closestDistance && distance < 200) {
            closestDistance = distance;
            closestTarget = target;
        }
    });
    
    if (closestTarget) {
        attackTarget(closestTarget.element, closestTarget.type);
    }
}

// בדיקת סוף משחק - אנרגיה אפסית
setInterval(() => {
    if (game.isPlaying && game.energy <= 0) {
        endGame();
    }
}, 1000);

// הסתרת הוראות בהתחלה
elements.instructions.classList.remove('hidden');

