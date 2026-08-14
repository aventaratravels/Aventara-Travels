document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Header & Active State ---
    const header = document.querySelector('header');
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add(isHomePage ? 'scrolled' : 'scrolled-light');
        } else {
            header.classList.remove('scrolled', 'scrolled-light');
        }
    });

    // Handle pages that don't have a full-screen hero image
    if (!isHomePage && !document.querySelector('.hero')) {
         header.classList.add('scrolled-light');
    }

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Scroll Reveal ---
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const revealPoint = 100;
            
            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Trigger on load

    // --- Back to Top Button ---
    const backToTopBtn = document.createElement('button');
    backToTopBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
    backToTopBtn.className = 'back-to-top';
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // --- Filtering Logic (Tours/Experiences) ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const filterItems = document.querySelectorAll('.filter-item');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                filterItems.forEach(item => {
                    if (filterValue === 'all' || item.getAttribute('data-category').includes(filterValue)) {
                        item.style.display = 'block';
                        setTimeout(() => item.style.opacity = '1', 50);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => item.style.display = 'none', 300);
                    }
                });
            });
        });
    }

    // --- FAQ Accordion ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            const content = header.nextElementSibling;
            
            // Close all others
            document.querySelectorAll('.accordion-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.accordion-content').style.maxHeight = null;
                }
            });
            
            // Toggle current
            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // --- Form Validation ---
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            let isValid = true;
            const requiredFields = form.querySelectorAll('[required]');
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#dc3545';
                } else {
                    field.style.borderColor = '#ccc';
                }
            });
            
            const messageEl = form.querySelector('.form-message');
            
            if (isValid) {
                // Simulate form submission
                const btn = form.querySelector('button[type="submit"]');
                const originalText = btn.innerHTML;
                btn.innerHTML = 'Sending...';
                btn.disabled = true;
                
                setTimeout(() => {
                    form.reset();
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    
                    if (messageEl) {
                        messageEl.textContent = 'Thank you! Your enquiry has been received. We will contact you shortly.';
                        messageEl.className = 'form-message success';
                        messageEl.style.display = 'block';
                        
                        setTimeout(() => {
                            messageEl.style.display = 'none';
                        }, 5000);
                    }
                }, 1500);
            } else {
                if (messageEl) {
                    messageEl.textContent = 'Please fill out all required fields.';
                    messageEl.className = 'form-message error';
                    messageEl.style.display = 'block';
                }
            }
        });
    });

    // Floating Share Button
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Aventara Travels',
                        text: 'Discover curated Sri Lankan journeys with Aventara Travels.',
                        url: window.location.href,
                    });
                } catch (err) {
                    console.log('Error sharing:', err);
                }
            } else {
                // Fallback for browsers that don't support Web Share API
                navigator.clipboard.writeText(window.location.href).then(() => {
                    const originalHTML = shareBtn.innerHTML;
                    shareBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                    setTimeout(() => {
                        shareBtn.innerHTML = originalHTML;
                    }, 2000);
                });
            }
        });
    }
});


// Aventara quote/contact forms: send enquiries securely via FormSubmit.
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('form.enquiry-form').forEach(function(form) {
    form.addEventListener('submit', async function(e) {
      if (!form.action.includes('formsubmit.co')) return;
      e.preventDefault();
      const btn=form.querySelector('button[type="submit"]');
      const original=btn ? btn.innerHTML : '';
      if(btn){btn.disabled=true;btn.innerHTML='SENDING...';}
      try {
        const response=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}});
        if(!response.ok) throw new Error('send failed');
        form.reset();
        let msg=form.querySelector('.form-message');
        if(!msg){msg=document.createElement('div');msg.className='form-message';form.appendChild(msg);}
        msg.textContent='Thank you! Your enquiry has been sent to Aventara Travels. We will contact you shortly.';
        msg.style.display='block';
      } catch(err) {
        let msg=form.querySelector('.form-message');
        if(!msg){msg=document.createElement('div');msg.className='form-message';form.appendChild(msg);}
        msg.textContent='We could not send your enquiry right now. Please contact Aventara Travels by WhatsApp or email.';
        msg.style.display='block';
      } finally { if(btn){btn.disabled=false;btn.innerHTML=original;} }
    });
  });
});
