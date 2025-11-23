document.getElementById("age").addEventListener("Save Changes"
const dob = new Date("2008-11-15"); // example date of birth
const today = new Date();

let age = today.getFullYear() - dob.getFullYear();
const monthDiff = today.getMonth() - dob.getMonth();
const dayDiff = today.getDate() - dob.getDate();

if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
  age--;
}

if (age < 18) {
  alert("You must be 18 years or older");
}
)
