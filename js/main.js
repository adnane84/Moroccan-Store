import { data } from "./data.js";
import { navbar, createNavbar } from "./navbar.js";
import { sortByName, sortByPrice } from "./sorting.js";
import { getUniqueCategories, filterByCategory } from "./filter.js";
import { setupSearch } from "./search.js";
import { addToCart, getRandomProducts, cartItems } from "./cart.js";
import { scrollTo } from "./scroll.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("products-container");
  const sortButton = document.getElementById("sortButton");
  const sortPrice = document.getElementById("sortButtonPrice");
  const categoryFilter = document.getElementById("post-category");
  const header = document.getElementById("header");
  const contact = document.getElementById("contact");
  const footer = document.getElementById("footer");
  let currentData = [...data];
  let currentFilter = null;
  let searchQuery = "";

  function createCards(product) {
    const card = document.createElement("div");
    card.className = "col-md-4"; // Adjust the column size for different screen sizes
    const { productName, price, craftsperson, image, description } = product;
    card.innerHTML = `
      <div class="card shadow">
        <img type="button" src="./assets/new-window.png" class="view-details"></img>
        <img src="${image}" class="card-img-top rounded" alt="${craftsperson}" style="height:400px">
        <div class="card-body">
          <h5 class="card-title">${productName}</h5>
          <p class="card-text">${description}</p>
          <div class="product-info">
            <button type="button" class="add-to-cart btn btn-outline-secondary btn-lg">Add Product</button>
            <h4>$${price}</h4>
          </div>
        </div>
      </div>
    `;

    const viewDetailsButton = card.querySelector(".view-details");
    const addToCartButton = card.querySelector(".add-to-cart");

    viewDetailsButton.addEventListener("click", () => {
      const popup = createPopup(product);
      document.body.appendChild(popup);
      popup.style.display = "block";
    });

    addToCartButton.addEventListener("click", () => {
      addToCart(product); // Call the addToCart function with the current product
    });

    return card;
  }

  function createPopup(product) {
    const popup = document.createElement("div");
    popup.className = "product-popup container";
    const { productName, price, craftsperson, image, description } = product;
    popup.innerHTML = `
      <div class="popup-content card mb-3 row">
     <div class = "col popup-image">
     <img src="${image}" alt="${craftsperson}">
     </div>
      <div class="popup-info col">
      <h2 class="popup-title">${productName}</h2>
      <p class="card-title">Brand: ${craftsperson}</p>
      <p class="popup-text">Description: ${description}</p>
      <h4>Price: $${price}</h4>
      <button type="button" class="add-to-cart btn btn-outline-primary btn-lg">Add to Cart</button>
      <button type="button" class="close-popup btn-close btn-lg"></button>
      </div>
      </div>
    `;

    const hideElements = () => {
      const elementsToHide = [
        contact,
        footer,
        header,
        categoryFilter,
        container,
        searchBar,
      ];
      elementsToHide.forEach((element) => {
        element.style.opacity = 0;
      });
      document.body.classList.add("body-no-scroll");
    };

    const showElements = () => {
      const elementsToShow = [
        contact,
        footer,
        header,
        categoryFilter,
        container,
        searchBar,
      ];
      elementsToShow.forEach((element) => {
        element.style.opacity = 1;
      });
      document.body.classList.remove("body-no-scroll");
    };

    const closePopup = () => {
      popup.style.display = "none";
      showElements();
    };

    const addToCartHandler = () => {
      addToCart(product);
    };

    const closePopupButton = popup.querySelector(".close-popup");
    closePopupButton.addEventListener("click", closePopup);

    const addToCartButton = popup.querySelector(".add-to-cart");
    addToCartButton.addEventListener("click", addToCartHandler);

    // Initial hide of elements
    hideElements();

    return popup;
  }

  function clearCard() {
    container.innerHTML = "";
  }

  function displayCards(products) {
    clearCard();
    products.forEach((product) => {
      const card = createCards(product);
      container.appendChild(card);
    });
  }

  categoryFilter.addEventListener("click", handleCategoryFilter);

  const searchBar = document.getElementById("searchBar");
  if (searchBar) {
    searchBar.value = ""; // Clear the search input field on page load
  }

  categoryFilter.addEventListener("click", (event) => {
    const selectedCategory = event.target.getAttribute("data-category");

    // Remove the "active-filter" class from any previously active button
    const activeButton = document.querySelector(".filter-button.active-filter");
    if (activeButton) {
      activeButton.classList.remove("active-filter");
    }

    // Add the "active-filter" class to the clicked button
    event.target.classList.add("active-filter");

    currentFilter = selectedCategory === "all" ? null : selectedCategory;
    displayFilteredOrAllData();
  });

  // Create and display the list of filters
  function createCategoryFilters() {
    const categories = getUniqueCategories(data);
    categoryFilter.innerHTML = `
    <div class="col-md-4 button-30 filter" role="presentation" data-category="all">All</div>
    ${categories
      .map(
        (category) =>
          `<div class="col-md-4 button-30 filter"  role="presentation" data-category="${category}">${category}</div>`
      )
      .join("")}
  `;
  }

  // Filter products by selected category
  function handleCategoryFilter(event) {
    const selectedCategory = event.target.getAttribute("data-category");
    if (selectedCategory === "all") {
      displayCards(data);
    } else {
      const filteredData = filterByCategory(data, selectedCategory);
      displayCards(filteredData);
    }
  }

  function displayFilteredOrAllData() {
    let filteredData = currentData;

    if (currentFilter) {
      filteredData = filterByCategory(currentData, currentFilter);
    }

    if (searchQuery) {
      filteredData = filteredData.filter((product) =>
        product.productName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    displayCards(filteredData);
  }

  sortButton.addEventListener("click", () => {
    currentData = sortByName(currentData, true); // Assuming ascending by default
    displayFilteredOrAllData();
  });

  sortPrice.addEventListener("click", () => {
    currentData = sortByPrice(currentData, true); // Assuming ascending by default
    displayFilteredOrAllData();
  });

  categoryFilter.addEventListener("click", handleCategoryFilter);

  // Function to initialize the cart with items from local storage
  function initializeCartFromLocalStorage() {
    const storedCartItems = JSON.parse(localStorage.getItem("cartItems"));
    if (storedCartItems) {
      cartItems.length = 0;
      cartItems.push(...storedCartItems);
      // Call other functions to update the cart display and perform other tasks.
    }
  }

  // Initialize the cart from local storage when the page loads
  initializeCartFromLocalStorage();
  createCategoryFilters();
  displayCards(data);
  setupSearch();
  getRandomProducts();
});
