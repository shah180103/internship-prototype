// --- Global State ---
let selectedGoal = null;
let currentBudget = 5000;

// 1. Handle "Pill" Selection (Single Choice)
function selectPill(group, value, btn) {
    selectedGoal = value;
    
    // Remove 'active' from all siblings
    let siblings = btn.parentElement.children;
    for (let sibling of siblings) {
        sibling.classList.remove('active');
    }
    // Add 'active' to clicked button
    btn.classList.add('active');
}

// 2. Handle "Toggle" Selection (Multi Choice - Optional)
function togglePill(btn) {
    btn.classList.toggle('active');
}

// 3. Update Budget Display
function updateBudgetDisplay(val) {
    currentBudget = parseInt(val);
    document.getElementById('budgetText').innerText = "RM " + currentBudget.toLocaleString();
}

// 4. MAIN LOGIC: Find & Slide to Package
function findPackage() {
    
    // Safety Check
    if (!selectedGoal) {
        alert("Please select a goal first.");
        return;
    }

    let targetCardId = "";

    // --- LOGIC ENGINE ---
    if (currentBudget < 3000) {
        targetCardId = "card-kickstarter";
    } else if (currentBudget >= 8000) {
        targetCardId = "card-enterprise";
    } else {
        // Mid Budget Logic
        if (selectedGoal === 'sales') {
            targetCardId = "card-growth";
        } else {
            targetCardId = "card-authority";
        }
    }

    // --- SLIDE ANIMATION ---
    scrollToCard(targetCardId);
}

// Helper: Moves the track to show the correct card
function scrollToCard(cardId) {
    const track = document.getElementById('cardsTrack');
    const cards = Array.from(track.children);
    const targetIndex = cards.findIndex(card => card.id === cardId);

    if (targetIndex !== -1) {
        const movePercent = targetIndex * -100; 
        track.style.transform = `translateX(${movePercent}%)`;

        // UPDATE THIS LINE:
        cards.forEach(c => c.classList.remove('active-card'));
        cards[targetIndex].classList.add('active-card');
    }
}

// Initialize: Show the first card (Placeholder) on load
document.addEventListener('DOMContentLoaded', () => {
    // Add 'active-card' to the placeholder so it's visible
    const placeholder = document.getElementById('card-default');
    if(placeholder) placeholder.classList.add('active-card');
});