// open-account.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("openAccountForm");

  // 🔹 Helper: Popup Message
  function showPopup(message, type) {
    const popup = document.createElement("div");
    popup.className = `popup ${type}`;
    popup.textContent = message;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 4000);
  }

  // 🔹 Helper: Validate Form Fields
  function validateForm(data) {
    if (!/^\d{10}$/.test(data.phoneNumber)) {
      showPopup("📱 Invalid phone number (must be 10 digits)", "error");
      return false;
    }
    if (!/^\d{12}$/.test(data.aadharNumber)) {
      showPopup("🪪 Invalid Aadhar number (must be 12 digits)", "error");
      return false;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.panNumber)) {
      showPopup("🧾 Invalid PAN number format", "error");
      return false;
    }
    if (!/^\d{6}$/.test(data.pincode)) {
      showPopup("📍 Invalid pincode (must be 6 digits)", "error");
      return false;
    }
    return true;
  }

  // 🔹 Submit Form
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Gather data
    const customerData = {
      fullName: document.getElementById("fullName").value.trim(),
      bod: document.getElementById("bod").value,
      gender: document.getElementById("gender").value,
      phoneNumber: document.getElementById("phoneNumber").value.trim(),
      email: document.getElementById("email").value.trim(),
      address: document.getElementById("address").value.trim(),
      city: document.getElementById("city").value.trim(),
      state: document.getElementById("state").value.trim(),
      panNumber: document.getElementById("panNumber").value.trim(),
      country: document.getElementById("country").value.trim(),
      pincode: document.getElementById("pincode").value.trim(),
      aadharNumber: document.getElementById("aadharNumber").value.trim()
    };

    // Validate before sending
    if (!validateForm(customerData)) return;

    try {
      // Send data to backend
      const response = await fetch("http://51.20.82.164:8080/smartBank/customer/createCustomer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData)
      });

      const result = await response.text();

      if (result.includes("Customer saved successfully")) {
        showPopup("🎉 Registration successful! We'll verify your details soon.", "success");
        form.reset();
      } else {
        showPopup("⚠️ Submission failed. Please verify your inputs.", "error");
      }
    } catch (error) {
      console.error("Error:", error);
      showPopup("❌ Server connection failed. Try again later.", "error");
    }
  });
});
