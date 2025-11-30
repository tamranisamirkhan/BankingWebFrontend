document.getElementById("signupForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const user = {
        username: document.getElementById("username").value.trim(),
        email: document.getElementById("email").value.trim(),
        phoneNumber: document.getElementById("phoneNumber").value.trim(),
        password: document.getElementById("password").value.trim(),
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        dateOfBirth: document.getElementById("dateOfBirth").value,
        gender: document.getElementById("gender").value,
        address: document.getElementById("address").value.trim(),
        role: document.getElementById("role").value
    };

    // Basic frontend validation
    if (!user.email.includes("@")) {
        alert("Please enter a valid email address");
        return;
    }

    fetch("http://smartbankofficial.online/smartBank/customer/createCustomer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
    })
    .then(response => {
        if(response.ok) return response.json();
        else throw new Error("Registration failed. Please check your details.");
    })
    .then(data => {
        alert(`Registration successful! Welcome ${data.firstName}`);
        // Redirect to login page
        window.location.href = "../index.html";
    })
    .catch(error => {
        console.error("Error:", error);
        alert(error.message);
    });
});
