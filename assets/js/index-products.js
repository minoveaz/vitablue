/**
 * Index Products - Featured products and Bento2 grid
 * Refactored for Static HTML First approach (SEO & Performance)
 */

let productsData = null;

// Load products data
function loadIndexProducts() {
    // Inicializar solo funcionalidades estáticas
    setupHeroRotator();
    const bentoGrid = document.getElementById('bento2-grid');
    if (bentoGrid && bentoGrid.children.length > 0) {
        console.log('🎯 Static mode: Products grid ready');
        setupIndexBento2Filters();
    }
    // Eliminada la carga dinámica de datos y componentes dependientes de JSON
}

// ===== FEATURED PRODUCTS (Legacy/Fallback) =====
// Esta función se mantiene por compatibilidad si alguien borra el HTML estático,
// pero normalmente no se ejecutará si el HTML ya está ahí.
function renderIndexFeaturedProducts() {
    // ... (Lógica simplificada o eliminada si ya no se usa)
}

// ===== BENTO 2 FILTERS =====
function setupIndexBento2Filters() {
    const filterButtons = document.querySelectorAll('.bento2-filter-button');
    const cards = document.querySelectorAll('.bento2-grid .bento2-card');
    
    if (!filterButtons.length || !cards.length) return;

    console.log(`🔧 Initializing filters for ${cards.length} products`);

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Filter cards with animation
            cards.forEach((card, index) => {
                const cardCategory = card.dataset.category;
                
                // Reset animation
                card.style.animation = 'none';
                card.offsetHeight; /* trigger reflow */
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                    // Add delay based on index for staggered effect
                    // Solo animar los visibles
                    card.style.animation = `bento2FadeIn 0.6s ease forwards`;
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    loadIndexProducts();
});

// ===== HERO ENHANCEMENTS (Data Dependent) =====
// Eliminada la función computeHeroMetrics: métricas deben estar en el HTML estático

// Eliminada la función updateHeroMetrics: métricas deben estar en el HTML estático

// Eliminada la función renderHeroFeaturedMiniCards: mini-cards deben estar en el HTML estático

function setupHeroRotator() {
    const el = document.querySelector('.hero-rotator');
    if (!el) return;
    const items = ['Estudiantes', 'Profesionales', 'Familias', 'Mayores', 'Mascotas'];
    let idx = 1;
    setInterval(() => {
        el.textContent = items[idx];
        idx = (idx + 1) % items.length;
    }, 4000);
}

// Eliminada la función setupHeroSearch: búsqueda debe estar en el HTML estático
