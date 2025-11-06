// Simple interactivity for buttons

document.querySelector(".add-wallet").addEventListener("click", () => {
    alert("Add new wallet feature coming soon!");
  });
  
  document.querySelector(".connect-bank").addEventListener("click", () => {
    alert("Redirecting to bank connection...");
    window.location.href = "connect-bank.html"; // example redirect
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
  