// customer-actions.js

export async function updateStatus(id, action) {
  let endpoint = "";
  let method = "POST";

  switch (action) {
    case "APPROVE": endpoint = `approveCustomer/${id}`; break;
    case "REJECT": endpoint = `rejectCustomer/${id}`; break;

  }

  try {
    const res = await fetch(`https://smartbankofficial.online/smartBank/admin/${endpoint}`, {
      method,
      credentials: "include",
    });

    const msg = await res.text();
    alert(msg);

    document.getElementById("customerModal").style.display = "none";

    // Refresh list
    window.loadCustomer();

  } catch (e) {
    alert("❌ " + e.message);
  }
}
