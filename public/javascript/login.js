async function validateAndLogin() {
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
  const body = {
    "username" : userNameInput.value,
    "password" : passwordInput.value
  };

  if (await login(body)) {
    localStorage.setItem('username', body.username);
    window.location.href = "logged-in.html";
    return;
  } else {
    document.getElementById("username-error").innerText = "";
    userNameInput.classList.add("is-invalid");
    passwordInput.classList.add("is-invalid");

    document.getElementById("password-error").innerText = "Invalid credentials";

  }

}

async function validateAndRegister() {
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

  // If validation passes, proceed with register
  const body = {
    "username" : userNameInput.value,
    "password" : passwordInput.value
  };

  if (await register(body)) {
    localStorage.setItem('username', body.username);
    window.location.href = "logged-in.html";
    return;
  } else {
    document.getElementById("username-error").innerText = "";
    userNameInput.classList.add("is-invalid");
    passwordInput.classList.add("is-invalid");
    document.getElementById("password-error").innerText = "User already exists";

  }

}


async function login(body) {

  try {
      await sendPostRequest("/api/auth/login", body);
      console.log("Logged in successfully")
  } catch (error) {
      return false;
  }

  return true;
}
async function register(body) {

  try {
      await sendPostRequest("/api/auth/create", body);
      console.log("Registered successfully")
  } catch (error) {
      return false;
  }

  return true;
}

async function sendPostRequest(url, data) {
  const response = await fetch(url, {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
  });
  if (!response.ok) {
      throw new Error(`Post request failed: ${response.statusText}`);
  }
}