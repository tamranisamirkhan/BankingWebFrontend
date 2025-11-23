document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("openAccountForm");

  // 🔹 Popup Message Box
  function showPopup(message, type) {
    const popup = document.createElement("div");
    popup.className = `popup ${type}`;
    popup.textContent = message;

    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), 4000);
  }

  // 🔹 Validate Inputs
  function validateForm(data) {
    if (!/^\d{10}$/.test(data.phoneNumber)) {
      showPopup("📱 Invalid phone number (must be 10 digits)", "error");
      return false;
    }
    if (!/^\d{12}$/.test(data.aadharNumber)) {
      showPopup("🪪 Invalid Aadhar number (must be 12 digits)", "error");
      return false;
    }
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(data.panNumber)) {
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

    // Validate Fields
    if (!validateForm(customerData)) return;

    try {
      const response = await fetch("http://51.20.82.164:8080/smartBank/customer/createCustomer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customerData)
      });

      const result = await response.json();

      // SUCCESS
      if (response.status === 201 || result.status === "CREATED") {
        showPopup("🎉 Registration successful! A confirmation email has been sent.", "success");

        setTimeout(() => {
          window.location.href = "../index.html";
        }, 2500);

        form.reset();
        return;
      }

      // ERROR HANDLING
      if (response.status === 409) {
        showPopup(`⚠️ ${result.data}`, "error");
        return;
      }

      // UNKNOWN ERROR
      showPopup("⚠️ Something went wrong. Try again.", "error");

    } catch (error) {
      console.error(error);
      showPopup("❌ Server error. Please try again later.", "error");
    }
  });
});
