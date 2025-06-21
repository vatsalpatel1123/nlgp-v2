/**
 * Brandmode - Main JavaScript File
 * Digital Marketing Agency Website
 */

(function() {
    'use strict';

    // DOM Ready
    document.addEventListener('DOMContentLoaded', function() {
        initializeWebsite();
    });

    function initializeWebsite() {
        // Initialize all components
        initMobileMenu();
        initSmoothScrolling();
        initScrollAnimations();
        initContactForm();
        initPortfolioFilter();
        initTestimonialSlider();
        initScrollToTop();
        initHeaderScroll();
    }

    // Mobile Menu Toggle
    function initMobileMenu() {
        const menuToggle = document.querySelector('.menu-toggle');
        const navigation = document.querySelector('.site-navigation');

        if (menuToggle && navigation) {
            menuToggle.addEventListener('click', function() {
                navigation.classList.toggle('active');
                menuToggle.classList.toggle('active');
                
                // Toggle aria-expanded for accessibility
                const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
                menuToggle.setAttribute('aria-expanded', !isExpanded);
            });

            // Close menu when clicking on links
            const menuLinks = navigation.querySelectorAll('a');
            menuLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navigation.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                });
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!navigation.contains(e.target) && !menuToggle.contains(e.target)) {
                    navigation.classList.remove('active');
                    menuToggle.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // Smooth Scrolling for anchor links
    function initSmoothScrolling() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Scroll Animations
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
        
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

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Contact Form Handler
    function initContactForm() {
        const contactForm = document.querySelector('#contact-form');
        
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                // Get form data
                const formData = new FormData(this);
                const formObject = {};
                formData.forEach((value, key) => {
                    formObject[key] = value;
                });

                // Basic validation
                if (validateForm(formObject)) {
                    // Show success message
                    showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
                    this.reset();
                } else {
                    showMessage('Please fill in all required fields correctly.', 'error');
                }
            });
        }
    }

    // Form Validation
    function validateForm(data) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        return data.name && 
               data.name.trim().length > 0 &&
               data.email && 
               emailRegex.test(data.email) &&
               data.message && 
               data.message.trim().length > 0;
    }

    // Show Message
    function showMessage(message, type) {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        // Style the message
        messageDiv.style.cssText = `
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 5px;
            font-weight: 500;
            ${type === 'success' ? 
                'background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb;' : 
                'background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;'
            }
        `;

        // Insert message
        const contactForm = document.querySelector('#contact-form');
        if (contactForm) {
            contactForm.insertBefore(messageDiv, contactForm.firstChild);
            
            // Remove message after 5 seconds
            setTimeout(() => {
                messageDiv.remove();
            }, 5000);
        }
    }

    // Portfolio Filter (if portfolio section exists)
    function initPortfolioFilter() {
        const filterButtons = document.querySelectorAll('.portfolio-filter button');
        const portfolioItems = document.querySelectorAll('.portfolio-item');

        if (filterButtons.length > 0 && portfolioItems.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const filter = this.getAttribute('data-filter');
                    
                    // Update active button
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Filter items
                    portfolioItems.forEach(item => {
                        if (filter === 'all' || item.classList.contains(filter)) {
                            item.style.display = 'block';
                            item.classList.add('fade-in');
                        } else {
                            item.style.display = 'none';
                        }
                    });
                });
            });
        }
    }

    // Testimonial Slider (simple implementation)
    function initTestimonialSlider() {
        const slider = document.querySelector('.testimonial-slider');
        const slides = document.querySelectorAll('.testimonial-slide');
        const prevBtn = document.querySelector('.testimonial-prev');
        const nextBtn = document.querySelector('.testimonial-next');
        
        if (slider && slides.length > 1) {
            let currentSlide = 0;
            
            function showSlide(index) {
                slides.forEach((slide, i) => {
                    slide.style.display = i === index ? 'block' : 'none';
                });
            }
            
            function nextSlide() {
                currentSlide = (currentSlide + 1) % slides.length;
                showSlide(currentSlide);
            }
            
            function prevSlide() {
                currentSlide = (currentSlide - 1 + slides.length) % slides.length;
                showSlide(currentSlide);
            }
            
            // Initialize
            showSlide(0);
            
            // Event listeners
            if (nextBtn) nextBtn.addEventListener('click', nextSlide);
            if (prevBtn) prevBtn.addEventListener('click', prevSlide);
            
            // Auto-play
            setInterval(nextSlide, 5000);
        }
    }

    // Scroll to Top Button
    function initScrollToTop() {
        // Create scroll to top button
        const scrollBtn = document.createElement('button');
        scrollBtn.innerHTML = '↑';
        scrollBtn.className = 'scroll-to-top';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        
        // Style the button
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 50%;
            font-size: 20px;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        document.body.appendChild(scrollBtn);
        
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollBtn.style.opacity = '1';
                scrollBtn.style.visibility = 'visible';
            } else {
                scrollBtn.style.opacity = '0';
                scrollBtn.style.visibility = 'hidden';
            }
        });
        
        // Scroll to top when clicked
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Header Scroll Effect
    function initHeaderScroll() {
        const header = document.querySelector('.site-header');
        
        if (header) {
            window.addEventListener('scroll', function() {
                if (window.pageYOffset > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }
    }

    // Utility function to debounce events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        // Close mobile menu on resize
        const navigation = document.querySelector('.site-navigation');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (window.innerWidth > 991 && navigation && menuToggle) {
            navigation.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
        }
    }, 250));

})();
