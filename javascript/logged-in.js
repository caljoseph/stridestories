 document.addEventListener("DOMContentLoaded", async function() {
    const username = localStorage.getItem('username');

    var userParagraph = document.getElementById("user");
    if(username) {
        userParagraph.textContent = 'Hello ' + username + '!'; 
    } else {
        userParagraph.textContent = "Username empty (but hello anyway!)"
    }
});

async function logout() {
    const username = localStorage.getItem('username');
    if (username) {
        try {
            await fetch('/api/auth/logout', {
                method: 'DELETE'
            });
            console.log('Logged out successfully');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    } else {
        console.error('Username not found in localStorage');
    }
    localStorage.removeItem('username');
}

