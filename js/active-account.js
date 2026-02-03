document.addEventListener("DOMContentLoaded", () => {

    const messageBox = document.getElementById("message");
    const form = document.getElementById("activationForm");

    // 1️⃣ Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
        messageBox.textContent = "Invalid or missing activation link.";
        messageBox.style.color = "red";
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
        const transactionPin = document.getElementById("transactionPin").value.trim();
        const confirmTransactionPin = document.getElementById("confirmTransactionPin").value.trim();

        // 2️⃣ Basic frontend validation
        if (!password || !confirmPassword || !transactionPin || !confirmTransactionPin) {
            showError("All fields are required.");
            return;
        }

        if (password !== confirmPassword) {
            showError("Passwords do not match.");
            return;
        }

        if (transactionPin !== confirmTransactionPin) {
            showError("Transaction PINs do not match.");
            return;
        }

        if (!/^\d{4,6}$/.test(transactionPin)) {
            showError("Transaction PIN must be 4 to 6 digits.");
            return;
        }

        // 3️⃣ Build request payload (matches backend DTO)
        const data = {
            token: token,
            password: password,
            confirmPassword: confirmPassword,
            transactionPin: transactionPin,
            confirmTransactionPin: confirmTransactionPin
        };

        try {
            const response = await fetch(
                "https://smartbankofficial.online/smartBank/user/activate",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                }
            );

            const resultText = await response.text();

            if (response.ok) {
                messageBox.textContent =
                    "Account activated successfully. Redirecting to login...";
                messageBox.style.color = "lightgreen";

                setTimeout(() => {
                    window.location.href = "../pages/login.html";
                }, 2000);
            } else {
                showError(resultText || "Activation failed.");
            }

        } catch (error) {
            showError("Server error. Please try again later.");
        }
    });

    function showError(msg) {
        messageBox.textContent = msg;
        messageBox.style.color = "red";
    }
});
