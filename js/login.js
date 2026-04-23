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

      // ✅ SUCCESS (your original logic preserved)
      if (status === 200 && body.status === "OK") {

        if (body.data.role === "ADMIN") {
          window.location.href = "../pages/admin-dashboard.html";
        } else if (body.data.role === "CUSTOMER") {
          window.location.href = "../pages/dashboard.html";
        } else {
          showError("Unknown role. Please contact support.");
        }

      } else {
        // ❌ ONLY CHANGE → show error instead of alert
        showError(body.error || "Invalid username or password");
      }
    })
    .catch(error => {
      console.error("Error:", error);

      // ❌ ONLY CHANGE → no popup
      showError("An error occurred. Please try again later.");
    });

  // 🔴 helper
  function showError(message) {
    errorDiv.innerText = message;
    errorDiv.style.display = "block";
  }
});