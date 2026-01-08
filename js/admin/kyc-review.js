const params = new URLSearchParams(window.location.search);
const customerId = params.get("id");

if (!customerId) {
  alert("Invalid request");
  window.location.href = "admin-dashboard.html";
}

const BASE_URL = "https://smartbankofficial.online/smartBank/admin/kyc";

/* ================= LOAD DETAILS ================= */

async function loadKycDetails() {
  const res = await fetch(`${BASE_URL}/${customerId}`, {
    credentials: "include"
  });

  if (!res.ok) {
    alert("Failed to load KYC data");
    return;
  }

  const data = await res.json();

  // Populate details
  document.getElementById("custName").innerText = data.fullName;
  document.getElementById("custEmail").innerText = data.email;
  document.getElementById("custPhone").innerText = data.phoneNumber;
  document.getElementById("custDob").innerText = data.bod;
  document.getElementById("custAddress").innerText = data.address;
  document.getElementById("custStatus").innerText = data.kycStatus;

  // Load documents (secure streaming)
  document.getElementById("aadhaarFront").src =
    `${BASE_URL}/${customerId}/document/AADHAAR_FRONT`;

  document.getElementById("aadhaarBack").src =
    `${BASE_URL}/${customerId}/document/AADHAAR_BACK`;

  document.getElementById("panCard").src =
    `${BASE_URL}/${customerId}/document/PAN`;

  // Show decision buttons ONLY for SUBMITTED
  const decisionBox = document.getElementById("decisionBox");
  if (data.kycStatus !== "SUBMITTED") {
    decisionBox.style.display = "none";
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
