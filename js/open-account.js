// open-account.js
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("openAccountForm");

    // Show popup message
    function showPopup(message, type) {
        const popup = document.createElement("div");
        popup.className = `popup ${type}`;
        popup.textContent = message;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 3000);
    }

    // Validate input fields
    function validateForm(data) {
        if (!data.fullName || data.fullName.length < 3) {
            showPopup("Full Name must be at least 3 characters", "error");
            return false;
        }

        if (!/^\d{10}$/.test(data.phoneNumber)) {
            showPopup("Invalid Phone Number (must be 10 digits)", "error");
            return false;
        }

        if (!/^\d{12}$/.test(data.aadharNumber)) {
            showPopup("Invalid Aadhaar Number (must be 12 digits)", "error");
            return false;
        }

        if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(data.panNumber)) {
            showPopup("Invalid PAN Format (ABCDE1234F)", "error");
            return false;
        }

        if (!/^\d{6}$/.test(data.pincode)) {
            showPopup("Invalid Pincode (6 digits required)", "error");
            return false;
        }

        if (!data.email.includes("@") || !data.email.includes(".")) {
            showPopup("Invalid Email Address", "error");
            return false;
        }

        if (!data.address || data.address.length < 5) {
            showPopup("Address must be at least 5 characters", "error");
            return false;
        }

        if (!data.city) {
            showPopup("City is required", "error");
            return false;
        }

        if (!data.state) {
            showPopup("State is required", "error");
            return false;
        }

        if (!data.country) {
            showPopup("Country is required", "error");
            return false;
        }

        if (!data.bod) {
            showPopup("Date of Birth is required", "error");
            return false;
        }

        return true; // All validations passed
    }

    // Submit form
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Gather inputs
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

        // Validate user input
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

            // Success: Customer created and customerId returned
            if ((response.status === 200 || response.status === 201) && result.data != null) {
                const customerId = result.data;
                showPopup("Registration Successful! Redirecting to KYC...", "success");

                setTimeout(() => {
                    window.location.href = `../pages/kyc-upload.html?customerId=${customerId}`;
                }, 1500);

                return;
            }

            // Conflict: Duplicate Aadhaar / PAN / Email
            if (response.status === 409) {
                showPopup(result.data, "error");
                return;
            }

            showPopup("Something went wrong. Try again.", "error");

        } catch (error) {
            console.error(error);
            showPopup("Server error. Try again later.", "error");
        }
    });
});
