const params = new URLSearchParams(window.location.search);
const customerId = params.get("customerId");

if (!customerId) {
  alert("Invalid access");
  window.location.href = "admin-dashboard.html";
}

async function loadCustomer() {
  const res = await fetch(
    `https://smartbankofficial.online/smartBank/admin/customer/${customerId}`,
    { credentials: "include" }
  );

  if (!res.ok) {
    alert("Failed to load customer");
    return;
  }

  const c = await res.json();

  document.getElementById("customerInfo").innerHTML = `
    <div><strong>Name:</strong> ${c.fullName}</div>
    <div><strong>DOB:</strong> ${new Date(c.bod).toLocaleDateString()}</div>
    <div><strong>Email:</strong> ${c.email}</div>
    <div><strong>Phone:</strong> ${c.phoneNumber}</div>
    <div><strong>Address:</strong> ${c.address}</div>
    <div><strong>Status:</strong> ${c.kycStatus}</div>
  `;

  document.getElementById("aadhaarFrontImg").src = c.aadhaarFrontPath;
  document.getElementById("aadhaarBackImg").src = c.aadhaarBackPath;
  document.getElementById("panImg").src = c.panPath;
}

document.getElementById("approveBtn").onclick = async () => {
  if (!confirm("Approve KYC for this customer?")) return;

  await fetch(
    `https://smartbankofficial.online/smartBank/admin/approveCustomer/${customerId}`,
    { method: "POST", credentials: "include" }
  );

  alert("KYC Approved");
  window.location.href = "admin-dashboard.html";
};

document.getElementById("rejectBtn").onclick = async () => {
  const reason = document.getElementById("rejectReason").value.trim();
  if (!reason) {
    alert("Rejection reason required");
    return;
  }

  await fetch(
    `https://smartbankofficial.online/smartBank/admin/rejectCustomer/${customerId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ reason })
    }
  );

  alert("KYC Rejected");
  window.location.href = "admin-dashboard.html";
};

loadCustomer();
