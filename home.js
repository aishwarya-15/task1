function loadUI(){
  let loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
  if(loggedUser.role){
    let userElements = document.querySelectorAll('.user');
    console.log(userElements);
    userElements.forEach(item => item.remove());
  }
  else{
    let adminElements = document.querySelectorAll('.admin');
    adminElements.forEach(item => item.remove());
  }
}
function Book(title,author,description,price,quantity,image){
  this.title=title;
  this.author=author;
  this.description=description;
  this.price=price;
  this.quantity =quantity;
  this.image=image;
}

function loadBooksUI(){
 
  let booksDiv = document.querySelector('.shop-items');
  booksDiv.innerHTML="";
  let books = JSON.parse(localStorage.getItem('bookStorage'));

  for(let book of books){
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
            <span class="shop-item-quantity">${book.quantity}</span>
            <button class="shop-item-increase" type="button">+</button>
        </section>
        <button class="btn-delete admin" type="button">Delete</button>
        <button class="btn-buy user" type="button">Buy</button>
    </div>`;
    bookItem.classList.add('shop-item');
    booksDiv.appendChild(bookItem);
  } 
}



function Logout(){
  localStorage.removeItem('loggedUser');
  return window.location.href="/home/elcot/BookStore/index.html";
}

function openModal(){
  document.querySelector('.modal-bg').classList.remove('hidden');
}

function closeModal(e){
  if(e.target.tagName === "I")
    document.querySelector('.modal-bg').classList.add('hidden');
  if(e.target.tagName === "BUTTON"){
    let form = document.querySelector('.form-group');
    let inputs= form.querySelectorAll('input');
    let values = [];
    for(let input of inputs){
      values.push(input.value);
      input.value = "";
    }
    let book = new Book(values[0],values[1],values[2],values[3],values[4],values[5]);
    let bookStorage;
    // if(localStorage.getItem('bookStorage')===null){
    //   bookStorage = [book];
    // }else{
      bookStorage = JSON.parse(localStorage.getItem('bookStorage'));
      bookStorage.push(book);
    // }
     localStorage.setItem('bookStorage',JSON.stringify(bookStorage));
     document.querySelector('.modal-bg').classList.add('hidden');
    //  alert("Book Added Successfully")
    loadBooksUI();
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

function searchFilter(e){
    
}
  
function deleteBookUI(el){
  let shopItem = el.toElement.parentElement.parentElement;
  let title = shopItem.children[0].innerText;
  shopItem.remove();
  removeBook(title);
}

function removeBook(title){
   let books = JSON.parse(localStorage.getItem('bookStorage'));

   books.forEach((book,index) => {
      if(book.title === title){
        books.splice(index,1);
      }else{
        console.log(book.title)
      }
   });
   localStorage.setItem('bookStorage',JSON.stringify(books));
}













let logout = document.getElementById('logout');
let addbook = document.getElementById('add-book');
let modal = document.querySelector('.addbook-modal');
let searchBar = document.getElementById('search');
// let deleteBtn= document.querySelector('.btn-delete'); 
let items =document.querySelector('.shop-items');
let buyBtn = document.querySelector('.btn-buy');

document.getElementById("defaultOpen").click();
logout.addEventListener('click',Logout);  
addbook.addEventListener('click',openModal);
modal.addEventListener('click',closeModal);
searchBar.addEventListener('keyup',searchFilter);
items.addEventListener('click',deleteBookUI);

document.addEventListener('DOMContentLoaded',loadBooksUI);
document.addEventListener('DOMContentLoaded',loadUI);