document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const usernameOrEmail = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorDiv = document.getElementById("error-message");

  // clear old error
  errorDiv.style.display = "none";
  errorDiv.innerText = "";

  if (!usernameOrEmail || !password) {
    showError("Please enter both username/email and password.");
    return;
  }

  const loginData = { usernameOrEmail, password };

  fetch("https://smartbankofficial.online/smartBank/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    credentials: "include",
    body: JSON.stringify(loginData)
  })
    .then(response => response.json().then(data => ({ status: response.status, body: data })))
    .then(({ status, body }) => {

      // ✅ SUCCESS (FIXED FOR NEW RESPONSE)
      if (status === 200 && body.status === "OK") {

        const role = body.data.role;

        if (role === "ADMIN") {
          window.location.href = "../pages/admin-dashboard.html";
        } else if (role === "CUSTOMER") {
          window.location.href = "../pages/dashboard.html";
        } else {
          showError("Unknown role. Please contact support.");
        }

      } else {
        // ❌ ERROR
        showError(body.error || "Invalid username or password");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      showError("An error occurred. Please try again later.");
    });

  function showError(message) {
    errorDiv.innerText = message;
    errorDiv.style.display = "block";
  }
});