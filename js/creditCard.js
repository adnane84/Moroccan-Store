import { cartItems } from "./cart.js";

// Helper function to toggle the visibility of an element by ID
export function toggleElementVisibility(id) {
  const element = document.getElementById(id);
  if (element) {
    element.classList.toggle("hidden");
  }
}

// Helper function to clear an error message by class
function clearErrorMessage(className) {
  const errorElement = document.querySelector(className);
  if (errorElement) {
    errorElement.textContent = "";
  }
}

// Function to format credit card number
export function formatCreditCard() {
  const input = document.getElementById("credit-card");
  const value = input.value.replace(/\D/g, ""); // Remove non-digit characters
  const formattedValue = value
    .replace(/(\d{4})(?=\d)/g, "$1-")
    .substring(0, 19);
  input.value = formattedValue;
}

// Function to validate CVV
export function validateCVV() {
  const cvvInput = document.getElementById("card-cvv");
  const cvvValue = cvvInput.value.trim();
  const cvvError = document.querySelector(".cvv-error");

  cvvError.textContent = /^\d{3}$/.test(cvvValue)
    ? ""
    : "*CVV must be 3 digits.";
}

// Function to validate expiration date
export function validateExpiration() {
  const expirationInput = document.getElementById("card-expiration");
  const expirationValue = expirationInput.value.trim();
  const expirationError = document.querySelector(".expiration-error");
  const datePattern = /^(0[1-9]|1[0-2])\/(\d{2})$/;

  if (!datePattern.test(expirationValue)) {
    expirationError.textContent = "*Invalid format (MM/YY).";
    return;
  }

  const [inputMonth, inputYear] = expirationValue.split("/").map(Number);
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;

  if (
    inputYear < currentYear ||
    (inputYear === currentYear && inputMonth < currentMonth)
  ) {
    expirationError.textContent = "*Card has expired";
  } else {
    expirationError.textContent = "";
  }
}

// Function to validate cardholder name
export function validateCardHolder() {
  const cardHolderInput = document.getElementById("card-holder");
  const cardHolderValue = cardHolderInput.value.trim();
  const cardHolderError = document.querySelector(".card-holder-error");

  cardHolderError.textContent = /^[A-Za-z\s]+$/.test(cardHolderValue)
    ? ""
    : "*Cardholder name can only contain letters and spaces.";
}

// Function to validate all fields and show the shipping form if all validations pass
export function validateAndShowShippingForm() {
  const cvvError = document.querySelector(".cvv-error");
  const expirationError = document.querySelector(".expiration-error");
  const cardHolderError = document.querySelector(".card-holder-error");
  const submitError = document.querySelector(".sub-error");

  if (
    cvvError.textContent === "" &&
    expirationError.textContent === "" &&
    cardHolderError.textContent === ""
  ) {
    toggleElementVisibility("shippingForm");
  } else {
    submitError.innerHTML = `<span class="submit-error">*Please fix the errors in the form before submitting.</span>`;
  }
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  const checkoutButton = document.getElementById("checkoutButton");
  const submitBtn = document.getElementById("submit-button");
  const emptyCartMsg = document.getElementById("empty-cart-msg");

  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (cartItems.length === 0) {
        emptyCartMsg.innerHTML = `<h3>You cart is empty!</h3>`;
      } else {
        toggleElementVisibility("payment-form");
        emptyCartMsg.innerHTML = ``;
      }
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener("click", (event) => {
      event.preventDefault();
      validateCVV();
      validateExpiration();
      validateCardHolder();
      validateAndShowShippingForm();
    });
  }
});
