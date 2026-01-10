const params = new URLSearchParams(window.location.search);
const customerId = params.get("id");

if (!customerId) {
  alert("Invalid request");
  window.location.href = "admin-dashboard.html";
}

const BASE_URL = "https://smartbankofficial.online/smartBank/admin/kyc";

/* ================= LOAD KYC DETAILS ================= */

async function loadKycDetails() {
  const res = await fetch(`${BASE_URL}/${customerId}`, {
    credentials: "include"
  });

  if (!res.ok) {
    alert("Failed to load KYC data");
    return;
  }

  const data = await res.json();

  // ✅ Render customer details dynamically
  const infoDiv = document.getElementById("customerInfo");
  infoDiv.innerHTML = `
    <div><strong>Name:</strong> ${data.fullName}</div>
    <div><strong>Email:</strong> ${data.email}</div>
    <div><strong>Phone:</strong> ${data.phoneNumber}</div>
    <div><strong>DOB:</strong> ${data.bod}</div>
    <div><strong>Address:</strong> ${data.address}</div>
    <div><strong>KYC Status:</strong> ${data.kycStatus}</div>
  `;

  // ✅ Load documents securely
  document.getElementById("aadhaarFrontImg").src =
    `${BASE_URL}/${customerId}/document/AADHAAR_FRONT`;

  document.getElementById("aadhaarBackImg").src =
    `${BASE_URL}/${customerId}/document/AADHAAR_BACK`;

  document.getElementById("panImg").src =
    `${BASE_URL}/${customerId}/document/PAN`;

  // ✅ Hide actions if not SUBMITTED
  if (data.kycStatus !== "SUBMITTED") {
    document.getElementById("decisionBox").style.display = "none";
  }
}

/* ================= APPROVE ================= */

document.getElementById("approveBtn").onclick = async () => {
  if (!confirm("Approve this KYC?")) return;

  const res = await fetch(`${BASE_URL}/${customerId}/approve`, {
    method: "POST",
    credentials: "include"
  });

  if (res.ok) {
    alert("KYC approved successfully");
    window.location.href = "admin-dashboard.html";
  } else {
    alert("Failed to approve KYC");
  }
};

/* ================= REJECT ================= */

document.getElementById("rejectBtn").onclick = async () => {
  const reason = document.getElementById("rejectReason").value.trim();

  if (!reason) {
    alert("Rejection reason is required");
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
    alert("KYC rejected successfully");
    window.location.href = "admin-dashboard.html";
  } else {
    alert("Failed to reject KYC");
  }
};

loadKycDetails();
