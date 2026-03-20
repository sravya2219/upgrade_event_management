function login(e)
{
e.preventDefault();

let email=document.getElementById("email").value;
let password=document.getElementById("password").value;

if(email==="admin@upgrad.com" && password==="12345")
{
localStorage.setItem("admin","true");

window.location="events.html";
}
else
{
alert("Invalid Login");
e.target.reset();
}
}