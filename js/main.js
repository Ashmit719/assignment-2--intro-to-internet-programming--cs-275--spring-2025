// Global variables
let currentIndex = 0;
let targetedData = [];

// JSONP callback function
const callback = (data) => {
    loadImage(data);
};

// Function to load and display images
const loadImage = (data) => {
    targetedData = data; // Store data globally
    const carouselSlides = document.querySelector(`.carousel-slides`);
    carouselSlides.innerHTML = ``; // Clear previous slides

    data.forEach((album) => {
        let slide = document.createElement(`div`);
        slide.classList.add(`slide`);
        slide.innerHTML = `
            <h2 class="album-title">${album.album}</h2>
            <h3><a href="${album.url}" target="_blank" class="artist-name">${album.artist}</a></h3>
            <img src="${album.cover_image.path}" alt="${album.cover_image.alt_content}" style="max-width: 100%;">
            <p class="image-credit">Credit: <a href="${album.cover_image.url}" target="_blank">
            ${album.cover_image.credit}</a></p>
            <p class="review-text">${album.review.content}</p>
            <a href="${album.review.url}" target="_blank">${album.review.source}</a>
`           ;
        carouselSlides.appendChild(slide);
    });

    showSlide(0); // Show first slide
};

// Function to show a specific slide
const showSlide = (index) => {
    if (!targetedData.length) return;

    const carouselSlides = document.querySelector(`.carousel-slides`);
    const slideWidth = document.querySelector(`.slide`).offsetWidth; // Get width dynamically
    carouselSlides.style.transform = `translateX(-${index * slideWidth}px)`; // Move by slide width

    // Navigation buttons
    const prevBtn = document.querySelector(`.carousel-navigation a:first-child`);
    const nextBtn = document.querySelector(`.carousel-navigation a:last-child`);

    if (prevBtn && nextBtn) {
        // Adjust button visibility
        prevBtn.style.display = index === 0 ? `none` : `block`;
        nextBtn.style.display = index === targetedData.length - 1 ? `none` : `block`;
    }
};

// Function to dynamically load JSONP script
const loadJSONP = () => {
    let script = document.createElement(`script`);
    script.src = `json/data.json`; // JSONP call
    script.async = true;
    script.onerror = () => console.error(`Failed to load JSONP file.`); // Catch loading errors
    document.body.appendChild(script);
};

// Event listeners for navigation
document.addEventListener(`DOMContentLoaded`, () => {
    loadJSONP(); // Load JSONP file on page load

    // Setup navigation buttons
    const prevBtn = document.querySelector(`.carousel-navigation a:first-child`);
    const nextBtn = document.querySelector(`.carousel-navigation a:last-child`);

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener(`click`, (event) => {
            event.preventDefault();
            if (currentIndex > 0) {
                currentIndex--;
                showSlide(currentIndex);
            }
        });

        nextBtn.addEventListener(`click`, (event) => {
            event.preventDefault();
            if (currentIndex < targetedData.length - 1) {
                currentIndex++;
                showSlide(currentIndex);
            }
        });
    }
});
