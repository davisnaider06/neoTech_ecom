// Mock data
const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: "R$ 8.999,00",
    originalPrice: "R$ 9.999,00",
    image: "assets/images/iphone-15.png",
    category: "Smartphones",
    rating: 4.8,
    reviews: 1247,
    inStock: true,
    isNew: true,
  },
  {
    id: 2,
    name: "MacBook Pro",
    price: "R$ 12.999,00",
    originalPrice: null,
    image: "assets/images/macbook-pro.png",
    category: "Laptops",
    rating: 4.9,
    reviews: 892,
    inStock: true,
    isNew: false,
  },
  {
    id: 3,
    name: "Samsung Galaxy S24 Ultra",
    price: "R$ 7.499,00",
    originalPrice: "R$ 8.299,00",
    image: "assets/images/samsung-s24.png",
    category: "Smartphones",
    rating: 4.7,
    reviews: 2156,
    inStock: true,
    isNew: true,
  },
  {
    id: 4,
    name: "Dell XPS 13",
    price: "R$ 6.999,00",
    originalPrice: null,
    image: "assets/images/dell.png",
    category: "Laptops",
    rating: 4.6,
    reviews: 543,
    inStock: false,
    isNew: false,
  },
  {
    id: 5,
    name: "AirPods Pro 2",
    price: "R$ 1.899,00",
    originalPrice: "R$ 2.199,00",
    image: "assets/images/airpods.png",
    category: "Acessórios",
    rating: 4.8,
    reviews: 3421,
    inStock: true,
    isNew: false,
  },
  {
    id: 6,
    name: "iPad Pro M2",
    price: "R$ 8.499,00",
    originalPrice: null,
    image: "assets/images/tablet.png",
    category: "Tablets",
    rating: 4.7,
    reviews: 1876,
    inStock: true,
    isNew: false,
  },
]

const categories = [
  { name: "Smartphones", count: 45, image: "assets/images/smartphone-category.png" },
  { name: "Laptops", count: 32, image: "assets/images/laptop-category.png" },
  { name: "Tablets", count: 28, image: "assets/images/tablet-category.png" },
  { name: "Acessórios", count: 156, image: "assets/images/tech-accessories-category.png" },
]

// State
let cartItems = []
let searchQuery = ""
let selectedCategory = "Todos"

// DOM Elements
const cartBtn = document.getElementById("cartBtn")
const cartSidebar = document.getElementById("cartSidebar")
const cartOverlay = document.getElementById("cartOverlay")
const cartClose = document.getElementById("cartClose")
const cartBadge = document.getElementById("cartBadge")
const cartSubtitle = document.getElementById("cartSubtitle")
const cartContent = document.getElementById("cartContent")
const cartFooter = document.getElementById("cartFooter")
const totalPrice = document.getElementById("totalPrice")
const searchInput = document.getElementById("searchInput")
const mobileSearchInput = document.getElementById("mobileSearchInput")
const categoriesGrid = document.getElementById("categoriesGrid")
const productsGrid = document.getElementById("productsGrid")
const categoryFilters = document.getElementById("categoryFilters")
const productsTitle = document.getElementById("productsTitle")

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderCategories()
  renderCategoryFilters()
  renderProducts()
  setupEventListeners()
})

// Event Listeners
function setupEventListeners() {
  // Cart sidebar
  cartBtn.addEventListener("click", openCart)
  cartClose.addEventListener("click", closeCart)
  cartOverlay.addEventListener("click", closeCart)

  // Search
  searchInput.addEventListener("input", handleSearch)
  mobileSearchInput.addEventListener("input", handleSearch)

  // Sync search inputs
  searchInput.addEventListener("input", () => {
    mobileSearchInput.value = searchInput.value
  })
  mobileSearchInput.addEventListener("input", () => {
    searchInput.value = mobileSearchInput.value
  })
}

// Cart Functions
function openCart() {
  cartSidebar.classList.add("open")
  cartOverlay.classList.add("open")
  document.body.style.overflow = "hidden"
}

function closeCart() {
  cartSidebar.classList.remove("open")
  cartOverlay.classList.remove("open")
  document.body.style.overflow = ""
}

function addToCart(product) {
  const existingItem = cartItems.find((item) => item.id === product.id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cartItems.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
    })
  }

  updateCartUI()
}

function removeFromCart(productId) {
  cartItems = cartItems.filter((item) => item.id !== productId)
  updateCartUI()
}

function updateQuantity(productId, newQuantity) {
  if (newQuantity === 0) {
    removeFromCart(productId)
    return
  }

  const item = cartItems.find((item) => item.id === productId)
  if (item) {
    item.quantity = newQuantity
    updateCartUI()
  }
}

function getTotalItems() {
  return cartItems.reduce((total, item) => total + item.quantity, 0)
}

function getTotalPrice() {
  return cartItems.reduce((total, item) => {
    const price = Number.parseFloat(item.price.replace("R$ ", "").replace(".", "").replace(",", "."))
    return total + price * item.quantity
  }, 0)
}

function updateCartUI() {
  const totalItems = getTotalItems()
  const total = getTotalPrice()

  // Update badge
  cartBadge.textContent = totalItems
  cartBadge.style.display = totalItems > 0 ? "flex" : "none"

  // Update subtitle
  cartSubtitle.textContent = `${totalItems} ${totalItems === 1 ? "item" : "itens"} no carrinho`

  // Update content
  if (cartItems.length === 0) {
    cartContent.innerHTML = '<p class="cart-empty">Seu carrinho está vazio</p>'
    cartFooter.style.display = "none"
  } else {
    cartContent.innerHTML = cartItems
      .map(
        (item) => `
            <div class="cart-item fade-in">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price}</div>
                </div>
                <div class="cart-item-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remover</button>
                </div>
            </div>
        `,
      )
      .join("")

    cartFooter.style.display = "block"
    totalPrice.textContent = `R$ ${total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
  }
}

// Search Functions
function handleSearch(e) {
  searchQuery = e.target.value
  renderProducts()
}

// Filter Functions
function setCategory(category) {
  selectedCategory = category
  productsTitle.textContent = category === "Todos" ? "Produtos" : category
  renderProducts()
  updateCategoryFilters()
}

function updateCategoryFilters() {
  const buttons = categoryFilters.querySelectorAll(".filter-btn")
  buttons.forEach((btn) => {
    if (btn.textContent === selectedCategory) {
      btn.classList.add("active")
    } else {
      btn.classList.remove("active")
    }
  })
}

// Render Functions
function renderCategories() {
  categoriesGrid.innerHTML = categories
    .map(
      (category, index) => `
        <div class="category-card hover-glow fade-in" 
             style="animation-delay: ${index * 0.1}s"
             onclick="setCategory('${category.name}')">
            <img src="${category.image}" alt="${category.name}" class="category-image">
            <div class="category-name">${category.name}</div>
            <div class="category-count">${category.count} produtos</div>
        </div>
    `,
    )
    .join("")
}

function renderCategoryFilters() {
  const allCategories = ["Todos", ...categories.map((cat) => cat.name)]

  categoryFilters.innerHTML = allCategories
    .map(
      (category) => `
        <button class="filter-btn hover-glow ${category === selectedCategory ? "active" : ""}" 
                onclick="setCategory('${category}')">
            ${category}
        </button>
    `,
    )
    .join("")
}

function renderProducts() {
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  productsGrid.innerHTML = filteredProducts
    .map(
      (product, index) => `
        <div class="product-card hover-glow fade-in" style="animation-delay: ${index * 0.1}s">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                ${product.isNew ? '<div class="product-badge badge-new">Novo</div>' : ""}
                ${!product.inStock ? '<div class="product-badge badge-out-of-stock">Esgotado</div>' : ""}
            </div>
            
            <div class="product-content">
                <div class="product-header">
                    <div class="product-info">
                        <h4>${product.name}</h4>
                        <div class="product-category">${product.category}</div>
                    </div>
                    <button class="favorite-btn hover-glow">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
                
                <div class="product-rating">
                    <div class="star-rating">
                        <svg class="star" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                        <span class="rating-text">${product.rating}</span>
                    </div>
                    <span class="reviews-count">(${product.reviews} avaliações)</span>
                </div>
                
                <div class="product-pricing">
                    <span class="current-price">${product.price}</span>
                    ${product.originalPrice ? `<span class="original-price">${product.originalPrice}</span>` : ""}
                </div>
                
                <button class="add-to-cart-btn hover-glow" 
                        ${!product.inStock ? "disabled" : ""} 
                        onclick="addToCart(${JSON.stringify(product).replace(/"/g, "&quot;")})">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"></path>
                        <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"></path>
                        <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"></path>
                    </svg>
                    ${product.inStock ? "Adicionar ao Carrinho" : "Indisponível"}
                </button>
            </div>
        </div>
    `,
    )
    .join("")
}