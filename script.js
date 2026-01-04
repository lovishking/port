// Loading Screen
window.addEventListener('load', function() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Hide loading screen after minimum 2 seconds
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Remove from DOM after transition
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 2000);
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Navbar background change on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(15, 15, 15, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.7)';
        } else {
            navbar.style.background = 'rgba(15, 15, 15, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
        }
    });
    
    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .about-content, .contact-content');
    animateElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    
    // Typing animation for hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        // Disable typing animation to preserve HTML formatting
        // The title will appear normally with the highlight span working correctly
        heroTitle.style.opacity = '0';
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 0.5s ease';
            heroTitle.style.opacity = '1';
        }, 500);
    }
    
    // Animated counter for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        }
        
        updateCounter();
    }
    
    // Trigger counter animation when stats section is visible
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    animateCounter(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    });
    
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            const emailInput = document.getElementById('email');
            const replyToInput = document.getElementById('reply-to');
            
            // Set reply-to as the sender's email
            if (emailInput && replyToInput) {
                replyToInput.value = emailInput.value;
            }
            
            // Show loading state
            const btnText = contactForm.querySelector('.btn-text');
            const btnLoading = contactForm.querySelector('.btn-loading');
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            
            if (btnText && btnLoading && submitBtn) {
                btnText.style.display = 'none';
                btnLoading.style.display = 'inline-block';
                submitBtn.disabled = true;
            }
            
            // Form will submit to Formspree
            // Success notification will show after redirect
        });
    }
    
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#2ecc71' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideInRight 0.3s ease;
            max-width: 300px;
        `;
        
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0;
            margin-left: auto;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
        
        // Close button functionality
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    // Add notification animations to CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        .nav-link.active {
            color: #64b5f6;
        }
        
        .nav-link.active::after {
            width: 100%;
        }
    `;
    document.head.appendChild(style);
    
    // Skills hover effect
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Project card tilt effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });
    
    // Theme toggle (bonus feature)
    function createThemeToggle() {
        const toggle = document.createElement('button');
        toggle.innerHTML = '<i class="fas fa-moon"></i>';
        toggle.className = 'theme-toggle';
        toggle.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: #64b5f6;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(100, 181, 246, 0.4);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        toggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const icon = toggle.querySelector('i');
            if (document.body.classList.contains('dark-theme')) {
                icon.className = 'fas fa-sun';
                localStorage.setItem('theme', 'dark');
            } else {
                icon.className = 'fas fa-moon';
                localStorage.setItem('theme', 'light');
            }
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            toggle.querySelector('i').className = 'fas fa-sun';
        }
        
        document.body.appendChild(toggle);
    }
    
    createThemeToggle();
    
    // Add dark theme styles
    const darkThemeStyle = document.createElement('style');
    darkThemeStyle.textContent = `
        .dark-theme {
            background: #1a1a1a;
            color: #e0e0e0;
        }
        
        .dark-theme .navbar {
            background: rgba(26, 26, 26, 0.95);
        }
        
        .dark-theme .nav-link {
            color: #e0e0e0;
        }
        
        .dark-theme .section-title {
            color: #e0e0e0;
        }
        
        .dark-theme .about {
            background: #222;
        }
        
        .dark-theme .projects {
            background: #222;
        }
        
        .dark-theme .skill-category,
        .dark-theme .project-card,
        .dark-theme .contact-form {
            background: #333;
            color: #e0e0e0;
        }
        
        .dark-theme .footer {
            background: #111;
        }
    `;
    document.head.appendChild(darkThemeStyle);
});

// Video Slider Functionality
let sliderPositions = {
    codeshack: 0,
    personal: 0
};

function slideVideos(category, direction) {
    const slider = document.getElementById(`${category}-slider`);
    const cards = slider.querySelectorAll('.video-card');
    const cardWidth = 324; // 300px width + 24px gap
    const containerWidth = slider.parentElement.offsetWidth;
    const visibleCards = Math.floor(containerWidth / cardWidth);
    const maxPosition = Math.max(0, cards.length - visibleCards);
    
    // Update position
    sliderPositions[category] += direction;
    
    // Boundary checks
    if (sliderPositions[category] < 0) {
        sliderPositions[category] = 0;
    } else if (sliderPositions[category] > maxPosition) {
        sliderPositions[category] = maxPosition;
    }
    
    // Apply transform
    const translateX = -(sliderPositions[category] * cardWidth);
    slider.style.transform = `translateX(${translateX}px)`;
    
    // Update button states
    updateSliderButtons(category, maxPosition);
}

function updateSliderButtons(category, maxPosition) {
    const categoryElement = document.querySelector(`#${category}-slider`).closest('.video-category');
    const prevBtn = categoryElement.querySelector('.prev-btn');
    const nextBtn = categoryElement.querySelector('.next-btn');
    
    // Update button opacity based on position
    prevBtn.style.opacity = sliderPositions[category] === 0 ? '0.5' : '1';
    nextBtn.style.opacity = sliderPositions[category] >= maxPosition ? '0.5' : '1';
    
    prevBtn.style.cursor = sliderPositions[category] === 0 ? 'not-allowed' : 'pointer';
    nextBtn.style.cursor = sliderPositions[category] >= maxPosition ? 'not-allowed' : 'pointer';
}

// Initialize slider button states when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        // Initialize button states for both sliders
        const categories = ['codeshack', 'personal'];
        categories.forEach(category => {
            const slider = document.getElementById(`${category}-slider`);
            if (slider) {
                const cards = slider.querySelectorAll('.video-card');
                const containerWidth = slider.parentElement.offsetWidth;
                const cardWidth = 324;
                const visibleCards = Math.floor(containerWidth / cardWidth);
                const maxPosition = Math.max(0, cards.length - visibleCards);
                updateSliderButtons(category, maxPosition);
            }
        });
    }, 100);
});

// Handle window resize to recalculate slider positions
window.addEventListener('resize', function() {
    // Reset positions on resize
    sliderPositions.codeshack = 0;
    sliderPositions.personal = 0;
    
    // Reset transforms
    const sliders = document.querySelectorAll('.video-slider');
    sliders.forEach(slider => {
        slider.style.transform = 'translateX(0px)';
    });
    
    // Update button states
    setTimeout(() => {
        const categories = ['codeshack', 'personal'];
        categories.forEach(category => {
            const slider = document.getElementById(`${category}-slider`);
            if (slider) {
                const cards = slider.querySelectorAll('.video-card');
                const containerWidth = slider.parentElement.offsetWidth;
                const cardWidth = 324;
                const visibleCards = Math.floor(containerWidth / cardWidth);
                const maxPosition = Math.max(0, cards.length - visibleCards);
                updateSliderButtons(category, maxPosition);
            }
        });
    }, 100);
});