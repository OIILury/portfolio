// Système de particules flottantes
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.container = null;
        this.isActive = false;
        this.init();
    }

    init() {
        // Créer le conteneur de particules
        this.container = document.createElement('div');
        this.container.className = 'particles-container';
        this.container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
            overflow: hidden;
        `;
        
        document.body.appendChild(this.container);
        
        // Créer les particules
        this.createParticles();
        
        // Démarrer l'animation
        this.start();
    }

    createParticles() {
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Styles de base
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: rgba(139, 69, 19, 0.6);
                border-radius: 50%;
                pointer-events: none;
                box-shadow: 0 0 6px rgba(139, 69, 19, 0.4);
            `;
            
            // Position initiale aléatoire
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            
            // Animation personnalisée
            const duration = 6 + Math.random() * 4; // 6-10 secondes
            const delay = Math.random() * 6;
            
            particle.style.animation = `float ${duration}s infinite linear`;
            particle.style.animationDelay = delay + 's';
            
            // Ajouter des propriétés pour l'animation
            particle.dataset.speed = Math.random() * 0.5 + 0.5;
            particle.dataset.direction = Math.random() * 360;
            
            this.particles.push(particle);
            this.container.appendChild(particle);
        }
    }

    start() {
        this.isActive = true;
        this.animate();
    }

    stop() {
        this.isActive = false;
    }

    animate() {
        if (!this.isActive) return;
        
        this.particles.forEach(particle => {
            const speed = parseFloat(particle.dataset.speed);
            const direction = parseFloat(particle.dataset.direction);
            
            // Calculer la nouvelle position
            const currentTop = parseFloat(particle.style.top) || 0;
            const newTop = currentTop - speed;
            
            // Si la particule sort de l'écran, la repositionner en bas
            if (newTop < -10) {
                particle.style.top = '110%';
                particle.style.left = Math.random() * 100 + '%';
            } else {
                particle.style.top = newTop + '%';
            }
        });
        
        requestAnimationFrame(() => this.animate());
    }

    // Méthode pour ajuster l'opacité des particules selon le thème
    updateTheme(isDark) {
        this.particles.forEach(particle => {
            if (isDark) {
                // Thème sombre : particules beiges plus visibles
                particle.style.background = 'rgba(222, 184, 135, 0.4)';
                particle.style.boxShadow = '0 0 4px rgba(222, 184, 135, 0.3)';
            } else {
                // Thème clair : particules plus sombres et plus visibles
                particle.style.background = 'rgba(139, 69, 19, 0.6)';
                particle.style.boxShadow = '0 0 6px rgba(139, 69, 19, 0.4)';
            }
        });
    }
}

// CSS pour les animations de particules
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes float {
        0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0;
        }
        15% {
            opacity: 1;
        }
        85% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
    
    .particles-container {
        will-change: transform;
    }
    
    .particle {
        will-change: transform, opacity;
    }
`;
document.head.appendChild(particleStyles);

// Initialisation du système de particules
let particleSystem = null;

// Fonction pour initialiser les particules
function initParticles() {
    if (!particleSystem) {
        particleSystem = new ParticleSystem();
    }
}

// Fonction pour arrêter les particules
function stopParticles() {
    if (particleSystem) {
        particleSystem.stop();
    }
}

// Fonction pour redémarrer les particules
function restartParticles() {
    if (particleSystem) {
        particleSystem.start();
    }
}

// Fonction pour mettre à jour le thème des particules
function updateParticleTheme(isDark) {
    if (particleSystem) {
        particleSystem.updateTheme(isDark);
    }
}

// Initialiser les particules quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    // Attendre un peu avant de démarrer les particules
    setTimeout(() => {
        initParticles();
        
        // Détecter le thème actuel et appliquer les bonnes couleurs
        const isDarkMode = document.body.classList.contains('dark-mode');
        updateParticleTheme(isDarkMode);
    }, 500);
});

// Gestion du thème pour les particules
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('change', (e) => {
            const isDark = e.target.checked;
            updateParticleTheme(isDark);
        });
    }
});

// Optimisation des performances
let isPageVisible = true;

document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    
    if (isPageVisible) {
        restartParticles();
    } else {
        stopParticles();
    }
});

// Nettoyer les particules quand on quitte la page
window.addEventListener('beforeunload', () => {
    if (particleSystem) {
        particleSystem.stop();
    }
});

// Export pour utilisation dans d'autres fichiers
window.ParticleSystem = ParticleSystem;
window.initParticles = initParticles;
window.stopParticles = stopParticles;
window.restartParticles = restartParticles;
window.updateParticleTheme = updateParticleTheme;
