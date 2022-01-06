function fillFormProduct(){

    const input = document.getElementById('comments');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const comments = urlParams.get('comments');

    input.value = comments;
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fillFormProduct)
}
else {
    fillFormProduct();
}