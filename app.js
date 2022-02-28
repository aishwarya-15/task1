let title = document.getElementById('title');
let registerLink = document.getElementById('registerLink');
let loginLink = document.getElementById('loginLink');
let emailDiv = document.getElementById('email-div');
let emailInput = document.getElementById('email');
let usernameInput = document.getElementById('username');
let passwordInput = document.getElementById('password');
let submitBtn = document.getElementById('submit');

function User(username,email,password,role){
    this.username=username;
    this.email=email;
    this.password=password;
    this.role=role;
}

function Login(username, password){
    let storage= JSON.parse(localStorage.getItem('storage'));
    let userNames = storage.map((item) => item.username);
    let passwords = storage.map( item => item.password);
    let found=false;
    for(let item of storage){
        if(username === item.username && password === item.password){
            found=true;
            localStorage.setItem('loggedUser',JSON.stringify(item));
            usernameInput.value='';
            passwordInput.value='';
            window.location.href ="/home/elcot/BookStore/home.html";
        }
    }
    if(!found)alert("Incorrect username or password");
    usernameInput.value='';
    passwordInput.value='';

}

function Register(username,email,password){
    let user= new User(username,email,password,false);
    let storage;
    if(JSON.parse(localStorage.getItem('storage')) === null) {
        storage=[];
        storage.push(user); 
    }
    else{
        storage = JSON.parse(localStorage.getItem('storage'));
        let userNames = storage.map((item) => item.username);
        for(let name of userNames){
            if(name === user.username){
                alert("username already exists!")
            }
        }
        if(passwordInput.value.length >8){
        storage.push(user);
        localStorage.setItem('storage',JSON.stringify(storage));
        }
        else{
            alert("Password must contain minimum 8 characters! ")
        }  
    }
    usernameInput.value='';
    passwordInput.value='';
    emailInput.value='';
}

(function setAdminRights(){
    let admin = new User("admin","admin@gmail.com","admin",true);
    if(localStorage.getItem('storage')===null){
       let storage =[admin];
       localStorage.setItem('storage',JSON.stringify(storage));
    }
})();

function validateUser(e){
    e.preventDefault();
    let username = usernameInput.value;
    let password = passwordInput.value;
    let email = emailInput.value; 
    if(e.target.innerText === "Register"){
        Register(username,email,password);
    }
    else{
        Login(username,password);
    }
}

function registerUI(e){
   emailDiv.classList.remove('hide');
   loginLink.classList.remove('hide');
   registerLink.classList.add('hide');
   submitBtn.innerText="Register";
   title.innerText="Register";
}

function loginUI(e){
   emailDiv.classList.add('hide');
   loginLink.classList.add('hide');
   registerLink.classList.remove('hide');
   submitBtn.innerText="Login";
   title.innerText="Login";
}


registerLink.addEventListener('click',registerUI);
loginLink.addEventListener('click',loginUI);
submitBtn.addEventListener('click',validateUser);

















