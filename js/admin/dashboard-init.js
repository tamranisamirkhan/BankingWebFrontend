// dashboard-init.js

import { setupNavigation } from "./navigation.js";
import { setupFilters, highlightFilter } from "./filters.js";
import { loadCustomers } from "./customer-list.js";

window.loadCustomers = loadCustomers;

document.addEventListener("DOMContentLoaded", () => {
  console.log("Admin Dashboard Loaded");

  // Section map
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

  // Default filter
  let currentFilter = "SUBMITTED";
  loadCustomers(currentFilter);

  highlightFilter(
    document.querySelectorAll(".filter-btn"),
    "SUBMITTED"
  );

  const filterButtons = document.querySelectorAll(".filter-btn");

  function setFilter(f) {
    currentFilter = f;
  }

  // Setup navigation & filters
  setupNavigation(
    sectionMap,
    showSection,
    updateHeader,
    () => loadCustomers(currentFilter)
  );

  setupFilters(
    filterButtons,
    setFilter,
    () => loadCustomers(currentFilter)
  );

  // ✅ STEP 5: Handle Review button click
  document
    .getElementById("customerTableBody")
    .addEventListener("click", (e) => {

      if (e.target.classList.contains("review-btn")) {
        const customerId = e.target.dataset.id;

        window.location.href =
          `../pages/kyc-review.html?id=${customerId}`;
      }
    });

  // Default section
  showSection("overviewSection");
});

function showSection(id) {
  document
    .querySelectorAll(".section")
    .forEach(s => (s.style.display = "none"));

  document.getElementById(id).style.display = "block";
}

function updateHeader(menuId) {
  const title =
    document.getElementById(menuId).textContent.trim();

  document.getElementById("pageTitle").textContent = title;
}
