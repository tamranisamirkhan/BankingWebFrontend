document.addEventListener("DOMContentLoaded", () => {

    const MAX_SIZE = 300 * 1024;

    const front = document.getElementById("aadhaarFront");
    const back = document.getElementById("aadhaarBack");
    const pan = document.getElementById("panCard");

    const previewFront = document.getElementById("previewFront");
    const previewBack = document.getElementById("previewBack");
    const previewPan = document.getElementById("previewPan");

    const submitBtn = document.getElementById("submitBtn");
    const statusMessage = document.getElementById("statusMessage");

    // 🔐 Read token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
        window.location.href = "/pages/kyc-expired.html";
        return;
    }

    function validateAndPreview(input, preview) {
        const file = input.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Only image files allowed");
            input.value = "";
            return;
        }

        if (file.size > MAX_SIZE) {
            alert("File size must be under 300 KB");
            input.value = "";
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            preview.src = reader.result;
            preview.classList.remove("hidden");
        };
        reader.readAsDataURL(file);
    }

    front.addEventListener("change", () => validateAndPreview(front, previewFront));
    back.addEventListener("change", () => validateAndPreview(back, previewBack));
    pan.addEventListener("change", () => validateAndPreview(pan, previewPan));

    document.getElementById("kycForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        if (!front.files[0] || !back.files[0] || !pan.files[0]) {
            statusMessage.innerText = "Please upload all required documents.";
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = "Submitting...";
        statusMessage.innerText = "";

        const formData = new FormData();
        formData.append("token", token);
        formData.append("aadhaarFront", front.files[0]);
        formData.append("aadhaarBack", back.files[0]);
        formData.append("panCard", pan.files[0]);

        try {
            const res = await fetch(
                "https://smartbankofficial.online/smartBank/customer/upload/kyc",
                {
                    method: "POST",
                    body: formData
                }
            );

            const text = await res.text();

            if (res.ok) {
                // ✅ SUCCESS → redirect
                window.location.href = "/pages/kyc-submitted.html";
            } else {
                // ❌ expired or reused link
                window.location.href = "/pages/kyc-expired.html";
            }

        } catch (err) {
            submitBtn.disabled = false;
            submitBtn.innerText = "Submit KYC";
            statusMessage.innerText = "Upload failed. Please try again later.";
        }
    });
});
