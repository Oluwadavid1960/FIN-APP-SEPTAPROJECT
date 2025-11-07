document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();
  
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirm = document.getElementById("confirm").value.trim();
  
    if (!name || !email || !password || !confirm) {
      alert("Please fill in all fields.");
      return;
    }
  
    if (password !== confirm) {
      alert("Passwords do not match.");
      return;
    }
  
    alert(`Welcome to FinTracker, ${name}! Your account has been created successfully.`);
    window.location.href = "index.html"; // Redirect to login page
  });
  