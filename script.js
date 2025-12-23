document.addEventListener('DOMContentLoaded', function() {
    
// =============== Mobile Navigation Toggle ==============================
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });
    }

 // ============= Active Link Highlighter ========================
    // Get current page URL path (e.g., "/contact.html")
    const currentLocation = location.pathname.split("/").pop();
    const menuItems = document.querySelectorAll('.nav-links a');

    menuItems.forEach(link => {
        // Get the href attribute of the link (e.g., "contact.html")
        const linkAttribute = link.getAttribute('href');

        // Check if the link matches the current page
        // OR if we are on the homepage (empty string or index.html) and the link is "index.html"
        if (linkAttribute === currentLocation || (currentLocation === "" && linkAttribute === "index.html")) {
            link.classList.add('active');
        } else {
             // Optional: If you want to highlight sections on the homepage while scrolling
             // you would need a more complex "Intersection Observer" script.
             // For separate pages (Home vs Contact), this simple check is perfect.
            link.classList.remove('active');
        }
    });

// =================== NEW Multi-Card Testimonial Slider ====================
    const track = document.querySelector('.testimonial-track-container');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentIndex = 0;

    function updateSlider() {
        if (!track || cards.length === 0) return;

        // Get width of one card + gap (computed style usually safer)
        const cardWidth = cards[0].offsetWidth;
        // Gap is set in CSS (30px), but let's calculate it to be precise
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap) || 0;
        
        const moveAmount = (cardWidth + gap) * currentIndex;
        track.style.transform = `translateX(-${moveAmount}px)`;
        
        // Disable buttons if at ends (Optional)
        // prevBtn.disabled = currentIndex === 0;
        // nextBtn.disabled = currentIndex >= maxIndex; 
    }

    function getMaxIndex() {
        // How many visible?
        const containerWidth = document.querySelector('.testimonial-window').offsetWidth;
        const cardWidth = cards[0].offsetWidth;
        const cardsVisible = Math.floor(containerWidth / cardWidth);
        
        // Total cards - visible cards
        return Math.max(0, cards.length - cardsVisible);
    }

    if (track && cards.length > 0) {
        nextBtn.addEventListener('click', () => {
            const maxIndex = getMaxIndex();
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back to start
            }
            updateSlider();
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = getMaxIndex(); // Loop to end
            }
            updateSlider();
        });

        // Update on resize to handle different cards-per-view
        window.addEventListener('resize', () => {
            currentIndex = 0; // Reset to avoid alignment bugs
            updateSlider();
        });
    }

// =========== Smooth Scrolling for Anchor Links =====================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            if(navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
            }

            const targetId = this.getAttribute('href');
            if(targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

// ================== FAQ Accordion Logic ========================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const item = question.parentElement;
            const answer = item.querySelector('.faq-answer');

            // Toggle the 'active' class
            item.classList.toggle('active');

            // Handle the smooth slide animation
            if (item.classList.contains('active')) {
                // Set height to the content's actual height
                answer.style.maxHeight = answer.scrollHeight + "px";
            } else {
                // Collapse back to 0
                answer.style.maxHeight = null;
            }

            // Optional: Close other items when one opens (Accordion style)
            // Uncomment the lines below if you want only one open at a time
            /*
            faqQuestions.forEach(otherQuestion => {
                const otherItem = otherQuestion.parentElement;
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });
            */
        });
    });

// =========== Modal "Read More" Button Logic ======================

    function openModal(project) {
        const modal = document.getElementById('portfolio-modal');
    
        // ... (Your existing code to fill title, desc, results) ...

        // Logic for the "Read More" Button
        const readMoreBtn = document.getElementById('modal-read-more');

        if (project.link && project.link !== "") {
            // If a link exists, show button and set the href
            readMoreBtn.style.display = "inline-block"; 
            readMoreBtn.href = project.link;
        } else {
            // If no link, hide the button
        readMoreBtn.style.display = "none";
        }

        modal.style.display = "flex";
    }


// ============== PORTFOLIO LOGIC =====================================
    const portfolioGrid = document.getElementById('portfolio-grid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Only run if we are on the portfolio page
    if (portfolioGrid) {
        
        // 1. Function to Display Items
        function displayItems(items) {
            let displayMenu = items.map(function(item) {
                return `
                <div class="portfolio-card" data-id="${item.id}">
                    <div class="card-image">
                        <img src="${item.image}" alt="${item.title}">
                    </div>
                    <div class="card-content">
                        <span class="card-category">${item.category}</span>
                        <h3>${item.title}</h3>
                        <p>Click to see results</p>
                    </div>
                </div>`;
            });
            displayMenu = displayMenu.join("");
            portfolioGrid.innerHTML = displayMenu;

            // Re-attach click listeners to new cards
            attachCardListeners();
        }

        // 2. Initial Render (Show All)
        displayItems(portfolioData);

        // 3. Dropdown-Filter Logic
        
        // a. Select the Dropdown Elements
        const industrySelect = document.getElementById('filter-industry');
        const serviceSelect = document.getElementById('filter-service');

        // b. State Variables
        let currentFilters = {
            industry: 'all',
            service: 'all'
        };

        // c. Define the Filter Function
        function filterProjects() {
            const filteredItems = portfolioData.filter(item => {
                // Check Industry
                const matchIndustry = (currentFilters.industry === 'all') || (item.category === currentFilters.industry);
                
                // Check Service
                const matchService = (currentFilters.service === 'all') || (item.service === currentFilters.service);

                // Item must match BOTH to be shown
                return matchIndustry && matchService;
            });

            displayItems(filteredItems);
        }

        // d. Add Event Listeners for "Change"
        if (industrySelect && serviceSelect) {
            
            industrySelect.addEventListener('change', (e) => {
                currentFilters.industry = e.target.value;
                filterProjects();
            });

            serviceSelect.addEventListener('change', (e) => {
                currentFilters.service = e.target.value;
                filterProjects();
            });
        }


        // 4. Modal Logic
        const modal = document.getElementById('portfolio-modal');
        const closeModal = document.querySelector('.close-modal');

        function attachCardListeners() {
            const cards = document.querySelectorAll('.portfolio-card');
            cards.forEach(card => {
                card.addEventListener('click', () => {
                    const id = card.getAttribute('data-id');
                    const project = portfolioData.find(p => p.id == id);
                    
                    // Fill Modal Data
                    document.getElementById('modal-logo').src = project.logo;
                    document.getElementById('modal-title').innerText = project.title;
                    document.getElementById('modal-category').innerText = project.industry;
                    document.getElementById('modal-desc').innerText = project.description;
                    
                    // Fill Results List
                    const resultsList = document.getElementById('modal-results-list');
                    resultsList.innerHTML = project.results.map(r => `<li>${r}</li>`).join('');

                    // --- Button Logic (UPDATED) ---
                    const readMoreBtn = document.getElementById('modal-read-more');

                    // Debugging: Check what link we are trying to set
                    console.log("Setting link to:", project.link);

                    if (project.link && project.link.trim() !== "") {
                        readMoreBtn.style.display = "inline-block";
                        readMoreBtn.setAttribute('href', project.link); // Force attribute update
                    } else {
                        readMoreBtn.style.display = "none";
                    }
                    // Show Modal
                    modal.style.display = 'flex';
                });
            });
        }

        // Close Modal
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close if clicking outside
        window.addEventListener('click', (e) => {
            if (e.target == modal) {
                modal.style.display = 'none';
            }
        });
    }

// ================= CONTACT FORM & BOOKING LOGIC ====================

    const bookingToggle = document.getElementById('booking-toggle');
    const bookingExtension = document.getElementById('booking-extension');
    const serviceSelect = document.getElementById('service-select');
    const bookingDateInput = document.getElementById('booking-date');
    const submitBtn = document.getElementById('submit-btn');

    if (bookingToggle && bookingExtension) {

        // 1. Toggle Functionality
        bookingToggle.addEventListener('change', function() {
            if (this.checked) {
                // Show Booking Form
                bookingExtension.style.display = 'block';
                submitBtn.innerText = "Confirm Booking & Send";
                serviceSelect.setAttribute('required', 'true'); // Make purpose mandatory
                bookingDateInput.setAttribute('required', 'true'); // Make date mandatory
            } else {
                // Hide Booking Form
                bookingExtension.style.display = 'none';
                submitBtn.innerText = "Send Message";
                serviceSelect.removeAttribute('required');
                bookingDateInput.removeAttribute('required');
            }
        });

        // 2. Auto-Fill from Configurator (Path 3)
        const urlParams = new URLSearchParams(window.location.search);
        const selectedPackage = urlParams.get('package');

        if (selectedPackage) {
            // A. Turn the toggle ON automatically
            bookingToggle.checked = true;
            bookingExtension.style.display = 'block';
            submitBtn.innerText = "Confirm Booking & Send";
            
            // B. Select the right package in dropdown
            for (let i = 0; i < serviceSelect.options.length; i++) {
                if (serviceSelect.options[i].value === selectedPackage) {
                    serviceSelect.selectedIndex = i;
                    break; 
                }
            }
        }

        // 3. Initialize Custom Flatpickr Calendar
        // (Replaces the basic browser calendar)
        
        flatpickr("#booking-date", {
            enableTime: true,
            dateFormat: "F j, Y at h:i K", // Format: "December 16, 2025 at 02:00 PM"
            minDate: "today", // Block past dates
            
            // LOGIC: Disable Weekends (Sat & Sun) to simulate "Unavailable Slots"
            disable: [
                function(date) {
                    // return true to disable
                    return (date.getDay() === 0 || date.getDay() === 6);
                }
            ],
            
            // Visuals
            time_24hr: false,
            defaultHour: 9,
            
            // Events
            onChange: function(selectedDates, dateStr, instance) {
                // If we needed extra logic (like checking a specific holiday), we could do it here
                document.getElementById('date-warning').style.display = 'none';
            }
        });
        
        // Note: We removed the old 'change' event listener because Flatpickr handles the UI logic now.
    }



});