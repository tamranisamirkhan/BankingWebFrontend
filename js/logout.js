// ============================================
// SmartBank - Simple Logout Script
// ============================================

async function logoutUser() {
  try {
    // Send logout request to backend
    const response = await fetch("https://smartbankofficial.online/smartBank/user/logout", {
      method: "POST",
      credentials: "include", // include cookies
    });

    if (response.ok) {
      // Clear session data
      localStorage.clear();
      sessionStorage.clear();

      // ✅ Show popup
      alert("✅ You have been logged out successfully!");

      // Disable forward & back navigation after logout
      preventBackNavigation();

      // Redirect to homepage (index.html)
      window.location.replace("https://smartbankofficial.netlify.app/index.html");

    } else {
      alert("⚠️ Logout failed. Please try again.");
    }

  } catch (error) {
    console.error("Logout error:", error);
    alert("❌ Something went wrong while logging out.");
  }
}

// ============================================
// Disable Back/Forward Navigation
// ============================================
function preventBackNavigation() {
  // Clear browser history to prevent back navigation
  window.history.pushState(null, "", window.location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };
}

// ============================================
// Attach Logout Handler to Button
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      logoutUser();
    });
  }
});
