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

  // Toggle on click
  toggleBtn.addEventListener('click', ()=>{
    const isDark = root.getAttribute('data-theme') === 'dark';
    setDark(!isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  });

  // Keyboard shortcut: press "D" (case-insensitive)
  window.addEventListener('keydown', (e)=>{
    if(e.key && e.key.toLowerCase() === 'd' && !/input|textarea|select/i.test(document.activeElement.tagName)){
      toggleBtn.click();
    }
  });
    
    //Optional: respond to system theme changes if user hasn't explicitly chosen
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e)=>{
    if(!localStorage.getItem('theme')) {
      setDark(e.matches);
    }
  });
})();


  
