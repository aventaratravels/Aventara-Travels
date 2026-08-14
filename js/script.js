/* ==========================================================================
   AVENTARA TRAVELS SRI LANKA - JAVASCRIPT ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Sticky Header Glass Effect ---
    const header = document.querySelector('.site-header, header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- 2. Mobile Menu Toggle ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links, .nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close on clicking link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --- 3. Mobile Dropdown Toggle ---
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        if (link && item.querySelector('.dropdown-menu')) {
            link.addEventListener('click', (e) => {
                if (window.innerWidth <= 992) {
                    e.preventDefault();
                    item.classList.toggle('active');
                }
            });
        }
    });

    // --- 4. Back to Top Button ---
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- 5. FAQ Accordion ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = item.querySelector('.accordion-content');
            
            // Close other accordions
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    if (otherContent) otherContent.style.maxHeight = null;
                }
            });
            
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // --- 6. Universal "Plan Your Journey" Modal Trigger ---
    const modalOverlay = document.getElementById('planJourneyModal');
    const modalCloseBtn = document.querySelector('.modal-close');

    function openModal() {
        if (modalOverlay) {
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        } else {
            const plannerSection = document.getElementById('journey-planner') || document.getElementById('plan-your-journey');
            if (plannerSection) {
                plannerSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Connect all "Plan Your Journey", "Request Quote", "Inquire Now" buttons to trigger modal or scroll
    document.querySelectorAll('.btn-plan-journey, a[href="#journey-planner"], a[href="#plan-your-journey"], .btn-inquire-now').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (href === '#journey-planner' || href === '#plan-your-journey' || btn.classList.contains('btn-plan-journey') || btn.classList.contains('btn-inquire-now')) {
                const target = document.querySelector(href);
                if (target && !modalOverlay) {
                    // Let default scroll action happen
                } else if (modalOverlay) {
                    e.preventDefault();
                    openModal();
                }
            }
        });
    });

    // --- 7. FormSubmit AJAX Form Handling ---
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Client-side validation
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#e74c3c';
                } else {
                    field.style.borderColor = '#E2DACB';
                }
            });

            const emailField = form.querySelector('input[type="email"]');
            if (emailField && emailField.value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailField.value)) {
                    isValid = false;
                    emailField.style.borderColor = '#e74c3c';
                }
            }

            const messageBox = form.querySelector('.form-message') || document.createElement('div');
            messageBox.className = 'form-message';
            if (!form.contains(messageBox)) form.appendChild(messageBox);

            if (!isValid) {
                messageBox.innerHTML = '<div style="background:#fde8e8;color:#9b1c1c;padding:0.75rem 1rem;border-radius:6px;margin-top:1rem;font-size:0.9rem;">Please complete all required fields with valid details.</div>';
                return;
            }

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : 'SUBMIT';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span style="display:inline-block;animation:spin 1s linear infinite;">⏳</span> SENDING ENQUIRY...';
            }

            // Build FormSubmit target URL
            const actionUrl = form.action.includes('formsubmit.co') ? form.action : 'https://formsubmit.co/ajax/aventaratravels@gmail.com';

            try {
                const formData = new FormData(form);
                // Ensure Subject line is set
                if (!formData.has('_subject')) {
                    formData.append('_subject', 'New Travel Enquiry - Aventara Travels Sri Lanka');
                }

                const response = await fetch(actionUrl, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    form.reset();
                    messageBox.innerHTML = '<div style="background:#def7ec;color:#03543f;padding:1rem 1.25rem;border-radius:8px;margin-top:1rem;font-size:0.95rem;font-weight:600;">✨ Thank you! Your enquiry has been delivered to Aventara Travels. Our Sri Lanka travel specialists will contact you within 12 hours.</div>';
                    setTimeout(() => {
                        if (modalOverlay && modalOverlay.classList.contains('active')) {
                            closeModal();
                        }
                    }, 4000);
                } else {
                    throw new Error('FormSubmit endpoint error');
                }
            } catch (err) {
                console.error('Enquiry Submission Error:', err);
                messageBox.innerHTML = '<div style="background:#fde8e8;color:#9b1c1c;padding:1rem 1.25rem;border-radius:8px;margin-top:1rem;font-size:0.9rem;">We could not deliver your form directly. Please contact us directly via WhatsApp (+94 77 99 70 840) or Email (aventaratravels@gmail.com).</div>';
            } finally {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
            }
        });
    });

    // --- 8. Filter Logic for Tour Listings ---
    const filterBtns = document.querySelectorAll('.filter-tab');
    const filterItems = document.querySelectorAll('.tour-card[data-category]');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                filterItems.forEach(item => {
                    const cat = item.getAttribute('data-category');
                    if (filter === 'all' || cat.includes(filter)) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
});

