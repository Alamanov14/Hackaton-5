let API = "http://localhost:8000/products";

let name = document.querySelector(".product-name");
let category = document.querySelector(".product-category");
let from = document.querySelector(".product-from");
let price = document.querySelector(".product-price");
let photo = document.querySelector(".product-photo");
let btnAdd = document.querySelector(".bnt-add");

// edit Modal
let editName = document.querySelector(".edit-name");
let editCat = document.querySelector(".edit-category");
let editFrom = document.querySelector(".edit-from");
let editPhoto = document.querySelector(".edit-photo");
let editPrice = document.querySelector(".edit-price");
let editSave = document.querySelector(".edit-save");
let editModal = document.querySelector("#staticBackdrop");
// search
let search = document.querySelector(".search");
let searchVal = "";
// pagination
let pagination = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");
let currentPage = 1;
let totalPage = 1;

let productList = document.querySelector(".product-list");
btnAdd.addEventListener("click", async () => {
  let obj = {
    name: name.value,
    category: category.value,
    from: from.value,
    price: price.value,
    photo: photo.value,
  };
  if (
    !obj.name.trim() ||
    !obj.category.trim() ||
    !obj.from.trim() ||
    !obj.photo.trim() ||
    !obj.price.trim()
  ) {
    alert("Заполните поля");
    return;
  }
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  name.value = "";
  category.value = "";
  from.value = "";
  price.value = "";
  photo.value = "";
  render();
});
render();
async function render() {
  let res = await fetch(`${API}?p=${searchVal}&_page=${currentPage}&_limit=3`);
  let products = await res.json();

  productList.innerHTML = "";
  products.forEach((item) => {
    productList.innerHTML += `
    <div class="card" style="width: 18rem;">
  <img src="${item.photo}" class="card-img-top" alt="error">
  <div class="card-body">
    <h5 class="card-name">${item.name}</h5>
    <h5 class="card-category">${item.category}</h5>
    <h5 class="card-from">${item.from}</h5>
    <h5 class="card-price">${item.price}</h5>
    <button onclick='deleteProduct(${item.id})'data-bs-toggle="modal" data-bs-target="#staticBackdrop" class='btn-delete'>Delete</button>
    <button onclick='openModal(${item.id})'data-bs-toggle="modal" data-bs-target="#staticBackdrop" class='btn-edit'>Edit</button>
  </div>
</div>
    `;
  });
}
// delete
async function deleteProduct(id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    render();
  } catch (error) {
    console.log(error);
  }
}
// edit
let editObj = {};
async function openModal(id) {
  try {
    let res = await fetch(`${API}/${id}`);
    let objToEdit = await res.json();

    editName.value = objToEdit.name;
    editCat.value = objToEdit.category;
    editPrice.value = objToEdit.price;
    editFrom.value = objToEdit.from;
    editPhoto.value = objToEdit.photo;
    editSave.setAttribute("id", `${id}`);
  } catch (error) {
    console.log(error);
  }
}
editSave.addEventListener("click", async (e) => {
  let id = e.target.id;
  console.log(id);
  editObj = {
    name: editName.value,
    category: editCat.value,
    photo: editPhoto.value,
    price: editPrice.value,
    from: editFrom.value,
  };
  console.log(editObj);
  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(editObj),
    });
  } catch (error) {
    console.log(error);
  }
  render();
  let modal = bootstrap.Modal.getInstance(editModal);
  modal.hide();
});

// search
search.addEventListener("input", () => {
  searchVal = search.value;
  render();
});
// pagination
function paginationBtns() {
  fetch(`${API}/q?=${searchVal}`)
    .then((res) => res.json())
    .then((date) => {
      totalPage = Math.ceil(date.length / 3);
      pagination.innerHTML = "";
      for (i = 1; i < totalPage; i++) {
        if (currentPage == i) {
          pagination.innerHTML = `
            <li class="page-item active"><a class="page-link  page_number" href="#">${i}</a></li> 
            `;
        } else {
          pagination.innerHTML = `
            <li class="page-item "><a class="page-link  page_number" href="#">${i}</a></li> 
            `;
        }
      }
      if (currentPage == 1) prev.classList.add("disable");
      else prev.classList.remove("disable");
      if (currentPage == totalPage) next.classList.add("disable");
      else next.classList.remove("disable");
    });
}

prev.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  render();
});
next.addEventListener("click", () => {
  if (currentPage >= totalPage) return;
  currentPage++;
  render();
});
