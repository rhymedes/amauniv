// Mobile navigation toggle
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuButton && navLinks) {
    mobileMenuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }
        });
    });
}


// Theme toggle logic
const themeToggleButton = document.getElementById('theme-toggle');
const sunIcon = themeToggleButton ? themeToggleButton.querySelector('.sun-icon') : null;
const moonIcon = themeToggleButton ? themeToggleButton.querySelector('.moon-icon') : null;

function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (sunIcon && moonIcon) {
        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }
}

// Check for saved theme preference or system preference on load
// Ensure this runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setTheme('dark');
    } else {
        setTheme('light'); // Default to light if no preference
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', () => {
            const currentTheme = document.body.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(newTheme);
        });
    }
});


// Modal functionality
const modalOverlay = document.getElementById('modal-overlay');
const modalContent = document.getElementById('modal-content');
const modalCloseButton = document.getElementById('modal-close-button');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const cards = document.querySelectorAll('.card');

if (modalOverlay && modalContent && modalCloseButton && modalTitle && modalBody && cards) {
    cards.forEach(card => {
        // Exclude the contact form card (if applicable on a page) from being clickable for the modal
        if (card.querySelector('#contactForm')) {
            card.style.cursor = 'default'; // Change cursor back to default
            return; // Skip adding click listener to this card
        }

        card.addEventListener('click', () => {
            const titleElement = card.querySelector('h3');
            // Dynamically select content based on what's inside the card
            // This handles paragraphs, lists, or even divs containing features
            let contentToDisplay = '';

            const paragraphs = card.querySelectorAll('p');
            if (paragraphs.length > 0) {
                paragraphs.forEach(p => {
                    // Exclude small notes like "*Specific requirements may vary..."
                    if (!p.classList.contains('text-sm') && !p.classList.contains('font-bold')) { // Add more specific classes if needed to exclude
                        contentToDisplay += `<p>${p.innerHTML}</p>`;
                    } else if (p.classList.contains('font-bold') && p.textContent.includes('-')) { // For testimonial names
                        contentToDisplay += `<p class="font-bold">${p.innerHTML}</p>`;
                    } else if (p.classList.contains('text-sm')) { // For testimonial classes
                        contentToDisplay += `<p class="text-sm text-gray-500">${p.innerHTML}</p>`;
                    }
                });
            }

            const lists = card.querySelectorAll('ul');
            if (lists.length > 0) {
                lists.forEach(ul => {
                    contentToDisplay += ul.outerHTML; // Get entire ul with li elements
                });
            }

            const featureItems = card.querySelectorAll('.feature-item');
            if (featureItems.length > 0) {
                featureItems.forEach(item => {
                    contentToDisplay += item.outerHTML; // Get entire feature-item div
                });
            }


            if (titleElement && contentToDisplay) {
                modalTitle.textContent = titleElement.textContent;
                modalBody.innerHTML = contentToDisplay;

                modalOverlay.classList.remove('hidden');
                // Trigger reflow to ensure transition plays
                void modalOverlay.offsetWidth;
                modalOverlay.classList.add('visible');
            }
        });
    });

    modalCloseButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent click from bubbling to overlay
        modalOverlay.classList.remove('visible');
        modalOverlay.classList.add('hidden');
    });

    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) { // Only close if clicking on the overlay itself, not the content
            modalOverlay.classList.remove('visible');
            modalOverlay.classList.add('hidden');
        }
    });
}
