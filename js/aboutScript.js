// Animation des barres de progression
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target;
                const width = progress.getAttribute('data-width');
                progress.style.width = width + '%';
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Animation des statistiques
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const finalValue = stat.textContent;
                const isPlus = finalValue.includes('+');
                const numericValue = parseInt(finalValue.replace('+', ''));
                
                let currentValue = 0;
                const increment = numericValue / 50;
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        currentValue = numericValue;
                        clearInterval(timer);
                    }
                    stat.textContent = Math.floor(currentValue) + (isPlus ? '+' : '');
                }, 30);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        observer.observe(stat);
    });
}

// Animation des cartes au scroll
function animateCards() {
    const cards = document.querySelectorAll('.skill-category, .goal-card, .timeline-content');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Animation des icônes
function animateIcons() {
    const icons = document.querySelectorAll('.goal-icon, .cv-icon');
    
    icons.forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2) rotate(5deg)';
            icon.style.transition = 'transform 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Effet de typing pour le titre
function typeWriterEffect() {
    const title = document.querySelector('.profile-card h1');
    if (!title) return;
    
    const text = title.textContent;
    title.textContent = '';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        title.textContent += text.charAt(i);
        i++;
        if (i >= text.length) {
            clearInterval(typeInterval);
        }
    }, 100);
}

// Animation des sections au scroll
function animateSections() {
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.3 });

    sections.forEach(section => {
        observer.observe(section);
    });
}

// Effet de hover pour les liens
function enhanceLinks() {
    const links = document.querySelectorAll('a');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-2px)';
        });
        
        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
        });
    });
}

// Animation du CV download
function animateCVDownload() {
    const cvButton = document.querySelector('.cv-button');
    if (!cvButton) return;
    
    cvButton.addEventListener('mouseenter', () => {
        cvButton.style.animation = 'pulse 1s infinite';
    });
    
    cvButton.addEventListener('mouseleave', () => {
        cvButton.style.animation = 'none';
    });
}

// CSS pour les animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.05);
        }
    }
    
    section.animate-in {
        animation: slideInUp 0.8s ease-out;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(50px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// Initialisation de toutes les animations
document.addEventListener('DOMContentLoaded', () => {
    // Attendre un peu avant de démarrer les animations
    setTimeout(() => {
        animateProgressBars();
        animateStats();
        animateCards();
        animateIcons();
        animateSections();
        enhanceLinks();
        animateCVDownload();
        
        // Démarrer l'effet de typing après un délai
        setTimeout(typeWriterEffect, 500);
    }, 100);
});

// Gestion du scroll pour les animations
let ticking = false;

function updateOnScroll() {
    if (!ticking) {
        requestAnimationFrame(() => {
            // Mettre à jour les animations basées sur le scroll
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', updateOnScroll);

// Effet de smooth scroll pour les ancres
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Amélioration de l'accessibilité
function enhanceAccessibility() {
    // Ajouter des attributs ARIA pour les barres de progression
    const progressBars = document.querySelectorAll('.progress');
    progressBars.forEach(bar => {
        const percentage = bar.getAttribute('data-width');
        bar.setAttribute('aria-valuenow', percentage);
        bar.setAttribute('aria-valuemin', '0');
        bar.setAttribute('aria-valuemax', '100');
        bar.setAttribute('role', 'progressbar');
    });
    
    // Ajouter des focus styles
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--primary-color)';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = 'none';
        });
    });
}

// Initialiser l'accessibilité
document.addEventListener('DOMContentLoaded', enhanceAccessibility);
