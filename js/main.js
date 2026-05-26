document.addEventListener('DOMContentLoaded', () => {
  // 1. Target UI Elements
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search');
  const searchResultsContainer = document.getElementById('search-results');
  const categoryGrid = document.querySelector('.categories');
  const categoryItems = document.querySelectorAll('.categories li');

  // 2. Mock Database Data for Goods/Products
  // (You can easily map this over to fetch from your Supabase instance later!)
  const sampleProducts = [
    { name: 'Apples', category: 'Fresh Produce', link: 'fresh.html' },
    { name: 'Bananas', category: 'Fresh Produce', link: 'fresh.html' },
    { name: 'Beef Steak', category: 'Meat & Seafood', link: 'meat_seafood.html' },
    { name: 'Cheddar Cheese', category: 'Dairy & Eggs', link: 'dairy_eggs.html' },
    { name: 'Chocolate Chip Cookies', category: 'Snacks & Confectionery', link: 'snacks.html' },
    { name: 'Smartphone Pro', category: 'Electronics & Gadgets', link: 'phones.html' },
    { name: 'Denim Jacket', category: 'Clothing & Accessories', link: 'wears.html' },
    { name: 'Blender 5000', category: 'Kitchen Utensils', link: 'kitchen.html' }
  ];

  // 3. Search Handler Function
  function executeSearch() {
    const query = searchInput.value.toLowerCase().trim();

    // If input is empty, reset the view entirely
    if (query === '') {
      searchResultsContainer.classList.add('hidden');
      searchResultsContainer.innerHTML = '';
      categoryGrid.style.display = 'grid';
      categoryItems.forEach(item => item.style.display = 'block');
      return;
    }

    // --- Part A: Filter Categories on Screen ---
    let visibleCategoriesCount = 0;
    categoryItems.forEach(item => {
      const categoryText = item.textContent.toLowerCase();
      if (categoryText.includes(query)) {
        item.style.display = 'block';
        visibleCategoriesCount++;
      } else {
        item.style.display = 'none';
      }
    });

    // --- Part B: Search for Specific Goods ---
    const matchedProducts = sampleProducts.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.category.toLowerCase().includes(query)
    );

    // If we have specific product hits, display them cleanly above the grid
    if (matchedProducts.length > 0) {
      searchResultsContainer.classList.remove('hidden');
      searchResultsContainer.innerHTML = `
        <h3 class="results-heading">Matching Items Found</h3>
        <div class="results-grid">
          ${matchedProducts.map(prod => `
            <a href="${prod.link}" class="result-item">
              <span class="item-name">${prod.name}</span>
              <span class="item-cat-badge">${prod.category}</span>
            </a>
          `).join('')}
        </div>
      `;
    } else if (visibleCategoriesCount === 0) {
      // If nothing matches either categories OR goods
      searchResultsContainer.classList.remove('hidden');
      searchResultsContainer.innerHTML = `<p class="no-results">No items or categories match "${searchInput.value}"</p>`;
    } else {
      // Hide results container if only category grid elements match
      searchResultsContainer.classList.add('hidden');
    }
  }

  // 4. Listeners for Seamless Interactions
  // Updates matches instantly as the user types
  searchInput.addEventListener('input', executeSearch);

  // Prevents full page reloads if user presses enter or clicks the submit button
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    executeSearch();
  });
});