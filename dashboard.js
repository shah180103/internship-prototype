document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. LOGOUT LOGIC (Moved to Top for Safety)
    // ==========================================
    const logoutAction = (e) => {
        e.preventDefault();
        // In a real app, you would clear session/cookies here
        window.location.href = "login.html";
    };

    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logoutAction);
    }

    const mobileLogout = document.getElementById('mobile-logout-btn');
    if (mobileLogout) {
        mobileLogout.addEventListener('click', logoutAction);
    }

    // ==========================================
    // 2. GET CLIENT DATA
    // ==========================================
    const urlParams = new URLSearchParams(window.location.search);
    const clientName = urlParams.get('client') || "Guest";

    // DATABASE
    const database = {
        "Astro Malaysia": {
            logo: "astro_logo.png",
            metrics: {
                activeProjects: 3,
                pendingAmount: "RM 12,500",
                leads: 145,
                hoursUsed: "34 / 50"
            },
            manager: "Sarah Lee",
            projects: [
                { name: "Q4 Social Campaign", service: "Social Media", deadline: "Dec 20, 2025", status: "In Progress", progress: 75 },
                { name: "Website Revamp", service: "Web Dev", deadline: "Jan 15, 2026", status: "Review", progress: 90 },
                { name: "SEO Audit", service: "SEO", deadline: "Dec 25, 2025", status: "Pending", progress: 10 }
            ],
            invoices: [],
            updates: ["Campaign started successfully.", "SEO Audit phase 1 complete."]
        },
        "Neuroversiti": {
            logo: "neuro_logo.png",
            metrics: {
                activeProjects: 2,
                pendingAmount: "RM 4,500",
                leads: 12,
                hoursUsed: "10 / 40"
            },
            manager: "Digital Brain Admin",
            projects: [
                { name: "Neuroversiti Website", service: "Web Dev", deadline: "Dec 25, 2025", status: "In Progress", progress: 45 },
                { name: "Logo Redesign", service: "Branding", deadline: "Jan 10, 2026", status: "Started", progress: 20 }
            ],
            invoices: [
                { id: "#INV-001", date: "12 Dec 2025", amount: "RM 4,500", status: "Overdue" }
            ],
            updates: ["Homepage wireframe approved.", "Logo concepts sent for review."]
        },
        // ADDED FALLBACK FOR GUESTS
        "Guest": {
            logo: "",
            metrics: { activeProjects: 0, pendingAmount: "RM 0", leads: 0, hoursUsed: "0 / 0" },
            manager: "Sales Team",
            projects: [],
            invoices: [],
            updates: ["Welcome to Digital Brain! Please log in to see your projects."]
        }
    };

    // 3. Select Data based on Client Name
    // If client name from URL isn't in DB, fallback to "Guest"
    const data = database[clientName] || database["Guest"];

    // ==========================================
    // 3. RENDER DATA TO HTML
    // ==========================================
    
    // Header
    const nameDisplay = document.getElementById('client-name');
    if(nameDisplay) nameDisplay.textContent = clientName;

    // Logo (Only show if it exists)
    const logoImg = document.getElementById('client-logo');
    if(logoImg) {
        if(data.logo && data.logo !== "") {
            logoImg.src = data.logo;
            logoImg.style.display = "block";
        } else {
            logoImg.style.display = "none";
        }
    }

    // Metrics
    const mActive = document.getElementById('metric-active');
    if(mActive) mActive.textContent = data.metrics.activeProjects;

    const mPending = document.getElementById('metric-pending');
    if(mPending) mPending.textContent = data.metrics.pendingAmount;

    const mLeads = document.getElementById('metric-leads');
    if(mLeads) mLeads.textContent = data.metrics.leads;

    const mHours = document.getElementById('metric-hours');
    if(mHours) mHours.textContent = data.metrics.hoursUsed;

    // Manager
    const mgrName = document.getElementById('manager-name');
    if(mgrName) mgrName.textContent = data.manager;

    // Projects Table
    const projectTable = document.getElementById('project-table-body');
    if (projectTable) {
        projectTable.innerHTML = ""; // Clear current
        if (data.projects && data.projects.length > 0) {
            data.projects.forEach(proj => {
                const row = document.createElement('tr');
                
                // Status Color Logic
                let statusClass = "status-gray";
                if(proj.status === "In Progress" || proj.status === "Started") statusClass = "status-blue";
                if(proj.status === "Review") statusClass = "status-orange";
                if(proj.status === "Completed") statusClass = "status-green";

                row.innerHTML = `
                    <td><strong>${proj.name}</strong></td>
                    <td>${proj.service}</td>
                    <td>${proj.deadline}</td>
                    <td><span class="status-badge ${statusClass}">${proj.status}</span></td>
                    <td>
                        <div class="progress-bar-bg">
                            <div class="progress-bar-fill" style="width: ${proj.progress}%"></div>
                        </div>
                    </td>
                `;
                projectTable.appendChild(row);
            });
        } else {
            projectTable.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">No active projects found.</td></tr>`;
        }
    }

    // Invoices List
    const invoiceList = document.getElementById('invoice-list');
    if (invoiceList) {
        invoiceList.innerHTML = ""; // Clear current
        if (data.invoices && data.invoices.length > 0) {
            data.invoices.forEach(inv => {
                const isOverdue = inv.status === "Overdue";
                const div = document.createElement('div');
                div.className = "invoice-item";
                div.innerHTML = `
                    <div class="inv-details">
                        <span class="inv-id">${inv.id}</span>
                        <span class="inv-date">${inv.date}</span>
                    </div>
                    <div class="inv-amount">
                        <span>${inv.amount}</span>
                        <span class="badge ${isOverdue ? 'badge-red' : 'badge-gray'}">${inv.status}</span>
                    </div>
                `;
                invoiceList.appendChild(div);
            });
        } else {
            invoiceList.innerHTML = "<p style='color:#888; font-size:0.9rem;'>No pending invoices.</p>";
        }
    }

    // Updates List
    const updatesList = document.getElementById('updates-list');
    if (updatesList) {
        updatesList.innerHTML = ""; // Clear current
        if(data.updates && data.updates.length > 0) {
            data.updates.forEach(update => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-bell red-text"></i> ${update}`;
                updatesList.appendChild(li);
            });
        } else {
             updatesList.innerHTML = "<li>No recent updates.</li>";
        }
    }
});