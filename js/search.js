export function setupSearch() {
  const searchBar = document.getElementById("searchBar");
  const allCards = document.querySelectorAll(".post-card");

  searchBar.addEventListener("keyup", (e) => {
    const searchValue = e.target.value.toLowerCase();

    allCards.forEach((card) => {
      const cardTitle = card.querySelector(".card-title").innerText.toLowerCase();

      if (cardTitle.includes(searchValue)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
};
