const openBtn = document.getElementById("openformbtn");
const modal = document.getElementById("budgetform");
const modalCenter = document.querySelector(".modal-center");
const closeBtn = document.getElementById("closebtn");

openBtn.onclick = () => modal.style.display = "block";
closeBtn.onclick = () => modal.style.display = "none";

// Close modal if user clicks outside the modal
window.onclick = (e) => {
  if (e.target === modalCenter) {
    modal.style.display = "none";
  }
};

