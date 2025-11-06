document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
  
    if (!email || !password) {
      alert("Please fill in both email and password.");
      return;
    }
  
    // Simulated login
    alert(`Welcome back! ${email}!`);
    window.location.href = "dashboard.html"; // redirect example
  });
  