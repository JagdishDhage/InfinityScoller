let photoArray = [];
const imageContainer = document.getElementById('imgcontainer');
const loader = document.getElementById('loader');
const count = 15; // Reduced for better initial load performance
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let initialLoad = true;

const apiKey = 'x1U7T5ZeBj7jJS2Q9i1ffhZ90fhPNJLzrQBOT3Sxc_Y';
const apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${count}`;

// Create and show status message
function showStatus(message, isError = false) {
    // Remove existing status message if any
    const existingStatus = document.querySelector('.status-message');
    if (existingStatus) {
        existingStatus.remove();
    }
    
    // Create new status message
    const statusElement = document.createElement('div');
    statusElement.classList.add('status-message');
    statusElement.textContent = message;
    
    if (isError) {
        statusElement.style.backgroundColor = '#e74c3c';
    }
    
    document.body.appendChild(statusElement);
    
    // Show the message
    setTimeout(() => {
        statusElement.classList.add('show');
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        statusElement.classList.remove('show');
        setTimeout(() => {
            statusElement.remove();
        }, 300);
    }, 3000);
}

// Check if image finished loading
function imageLoaded() {
    imagesLoaded++;
    
    // Update loader text with loading percentage
    const loadingProgress = Math.floor((imagesLoaded / totalImages) * 100);
    
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
        
        // Show more images on next scroll for better UX
        if (initialLoad) {
            initialLoad = false;
            // Show status message
            showStatus('Images loaded successfully! ✨');
        }
    }
}

// Create elements for links & photos, add to DOM
function displayPhotos() {
    imagesLoaded = 0;
    totalImages = photoArray.length;
    
    photoArray.forEach((photo) => {
        // Create <a> to link to Unsplash
        const item = document.createElement('a');
        item.setAttribute('href', photo.links.html);
        item.setAttribute('target', '_blank');
        item.setAttribute('rel', 'noopener noreferrer');
        item.classList.add('image-item'); // Add class for potential future styling
        
        // Create placeholder for image with shimmer effect
        item.classList.add('loading');
        
        // Create <img> for photo
        const img = document.createElement('img');
        img.setAttribute('src', photo.urls.regular);
        img.setAttribute('alt', photo.alt_description || 'Unsplash Image');
        img.setAttribute('title', photo.alt_description || 'Unsplash Image');
        
        // Event listener, check when each is finished loading
        img.addEventListener('load', () => {
            // Remove loading class when image has loaded
            item.classList.remove('loading');
            imageLoaded();
        });

        // Put <img> inside <a>, then put both inside imageContainer
        item.appendChild(img);
        imageContainer.appendChild(item);
    });
}

// Get photos from Unsplash API
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        photoArray = await response.json();
        displayPhotos();
    } catch (error) {
        console.error('Error fetching photos:', error);
        showStatus('Failed to load images. Please try again later.', true);
        
        // Still hide loader in case of error
        loader.hidden = true;
    }
}

// Check to see if scrolling near bottom of page, load more photos
window.addEventListener('scroll', () => {
    // Formula checks if we're near the bottom of the page (1000px buffer for smoother experience)
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
        
        // Add subtle notification
        showStatus('Loading more images...');
    }
});

// Add animation to heading
document.addEventListener('DOMContentLoaded', () => {
    const heading = document.querySelector('.heading');
    heading.innerHTML = heading.textContent
        .split('')
        .map(letter => `<span class="letter">${letter}</span>`)
        .join('');
        
    const letters = document.querySelectorAll('.letter');
    letters.forEach((letter, index) => {
        letter.style.animationDelay = `${index * 0.05}s`;
        letter.style.display = 'inline-block';
        letter.style.animation = 'letterFadeIn 0.5s forwards';
    });
    
    // Add letter animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes letterFadeIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
});

// On load
getPhotos();
