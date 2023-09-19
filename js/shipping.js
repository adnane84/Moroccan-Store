import { toggleElementVisibility } from "./creditCard.js";

export function populateStateSelect() {
  // Example of populating the select element with states
  const states = [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
  ];

  // You can use this "states" array to populate your state select element.

  const stateSelect = document.getElementById("state");

  states.forEach((state) => {
    const option = document.createElement("option");
    option.value = state;
    option.text = state;
    stateSelect.appendChild(option);
  });

  // Add form submission validation
  const form = document.getElementById("shippingForm");
  form.addEventListener("submit", function (event) {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const city = document.getElementById("city").value;
    const zipCode = document.getElementById("zipCode").value;

    if (!/^[A-Za-z]+$/.test(firstName)) {
      alert("First name should contain letters only.");
      event.preventDefault();
    }

    if (!/^[A-Za-z]+$/.test(lastName)) {
      alert("Last name should contain letters only.");
      event.preventDefault();
    }

    if (!/^[A-Za-z]+$/.test(city)) {
      alert("City should contain letters only.");
      event.preventDefault();
    }

    if (!/^\d{5}$/.test(zipCode)) {
      alert("Zip code should contain exactly 5 digits.");
      event.preventDefault();
    }
  });
}

// Function to generate a random 10-digit order number
function generateOrderNumber() {
  const characters = "0123456789";
  const orderNumber =
    "#" +
    Array.from(
      { length: 10 },
      () => characters[Math.floor(Math.random() * characters.length)]
    ).join("");
  return orderNumber;
}

// Function to display a message when the "Submit" button is clicked
export function displaySubmitMessage() {
  const submitButton = document.getElementById("submit-shipping");
  const successMessage = document.getElementById("shippingSuccessMessage");

  submitButton.addEventListener("click", () => {
    const orderNumber = generateOrderNumber();
    const shoppingMsg = document.createElement("div");
    shoppingMsg.classList = "shipping-message";
    shoppingMsg.style.display = "block";
    shoppingMsg.innerHTML = `
    <h3 class="custom-font">Shipping information </br> submitted successfully!</h3>
    <h4 class="custom-font">Thank You</h4>
    <p class="custom-font">Order Number: <span id="orderNumber">${orderNumber}</span></p>
    `;

    successMessage.appendChild(shoppingMsg);
    // Optionally, you can clear the form fields after displaying the message
    clearFormFields();
  });
}

// Function to clear form fields
function clearFormFields() {
  const shipping = document.querySelector(".shipping");
  shipping.classList.add("hidden");
  toggleElementVisibility("payment-form");
}

// Call the displaySubmitMessage function when the page loads
document.addEventListener("DOMContentLoaded", displaySubmitMessage);
