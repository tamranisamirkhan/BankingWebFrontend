// dashboard-init.js

import { setupNavigation } from "./navigation.js";
import { setupFilters, highlightFilter } from "./filters.js";
import { loadCustomers } from "./customer-list.js";

window.loadCustomers = loadCustomers;

document.addEventListener("DOMContentLoaded", () => {

  const sectionMap = {
    overviewMenu: "overviewSection",
    onboardingMenu: "onboardingSection",
    kycMenu: "kycSection",                 // ✅ FIXED
    customersMenu: "customersSection",
    manageUsersMenu: "manageUsersSection",
    accountsMenu: "accountsSection",
    transactionsMenu: "transactionsSection",
    loansMenu: "loansSection",
    reportsMenu: "reportsSection",
    notificationsMenu: "notificationsSection",
    settingsMenu: "settingsSection"
  };

  let currentFilter = "SUBMITTED";

  // Load default (KYC data if needed later)
  highlightFilter(
    document.querySelectorAll(".filter-btn"),
    "SUBMITTED"
  );

  const filterButtons = document.querySelectorAll(".filter-btn");

  function setFilter(f) {
    currentFilter = f;
  }

  setupNavigation(
    sectionMap,
    (sectionId) => {
      showSection(sectionId);
      updateHeaderFromSection(sectionId);

      // ✅ Load KYC when KYC section opens
      if (sectionId === "kycSection") {
        loadCustomers(currentFilter);
      }
    },
    updateHeader
  );

  setupFilters(
    filterButtons,
    setFilter,
    () => loadCustomers(currentFilter)
  );

  // ✅ FIXED: bind to correct table
  document
    .getElementById("kycTableBody")
    .addEventListener("click", e => {
      if (e.target.classList.contains("review-btn")) {
        const customerId = e.target.dataset.id;
        window.location.href =
          `../pages/kyc-review.html?id=${customerId}`;
      }
    });

  showSection("overviewSection");
});

function showSection(id) {
  document.querySelectorAll(".section")
    .forEach(s => (s.style.display = "none"));
  document.getElementById(id).style.display = "block";
}

function updateHeader(menuId) {
  document.getElementById("pageTitle").textContent =
    document.getElementById(menuId).textContent.trim();
}

// Optional helper
function updateHeaderFromSection(sectionId) {
  const menuMap = {
    kycSection: "kycMenu"
  };
  if (menuMap[sectionId]) {
    updateHeader(menuMap[sectionId]);
  }
}