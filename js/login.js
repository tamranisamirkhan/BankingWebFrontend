document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const usernameOrEmail = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!usernameOrEmail || !password) {
    alert("Please enter both username/email and password.");
    return;
  }

  const loginData = { usernameOrEmail, password };

  fetch("http://51.20.82.164:8080/smartBank/user/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    credentials: "include", // keeps JWT cookie from backend
    body: JSON.stringify(loginData)
  })
    .then(response => {
      if (!response.ok) throw new Error("Login failed");
      return response.json(); // expect JSON now
    })
    .then(data => {
      if (data.message && data.message.includes("Login successful")) {
        alert(data.message);

        if (data.role === "ADMIN") {
          window.location.href = "../pages/admin-dashboard.html";
        } else if (data.role === "CUSTOMER") {
          window.location.href = "../pages/dashboard.html";
        } else {
          alert("Unknown role. Please contact support.");
        }
      } else {
        alert("Invalid credentials!");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    });
});
