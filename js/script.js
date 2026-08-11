document.addEventListener('DOMContentLoaded', () => {
    
    // --- Sticky Header & Navigation ---
    const header = document.querySelector('header');
    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header?.classList.add(isHomePage ? 'scrolled' : 'scrolled-light');
        } else {
            header?.classList.remove('scrolled', 'scrolled-light');
        }
    });

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
        });
    }

    // --- GitHub Form Submission Handler ---
    const form = document.querySelector('.enquiry-form');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn ? btn.innerHTML : 'SEND ENQUIRY';
            const messageEl = form.querySelector('.form-message');

            if (btn) {
                btn.innerHTML = 'Sending...';
                btn.disabled = true;
            }

            // Extract input values
            const name = form.querySelector('[name="name"]')?.value.trim() || 'Anonymous';
            const email = form.querySelector('[name="email"]')?.value.trim() || 'Not provided';
            const phone = form.querySelector('[name="phone"]')?.value.trim() || 'Not provided';
            const message = form.querySelector('[name="message"]')?.value.trim() || '';

            // GitHub Details
            const repoOwner = 'aventaratravels';
            const repoName = 'Aventara-Travels';

            // GitHub Personal Access Token
            const GITHUB_TOKEN = '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';

            const issueData = {
                title: `New Customer Inquiry: ${name}`,
                body: `### New Customer Inquiry from Website\n\n**Name:** ${name}\n**Email:** ${email}\n**Phone / WhatsApp:** ${phone}\n\n**Message / Request Details:**\n${message}`,
                labels: ['customer-inquiry']
            };

            try {
                const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `token ${GITHUB_TOKEN}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(issueData)
                });

                if (response.ok) {
                    form.reset();
                    if (messageEl) {
                        messageEl.textContent = 'Thank you! Your enquiry has been received. We will contact you shortly.';
                        messageEl.style.color = '#155724';
                        messageEl.style.backgroundColor = '#d4edda';
                        messageEl.style.borderColor = '#c3e6cb';
                        messageEl.style.display = 'block';
                    }
                } else {
                    const errData = await response.json();
                    if (messageEl) {
                        messageEl.textContent = 'Submission error: ' + (errData.message || 'Please check token.');
                        messageEl.style.color = '#721c24';
                        messageEl.style.backgroundColor = '#f8d7da';
                        messageEl.style.borderColor = '#f5c6cb';
                        messageEl.style.display = 'block';
                    }
                }
            } catch (err) {
                if (messageEl) {
                    messageEl.textContent = 'Network error. Please check your internet connection.';
                    messageEl.style.color = '#721c24';
                    messageEl.style.backgroundColor = '#f8d7da';
                    messageEl.style.display = 'block';
                }
            } finally {
                if (btn) {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                }
            }
        });
    }
});
