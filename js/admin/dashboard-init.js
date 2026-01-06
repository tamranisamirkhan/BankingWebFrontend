// dashboard-init.js

import { setupNavigation } from "./navigation.js";
import { setupFilters, highlightFilter } from "./filters.js";
import { loadCustomers } from "./customer-list.js";


window.loadCustomer = loadCustomers;

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

  // Setup modules
  setupNavigation(sectionMap, showSection, updateHeader, () => loadCustomers(currentFilter));
  setupFilters(filterButtons, setFilter, () => loadCustomers(currentFilter));


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
