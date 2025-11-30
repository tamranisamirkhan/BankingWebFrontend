document.addEventListener("DOMContentLoaded", () => {

    const messageBox = document.getElementById("message");
    const form = document.getElementById("activationForm");

    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (!token) {
        messageBox.textContent = "Invalid activation link.";
        messageBox.style.color = "red";
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = {
            token: token,
            username: document.getElementById("username").value.trim(),
            password: document.getElementById("password").value.trim()
        };

        try {
            const response = await fetch("https://api.smartbankofficial.online/smartBank/customer/activate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const text = await response.text();

            if (response.ok) {
                messageBox.textContent = "Account activated successfully! Redirecting...";
                messageBox.style.color = "lightgreen";

                setTimeout(() => {
                    window.location.href = "../pages/login.html";
                }, 2000);
            } else {
                messageBox.textContent = text;
                messageBox.style.color = "red";
            }

        } catch (error) {
            messageBox.textContent = "Server error. Try later.";
            messageBox.style.color = "red";
        }
    });
});
