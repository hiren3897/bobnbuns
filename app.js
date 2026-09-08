// Bob 'N' Buns App Client Script
document.addEventListener('DOMContentLoaded', () => {
  const categoriesContainer = document.getElementById('categoryPills');
  const menuContainer = document.getElementById('menuContainer');
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  const totalItemsCountEl = document.getElementById('totalItemsCount');

  let activeCategory = 'all';
  let searchQuery = '';

  // Render Category Filter Pills
  function renderCategories() {
    if (!categoriesContainer) return;
    
    let html = `
      <button class="cat-pill active" data-cat="all">
        <span>✨</span> All Items (${BOBNBUNS_DATA.items.length})
      </button>
    `;

    BOBNBUNS_DATA.categories.forEach(cat => {
      const count = BOBNBUNS_DATA.items.filter(item => item.category === cat.id).length;
      html += `
        <button class="cat-pill" data-cat="${cat.id}">
          <span>${cat.icon}</span> ${cat.name} (${count})
        </button>
      `;
    });

    categoriesContainer.innerHTML = html;

    categoriesContainer.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const cat = e.currentTarget.getAttribute('data-cat');
        setActiveCategory(cat);
      });
    });
  }

  function setActiveCategory(cat) {
    activeCategory = cat;
    document.querySelectorAll('.cat-pill').forEach(btn => {
      if (btn.getAttribute('data-cat') === cat) {
        btn.classList.add('active');
        btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } else {
        btn.classList.remove('active');
      }
    });
    renderMenu();
  }

  // Render Menu Items
  function renderMenu() {
    if (!menuContainer) return;

    let filteredItems = BOBNBUNS_DATA.items;

    if (activeCategory !== 'all') {
      filteredItems = filteredItems.filter(item => item.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      filteredItems = filteredItems.filter(item => 
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.tag && item.tag.toLowerCase().includes(q))
      );
    }

    if (totalItemsCountEl) {
      totalItemsCountEl.textContent = `${filteredItems.length} items found`;
    }

    if (filteredItems.length === 0) {
      menuContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <div style="font-size: 3rem; margin-bottom: 1rem;">🔍</div>
          <h3 style="font-size: 1.25rem; color: var(--text-primary); margin-bottom: 0.5rem;">No menu items found</h3>
          <p>Try searching for something else like "burger", "wrap", "fries", or "paneer"</p>
          <button class="btn btn-secondary" id="resetFilterBtn" style="margin-top: 1.25rem;">Show All Items</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetFilterBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          searchQuery = '';
          if (searchClearBtn) searchClearBtn.style.display = 'none';
          setActiveCategory('all');
        });
      }
      return;
    }

    // Group items by category
    const grouped = {};
    filteredItems.forEach(item => {
      if (!grouped[item.category]) grouped[item.category] = [];
      grouped[item.category].push(item);
    });

    let html = '';

    BOBNBUNS_DATA.categories.forEach(cat => {
      const itemsInCat = grouped[cat.id];
      if (!itemsInCat || itemsInCat.length === 0) return;

      html += `
        <section class="menu-category-block" id="cat-sec-${cat.id}">
          <div class="category-header">
            <div>
              <h2 class="category-title">
                <span>${cat.icon}</span> ${cat.name}
              </h2>
              <p class="category-desc">${cat.description}</p>
            </div>
            <div class="category-count">${itemsInCat.length} items</div>
          </div>
          <div class="menu-grid">
            ${itemsInCat.map(item => renderItemCard(item)).join('')}
          </div>
        </section>
      `;
    });

    menuContainer.innerHTML = html;
  }

  function renderItemCard(item) {
    const waPhone = BOBNBUNS_DATA.restaurant.whatsapp.replace(/[^0-9]/g, '');
    const waText = encodeURIComponent(`Hi Bob 'N' Buns! I would like to order: ${item.name}`);
    const waUrl = `https://wa.me/${waPhone}?text=${waText}`;

    let priceDisplay = '';
    if (item.hasSizes) {
      priceDisplay = `
        <div class="dual-price">
          <div class="dual-price-item">
            <span class="size-label">Medium</span>
            <span class="size-price">₹${item.priceMedium}</span>
          </div>
          <div class="dual-price-item">
            <span class="size-label">Large</span>
            <span class="size-price">₹${item.priceLarge}</span>
          </div>
        </div>
      `;
    } else {
      priceDisplay = `
        <div class="price-container">
          <span class="price-val">₹${item.price}</span>
        </div>
      `;
    }

    let badgeDisplay = '';
    if (item.tag) {
      badgeDisplay += `<span class="badge-tag">${item.tag}</span>`;
    }
    if (item.badge) {
      badgeDisplay += `<span class="badge-tag" style="background: rgba(22, 163, 74, 0.15); color: #4ade80; border-color: rgba(22, 163, 74, 0.3);">${item.badge}</span>`;
    }

    return `
      <article class="menu-card" data-item-id="${item.id}">
        <div>
          <div class="card-top">
            <div class="card-badges">
              <span class="veg-dot-icon" title="100% Pure Veg"></span>
              ${badgeDisplay}
            </div>
          </div>
          <h3 class="card-title">${item.name}</h3>
          <p class="card-description">${item.description || ''}</p>
        </div>
        <div class="card-bottom">
          ${priceDisplay}
          <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="card-order-btn" title="Order via WhatsApp">
            <span>💬</span> Order
          </a>
        </div>
      </article>
    `;
  }

  // Search input listeners
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchClearBtn) {
        searchClearBtn.style.display = searchQuery ? 'block' : 'none';
      }
      renderMenu();
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchClearBtn.style.display = 'none';
      searchInput.focus();
      renderMenu();
    });
  }

  // Initial render
  renderCategories();
  renderMenu();
});

