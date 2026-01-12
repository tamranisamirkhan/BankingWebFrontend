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

      const data = await res.json();

      // ================= MAP DTO → UI =================
      document.getElementById("custName").innerText = data.fullName ?? "-";
      document.getElementById("custEmail").innerText = data.email ?? "-";
      document.getElementById("custPhone").innerText = data.phoneNumber ?? "-";
      document.getElementById("custAddress").innerText = data.address ?? "-";
      document.getElementById("custKycStatus").innerText = data.kycStatus ?? "-";
      document.getElementById("custAccountStatus").innerText = data.customerStatus ?? "-";

      // Correct DTO field: dob
      document.getElementById("custDob").innerText =
        data.dob ? new Date(data.dob).toLocaleDateString() : "-";

      // ================= DOCUMENT STREAMING =================
      document.getElementById("aadhaarFrontImg").src =
        `${BASE_URL}/${customerId}/document/AADHAAR_FRONT`;

      document.getElementById("aadhaarBackImg").src =
        `${BASE_URL}/${customerId}/document/AADHAAR_BACK`;

      document.getElementById("panImg").src =
        `${BASE_URL}/${customerId}/document/PAN`;

      // ================= LOCK ACTIONS =================
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

  // ================= APPROVE =================
  document.getElementById("approveBtn").onclick = async () => {
    if (!confirm("Approve this KYC?")) return;

    const res = await fetch(`${BASE_URL}/${customerId}/approve`, {
      method: "POST",
      credentials: "include"
    });

    if (res.ok) {
      alert("KYC approved");
      window.location.href = "admin-dashboard.html";
    } else {
      alert("Approval failed");
    }
  };

  // ================= REJECT =================
  document.getElementById("rejectBtn").onclick = async () => {
    const reason = document.getElementById("rejectReason").value.trim();
    if (!reason) {
      alert("Rejection reason required");
      return;
    }

    if (!confirm("Reject this KYC?")) return;

    const res = await fetch(`${BASE_URL}/${customerId}/reject`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason })
    });

    if (res.ok) {
      alert("KYC rejected");
      window.location.href = "admin-dashboard.html";
    } else {
      alert("Rejection failed");
    }
  };

  loadKycDetails();
});
