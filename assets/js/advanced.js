// Advanced JavaScript Features

// Vanilla JS 3D Tilt Effect
class Tilt {
    constructor(element, settings = {}) {
        this.element = element;
        this.settings = {
            max: settings.max || 15,
            perspective: settings.perspective || 1000,
            scale: settings.scale || 1.05,
            speed: settings.speed || 500,
            easing: settings.easing || 'cubic-bezier(.03,.98,.52,.99)'
        };
        this.init();
    }

    init() {
        this.element.style.transform = `perspective(${this.settings.perspective}px)`;
        this.addEventListeners();
    }

    addEventListeners() {
        this.element.addEventListener('mouseenter', () => this.onMouseEnter());
        this.element.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.element.addEventListener('mouseleave', () => this.onMouseLeave());
    }

    onMouseEnter() {
        this.element.style.transition = `all ${this.settings.speed}ms ${this.settings.easing}`;
        setTimeout(() => {
            this.element.style.transition = 'none';
        }, this.settings.speed);
    }

    onMouseMove(e) {
        const rect = this.element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        
        const dx = x - xc;
        const dy = y - yc;
        
        const tiltX = -(dy / yc) * this.settings.max;
        const tiltY = (dx / xc) * this.settings.max;
        
        this.element.style.transform = `
            perspective(${this.settings.perspective}px)
            scale3d(${this.settings.scale}, ${this.settings.scale}, ${this.settings.scale})
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
        `;
    }

    onMouseLeave() {
        this.element.style.transition = `all ${this.settings.speed}ms ${this.settings.easing}`;
        this.element.style.transform = `
            perspective(${this.settings.perspective}px)
            scale3d(1, 1, 1)
            rotateX(0deg)
            rotateY(0deg)
        `;
    }
}

// Smooth Scroll with Dynamic Progress
class SmoothScroll {
    constructor() {
        this.progress = document.createElement('div');
        this.progress.className = 'scroll-progress';
        document.body.appendChild(this.progress);
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.updateProgress());
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => this.scrollToElement(e));
        });
    }

    updateProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        this.progress.style.width = `${progress}%`;
    }

    scrollToElement(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Intersection Observer for Advanced Animations
class ScrollAnimator {
    constructor() {
        this.init();
    }

    init() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    if (entry.target.dataset.once !== 'false') {
                        observer.unobserve(entry.target);
                    }
                } else if (entry.target.dataset.once === 'false') {
                    entry.target.classList.remove('visible');
                }
            });
        }, options);

        document.querySelectorAll('.scroll-reveal').forEach(el => {
            observer.observe(el);
        });
    }
}

// Dynamic Content Loader
class ContentLoader {
    constructor() {
        this.page = 1;
        this.loading = false;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.infiniteScroll());
    }

    async infiniteScroll() {
        if (this.loading) return;

        const endOfPage = window.innerHeight + window.pageYOffset >= document.body.offsetHeight - 1000;

        if (endOfPage) {
            this.loading = true;
            await this.loadMoreContent();
            this.loading = false;
        }
    }

    async loadMoreContent() {
        try {
            const response = await fetch(`/api/posts?page=${this.page}`);
            const data = await response.json();
            
            if (data.posts.length > 0) {
                this.renderPosts(data.posts);
                this.page++;
            }
        } catch (error) {
            console.error('Error loading more content:', error);
        }
    }

    renderPosts(posts) {
        const container = document.querySelector('.blog-grid');
        if (!container) return;

        posts.forEach(post => {
            const article = document.createElement('article');
            article.className = 'blog-card scroll-reveal';
            article.innerHTML = `
                <div class="blog-image">
                    <img src="${post.image}" alt="${post.title}">
                </div>
                <div class="blog-content">
                    <div class="blog-meta">
                        <span class="blog-date">${post.date}</span>
                        <span class="blog-category">${post.category}</span>
                    </div>
                    <h2>${post.title}</h2>
                    <p class="blog-excerpt">${post.excerpt}</p>
                    <div class="blog-footer">
                        <span class="read-time">${post.readTime}</span>
                        <a href="#" class="read-more">Read More</a>
                    </div>
                </div>
            `;
            container.appendChild(article);
        });
    }
}

// Masonry Layout
class MasonryGrid {
    constructor(container, items, options = {}) {
        this.container = container;
        this.items = Array.from(items);
        this.options = {
            columns: options.columns || 3,
            gap: options.gap || 20
        };
        this.init();
    }

    init() {
        this.layout();
        window.addEventListener('resize', () => this.layout());
        window.addEventListener('load', () => this.layout());
    }

    layout() {
        const containerWidth = this.container.offsetWidth;
        const columnWidth = (containerWidth - (this.options.gap * (this.options.columns - 1))) / this.options.columns;
        const columns = Array(this.options.columns).fill(0);

        this.items.forEach(item => {
            const shortestColumn = columns.indexOf(Math.min(...columns));
            
            item.style.width = `${columnWidth}px`;
            item.style.position = 'absolute';
            item.style.left = `${shortestColumn * (columnWidth + this.options.gap)}px`;
            item.style.top = `${columns[shortestColumn]}px`;
            
            columns[shortestColumn] += item.offsetHeight + this.options.gap;
        });

        this.container.style.height = `${Math.max(...columns)}px`;
    }
}

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D Tilt effect on cards
    document.querySelectorAll('.card-3d').forEach(card => {
        new Tilt(card);
    });

    // Initialize Smooth Scroll
    new SmoothScroll();

    // Initialize Scroll Animations
    new ScrollAnimator();

    // Initialize Content Loader for blog pages
    if (document.querySelector('.blog-grid')) {
        new ContentLoader();
    }

    // Initialize Masonry Layout for grid items
    const masonryContainer = document.querySelector('.masonry-grid');
    if (masonryContainer) {
        new MasonryGrid(
            masonryContainer,
            masonryContainer.children,
            { columns: window.innerWidth > 768 ? 3 : 1 }
        );
    }
});

// Particle Background Effect
class ParticleBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.init();
    }

    init() {
        this.resize();
        this.createParticles();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = Math.floor(window.innerWidth / 10);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 1,
                speedX: Math.random() * 2 - 1,
                speedY: Math.random() * 2 - 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            if (particle.x < 0 || particle.x > this.canvas.width) {
                particle.speedX *= -1;
            }
            if (particle.y < 0 || particle.y > this.canvas.height) {
                particle.speedY *= -1;
            }

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(var(--primary-rgb), 0.1)';
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize Particle Background if canvas exists
const particleCanvas = document.querySelector('#particle-bg');
if (particleCanvas) {
    new ParticleBackground(particleCanvas);
} 