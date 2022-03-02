const fragment = document.createDocumentFragment()
const cartTemplate = document.getElementById("cartTemplate").content
const cartFooter = document.getElementById("cartFooter").content
const items = document.getElementById("items")
const tableFooter = document.getElementById("tableFooter")
const cartBadge = document.getElementById("cartBadge")
const cartBadgeTemplate = document.getElementById("cartBadgeTemplate").content

let cart = {}



// Se espera la carga completa de la pagina y luego se toman los datos del JSON. Una vez hecho esto se revisa el LocalStorage para ver si hay items en el carrito

document.addEventListener('DOMContentLoaded', () => {
    cart = JSON.parse(localStorage.getItem("cart")) || []
    displayCart()
})


const setCart = object => {
    const product = {
        id: object.querySelector(".btn").dataset.id,
        name: object.querySelector("#name").textContent,
        price: object.querySelector("#price").textContent,
        quantity: 1,
    }

    if (cart.hasOwnProperty(product.id)) {
        product.quantity = cart[product.id].quantity + 1
    }
    cart[product.id] = {
        ...product
    }
    displayCart()

}


items.addEventListener("click", e => {
    btnAction(e)
})
// Se pasan los datos que se visualizaran en el carrito 

const displayCart = () => {
    items.innerHTML = ' '
    Object.values(cart).forEach(product => {
        cartTemplate.querySelector("#id").textContent = product.id
        cartTemplate.querySelector("#name").textContent = product.name
        cartTemplate.querySelector("#quantity").textContent = product.quantity
        cartTemplate.querySelector("#price").textContent = product.quantity * product.price
        cartTemplate.querySelector("#priceIva").textContent = (product.price * product.quantity * 1.21)
        cartTemplate.querySelector(".increase").dataset.id = product.id
        cartTemplate.querySelector(".decrease").dataset.id = product.id
        cartTemplate.querySelector(".clearItem").dataset.id = product.id

        const clone = cartTemplate.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    displayCartFooter()

    localStorage.setItem("cart", JSON.stringify(cart))
}

const displayCartFooter = () => {
    tableFooter.innerHTML = ''

    if (Object.keys(cart).length === 0) {
        tableFooter.innerHTML = `
        <th scope="row" colspan="6" class="text-center">Su carrito se encuentra vacio</th>
        `
        return
    }

    // Se calcula la cantiadad de productos y su coste total 

    const productsQuantity = Object.values(cart).reduce((acc, {
        quantity
    }) => acc + quantity, 0)
    const totalPrice = Object.values(cart).reduce((acc, {
        price,
        quantity
    }) => acc + (price * quantity), 0)
    const totalPriceIva = totalPrice * 1.21
    cartFooter.querySelector("#totalQuantity").textContent = productsQuantity
    cartFooter.querySelector("#totalPrice").textContent = totalPrice
    cartFooter.querySelector("#totalPriceIva").value = totalPriceIva
    const clone = cartFooter.cloneNode(true)
    fragment.appendChild(clone)
    tableFooter.appendChild(fragment)
    
    cartBadgeCounter()
}


const cartBadgeCounter = () => {
    cartBadge.innerHTML = ''

    if (Object.keys(cart).length === 0) {
        cartBadge.innerHTML = `
        <p class="my-0" style="color:#f5cb5c">0</p>`
        return
    }

    const productsQuantity = Object.values(cart).reduce((acc, {
        quantity
    }) => acc + quantity, 0)
    cartBadgeTemplate.querySelector("#badgeQuantity").textContent = productsQuantity

    const clone = cartBadgeTemplate.cloneNode(true)
    fragment.append(clone)
    cartBadge.appendChild(fragment)
}


// Botones para incrementar y disminuir la cantidad de los productos

const btnAction = e => {
    if (e.target.classList.contains('increase')) {
        cart[e.target.dataset.id]
        const product = cart[e.target.dataset.id]
        product.quantity++
        cart[e.target.dataset.id] = {
            ...product
        }
        displayCart()
        cartBadgeCounter()
    }
    if (e.target.classList.contains('decrease')) {
        cart[e.target.dataset.id]
        const product = cart[e.target.dataset.id]
        product.quantity--
        if (product.quantity === 0) {
            delete cart[e.target.dataset.id]
        } else {
            cart[e.target.dataset.id] = {
                ...product
            }
        }
        displayCart()
        cartBadgeCounter()
    }
    if (e.target.classList.contains('clearItem')) {
        delete cart[e.target.dataset.id]
        displayCart()
        cartBadgeCounter()
    }
    e.stopPropagation()
}

const clearCart = () => {
    cart = {}
    localStorage.setItem("cart", JSON.stringify(cart))
}


// Botones del formulario

const btnCancelPurchase = document.getElementById('cancelPurchase')
btnCancelPurchase.addEventListener("click", () => {
    clearCart()
    window.location.href = "../pages/products.html"
})


const btn = document.getElementById('button')

document.getElementById('form')
 .addEventListener('submit', function(event) {
   event.preventDefault()

   btn.value = 'Enviando...'

   const serviceID = 'default_service'
   const templateID = 'template_9f2t193'

   emailjs.sendForm(serviceID, templateID, this)
    .then(() => {
      btn.value = 'Enviar'
      alert('Enviado!')

      setTimeout(() => {
        clearCart()
        window.location.href = "../index.html";
    }, 100);

    }, (err) => {
      btn.value = 'Enviar'
      alert(JSON.stringify(err))
    })
})