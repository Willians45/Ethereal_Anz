// Product data with prices and image counts
const walletsData = [
    { id: 1, price: 25, imageCount: 1 },
    { id: 2, price: 22, imageCount: 1 },
    { id: 3, price: 28, imageCount: 2 },
    { id: 4, price: 22, imageCount: 2 },
    { id: 5, price: 23, imageCount: 2 },
    { id: 6, price: 20, imageCount: 1 },
    { id: 7, price: 40, imageCount: 1 },
    { id: 8, price: 32, imageCount: 1 },
    { id: 9, price: 37, imageCount: 1 },
    { id: 10, price: 24, imageCount: 2 },
    { id: 11, price: 24, imageCount: 2 },
    { id: 12, price: 21, imageCount: 2 },
    { id: 13, price: 21, imageCount: 2 },
    { id: 14, price: 22.50, imageCount: 2 },
    { id: 15, price: 29.72, imageCount: 2 },
    { id: 16, price: 15, imageCount: 2 },
    { id: 17, price: 17.34, imageCount: 2 },
    { id: 18, price: 24, imageCount: 4 },
    { id: 19, price: 25.51, imageCount: 3 }
];

// Generate keychains data (21 items) - Placeholder prices, easy to edit later
const keychainsData = [
    { id: 1, price: 16 },
    { id: 2, price: 16 },
    { id: 3, price: 16 },
    { id: 4, price: 10 },
    { id: 5, price: 10 },
    { id: 6, price: 12 },
    { id: 7, price: 12 },
    { id: 8, price: 6 },
    { id: 9, price: 6 },
    { id: 10, price: 8 },
    { id: 11, price: 8 },
    { id: 12, price: 16 },
    { id: 13, price: 8 },
    { id: 14, price: 8 },
    { id: 15, price: 10 },
    { id: 16, price: 10 },
    { id: 17, price: 8 },
    { id: 18, price: 8 },
    { id: 19, price: 12 },
    { id: 20, price: 12 },
    { id: 21, price: 12 }
];

// State
let currentCategory = 'wallets'; // 'wallets' or 'keychains'
let currentSort = 'default';     // 'default', 'asc', 'desc'

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
const modalTitle = document.getElementById('modalTitle');
const whatsappOrderBtn = document.getElementById('whatsappOrderBtn');

const categoryToggle = document.getElementById('categoryToggle');
// Custom Dropdown Logic
const customDropdown = document.getElementById('customDropdown');
const dropdownSelected = document.getElementById('dropdownSelected');
const dropdownOptions = document.getElementById('dropdownOptions');
const options = document.querySelectorAll('.dropdown-option');

// Toggle dropdown
dropdownSelected.addEventListener('click', (e) => {
    e.stopPropagation();
    customDropdown.classList.toggle('open');
});

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (!customDropdown.contains(e.target)) {
        customDropdown.classList.remove('open');
    }
});

// Handle option selection
options.forEach(option => {
    option.addEventListener('click', (e) => {
        const value = e.target.getAttribute('data-value');
        const text = e.target.textContent;

        // Update selected text and value
        dropdownSelected.textContent = text;
        currentSort = value;

        // Visual feedback
        options.forEach(opt => opt.classList.remove('selected'));
        e.target.classList.add('selected');

        // Close dropdown and re-render
        customDropdown.classList.remove('open');
        renderProducts();
    });
});

// Remove old select event listener if it exists (not needed since element was replaced)
// priceFilter.addEventListener('change', ...); // Removed

// Toggle Category
categoryToggle.addEventListener('change', (e) => {
    currentCategory = e.target.checked ? 'keychains' : 'wallets';
    renderProducts();
});

// Helper to get image path based on category, ID, and image number
function getImagePath(category, id, imageNum = 1) {
    if (category === 'wallets') {
        return `images/carteras/${id}/${imageNum}.jpg`;
    } else {
        return `images/Llaveros/${id}.jpg`;
    }
}

// Get filtered and sorted products
function getProcessedProducts() {
    let data = currentCategory === 'wallets' ? [...walletsData] : [...keychainsData];

    if (currentSort === 'asc') {
        data.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'desc') {
        data.sort((a, b) => b.price - a.price);
    }
    // 'default' keeps original order (by ID usually)

    return data;
}

// Generate product cards
function renderProducts() {
    productGrid.innerHTML = ''; // Clear existing
    const products = getProcessedProducts();

    products.forEach(product => {
        const card = createProductCard(product);
        productGrid.appendChild(card);
    });

    // Re-trigger animations
    reattachObserver();
}

// Create individual product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const imagePath = getImagePath(currentCategory, product.id);
    const title = currentCategory === 'wallets' ? 'Cartera' : 'Llavero';

    card.innerHTML = `
        <div class="product-image-wrapper">
            <img src="${imagePath}" 
                 alt="${title} #${product.id}" 
                 class="product-image"
                 loading="lazy">
        </div>
        <div class="product-info">
            <p class="product-number">${title} #${product.id}</p>
            <p class="product-price">$${product.price.toFixed(2)}</p>
        </div>
    `;

    card.addEventListener('click', () => openModal(product));

    return card;
}

// Current modal state
let currentProduct = null;
let currentImageIndex = 0;

// Open product modal with carousel
function openModal(product) {
    currentProduct = product;
    currentImageIndex = 0;

    const title = currentCategory === 'wallets' ? 'Cartera' : 'Llavero';

    // Update title
    modalTitle.innerHTML = `${title} #<span id="modalNumber">${product.id}</span>`;
    modalPrice.textContent = `$${product.price.toFixed(2)}`;

    // Update carousel
    updateCarousel();

    // Generate WhatsApp link with product details
    const message = `Hola! ✨ Me interesa ${title === 'Cartera' ? 'la' : 'el'} ${title} #${product.id} ($${product.price.toFixed(2)}). ¿Está disponible?`;
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    whatsappOrderBtn.href = whatsappLink;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Update carousel display
function updateCarousel() {
    if (!currentProduct) return;

    const imageCount = currentProduct.imageCount || 1;
    const imagePath = getImagePath(currentCategory, currentProduct.id, currentImageIndex + 1);
    const title = currentCategory === 'wallets' ? 'Cartera' : 'Llavero';

    modalImage.src = imagePath;
    modalImage.alt = `${title} #${currentProduct.id} - Imagen ${currentImageIndex + 1}`;

    // Update navigation visibility
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    const indicators = document.querySelector('.carousel-indicators');

    if (imageCount > 1) {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
        indicators.style.display = 'flex';

        // Update indicators
        indicators.innerHTML = '';
        for (let i = 0; i < imageCount; i++) {
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${i === currentImageIndex ? 'active' : ''}`;
            dot.addEventListener('click', () => goToImage(i));
            indicators.appendChild(dot);
        }
    } else {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
        indicators.style.display = 'none';
    }
}

// Navigate to specific image
function goToImage(index) {
    if (!currentProduct) return;
    const imageCount = currentProduct.imageCount || 1;
    currentImageIndex = (index + imageCount) % imageCount;
    updateCarousel();
}

// Navigate to previous image
function prevImage() {
    if (!currentProduct) return;
    const imageCount = currentProduct.imageCount || 1;
    currentImageIndex = (currentImageIndex - 1 + imageCount) % imageCount;
    updateCarousel();
}

// Navigate to next image
function nextImage() {
    if (!currentProduct) return;
    const imageCount = currentProduct.imageCount || 1;
    currentImageIndex = (currentImageIndex + 1) % imageCount;
    updateCarousel();
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

// Swipe/Drag functionality for carousel
let isDragging = false;
let startX = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;

// Touch events
modalImage.addEventListener('touchstart', touchStart);
modalImage.addEventListener('touchmove', touchMove);
modalImage.addEventListener('touchend', touchEnd);

// Mouse events
modalImage.addEventListener('mousedown', touchStart);
modalImage.addEventListener('mousemove', touchMove);
modalImage.addEventListener('mouseup', touchEnd);
modalImage.addEventListener('mouseleave', touchEnd);

function touchStart(event) {
    if (!currentProduct || (currentProduct.imageCount || 1) <= 1) return;

    isDragging = true;
    startX = getPositionX(event);
    animationID = requestAnimationFrame(animation);
    modalImage.classList.add('dragging');
}

function touchMove(event) {
    if (!isDragging) return;

    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startX;
}

function touchEnd() {
    if (!isDragging) return;

    isDragging = false;
    cancelAnimationFrame(animationID);
    modalImage.classList.remove('dragging');

    const movedBy = currentTranslate - prevTranslate;

    // If moved enough, change image
    if (movedBy < -50) {
        nextImage();
    } else if (movedBy > 50) {
        prevImage();
    }

    // Reset
    currentTranslate = 0;
    prevTranslate = 0;
    modalImage.style.transform = 'translateX(0)';
}

function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function animation() {
    if (isDragging) {
        setSliderPosition();
        requestAnimationFrame(animation);
    }
}

function setSliderPosition() {
    modalImage.style.transform = `translateX(${currentTranslate}px)`;
}

// Controls animation using same observer
const controlsContainer = document.querySelector('.controls-container');
if (controlsContainer) {
    // Add logic to observe controls if needed, but CSS animation handles pure entrance
    // We already added 'animate' class in HTML for CSS animation triggering on load
    // or we can use observer if we want scroll trigger
}


// Animation Observer
let observer;

function reattachObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    if (observer) observer.disconnect();

    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Short delay to ensure DOM is ready
    setTimeout(() => {
        document.querySelectorAll('.product-card').forEach(card => {
            observer.observe(card);
        });
    }, 100);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
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
