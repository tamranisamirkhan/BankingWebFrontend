// kyc-review.js

const params = new URLSearchParams(window.location.search);
const customerId = params.get("id");

if (!customerId) {
  alert("Invalid request");
  window.location.href = "admin-dashboard.html";
}

// Base admin KYC URL
const BASE_URL = "https://smartbankofficial.online/smartBank/admin/kyc";

/* ================= LOAD DETAILS ================= */

async function loadKycDetails() {
  const res = await fetch(
    `${BASE_URL}/${customerId}`,
    { credentials: "include" }
  );

  if (!res.ok) {
    alert("Failed to load KYC data");
    window.location.href = "admin-dashboard.html";
    return;
  }

  const data = await res.json();

  // Customer details
  document.getElementById("customerDetails").innerHTML = `
    <div><strong>Name:</strong> ${data.fullName}</div>
    <div><strong>Email:</strong> ${data.email}</div>
    <div><strong>Phone:</strong> ${data.phoneNumber}</div>
    <div><strong>DOB:</strong> ${data.bod}</div>
    <div><strong>Address:</strong> ${data.address}</div>
    <div><strong>KYC Status:</strong> ${data.kycStatus}</div>
  `;

  // 🔐 Secure document streaming (BANK-GRADE)
  document.getElementById("aadhaarFront").src =
    `${BASE_URL}/${customerId}/document/AADHAAR_FRONT`;

  document.getElementById("aadhaarBack").src =
    `${BASE_URL}/${customerId}/document/AADHAAR_BACK`;

  document.getElementById("panCard").src =
    `${BASE_URL}/${customerId}/document/PAN`;
}

/* ================= APPROVE ================= */

document.getElementById("approveBtn").onclick = async () => {
  const confirmed = confirm("Are you sure you want to APPROVE this KYC?");
  if (!confirmed) return;

  const res = await fetch(
    `${BASE_URL}/${customerId}/approve`,
    {
      method: "POST",
      credentials: "include"
    }
  );

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

  const confirmed = confirm("Are you sure you want to REJECT this KYC?");
  if (!confirmed) return;

  const res = await fetch(
    `${BASE_URL}/${customerId}/reject`,
    {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason })
    }
  );

  if (res.ok) {
    alert("KYC rejected successfully");
    window.location.href = "admin-dashboard.html";
  } else {
    alert("Failed to reject KYC");
  }
};

// Init
loadKycDetails();
