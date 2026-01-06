// open-account.js
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("openAccountForm");

    function showPopup(message, type) {
        const popup = document.createElement("div");
        popup.className = `popup ${type}`;
        popup.textContent = message;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 3500);
    }

    function validateForm(data) {
        if (!data.fullName || data.fullName.length < 3) {
            showPopup("Full Name must be at least 3 characters", "error");
            return false;
        }
        if (!/^\d{10}$/.test(data.phoneNumber)) {
            showPopup("Invalid Phone Number", "error");
            return false;
        }
        if (!/^\d{12}$/.test(data.aadharNumber)) {
            showPopup("Invalid Aadhaar Number", "error");
            return false;
        }
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(data.panNumber)) {
            showPopup("Invalid PAN Format (ABCDE1234F)", "error");
            return false;
        }
        if (!/^\d{6}$/.test(data.pincode)) {
            showPopup("Invalid Pincode", "error");
            return false;
        }
        if (!data.email.includes("@")) {
            showPopup("Invalid Email Address", "error");
            return false;
        }
        if (!data.address || data.address.length < 5) {
            showPopup("Invalid Address", "error");
            return false;
        }
        if (!data.city || !data.state || !data.country || !data.bod) {
            showPopup("All fields are required", "error");
            return false;
        }
        return true;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const customerData = {
            fullName: form.fullName.value.trim(),
            bod: form.bod.value,
            gender: form.gender.value,
            phoneNumber: form.phoneNumber.value.trim(),
            email: form.email.value.trim(),
            address: form.address.value.trim(),
            city: form.city.value.trim(),
            state: form.state.value.trim(),
            country: form.country.value.trim(),
            pincode: form.pincode.value.trim(),
            aadharNumber: form.aadharNumber.value.trim(),
            panNumber: form.panNumber.value.trim()
        };

        if (!validateForm(customerData)) return;

        try {
            const response = await fetch(
                "https://smartbankofficial.online/smartBank/customer/createCustomer",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(customerData)
                }
            );

            const result = await response.json();

            if (response.ok) {
                showPopup(
                    "Application submitted successfully. Please check your email to complete KYC.",
                    "success"
                );

                setTimeout(() => {
                    window.location.href = "../pages/account-created.html";
                }, 2000);

                return;
            }

            if (response.status === 409) {
                showPopup(result.data, "error");
                return;
            }

            showPopup("Something went wrong. Please try again.", "error");

        } catch (error) {
            console.error(error);
            showPopup("Server error. Try again later.", "error");
        }
    });
});
