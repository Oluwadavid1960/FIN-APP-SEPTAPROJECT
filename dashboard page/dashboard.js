// Simple interactivity for buttons

document.querySelector(".add-wallet").addEventListener("click", () => {
    alert("Add new wallet feature coming soon!");
  });
  
  document.querySelector(".connect-bank").addEventListener("click", () => {
    alert("Redirecting to bank connection...");
    window.location.href = "../html/card.html"; // example redirect
  });
  
  // Date range validation example
  const startDate = document.getElementById("start-date");
  const endDate = document.getElementById("end-date");
  
  endDate.addEventListener("change", () => {
    if (new Date(endDate.value) < new Date(startDate.value)) {
      alert("End date cannot be before start date!");
      endDate.value = startDate.value;
    }
  });

// Idle time before logout (in milliseconds)
const IDLE_LIMIT = 5 * 60 * 1000; // 5 minutes

let idleTimer;

// Reset idle timer on user activity
function resetIdleTimer() {
    clearTimeout(idleTimer);

    idleTimer = setTimeout(() => {
        logout();
    }, IDLE_LIMIT);
}

// Logout function (redirect or clear user data)
function logout() {
    // Clear saved login (optional)
    localStorage.removeItem("savedEmail");

    // Redirect to login page
    window.location.href = "login.html";

     const ctx = document.getElementById('myChart').getContext('2d');

        new Chart(ctx, {
            type: 'bar', // change to line, pie, doughnut, etc.
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue (₦)',
                    data: [120000, 150000, 100000, 180000, 200000, 170000],
                    borderWidth: 2,
                    backgroundColor: 'rgba(54, 162, 235, 0.4)',
                    borderColor: 'rgba(54, 162, 235, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true }
                }
            }
        });


    // OR call backend logout:
    fetch("/logout").then(() => window.location.href = "/login");
}

// // Detect user activity
window.onload = () => {
    resetIdleTimer();

    // Activity types
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("click", resetIdleTimer);
    window.addEventListener("scroll", resetIdleTimer);
    window.addEventListener("touchstart", resetIdleTimer);
};

(function(){
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const iconPath = document.getElementById('iconPath');

  // helpers
  function setDark(dark){
    if(dark){
      root.setAttribute('data-theme','dark');
      toggleBtn.setAttribute('aria-pressed','true');
      // moon icon (simpler path for clarity)
      iconPath.setAttribute('d','M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z');
    } else {
      root.removeAttribute('data-theme');
      toggleBtn.setAttribute('aria-pressed','false');
      // sun icon
      iconPath.setAttribute('d','M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4M12 7a5 5 0 100 10 5 5 0 000-10z');
    }
  }

// Read saved preference
  const saved = localStorage.getItem('theme'); // 'dark' | 'light' or null
  if(saved === 'dark') {
    setDark(true);
  } else if(saved === 'light') {
    setDark(false);
  } else {
    // follow system preference (initial paint handled by CSS via prefers-color-scheme)
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(prefersDark);
  }

    const toggle = document.getElementById("darkModeToggle");
toggle.addEventListener("change", () => 
{
    document.body.classList.toggle("dark", toggle.checked);
});
  
/*
     Simple theme toggler:
     - Uses document.documentElement.dataset.theme = "dark" or removed for light
     - Persists choice to localStorage under 'theme' key
     - Respects system preference if no saved value
    */
    
    const storageKey = 'theme'; // 'light' | 'dark'
    const root = document.documentElement;
    const toggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');
    const currentThemeText = document.getElementById('currentTheme');
    
    function applyTheme(name){
      if(name === 'dark'){
        root.dataset.theme = 'dark';
        toggleBtn.setAttribute('aria-pressed','true');
        themeIcon.textContent = '🌙';
        themeLabel.textContent = 'Dark';
      } else {
        root.removeAttribute('data-theme');
        toggleBtn.setAttribute('aria-pressed','false');
        themeIcon.textContent = '☀';
        themeLabel.textContent = 'Light';
      }
      currentThemeText.textContent = name || 'system';
    }
    
    /* read saved preference */
    const saved = localStorage.getItem(storageKey);
    if(saved === 'dark' || saved === 'light'){
      applyTheme(saved);
    } else {
      // no saved value -> use system preference (but show 'system' on label)
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
      // show current as 'system' to indicate it's from OS (optional)
      currentThemeText.textContent = 'system (' + (prefersDark ? 'dark' : 'light') + ')';
    }
    
    /* toggle handler */
    toggleBtn.addEventListener('click', () => {
      // determine current effective theme
      const isDark = root.dataset.theme === 'dark';
      const next = isDark ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem(storageKey, next);
    });
    
    /* optional: listen for system changes and update only if user has not saved a preference */
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      if(!localStorage.getItem(storageKey)){
        applyTheme(e.matches ? 'dark' : 'light');
        currentThemeText.textContent = 'system (' + (e.matches ? 'dark' : 'light') + ')';
      }
    });

  
