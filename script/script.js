const loadTranding = () => {
    fetch("https://fakestoreapi.com/products")
    .then(res=> res.json())
    .then(json => {
        const trandingItems = json.slice(0, 3);
        displayTranding(trandingItems)
    })
    .catch(error => console.err("Error fetching data:", error));
}
const displayTranding = (trendingProducts) => {
    const trandingContainer = document.getElementById("trending-container");
    trandingContainer.innerHTML = "";
    
    trendingProducts.forEach(product => {
        const trandDiv = document.createElement("div");
        // কার্ডের বর্ডার এবং শ্যাডো ছবির মতো অ্যাডজাস্ট করা হয়েছে
        trandDiv.classList = "card bg-white shadow-sm border border-gray-200 rounded-2xl overflow-hidden";
        
        trandDiv.innerHTML = `
            <figure class="bg-gray-100 p-6 h-64 flex items-center justify-center">
                <img src="${product.image}" alt="${product.title}" class="h-full object-contain mix-blend-multiply" />
            </figure>
            
            <div class="card-body p-5">
                <div class="mb-2">
                    <span class="badge badge-ghost text-blue-600 bg-blue-50 border-none capitalize text-xs px-3 font-medium">
                        ${product.category}
                    </span>
                    <div class="float-right flex items-center gap-1">
                        <span class="text-yellow-400 text-sm">⭐</span>
                        <span class="text-sm font-semibold text-gray-700">${product.rating.rate}</span>
                        <span class="text-xs text-gray-400">(${product.rating.count})</span>
                    </div>
                </div>

                <h2 class="text-gray-800 font-bold text-base h-12 overflow-hidden leading-tight mb-2">
                    ${product.title}
                </h2>

                <p class="text-gray-900 font-extrabold text-xl mb-4">$${product.price}</p>

                <div class="flex items-center gap-3 mt-auto">
                    <button onclick="loadProductDetails(${product.id})" class="btn btn-outline flex-1 border-gray-300 text-gray-600 hover:bg-gray-100 h-10 min-h-0 text-sm font-bold rounded-lg">
                        <i class="fa-regular fa-eye mr-1"></i> Details
                    </button>
                    <button class="btn btn-primary flex-1 bg-indigo-600 hover:bg-indigo-700 border-none h-10 min-h-0 text-white text-sm font-bold rounded-lg">
                        <i class="fa-solid fa-cart-shopping mr-1"></i> Add
                    </button>
                </div>
            </div>
        `;
        trandingContainer.appendChild(trandDiv);
    });


}
loadTranding();