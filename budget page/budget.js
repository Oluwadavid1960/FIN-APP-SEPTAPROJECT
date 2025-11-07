const openBtn = document.getElementById("openFormBtn");
const modal = document.getElementById("budgetForm");
const closeBtn = document.getElementById("closeBtn");

openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";

// Close modal if user clicks outside the modal
window.onclick = (e) => {
  if (e.target == modal) {
    modal.style.display = "none";
  }
};

