// // === SMARTBANK ADMIN DASHBOARD ===
// // Clean Manage Users section with popup view + live status update

// document.addEventListener("DOMContentLoaded", () => {
//   console.log("✅ Admin Dashboard loaded");

//   // ==== SECTION NAVIGATION ====
//   const menuItems = document.querySelectorAll(".menu-item");
//   const sections = document.querySelectorAll(".section");
//   const pageTitle = document.getElementById("pageTitle");
//   const pageSubtitle = document.getElementById("pageSubtitle");

//   const sectionMap = {
//     overviewMenu: "overviewSection",
//     usersMenu: "usersSection",
//     accountsMenu: "accountsSection",
//     transactionsMenu: "transactionsSection",
//     loansMenu: "loansSection",
//     reportsMenu: "reportsSection",
//     notificationsMenu: "notificationsSection",
//     settingsMenu: "settingsSection"
//   };

//   function showSection(sectionId) {
//     sections.forEach(s => (s.style.display = "none"));
//     document.getElementById(sectionId).style.display = "block";
//   }

//   function updateHeader(menuId) {
//     const text = document.getElementById(menuId).textContent.trim();
//     pageTitle.textContent = text;
//     pageSubtitle.textContent =
//       text === "Manage Users"
//         ? "Approve, reject, and manage customer applications."
//         : "Welcome back, Admin — system snapshot.";
//   }

//   menuItems.forEach(item => {
//     item.addEventListener("click", () => {
//       menuItems.forEach(i => i.classList.remove("active"));
//       item.classList.add("active");
//       const sectionId = sectionMap[item.id];
//       if (sectionId) {
//         showSection(sectionId);
//         updateHeader(item.id);

//         // When Manage Users clicked, show pending by default
//         if (item.id === "usersMenu") {
//           currentFilter = "PENDING";
//           highlightFilterButton();
//           loadCustomers();
//         }
//       }
//     });
//   });

//   // ==== MANAGE USERS ====
//   const filterButtons = document.querySelectorAll(".filter-btn");
//   const tableBody = document.getElementById("customerTableBody");
//   const reloadBtn = document.getElementById("reloadCustomers");
//   const modal = document.getElementById("customerModal");
//   const closeModal = document.getElementById("closeModal");
//   const detailsContainer = document.getElementById("customerDetails");
//   const modalActions = document.getElementById("modalActions");

//   let allCustomers = [];
//   let currentFilter = "PENDING";

//   // Highlight active filter button
//   function highlightFilterButton() {
//     filterButtons.forEach(btn => {
//       btn.classList.toggle("active", btn.dataset.filter === currentFilter);
//     });
//   }

//   // Load customers from backend
//   async function loadCustomers() {
//     tableBody.innerHTML = "<tr><td colspan='8'>Loading...</td></tr>";

//     try {
//       const url = `https://smartbankofficial.online/smartBank/admin/getAllCustomer?status=${currentFilter}`;
//       const res = await fetch(url, { method: "GET", credentials: "include" });
//       if (!res.ok) throw new Error("Failed to fetch");

//       allCustomers = await res.json();
//       renderCustomers();
//     } catch (e) {
//       console.error(e);
//       tableBody.innerHTML = `<tr><td colspan='8'>❌ Error loading ${currentFilter}</td></tr>`;
//     }
//   }

//   // Render customer list
//   function renderCustomers() {
//     tableBody.innerHTML = "";

//     if (!allCustomers || allCustomers.length === 0) {
//       tableBody.innerHTML = `<tr><td colspan='8'>No ${currentFilter.toLowerCase()} customers found.</td></tr>`;
//       return;
//     }

//     allCustomers.forEach(c => {
//       const tr = document.createElement("tr");
//       tr.innerHTML = `
//         <td>${c.id}</td>
//         <td>${c.fullName || "-"}</td>
//         <td>${c.bod ? new Date(c.bod).toLocaleDateString() : "-"}</td>
//         <td>${c.gender || "-"}</td>
//         <td>${c.phoneNumber || "-"}</td>
//         <td>${c.email || "-"}</td>
//         <td>${c.address || "-"}</td>
//         <td><button class="action-btn" onclick="viewCustomer(${c.id})">View</button></td>
//       `;
//       tableBody.appendChild(tr);
//     });
//   }

//   // === Modal logic ===
//   window.viewCustomer = function (id) {
//     const c = allCustomers.find(x => x.id === id);
//     if (!c) return;

//     const entries = [
//       ["Full Name", c.fullName],
//       ["Date of Birth", c.bod ? new Date(c.bod).toLocaleDateString() : "-"],
//       ["Gender", c.gender],
//       ["Phone", c.phoneNumber],
//       ["Email", c.email],
//       ["Address", c.address],
//       ["City", c.city],
//       ["State", c.state],
//       ["Country", c.country],
//       ["Pincode", c.pincode],
//       ["Aadhar", c.aadharNumber],
//       ["PAN", c.panNumber],
//       ["Status", c.status]
//     ];

//     detailsContainer.innerHTML = entries
//       .map(([k, v]) => `<div><strong>${k}:</strong> ${v || "-"}</div>`)
//       .join("");

//     modalActions.innerHTML = "";
//     if (c.status === "PENDING") {
//       modalActions.appendChild(createActionButton("Approve", "#28a745", () => updateStatus(c.id, "APPROVED")));
//       modalActions.appendChild(createActionButton("Reject", "#d9534f", () => updateStatus(c.id, "REJECT")));
//     } else if (c.status === "ACTIVE") {
//       modalActions.appendChild(createActionButton("Deactivate", "#ffc107", () => updateStatus(c.id, "INACTIVE")));
//     } else if (c.status === "INACTIVE") {
//       modalActions.appendChild(createActionButton("Reactivate", "#17a2b8", () => updateStatus(c.id, "ACTIVATE")));
//     } else if (c.status === "REJECTED") {
//       modalActions.appendChild(createActionButton("Delete", "#dc3545", () => updateStatus(c.id, "DELETE")));
//     }

//     modal.style.display = "flex";
//   };

//   closeModal.onclick = () => (modal.style.display = "none");
//   window.onclick = e => {
//     if (e.target === modal) modal.style.display = "none";
//   };

//   function createActionButton(label, color, onClick) {
//     const btn = document.createElement("button");
//     btn.textContent = label;
//     btn.className = "action-btn";
//     btn.style.backgroundColor = color;
//     btn.onclick = onClick;
//     btn.style.margin = "0 5px";
//     return btn;
//   }

//   // === Update status dynamically ===
//   async function updateStatus(id, action) {
//     let endpoint = "";
//     let method = "POST";

//     switch (action) {
//       case "APPROVE": endpoint = `approveCustomer/${id}`; break;
//       case "REJECT": endpoint = `rejectCustomer/${id}`; break;
//       case "INACTIVE": endpoint = `inactiveCustomer/${id}`; break;
//       case "ACTIVATE": endpoint = `activateCustomer/${id}`; break;
//       case "DELETE": endpoint = `deleteCustomer/${id}`; method = "DELETE"; break;
//     }

//     try {
//       const res = await fetch(`https://smartbankofficial.online/smartBank/admin/${endpoint}`, { method, credentials: "include" });
//       const msg = await res.text();
//       alert(msg);
//       modal.style.display = "none";
//       loadCustomers(); // reload data after action
//     } catch (e) {
//       alert("❌ " + e.message);
//     }
//   }

//   // Filter buttons behavior
//   filterButtons.forEach(btn => {
//     btn.addEventListener("click", () => {
//       currentFilter = btn.dataset.filter;
//       highlightFilterButton();
//       loadCustomers();
//     });
//   });

//   // Reload button
//   if (reloadBtn) reloadBtn.addEventListener("click", loadCustomers);

//   // Default section
//   showSection("overviewSection");
// });
