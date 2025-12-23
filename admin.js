// admin.js

// 1. Master Data (Same structure as dashboard.js)
// In a real app, this would be fetched from a server.
let database = {
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
        ]
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
        ]
    }
};

const clientDropdown = document.getElementById('clientDropdown');
const projectsContainer = document.getElementById('projects-rows');

// 2. Function to Load Data into Inputs
function loadClientData(clientName) {
    const data = database[clientName];
    if (!data) return;

    // Fill Metrics
    document.getElementById('mgr-name').value = data.manager;
    document.getElementById('metric-active').value = data.metrics.activeProjects;
    document.getElementById('metric-pending').value = data.metrics.pendingAmount;
    document.getElementById('metric-hours').value = data.metrics.hoursUsed;

    // Fill Projects Table
    projectsContainer.innerHTML = ''; // Clear existing
    data.projects.forEach((proj, index) => {
        addProjectRow(proj, index);
    });
}

// 3. Helper: Create Project Row
function addProjectRow(proj = {}, index = null) {
    const row = document.createElement('tr');
    
    // Default values if adding new
    const name = proj.name || "";
    const service = proj.service || "";
    const deadline = proj.deadline || "";
    const progress = proj.progress || 0;
    const status = proj.status || "Pending";

    row.innerHTML = `
        <td><input type="text" class="p-name" value="${name}" placeholder="Project Name"></td>
        <td><input type="text" class="p-service" value="${service}" placeholder="Service"></td>
        <td><input type="text" class="p-deadline" value="${deadline}" placeholder="Date"></td>
        <td>
            <select class="p-status status-select">
                <option value="Pending" ${status === 'Pending' ? 'selected' : ''}>Pending</option>
                <option value="In Progress" ${status === 'In Progress' ? 'selected' : ''}>In Progress</option>
                <option value="Review" ${status === 'Review' ? 'selected' : ''}>Review</option>
                <option value="Completed" ${status === 'Completed' ? 'selected' : ''}>Completed</option>
            </select>
        </td>
        <td>
            <div style="display:flex; align-items:center; gap:10px;">
                <input type="range" class="p-progress" min="0" max="100" value="${progress}" oninput="this.nextElementSibling.innerText = this.value + '%'">
                <span style="font-size:12px; width:35px;">${progress}%</span>
            </div>
        </td>
    `;
    projectsContainer.appendChild(row);
}

// 4. Function: Add Empty Row
function addNewProjectRow() {
    addProjectRow();
}

// 5. Function: Generate JSON (Save)
function generateJSON() {
    const selectedClient = clientDropdown.value;
    
    // Scrape data from inputs
    const updatedData = {
        metrics: {
            activeProjects: document.getElementById('metric-active').value,
            pendingAmount: document.getElementById('metric-pending').value,
            leads: 145, // Keeping static for now or add input
            hoursUsed: document.getElementById('metric-hours').value
        },
        manager: document.getElementById('mgr-name').value,
        projects: []
    };

    // Scrape projects table
    const rows = projectsContainer.querySelectorAll('tr');
    rows.forEach(row => {
        const proj = {
            name: row.querySelector('.p-name').value,
            service: row.querySelector('.p-service').value,
            deadline: row.querySelector('.p-deadline').value,
            status: row.querySelector('.p-status').value,
            progress: parseInt(row.querySelector('.p-progress').value)
        };
        if(proj.name) updatedData.projects.push(proj);
    });

    // Update the master database object
    // Note: We keep the logo from the original to avoid breaking images
    database[selectedClient] = { 
        ...database[selectedClient], 
        ...updatedData 
    };

    // Show the Output
    const outputBox = document.getElementById('code-output');
    outputBox.style.display = 'block';
    outputBox.textContent = "const database = " + JSON.stringify(database, null, 4) + ";";
    
    alert("Data Updated! Scroll down to copy the new Database code.");
}

// Event Listener for Dropdown Change
clientDropdown.addEventListener('change', (e) => {
    loadClientData(e.target.value);
});

// --- NEW LOGOUT LOGIC ADDED BELOW ---

document.addEventListener('DOMContentLoaded', () => {
    // Initial Data Load
    loadClientData(clientDropdown.value);

    // Logout Functionality
    const logoutBtn = document.getElementById('logout-btn');
    const mobileLogoutBtn = document.getElementById('mobile-logout-btn');

    const handleLogout = (e) => {
        e.preventDefault();
        // In a real app, destroy session here
        window.location.href = 'login.html';
    };

    if(logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if(mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);
});