const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

if (mobileMenuButton) {
  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

// --- Cart System  ---
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function updateCartUI() {
  localStorage.setItem("cart", JSON.stringify(cart));
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;
  }
}

function addToCart(id, title, price, image) {
  const existingItem = cart.find((item) => item.id === id);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id, title, price, image, quantity: 1 });
  }
  updateCartUI();
  showToast(`${title.substring(0, 20)}... added to cart!`);
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCartUI();
  renderCart();
}

function toggleCart() {
  const modal = document.getElementById("cart-modal");
  if (modal) {
    modal.classList.toggle("hidden");
    if (!modal.classList.contains("hidden")) {
      renderCart();
    }
  }
}

function renderCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  
  if (!cartItemsContainer) return;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="text-center text-gray-500 py-10">Your cart is empty.</p>';
    cartTotal.innerText = "$0.00";
    return;
  }

  let total = 0;
  cartItemsContainer.innerHTML = cart.map((item) => {
    total += item.price * item.quantity;
    return `
      <div class="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
        <img src="${item.image}" class="w-12 h-12 object-contain bg-white rounded">
        <div class="flex-1">
          <h4 class="text-sm font-bold truncate w-32">${item.title}</h4>
          <p class="text-gray-500 text-xs">$${item.price} x ${item.quantity}</p>
        </div>
        <button onclick="removeFromCart(${item.id})" class="text-red-500 hover:text-red-700 p-2">
          <i class="fa-solid fa-trash-can"></i>
        </button>
      </div>`;
  }).join("");

  cartTotal.innerText = `$${total.toFixed(2)}`;
}

// --- Product  ---
async function fetchCategories() {
  const categoryContainer = document.getElementById("category-container");
  if (!categoryContainer) return;

  try {
    const res = await fetch("https://fakestoreapi.com/products/categories");
    const categories = await res.json();
    categoryContainer.innerHTML = "";

    const allBtn = document.createElement("button");
    allBtn.className = "category-btn px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-full shadow-lg transition-all duration-300 cursor-pointer";
    allBtn.innerText = "All";
    allBtn.onclick = () => loadProducts("all", allBtn);
    categoryContainer.appendChild(allBtn);

    categories.forEach((category) => {
      const btn = document.createElement("button");
      btn.className = "category-btn px-6 py-2.5 bg-white text-[#374151] border border-gray-200 font-medium rounded-full transition-all duration-300 capitalize cursor-pointer";
      btn.innerText = category;
      btn.onclick = () => loadProducts(category, btn);
      categoryContainer.appendChild(btn);
    });
  } catch (error) {
    console.error(error);
  }
}

async function loadProducts(category = "all", selectedBtn = null, limit = null) {
  const container = document.getElementById("product-container");
  if (!container) return;

  const allBtns = document.querySelectorAll(".category-btn");
  allBtns.forEach((btn) => {
    btn.classList.remove("bg-indigo-600", "text-white", "shadow-lg");
    btn.classList.add("bg-white", "text-[#374151]", "border", "border-gray-200");
  });

  if (selectedBtn) {
    selectedBtn.classList.add("bg-indigo-600", "text-white", "shadow-lg");
    selectedBtn.classList.remove("bg-white", "text-[#374151]", "border-gray-200");
  }

  let url = category === "all" ? "https://fakestoreapi.com/products" : `https://fakestoreapi.com/products/category/${category}`;

  try {
    container.innerHTML = `<div class="col-span-full text-center py-10">Loading products...</div>`;
    const response = await fetch(url);
    let products = await response.json();

    if (limit) products = products.slice(0, limit);
    container.innerHTML = "";

    products.forEach((product) => {
      const cleanTitle = product.title.replace(/'/g, "\\'");
      const card = `
        <div class="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow duration-300 group">
          <div class="relative h-64 bg-white rounded-t-xl overflow-hidden mb-4 flex items-center justify-center p-6">
            <img src="${product.image}" alt="${product.title}" class="object-contain h-full w-full group-hover:scale-105 transition-transform duration-300" />
          </div>
          <div class="p-4">
            <div class="flex justify-between items-center mb-2">
              <span class="bg-indigo-100 text-indigo-700 text-[10px] uppercase font-bold px-2 py-1 rounded">${product.category}</span>
              <div class="flex items-center text-yellow-500 text-sm font-semibold">
                <i class="fa-solid fa-star mr-1"></i>
                <span class="text-gray-500">${product.rating.rate}</span>
              </div>
            </div>
            <h3 class="text-gray-900 font-semibold text-lg mb-1 truncate" title="${product.title}">${product.title}</h3>
            <div class="text-gray-900 font-bold text-xl mb-4">$${product.price}</div>
            <div class="flex gap-4">
              <button onclick="showDetails(${product.id})" class="flex-1 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center gap-2 cursor-pointer"><i class="fa-regular fa-eye"></i> Details</button>
              <button onclick="addToCart(${product.id}, '${cleanTitle}', ${product.price}, '${product.image}')" class="flex-1 text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center flex items-center justify-center gap-2 cursor-pointer"><i class="fa-solid fa-cart-shopping"></i> Add</button>
            </div>
          </div>
        </div>`;
      container.innerHTML += card;
    });
  } catch (error) {
    container.innerHTML = `<div class="col-span-full text-center text-red-500 py-10">Failed to load products.</div>`;
  }
}

async function showDetails(id) {
  const modal = document.getElementById("product-modal");
  const modalContent = document.getElementById("modal-content");
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
  modalContent.innerHTML = `<div class="text-center py-10"><i class="fa-solid fa-spinner fa-spin text-3xl text-indigo-600"></i></div>`;

  try {
    const res = await fetch(`https://fakestoreapi.com/products/${id}`);
    const product = await res.json();
    const cleanTitle = product.title.replace(/'/g, "\\'");

    modalContent.innerHTML = `
      <div class="flex flex-col md:flex-row gap-8">
        <div class="w-full md:w-1/2 flex items-center justify-center bg-gray-50 rounded-xl p-4">
          <img src="${product.image}" alt="${product.title}" class="max-h-80 object-contain">
        </div>
        <div class="w-full md:w-1/2 flex flex-col">
          <span class="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2">${product.category}</span>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">${product.title}</h2>
          <p class="text-gray-600 leading-relaxed mb-6 flex-grow">${product.description}</p>
          <div class="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
            <div class="text-3xl font-bold text-gray-900">$${product.price}</div>
            <button onclick="addToCart(${product.id}, '${cleanTitle}', ${product.price}, '${product.image}')" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all flex items-center gap-2 cursor-pointer">
              <i class="fa-solid fa-cart-plus"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>`;
  } catch (error) {
    modalContent.innerHTML = `<p class="text-center text-red-500">Error loading product details.</p>`;
  }
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  const toast = document.createElement("div");
  
  toast.className = `
    bg-gray-900 text-white px-6 py-3 rounded-lg shadow-2xl 
    flex items-center gap-3 transform translate-y-10 opacity-0 
    transition-all duration-300 ease-out border-l-4 border-indigo-500
  `;
  
  toast.innerHTML = `
    <i class="fa-solid fa-circle-check text-indigo-400"></i>
    <span class="font-medium">${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove("translate-y-10", "opacity-0");
  }, 10);
  setTimeout(() => {
    toast.classList.add("translate-y-10", "opacity-0");
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
}

function closeModal() {
  const modal = document.getElementById("product-modal");
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
}

// Initial Calls
updateCartUI();
if (document.getElementById("category-container")) {
  fetchCategories();
  loadProducts("all");
} else {
  loadProducts("all", null, 3);
}

// Navbar Cart Click Event
const navCartBtn = document.querySelector('a[href="#"] .fa-cart-shopping')?.parentElement;
if (navCartBtn) {
  navCartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    toggleCart();
  });
}