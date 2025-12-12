document.addEventListener("DOMContentLoaded", () => {

    const MAX_SIZE = 300 * 1024; // 300 KB

    const front = document.getElementById("aadhaarFront");
    const back = document.getElementById("aadhaarBack");
    const pan = document.getElementById("panCard");

    const previewFront = document.getElementById("previewFront");
    const previewBack = document.getElementById("previewBack");
    const previewPan = document.getElementById("previewPan");

    // Preview and size validation
    function validateAndPreview(input, preview) {
        const file = input.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Only image files allowed!");
            input.value = "";
            return;
        }

        if (file.size > MAX_SIZE) {
            alert("File size must be under 300 KB!");
            input.value = "";
            return;
        }

        // Preview
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

    // Submit KYC Form
    document.getElementById("kycForm").addEventListener("submit", async (e) => {
        e.preventDefault();

        const params = new URLSearchParams(window.location.search);
        const customerId = params.get("customerId");

        if (!customerId) {
            alert("Customer ID missing. Please register first.");
            return;
        }

        const formData = new FormData();
        formData.append("customerId", customerId);
        formData.append("aadhaarFront", front.files[0]);
        formData.append("aadhaarBack", back.files[0]);
        formData.append("panCard", pan.files[0]);

        try {
            const res = await fetch(
                "https://smartbankofficial.online/smartBank/customer/kyc/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

            alert(await res.text());
        } catch (error) {
            console.error(error);
            alert("Upload failed. Try again.");
        }
    });

});
