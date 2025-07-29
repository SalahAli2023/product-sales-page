// Product data
const products = [
    {
        id: 1,
        name: "Laptop MacBook Pro M3",
        brand: "MacBook",
        price: 89.99,
        rating: 4,
        image: "src/assets/images/mak1.webp",
        description: "MacBook Pro (14-inch, M3 2023) RAM 8 GB SSD 512GB."
    },
    {
        id: 2,
        name: "Laptop Dell Precision 3560",
        brand: "Dell",
        price: 199.99,
        rating: 5,
        image: "src/assets/images/dell1.webp",
        description: "Dell Precision 3560 Intel Core i7-1165G7, NVIDIA 2GB, 16GB RAM, 512GB."
    },
    {
        id: 3,
        name: "Laptop MacBook Pro",
        brand: "MacBook",
        price: 599.99,
        rating: 4,
        image: "src/assets/images/mak2.webp",
        description: "MacBook Pro(14-inch, M4 2024) RAM 16GB SSD 512GB."
    },
    {
        id: 4,
        name: "Laptop dell Precision",
        brand: "dell",
        price: 49.99,
        rating: 3,
        image: "src/assets/images/dell2.webp",
        description: "Dell Precision 3560 TOUCH Intel Core i7-1165G7, NVIDIA 2GB, 16GB RAM, 512GB."
    },
    {
        id: 5,
        name: "Laptop MacBook",
        brand: "MacBook",
        price: 79.99,
        rating: 4,
        image: "src/assets/images/mak3.webp",
        description: "MacBook Pro (15-inch, 2019) CORE I7 RAM 16 GB SSD 512GB AMD 4."
    },
    {
        id: 6,
        name: "Laptop Dell Precision",
        brand: "Dell",
        price: 1299.99,
        rating: 5,
        image: "src/assets/images/dell3.webp",
        description: "Dell Precision 3560 TOUCH Intel Core i7-1165G7, NVIDIA 2GB, 16GB RAM, 512GB."
    }
];

// DOM elements
const productSlider = document.getElementById('productSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalBrand = document.getElementById('modalBrand');
const modalRating = document.getElementById('modalRating');
const modalPrice = document.getElementById('modalPrice');
const modalDescription = document.getElementById('modalDescription');

// Slider state
let currentSlide = 0;
let slideInterval;
const slidesToShow = 4;
const slideWidth = 100 / slidesToShow;

// Initialize the product slider
function initProductSlider() {
    productSlider.innerHTML = '';
    
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = `min-w-[${slideWidth}%] px-4 flex-shrink-0`;
        productCard.innerHTML = `
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer h-full flex flex-col product-card" data-id="${product.id}">
                <div class="h-48 overflow-hidden">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
                </div>
                <div class="p-4 flex-grow flex flex-col">
                    <h3 class="text-lg font-semibold text-gray-800 mb-1">${product.name}</h3>
                    <p class="text-cyan-800 text-sm mb-2">${product.brand}</p>
                    <div class="flex items-center mb-3 static-rating" data-rating="${product.rating}" data-id="${product.id}">
                        ${generateStars(product.rating, false)}
                    </div>
                    <div class="mt-auto">
                        <p class="text-xl font-bold text-gray-800">$${product.price.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        `;
        productSlider.appendChild(productCard);
    });

    // Set initial slide position
    updateSliderPosition();
    
    // Start auto sliding
    startAutoSlide();
    
    // Add click event to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', () => openModal(parseInt(card.dataset.id)));
    });
}

// Generate star rating HTML
function generateStars(rating, interactive = true, productId = null) {
    let stars = '';
    if (interactive) {
        stars = '<div class="star-rating flex">';
        for (let i = 5; i >= 1; i--) {
            stars += `
                <input type="radio" id="star-${productId}-${i}" name="rating-${productId}" value="${i}" ${rating === i ? 'checked' : ''}>
                <label for="star-${productId}-${i}" title="${i} stars" data-rating="${i}" data-id="${productId}">★</label>
            `;
        }
        stars += '</div>';
    } else {
        stars = '<div class="flex">';
        for (let i = 1; i <= 5; i++) {
            stars += `<span class="${i <= rating ? 'text-yellow-400' : 'text-gray-300'}">★</span>`;
        }
        stars += '</div>';
    }
    return stars;
}

// Open modal with product details
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    modalTitle.textContent = product.name;
    modalImage.src = product.image;
    modalImage.alt = product.name;
    modalBrand.textContent = product.brand;
    modalPrice.textContent = `$${product.price.toFixed(2)}`;
    modalDescription.textContent = product.description;
    
    // Create interactive star rating
    modalRating.innerHTML = generateStars(product.rating, true, productId);
    
    // Add event listeners to stars
    document.querySelectorAll(`.star-rating label[data-id="${productId}"]`).forEach(star => {
        star.addEventListener('click', (e) => {
            const newRating = parseInt(e.target.dataset.rating);
            product.rating = newRating;
            
            // Update rating in the modal
            modalRating.innerHTML = generateStars(newRating, true, productId);
            
            // Update rating on the product card
            const staticRatingElement = document.querySelector(`.static-rating[data-id="${productId}"]`);
            if (staticRatingElement) {
                staticRatingElement.innerHTML = generateStars(newRating, false);
            }
            
            // Re-add event listeners to the new stars in modal
            document.querySelectorAll(`.star-rating label[data-id="${productId}"]`).forEach(newStar => {
                newStar.addEventListener('click', (e) => {
                    const newRating = parseInt(e.target.dataset.rating);
                    product.rating = newRating;
                    modalRating.innerHTML = generateStars(newRating, true, productId);
                    const staticRatingElement = document.querySelector(`.static-rating[data-id="${productId}"]`);
                    if (staticRatingElement) {
                        staticRatingElement.innerHTML = generateStars(newRating, false);
                    }
                });
            });
        });
    });
    
    // Show modal
    productModal.classList.remove('modal-hidden');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeProductModal() {
    productModal.classList.add('modal-hidden');
    document.body.style.overflow = 'auto';
}

// Update slider position
function updateSliderPosition() {
    const offset = -currentSlide * slideWidth;
    productSlider.style.transform = `translateX(${offset}%)`;
}

// Go to next slide
function nextSlide() {
    if (currentSlide < Math.ceil(products.length / slidesToShow) - 1) {
        currentSlide++;
    } else {
        currentSlide = 0;
    }
    updateSliderPosition();
    resetAutoSlide();
}

// Go to previous slide
function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
    } else {
        currentSlide = Math.ceil(products.length / slidesToShow) - 1;
    }
    updateSliderPosition();
    resetAutoSlide();
}

// Start auto sliding
function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
}

// Reset auto slide timer
function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// Handle responsive slides
function handleResponsive() {
    // This is a simplified responsive handling
    // In a real project, you might want to use matchMedia for more precise control
    const width = window.innerWidth;
    let newSlidesToShow = 5;
    
    if (width < 1024) newSlidesToShow = 3;
    if (width < 768) newSlidesToShow = 2;
    if (width < 480) newSlidesToShow = 1;
    
    if (newSlidesToShow !== slidesToShow) {
        // Reinitialize slider with new settings
        initProductSlider();
    }
}

// Event listeners
prevBtn.addEventListener('click', prevSlide);
nextBtn.addEventListener('click', nextSlide);
closeModal.addEventListener('click', closeProductModal);
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
        closeProductModal();
    }
});
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeProductModal();
    }
});
window.addEventListener('resize', handleResponsive);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initProductSlider();
    handleResponsive();
});