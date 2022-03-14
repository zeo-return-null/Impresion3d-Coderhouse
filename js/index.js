
const cartBadge = document.getElementById("cartBadge")
const cartBadgeTemplate = document.getElementById("cartBadgeTemplate").content
const fragment = document.createDocumentFragment()

let cart = {}


document.addEventListener('DOMContentLoaded', () => {
    cart = JSON.parse(localStorage.getItem("cart")) || []
    cartBadgeCounter()

})

const cartBadgeCounter = () => {
    cartBadge.innerHTML = ''

    if (Object.keys(cart).length === 0) {
        cartBadge.innerHTML = `
        <p class="my-0" style="color:#f5cb5c">0</p>`
        return
    }

    const productsQuantity = Object.values(cart).reduce((acc, { quantity }) => acc + quantity, 0)
    cartBadgeTemplate.querySelector("#badgeQuantity").textContent = productsQuantity

    const clone = cartBadgeTemplate.cloneNode(true)
    fragment.append(clone)
    cartBadge.appendChild(fragment)
}


const cartButton = document.getElementById("cartButton") 
cartButton.addEventListener("click", () => {
    if (Object.keys(cart).length === 0) {
        alert("No posee productos en su carrito")
        return
    }
    else {
        window.location.href = "/pages/purchase.html"
    }
})