// customer-modal.js

import { updateStatus } from "./customer-actions.js";

export function setupModal() {
  const modal = document.getElementById("customerModal");
  const closeModal = document.getElementById("closeModal");

  closeModal.onclick = () => (modal.style.display = "none");
  window.onclick = e => { if (e.target === modal) modal.style.display = "none"; };
}

export function openModal(customer) {
  const modal = document.getElementById("customerModal");
  const detailsContainer = document.getElementById("customerDetails");
  const modalActions = document.getElementById("modalActions");

  const entries = [
    ["Full Name", customer.fullName],
    ["DOB", customer.bod ? new Date(customer.bod).toLocaleDateString() : "-"],
    ["Gender", customer.gender],
    ["Phone", customer.phoneNumber],
    ["Email", customer.email],
    ["Address", customer.address],
    ["City", customer.city],
    ["State", customer.state],
    ["Country", customer.country],
    ["Pincode", customer.pincode],
    ["Aadhar", customer.aadharNumber],
    ["PAN", customer.panNumber],
    ["Status", customer.status]
  ];

  detailsContainer.innerHTML = entries
    .map(([k, v]) => `<div><strong>${k}:</strong> ${v || "-"}</div>`)
    .join("");

  modalActions.innerHTML = "";

  const actions = {
    PENDING: ["Approve", "Reject"],
    ACTIVE: ["Deactivate"],
    INACTIVE: ["Reactivate"],
    REJECTED: ["Delete"]
  };

  if (actions[customer.status]) {
    actions[customer.status].forEach(action => {
      const btn = document.createElement("button");
      btn.textContent = action;
      btn.className = "action-btn";
      btn.onclick = () => updateStatus(customer.id, action.toUpperCase());
      modalActions.appendChild(btn);
    });
  }

  modal.style.display = "flex";
}
