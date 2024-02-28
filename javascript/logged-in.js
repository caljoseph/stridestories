document.addEventListener("DOMContentLoaded", function() {
    var userName = localStorage.getItem("username");
    var userParagraph = document.getElementById("user");
    if(userName) {
        userParagraph.textContent = 'Hello ' + userName + '!'; 
    } else {
        userParagraph.textContent = "Username empty (but hello anyway!)"
    }
});

function logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
}

