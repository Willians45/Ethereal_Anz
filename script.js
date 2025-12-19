// Product data with prices
const products = [
    { id: 1, price: 19 },
    { id: 2, price: 17 },
    { id: 3, price: 17 },
    { id: 4, price: 17 },
    { id: 5, price: 17 },
    { id: 6, price: 17 },
    { id: 7, price: 17 },
    { id: 8, price: 17 },
    { id: 9, price: 17 },
    { id: 10, price: 17.5 },
    { id: 11, price: 18 },
    { id: 12, price: 18 },
    { id: 13, price: 19.5 },
    { id: 14, price: 18 },
    { id: 15, price: 18 },
    { id: 16, price: 18 },
    { id: 17, price: 18 },
    { id: 18, price: 18 },
    { id: 19, price: 19.5 },
    { id: 20, price: 18 },
    { id: 21, price: 20 },
    { id: 22, price: 19.5 },
    { id: 23, price: 19 },
    { id: 24, price: 19 },
    { id: 25, price: 22 },
    { id: 26, price: 18.5 },
    { id: 27, price: 22 },
    { id: 28, price: 21 },
    { id: 29, price: 19.5 },
    { id: 30, price: 22 },
    { id: 31, price: 20 },
    { id: 32, price: 18 },
    { id: 33, price: 18 },
    { id: 34, price: 18 }
];
// WhatsApp configuration
const WHATSAPP_NUMBER = '584127568365';
// DOM Elements
const productGrid = document.getElementById('productGrid');
const modal = document.getElementById('productModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalImage = document.getElementById('modalImage');
const modalNumber = document.getElementById('modalNumber');
const modalPrice = document.getElementById('modalPrice');
const whatsappOrderBtn = document.getElementById('whatsappOrderBtn');
// Generate product cards
function renderProducts() {
    products.forEach(product => {
        const card = createProductCard(product);
        productGrid.appendChild(card);
    });
}
// Create individual product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <div class="product-image-wrapper">
            <img src="images/products/${product.id}.jpg" 
                 alt="Cartera #${product.id}" 
                 class="product-image"
                 loading="lazy">
        </div>
        <div class="product-info">
            <p class="product-number">Cartera #${product.id}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
        </div>
    `;

    card.addEventListener('click', () => openModal(product));

    return card;
}
// Open product modal
function openModal(product) {
    modalImage.src = `images/products/${product.id}.jpg`;
    modalImage.alt = `Cartera #${product.id}`;
    modalNumber.textContent = product.id;
    modalPrice.textContent = `$${product.price.toFixed(2)}`;

    // Generate WhatsApp link with product details
    const message = `Hola! ✨ Me interesa la Cartera #${product.id} ($${product.price.toFixed(2)}). ¿Está disponible?`;
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    whatsappOrderBtn.href = whatsappLink;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}
// Close modal
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}
// Event listeners for modal
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', closeModal);
// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});
// Prevent modal content click from closing modal
document.querySelector('.modal-content').addEventListener('click', (e) => {
    e.stopPropagation();
});
// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();

    // Add scroll-triggered animation observer for product cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animate class to trigger the animation
                entry.target.classList.add('animate');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all product cards after a small delay to ensure they're rendered
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach(card => {
            observer.observe(card);
        });
    }, 100);
});
// Add sparkle effect on mouse move (desktop only)
if (window.innerWidth > 768) {
    let sparkleTimeout;

    document.addEventListener('mousemove', (e) => {
        clearTimeout(sparkleTimeout);

        sparkleTimeout = setTimeout(() => {
            createSparkle(e.clientX, e.clientY);
        }, 100);
    });

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.fontSize = '1rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        sparkle.style.animation = 'sparkleDisappear 1s ease forwards';

        document.body.appendChild(sparkle);

        setTimeout(() => {
            sparkle.remove();
        }, 1000);
    }

    // Add sparkle disappear animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleDisappear {
            0% {
                opacity: 1;
                transform: scale(0) translateY(0);
            }
            50% {
                opacity: 1;
                transform: scale(1) translateY(-10px);
            }
            100% {
                opacity: 0;
                transform: scale(0.5) translateY(-30px);
            }
        }
    `;
    document.head.appendChild(style);
}
