import { data } from "./data.js";

export function getUniqueCategories(data) {
  const categories = [...new Set(data.map((product) => product.category))];
  return categories;
}

export function filterByCategory(data, category) {
  const filteredData = data.filter((product) => product.category === category);
  return filteredData;
}

export let currentData = [...data]; // Initialize with all data
export let currentFilter = null; // Track the current filter

export function setFilter(category) {
  currentFilter = category === "all" ? null : category;
}

export function applyFilter() {
  if (currentFilter) {
    return filterByCategory(currentData, currentFilter);
  } else {
    return currentData;
  }
}
