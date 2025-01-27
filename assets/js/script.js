// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const backToTopButton = document.getElementById('back-to-top');
const carousel = document.querySelector('.post-carousel');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');

// Theme Toggle
const toggleTheme = () => {
    const currentTheme = document.body.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update theme toggle icon
    const icon = themeToggle.querySelector('i');
    icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
};

// Initialize theme from localStorage
const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    const icon = themeToggle.querySelector('i');
    icon.className = savedTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
};

// Mobile Navigation Toggle
const toggleNav = () => {
    navMenu.classList.toggle('active');
    const spans = navToggle.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (navMenu.classList.contains('active')) {
            span.style.transform = index === 0 ? 'rotate(45deg) translate(5px, 5px)' :
                                 index === 1 ? 'opacity: 0' :
                                 'rotate(-45deg) translate(7px, -7px)';
        } else {
            span.style.transform = 'none';
        }
    });
};

// Back to Top Button
const handleScroll = () => {
    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
};

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Post Carousel
const posts = [
    {
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format&fit=crop&q=80',
        date: 'March 15, 2024',
        title: 'Getting Started with Web Development',
        excerpt: 'Learn the fundamentals of modern web development and start your journey...'
    },
    {
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
        date: 'March 14, 2024',
        title: 'Mastering CSS Grid Layout',
        excerpt: 'Deep dive into CSS Grid and learn how to create complex layouts with ease...'
    },
    {
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
        date: 'March 13, 2024',
        title: 'JavaScript Best Practices',
        excerpt: 'Discover the best practices for writing clean and maintainable JavaScript code...'
    }
];

const createPostCard = (post) => {
    return `
        <div class="post-card fade-in">
            <div class="post-image">
                <img src="${post.image}" alt="${post.title}">
            </div>
            <div class="post-content">
                <span class="post-date">${post.date}</span>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <a href="#" class="read-more">Read More</a>
            </div>
        </div>
    `;
};

const initCarousel = () => {
    carousel.innerHTML = posts.map(post => createPostCard(post)).join('');
};

// Intersection Observer for animations
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.post-card, .hero-content, .footer-section').forEach(el => {
        observer.observe(el);
    });
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initCarousel();
    observeElements();
});

themeToggle.addEventListener('click', toggleTheme);
navToggle.addEventListener('click', toggleNav);
window.addEventListener('scroll', handleScroll);
backToTopButton.addEventListener('click', scrollToTop);

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !navToggle.contains(e.target)) {
        toggleNav();
    }
}); 