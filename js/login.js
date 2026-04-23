document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const errorDiv = document.getElementById("error-message");
  const loginBtn = document.querySelector(".login-btn");

  // Reset UI
  errorDiv.style.display = "none";
  errorDiv.innerText = "";
  username.style.border = "";
  password.style.border = "";

  // Validation
  if (!username.value.trim() || !password.value.trim()) {
    showError("Please enter both username/email and password.");
    highlightInputs();
    return;
  }

  // Disable button
  loginBtn.disabled = true;
  loginBtn.innerText = "Logging in...";

  try {
    const response = await fetch("https://smartbankofficial.online/smartBank/user/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({
        usernameOrEmail: username.value.trim(),
        password: password.value.trim()
      })
    });

    const data = await response.json();

    // ✅ SUCCESS
    if (response.ok && data.status === "OK") {

      const role = data.data.role;

      if (role === "ADMIN") {
        window.location.href = "../pages/admin-dashboard.html";
      } else if (role === "CUSTOMER") {
        window.location.href = "../pages/dashboard.html";
      } else {
        showError("Unknown role. Please contact support.");
      }

    } else {
      // ❌ FAILURE
      showError(data.error || "Invalid username or password");
      highlightInputs();
    }

  } catch (err) {
    console.error(err);
    showError("Server error. Please try again.");
  } finally {
    loginBtn.disabled = false;
    loginBtn.innerText = "Login";
  }

  // 🔴 Helper functions

  function showError(message) {
    errorDiv.innerText = message;
    errorDiv.style.display = "block";
  }

  function highlightInputs() {
    username.style.border = "1px solid red";
    password.style.border = "1px solid red";
  }
});

// Clear error on typing
document.getElementById("username").addEventListener("input", clearError);
document.getElementById("password").addEventListener("input", clearError);

function clearError() {
  const errorDiv = document.getElementById("error-message");
  errorDiv.style.display = "none";
  document.getElementById("username").style.border = "";
  document.getElementById("password").style.border = "";
}