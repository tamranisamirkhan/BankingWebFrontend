document.addEventListener("DOMContentLoaded", () => {

  const params = new URLSearchParams(window.location.search);
  const customerId = params.get("id");

  if (!customerId) {
    alert("Invalid request");
    window.location.href = "admin-dashboard.html";
    return;
  }

  const BASE_URL = "https://smartbankofficial.online/smartBank/admin/kyc";

  async function loadKycDetails() {
    try {
      const res = await fetch(`${BASE_URL}/${customerId}`, {
        credentials: "include"
      });

      if (!res.ok) {
        alert("Failed to load KYC details");
        return;
      }

      const rawData = await res.json();

      // ✅ normalize bod → dob
      const data = {
        ...rawData,
        dob: rawData.bod
      };

      document.getElementById("custName").innerText = data.fullName ?? "-";
      document.getElementById("custEmail").innerText = data.email ?? "-";
      document.getElementById("custPhone").innerText = data.phoneNumber ?? "-";
      document.getElementById("custAddress").innerText = data.address ?? "-";
      document.getElementById("custKycStatus").innerText = data.kycStatus ?? "-";
      document.getElementById("custAccountStatus").innerText = data.customerStatus ?? "-";

      document.getElementById("custDob").innerText =
        data.dob ? new Date(data.dob).toLocaleDateString() : "-";

      document.getElementById("aadhaarFrontImg").src =
        `${BASE_URL}/${customerId}/document/AADHAAR_FRONT`;
      document.getElementById("aadhaarBackImg").src =
        `${BASE_URL}/${customerId}/document/AADHAAR_BACK`;
      document.getElementById("panImg").src =
        `${BASE_URL}/${customerId}/document/PAN`;

      if (data.kycStatus !== "SUBMITTED") {
        document.getElementById("approveBtn").disabled = true;
        document.getElementById("rejectBtn").disabled = true;
        document.getElementById("rejectReason").disabled = true;
      }

    } catch (err) {
      console.error(err);
      alert("Unexpected error while loading KYC");
    }
  }

  loadKycDetails();
});
