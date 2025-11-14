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

    // OR call backend logout:
    // fetch("/logout").then(() => window.location.href = "/login");
}

// Detect user activity
window.onload = () => {
    resetIdleTimer();

    // Activity types
    window.addEventListener("mousemove", resetIdleTimer);
    window.addEventListener("keydown", resetIdleTimer);
    window.addEventListener("click", resetIdleTimer);
    window.addEventListener("scroll", resetIdleTimer);
    window.addEventListener("touchstart", resetIdleTimer);
};
  
