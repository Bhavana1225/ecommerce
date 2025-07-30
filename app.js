document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.getElementById("productGrid");
  const priceFilter = document.getElementById("priceFilter");
  const priceValue = document.getElementById("priceValue");

  // Assuming products is defined globally via data.js
  // Get 'category' from URL params
  const params = new URLSearchParams(window.location.search);
  const selectedCategory = params.get("category");

  // Filter products by category if present
  let filteredByCategory = selectedCategory
    ? products.filter(p => p.category === selectedCategory)
    : products;

  // Set max price slider based on filtered category
  const maxPriceFromCategory = filteredByCategory.length > 0
    ? Math.max(...filteredByCategory.map(p => p.price))
    : 100000; // fallback max price if no products found

  priceFilter.max = maxPriceFromCategory;
  priceFilter.value = maxPriceFromCategory;
  priceValue.textContent = maxPriceFromCategory;

  function renderProducts(maxPrice) {
    productGrid.innerHTML = '';

    const filtered = filteredByCategory.filter(p => p.price <= maxPrice);

    if (filtered.length === 0) {
      productGrid.innerHTML = '<p>No products found.</p>';
      return;
    }

    filtered.forEach(product => {
      const card = document.createElement('div');
      card.className = 'product-card';

      card.innerHTML = `
        <a href="product-details.html?id=${product.id}" class="product-link">
          <img src="${product.image}" alt="${product.name}" />
          <div class="product-name">${product.name}</div>
          <div class="product-price">₹${product.price}</div>
        </a>
      `;
      productGrid.appendChild(card);
    });
  }

  priceFilter.addEventListener('input', () => {
    const val = Number(priceFilter.value);
    priceValue.textContent = val;
    renderProducts(val);
  });

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const total = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById("cart-count");
    if (cartCount) cartCount.textContent = total;
  }
  updateCartCount();

  // Initial render
  renderProducts(priceFilter.value);
});

