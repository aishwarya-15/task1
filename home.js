document.addEventListener('DOMContentLoaded', loadBooksUI);
document.addEventListener('DOMContentLoaded', loadUI);
document.addEventListener('DOMContentLoaded', displayBooksInOrdersUI);

function loadUI() {
  let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  if (loggedUser.role) {
    let userElements = document.querySelectorAll('.user');
    userElements.forEach(item => item.remove());
  }
  else {
    let adminElements = document.querySelectorAll('.admin');
    adminElements.forEach(item => item.remove());
  }
}

function Book(title, author, description, price, quantity, image) {
  this.title = title;
  this.author = author;
  this.description = description;
  this.price = price;
  this.quantity = quantity;
  this.image = image;
}

function loadBooksUI() {

  let booksDiv = document.querySelector('.shop-items');
  booksDiv.innerHTML = "";
  let books = JSON.parse(localStorage.getItem('bookStorage'));
  let loggedUser = (JSON.parse(localStorage.getItem('loggedUser'))).role;
  // console.log(loggedUser);
  if (loggedUser) {
    for (let book of books) {
      let bookItem = document.createElement('div');
      let imgSrc = book.image || "/home/elcot/Downloads/book.jpeg"
      bookItem.innerHTML = `
      <span class="shop-item-title">${book.title}</span>
      <img class="shop-item-image" src=${imgSrc}>
      <div class="shop-item-details">
          <span class="shop-item-description">${book.description}</span>
          <span class="shop-item-author">${book.author}</span>
          <span class="shop-item-price">Rs.${book.price}</span>
          <section class="section-quantity">  
              <button class="shop-item-decrease" type="button">-</button>
              <span class="shop-item-quantity admin">${book.quantity}</span>
              <button class="shop-item-increase" type="button">+</button>
          </section>
          <button class="btn-delete" type="button">Delete</button>
      </div>
      `;
      bookItem.classList.add('shop-item');
      booksDiv.appendChild(bookItem);
    }
  }
  else {
    for (let book of books) {
      let bookItem = document.createElement('div');
      let imgSrc = book.image || "/home/elcot/Downloads/book.jpeg"
      bookItem.innerHTML = `
        <span class="shop-item-title">${book.title}</span>
        <img class="shop-item-image" src=${imgSrc}>
        <div class="shop-item-details">
            <span class="shop-item-description">${book.description}</span>
            <span class="shop-item-author">${book.author}</span>
            <span class="shop-item-price">Rs.${book.price}</span>
            <section class="section-quantity">  
              <button class="shop-item-decrease" type="button">-</button>
              <span class="shop-item-quantity user">0</span>
              <button class="shop-item-increase" type="button">+</button>
          </section>
            <button class="btn-buy user" type="button">Buy</button>
        </div>
        `;
      bookItem.classList.add('shop-item');
      booksDiv.appendChild(bookItem);
    }
  }
}

function Logout() {
  localStorage.removeItem('loggedUser');
  return window.location.href = "/home/elcot/BookStore/index.html";
}

function openModal() {
  document.querySelector('.modal-bg').classList.remove('hidden');
}

function closeModal(e) {
  if (e.target.tagName === "I")
    document.querySelector('.modal-bg').classList.add('hidden');
  if (e.target.tagName === "BUTTON") {
    let form = document.querySelector('.form-group');
    let inputs = form.querySelectorAll('input');
    let values = [];
    for (let input of inputs) {
      values.push(input.value);
      input.value = "";
    }
    let book = new Book(values[0], values[1], values[2], values[3], values[4], values[5]);
    let bookStorage;
    // if(localStorage.getItem('bookStorage')===null){
    //   bookStorage = [book];
    // }else{
    bookStorage = JSON.parse(localStorage.getItem('bookStorage'));
    bookStorage.push(book);
    // }
    localStorage.setItem('bookStorage', JSON.stringify(bookStorage));
    document.querySelector('.modal-bg').classList.add('hidden');
    //  alert("Book Added Successfully")
    loadBooksUI();
    loadUI();
  }
}

function openPage(pageName) {
  let i, tabcontent;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  document.getElementById(pageName).style.display = "block";
}


function searchFilter(e) {
  let term = e.target.value.toLowerCase();
  let titles = document.querySelectorAll('.shop-item-title');
  let shopItems = document.querySelectorAll('.shop-item');
  titles.forEach(
    (title) => {
      if (title.innerText.toLowerCase().indexOf(term) != -1) {
        title.closest('.shop-item').style.display = "block";
      }
      else {
        title.closest('.shop-item').style.display = "none";
      }
    }
  )
}

function deleteBookUI(el) {
  if (el.srcElement.innerText === 'Delete') {
    let shopItem = el.toElement.parentElement.parentElement;
    let title = shopItem.children[0].innerText;
    removeBook(title);
    shopItem.remove();
  }
  else return;
}

function removeBook(title) {
  let books = JSON.parse(localStorage.getItem('bookStorage'));

  books.forEach((book, index) => {
    if (book.title === title) {
      books.splice(index, 1);
    } else {
      console.log(book.title)
    }
  });
  localStorage.setItem('bookStorage', JSON.stringify(books));
}

function updateQtyInStorage(title, qty) {
  let books = JSON.parse(localStorage.getItem('bookStorage'));
  if (JSON.parse(localStorage.getItem('loggedUser')).role) {
    books.forEach((book) => {
      if (book.title === title) {
        book.quantity = qty;
      }
    });
  } else {
    books.forEach((book) => {
      if (book.title === title) {
        book.quantity -= qty;
      }
    });
  }
  localStorage.setItem('bookStorage', JSON.stringify(books));
}

function incrementQty(e) {
  let qty = e.target.previousElementSibling;
  if (qty.classList.value === "shop-item-quantity admin") {
    qty.innerText++;
    let item = qty.closest('.shop-item');
    updateQtyInStorage(item.children[0].innerText, Number(qty.innerText));
  }
  else if (qty.classList.value === "shop-item-quantity user") {
    qty.innerText++;
    // console.log(Number(qty.innerText));
  } else return;
}

function decrementQty(e) {
  let qty = e.target.nextElementSibling;
  if (qty.classList.value === "shop-item-quantity admin" && qty.innerText > 0) {
    qty.innerText--;
    let item = qty.closest('.shop-item');
    updateQtyInStorage(item.children[0].innerText, Number(qty.innerText), "dec");
  } else if (qty.classList.value === "shop-item-quantity user" && qty.innerText > 0) {
    qty.innerText--;
  } else return;
}


function Order(orderId, username, email, title, qty, date, total) {
  this.orderId = orderId;
  this.username = username;
  this.email = email;
  this.title = title;
  this.quantity = qty;
  this.date = date;
  this.total = total;
}

function orderStorage(orderId, username, email, title, quantity, date, total) {
  let newOrder = new Order(orderId, username, email, title, quantity, date, total);
  let storage = JSON.parse(localStorage.getItem('orderStorage'));
  storage.push(newOrder);
  localStorage.setItem('orderStorage', JSON.stringify(storage));
}

function purchase(e) {
  if (e.target.classList.contains("btn-buy")) {
    let title = e.target.closest('.shop-item').children[0].innerText;
    // let price = e.target.closest('.shop-item').children[2];
    let price = e.target.previousElementSibling.previousElementSibling.innerText;
    // console.log(price);
    price = price.slice(3);
    let qty = e.target.previousElementSibling.children[1].innerText;
    e.target.previousElementSibling.children[1].innerText="0";
    // console.log(qty)
    updateQtyInStorage(title, qty);
    let total = price * qty;
    let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    let username = loggedUser.username;
    let email = loggedUser.email;
    let date = Date.now();
    let orderId = localStorage.getItem('orderId');
    // console.log(orderId)
    localStorage.setItem('orderId', ++orderId);

    orderStorage(orderId, username, email, title, qty, date, total);
    displayBooksInOrdersUI();
  }
  else return;
}

function displayBooksInOrdersUI() {

  let orders = JSON.parse(localStorage.getItem('orderStorage'));
  let table = document.querySelector('.table');
  table.innerHTML = "";
  let head = document.createElement('tr');
  head.innerHTML = `
  <th>Order Id</th>
  <th>Buyer Email</th>
  <th>Book Name</th>
  <th>Quantity</th>
  <th>Order date</th>
  <th>Total amount</th>`;
  table.appendChild(head);


  let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  if (loggedUser.role) {
    for (let order of orders) {
      let row = document.createElement('tr');
      row.innerHTML = `
      <td>${order.orderId}</td>
      <td>${order.email}</td>
      <td>${order.title}</td>
      <td>${order.quantity}</td>
      <td>${Date(order.date)}</td>
      <td>${order.total}</td>`
      // console.log(row);
      table.appendChild(row);
    }
  }
  else {
    for (let order of orders) {
      if (order.username === loggedUser.username) {
        let row = document.createElement('tr');
        row.innerHTML = `
        <td>${order.orderId}</td>
        <td>${order.email}</td>
        <td>${order.title}</td>
        <td>${order.quantity}</td>
        <td>${Date(order.date)}</td>
        <td>${order.total}</td>`
        // console.log(row);
        table.appendChild(row);
      }
    }
  }
}
let logout = document.getElementById('logout');
let addbook = document.getElementById('add-book');
let modal = document.querySelector('.addbook-modal');
let searchBar = document.getElementById('search');
// let deleteBtn= document.querySelector('.btn-delete'); 
let items = document.querySelector('.shop-items');
document.getElementById("defaultOpen").click();
logout.addEventListener('click', Logout);
addbook.addEventListener('click', openModal);
modal.addEventListener('click', closeModal);
searchBar.addEventListener('keyup', searchFilter);
items.addEventListener('click', deleteBookUI);
items.addEventListener('click', incrementQty);
items.addEventListener('click', decrementQty);
items.addEventListener('click', purchase);