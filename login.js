document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('client-login-form');
    const errorBanner = document.getElementById('login-error');

    // 1. Define the "Verified" Clients (Dummy Database)
    const verifiedClients = [
        {
            username: "astro",
            password: "password123",
            name: "Astro Malaysia"
        },
        {
            username: "burger",
            password: "password123",
            name: "BurgerJoint"
        },
        {
            username: "admin",
            password: "admin",
            name: "Digital Brain Admin"
        },
        {
            username: "neuro",
            password: "password123",
            name: "Neuroversiti"
        }
    ];

    // 2. Listen for Submit
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Stop page from refreshing

            const userInput = document.getElementById('username').value.trim();
            const passInput = document.getElementById('password').value.trim();

            // 3. Check Credentials
            const userFound = verifiedClients.find(client => 
                client.username === userInput && client.password === passInput
            );

            if (userFound) {
                // SUCCESS: Check if it is the Admin or a Client
                
                if (userFound.username === 'admin') {
                    // Redirect to Admin Portal
                    window.location.href = "admin.html";
                } else {
                    // Redirect to Client Dashboard
                    window.location.href = `dashboard.html?client=${encodeURIComponent(userFound.name)}`;
                }

            } else {
                // FAIL: Show Error
                errorBanner.style.display = "flex";
                errorBanner.innerHTML = `<i class="fas fa-exclamation-triangle"></i> Access Denied. User '${userInput}' is not verified.`;
                
                // Shake animation
                document.querySelector('.login-box').classList.add('shake');
                setTimeout(() => document.querySelector('.login-box').classList.remove('shake'), 500);
            }
        });
    }
});