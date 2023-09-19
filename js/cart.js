import { data } from "./data.js";
import {
  formatCreditCard,
  validateCVV,
  validateExpiration,
  validateCardHolder,
  validateAndShowShippingForm,
} from "./creditCard.js";
import { populateStateSelect, displaySubmitMessage } from "./shipping.js"; // Replace the path with the actual path to your stateSelect.js file

export const cartItems = [];

// Function to add a product to the cart
export function addToCart(product) {
  const existingItem = cartItems.find((item) => item.product === product);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cartItems.push({ product, quantity: 1 });
  }

  updateCart(); // Update the cart display
  updateCartIconDigit(); // Update the cart icon digit
  updateTaxAndShippingElements();
  // Save the updated cartItems array to local storage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Function to increment item quantity
export function incrementQuantity(product) {
  const item = cartItems.find(
    (item) => item.product.productName === product.productName
  );
  if (item) {
    item.quantity++;
  }
  updateCart();
  updateCartIconDigit();
  updateTaxAndShippingElements();
  // Save the updated cartItems array to local storage
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}

// Function to decrement item quantity
export function decrementQuantity(product) {
  const itemIndex = cartItems.findIndex(
    (item) => item.product.productName === product.productName
  );
  if (itemIndex !== -1) {
    if (cartItems[itemIndex].quantity > 1) {
      cartItems[itemIndex].quantity--;
    } else {
      cartItems.splice(itemIndex, 1);
    }
    updateCart();
    updateCartIconDigit();
    updateTaxAndShippingElements();
    // Save the updated cartItems array to local storage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
}

export function updateCart() {
  const cartContainer = document.getElementById("cart-summary");

  cartContainer.innerHTML = "";

  cartItems.forEach((item) => {
    const product = item.product; // Get the product from the item

    // Create a list item for the product with image, name, price, quantity, and delete button
    const listItem = document.createElement("div");
    const { image, productName, craftsperson, category } = product;
    listItem.className = "ibox-content";
    listItem.innerHTML = `
      <div class="table-responsive">
        <table class="table table-bordered shoping-cart-table">
          <tbody>
            <tr  class="product-cart">
              <td class="align-middle w-100" style="margin: 0 auto;">
                <div class="d-flex justify-content-center align-items-center">
                  <img src="${image}" alt="${productName}" class="img-fluid item" style="max-height: 350px; max-width: 100%;">
                </div>
              </td>
              <td class="info">
                <div class="product-details">
                  <h3>${productName}</h3>
                  <p>
                    Craftsperson: <em class="craft">${craftsperson}</em>
                  </p>
                  <p class="mb-0">
                    Category: <em class="category">${category}</em>
                  </p>
                </div>
              </td>
              <td class="item-quantity align-middle">
                <div class="d-flex justify-content-center align-items-center">
                  <button class="btn btn-outline-primary increment-button" data-product='${JSON.stringify(
                    product
                  )}'>+</button>
                  <span class="quantity form-control text-center">${
                    item.quantity
                  }</span>
                  <button class="btn btn-outline-primary decrement-button" data-product='${JSON.stringify(
                    product
                  )}'>-</button>
                </div>
              </td>
              <td class="align-middle">
                <h4 class="cart-item-price">$${product.price}</h4>
              </td>
              <td class="align-middle">
                <div class="d-flex justify-content-center">
                  <button class="btn btn-outline-danger delete-button" data-product='${JSON.stringify(
                    product
                  )}'>
                    <img src="./assets/trash-fill.svg" alt="Delete">
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    // Append the list item to the cart container
    cartContainer.appendChild(listItem);

    // Add a click event listener to the delete button
    const deleteButton = listItem.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
      const product = JSON.parse(deleteButton.dataset.product);
      removeItemFromCart(product);
      updateTaxAndShippingElements();
    });
  });

  updateCartTotal();

  const incrementButtons = document.querySelectorAll(".increment-button");
  const decrementButtons = document.querySelectorAll(".decrement-button");

  incrementButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const product = JSON.parse(button.dataset.product);
      console.log(product);
      incrementQuantity(product);
    });
  });

  decrementButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const product = JSON.parse(button.dataset.product);
      decrementQuantity(product);
    });
  });
}

// Function to remove an item from the cart
export function removeItemFromCart(product) {
  const itemIndex = cartItems.findIndex(
    (item) => item.product.productName === product.productName
  );

  if (itemIndex !== -1) {
    cartItems.splice(itemIndex, 1);
    updateCart();
    updateCartIconDigit();
    // Save the updated cartItems array to local storage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
}

export function updateCartTotal() {
  const cartTotals = document.querySelectorAll(".cartTotal");

  const totalPrice = cartItems.reduce((total, item) => {
    return total + parseFloat(item.product.price) * item.quantity;
  }, 0);

  cartTotals.forEach((cartTotal) => {
    cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
  });
}

export function updateCartIconDigit() {
  const digitIcon = document.querySelector(".digit-icon");
  const cartItemsCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  if (cartItemsCount > 0) {
    digitIcon.style.display = "inline-block";
    digitIcon.textContent = cartItemsCount;
  } else {
    digitIcon.style.display = "none";
  }
}

const cartButton = document.getElementById("cart-container");
const shoppingCart = document.getElementById("shopping-cart");
const goBackButton = document.getElementById("go-back-button");

cartButton.addEventListener("click", () => {
  toggleShoppingCart();
});

goBackButton.addEventListener("click", () => {
  if (shoppingCart.classList.contains("showCart")) {
    toggleShoppingCart();
  }
});

function toggleShoppingCart() {
  shoppingCart.classList.toggle("showCart");
  document.body.classList.toggle("no-scroll");
}

// Function to select two random products from the data
export function getRandomProducts() {
  const randomProducts = [];
  const dataCopy = [...data]; // Create a copy to avoid modifying the original data

  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * dataCopy.length);
    const randomProduct = dataCopy.splice(randomIndex, 1)[0];
    randomProducts.push(randomProduct);
  }

  return randomProducts;
}

// Initialize the cart with items from local storage when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
  if (storedCartItems) {
    cartItems.length = 0;
    cartItems.push(...storedCartItems);
    updateCart();
    updateCartIconDigit();
  }
});

// Function to display two random products
export function displayRandomProducts() {
  // Get a reference to the container where you want to display the products
  const productContainer = document.getElementById("random-product");

  // Get two random products
  const randomProducts = getRandomProducts();

  // Iterate over the random products and create product items
  randomProducts.forEach((productData) => {
    // Extract product information
    const { image, productName, price } = productData;

    // Create a container for each product item
    const productItem = document.createElement("div");

    // Set the HTML content for the product item
    productItem.innerHTML = `
      <div class="d-flex align-items-center flex-column">
        <a href="#" class="product-name">${productName}</a>
        <img src="${image}" style="height: 100px; width: 100px" class="rounded m-4">
        <p>$${price}</p>
        <div class="m-t text-right">
        <button type="button" class="add-to-cart btn btn-outline-secondary btn-lg">Add Product</button>
        </div>
      </div>
      <hr>
    `;
    const addToCartButton = productItem.querySelector(".add-to-cart");
    const emptyCartMsg = document.getElementById("empty-cart-msg");

    addToCartButton.addEventListener("click", () => {
      addToCart(productData);
      emptyCartMsg.innerHTML = ``;
      updateTaxAndShippingElements();
    });

    // Append the product item to the product container
    productContainer.appendChild(productItem);
  });
}

// Call the function to display two random products
displayRandomProducts();

// Function to calculate tax and shipping fee based on subtotal
function calculateTax(subtotal) {
  const taxRate = 0.1; // 10% tax rate
  const tax = subtotal * taxRate;
  return tax;
}

export function updateTaxAndShippingElements() {
  const subtotalElement = document.querySelector(".cartTotal");
  const taxElement = document.querySelector(".tax");
  const shippingFeeElement = document.querySelector(".shipping-fee");
  const totalElement = document.querySelector(".total");

  const shipping = 14.99;
  const subtotal = parseFloat(subtotalElement.innerText.replace("$", ""));
  const tax = calculateTax(subtotal);

  if (subtotal > 0) {
    if (subtotal < 500) {
      shippingFeeElement.textContent = `$${shipping}`;
    } else {
      shippingFeeElement.innerHTML = `<p class="shipping">Free shipping</p>`;
    }

    taxElement.textContent = `$${tax.toFixed(2)}`;
    // Only add shipping fee to the total if it's not free
    const total = subtotal + (subtotal < 500 ? shipping : 0);
    totalElement.textContent = `$${(total + tax).toFixed(2)}`;
  } else {
    shippingFeeElement.textContent = "";
    totalElement.textContent = "";
    taxElement.textContent = "";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const creditCardInput = document.getElementById("credit-card");
  const expirationInput = document.getElementById("card-expiration");
  const cvvInput = document.getElementById("card-cvv");
  const cardHolderInput = document.getElementById("card-holder");

  // Add event listeners
  creditCardInput.addEventListener("input", formatCreditCard);
  expirationInput.addEventListener("input", validateExpiration);
  cvvInput.addEventListener("input", validateCVV);
  cardHolderInput.addEventListener("input", validateCardHolder);
});

// Call the updateTaxAndShippingElements function when the page loads and whenever the cart is updated
document.addEventListener("DOMContentLoaded", updateTaxAndShippingElements);

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", () => {
  populateStateSelect();
});
