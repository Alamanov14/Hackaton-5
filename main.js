let API = "http://localhost:8000/products";

let name = document.querySelector(".product-name");
let category = document.querySelector(".product-category");
let from = document.querySelector(".product-from");
let photo = document.querySelector(".product-photo");
let btnAdd = document.querySelector(".bnt-add");
let productList = document.querySelector(".product-list");

btnAdd.addEventListener("click", async () => {
  let obj = {
    name: name.value,
    category: category.value,
    from: from.value,
    photo: photo.value,
  };
  if (
    name.value.trim() ||
    category.value.trim() ||
    from.value.trim() ||
    photo.value.trim()
  ) {
    alert("Заполните поля");
    return;
  }
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  name.value = "";
  category.value = "";
  from.value = "";
  photo.value = "";
});
async function render() {
  let res = await fetch(`${API}`);
  let products = res.json();
  productList.innerHTML = "";
  products.forEach((item) => {
    productList.innerHTML += `
    <div class="card" style="width: 18rem;">
  <img src="${item.photo}" class="card-img-top" alt="error">
  <div class="card-body">
    <h5 class="card-title">${item.name}</h5>
    <h5 class="card-title">${item.category}</h5>
    <h5 class="card-title">${item.from}</h5>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
    `;
  });
}
