export function sortByName(products) {
  const sortedData = [...products].sort((a, b) =>
    a.productName.localeCompare(b.productName)
  );
  return sortedData;
}

export function sortByPrice(products) {
  const sortedData = [...products].sort((a, b) => a.price - b.price);
  return sortedData;
}
