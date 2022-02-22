const fragment = document.createDocumentFragment()
const displayProducts = document.getElementById("displayProducts")
const items = document.getElementById("items")
const modalFooter = document.getElementById("modalFooter")
const cartBadge = document.getElementById("cartBadge")
const cardTemplate = document.getElementById("card").content
const cartTemplate = document.getElementById("cartTemplate").content
const cartFooter = document.getElementById("cartFooter").content
const cartBadgeTemplate = document.getElementById("cartBadgeTemplate").content


let cart = {}

// Se espera la carga completa de la pagina y luego se toman los datos del JSON. Una vez hecho esto se revisa el LocalStorage para ver si hay items en el carrito

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"))
        displayCart()
    }
})

// Se añade event listener a cada tarjeta para añadir los productos al carrito

displayProducts.addEventListener("click", e => {
    addProduct(e)
})

// se añade event listener a los botones para aumentar o disminuir productos en el carrito

items.addEventListener("click", e => {
    btnAction(e)
})

const fetchData = async () => {
    try {
        const res = await fetch('../data.json')
        const data = await res.json()

        displayCards(data)
    } catch (error) {
        console.log(error)
    }
}

// Mostrar en tarjetas los productos existentes en el data.json 

const displayCards = data => {
    data.forEach(product => {
        cardTemplate.querySelector("img").setAttribute("src", product.thumbnailURL)
        cardTemplate.querySelector("#name").textContent = product.name
        cardTemplate.querySelector("#description").textContent = product.description
        cardTemplate.querySelector("#price").textContent = product.price
        cardTemplate.querySelector("#dimensions").textContent = "Sus dimensiones son " + product.dimensions
        cardTemplate.querySelector(".btn").dataset.id = product.id
        const clone = cardTemplate.cloneNode(true)
        fragment.appendChild(clone)
    })
    displayProducts.appendChild(fragment)
}

//  Funcion para añadir al carrito

const addProduct = e => {
    if (e.target.classList.contains("btn")) {
        setCart(e.target.parentElement)
    }
    e.stopPropagation()
}


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

// Se pasan los datos que se visualizaran en el carrito 

const displayCart = () => {
    // console.log(cart)
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

// Se muestra el footer del carrito 

const displayCartFooter = () => {
    modalFooter.innerHTML = ''

    if (Object.keys(cart).length === 0) {
        modalFooter.innerHTML = `
        <th scope="row" colspan="7" class="text-center">Su carrito se encuentra vacio</th>
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
    cartFooter.querySelector("#totalPriceIva").textContent = totalPriceIva
    const clone = cartFooter.cloneNode(true)
    fragment.appendChild(clone)
    modalFooter.appendChild(fragment)

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

// Se añaden las funciones de los botones 

// Boton de vaciar carrito

const btnClearCart = document.getElementById("clearCart")
btnClearCart.addEventListener("click", () => {
    cart = {}
    displayCart()
    cartBadgeCounter()
})

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
    }
    e.stopPropagation()
}