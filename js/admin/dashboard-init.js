// dashboard-init.js

import { setupNavigation } from "./navigation.js";
import { setupFilters, highlightFilter } from "./filters.js";
import { loadCustomers } from "./customer-list.js";
import { setupModal, openModal } from "./customer-modal.js";

window.loadCustomers = loadCustomers;

document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin Dashboard Loaded");

  // Section map:
  const sectionMap = {
    overviewMenu: "overviewSection",
    usersMenu: "usersSection",
    accountsMenu: "accountsSection",
    transactionsMenu: "transactionsSection",
    loansMenu: "loansSection",
    reportsMenu: "reportsSection",
    notificationsMenu: "notificationsSection",
    settingsMenu: "settingsSection"
  };

  let currentFilter = "PENDING";
  const filterButtons = document.querySelectorAll(".filter-btn");

  function setFilter(f) {
    currentFilter = f;
  }

  // Setup modules
  setupNavigation(sectionMap, showSection, updateHeader, () => loadCustomers(currentFilter));
  setupFilters(filterButtons, setFilter, () => loadCustomers(currentFilter));
  setupModal();

  // Table row "View" button — event delegation
  document.getElementById("customerTableBody").addEventListener("click", async e => {
    if (e.target.classList.contains("view-btn")) {
      const id = e.target.dataset.id;
      const list = await loadCustomers(currentFilter);
      const customer = list.find(x => x.id == id);
      openModal(customer);
    }
  });

  // Default load
  showSection("overviewSection");
});

function showSection(id) {
  document.querySelectorAll(".section").forEach(s => (s.style.display = "none"));
  document.getElementById(id).style.display = "block";
}

function updateHeader(menuId) {
  const title = document.getElementById(menuId).textContent.trim();
  document.getElementById("pageTitle").textContent = title;
}
