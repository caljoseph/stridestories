function validateAndLogin() {
  const userNameInput = document.querySelector("#name");
  const passwordInput = document.querySelector("#password");


  userNameInput.classList.remove("is-invalid");
  passwordInput.classList.remove("is-invalid");

  if (!userNameInput.value) {
    userNameInput.classList.add("is-invalid");
    document.getElementById("username-error").innerText = "Username required";
    return;
  }

  if (!passwordInput.value) {
    passwordInput.classList.add("is-invalid");
    document.getElementById("password-error").innerText = "Password required";
    return;
  }

  // If validation passes, proceed with login
  localStorage.setItem("username", userNameInput.value.trim());
  localStorage.setItem("password", passwordInput.value.trim());

  // Redirect or perform other actions as needed
  window.location.href = "logged-in.html";
}

