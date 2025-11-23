document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".btn-delete");

  deleteButtons.forEach(btn => {
    btn.addEventListener("click", function () {
      // find the closest parent <li class="categories-item">
      const categoryItem = this.closest(".categories-item");

      // Optional: confirm before deleting
      if (confirm("Are you sure you want to delete this category?")) {
        categoryItem.remove();
      }
    });
  });
});

function formatAmount(input) {
    // Remove all non-digit characters
    let value = input.value.replace(/\D/g, "");

    // Format with commas
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Update input
    input.value = value;
}
