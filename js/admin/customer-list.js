// customer-list.js

export async function loadCustomers(currentFilter) {
  const tableBody = document.getElementById("customerTableBody");
  tableBody.innerHTML = "<tr><td colspan='8'>Loading...</td></tr>";

  try {
    const url =
      `https://smartbankofficial.online/smartBank/admin/kyc?status=${currentFilter}`;

    const res = await fetch(url, {
      method: "GET",
      credentials: "include"
    });

    if (!res.ok) throw new Error("Failed to fetch");

    const customers = await res.json();
    renderCustomers(customers);
    return customers;

  } catch (e) {
    console.error(e);
    tableBody.innerHTML =
      "<tr><td colspan='8'>❌ Error loading customers</td></tr>";
    return [];
  }
}

export function renderCustomers(customers) {
  const tableBody = document.getElementById("customerTableBody");
  tableBody.innerHTML = "";

  if (!customers.length) {
    tableBody.innerHTML =
      "<tr><td colspan='8'>No customers found.</td></tr>";
    return;
  }

  customers.forEach(c => {
    // ✅ NORMALIZE ID (this is the key)
    const customerId = c.customerId ?? c.id;

    if (!customerId) {
      console.warn("Customer without ID:", c);
      return;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${customerId}</td>
      <td>${c.fullName || "-"}</td>
      <td>${c.bod ? new Date(c.bod).toLocaleDateString() : "-"}</td>
      <td>${c.gender || "-"}</td>
      <td>${c.phoneNumber || "-"}</td>
      <td>${c.email || "-"}</td>
      <td>${c.address || "-"}</td>
      <td>
        <button
          class="action-btn small review-btn"
          data-id="${customerId}">
          Review
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}
