// document.addEventListener("DOMContentLoaded", () => {
//   // Fetch account data
//   fetch("http://localhost:8080/api/accounts/me", {
//     method: "GET",
//     credentials: "include"
//   })
//     .then(response => {
//       if (!response.ok) throw new Error("Unauthorized");
//       return response.json();
//     })
//     .then(data => {
//       document.getElementById("username").textContent = data.user.username;
//       document.getElementById("accountNumber").textContent = data.accountNumber;
//       document.getElementById("balance").textContent = data.balance.toFixed(2);
//       document.getElementById("accountType").textContent = data.accountType;
//       document.getElementById("accountStatus").textContent = data.status;
//       loadTransactions();
//     })
//     .catch(() => {
//       alert("Session expired! Please log in again.");
//       window.location.href = "../login.html";
//     });

//   // Fetch transactions (sample API)
//   function loadTransactions() {
//     fetch("http://localhost:8080/api/transactions/recent", {
//       method: "GET",
//       credentials: "include"
//     })
//       .then(response => response.json())
//       .then(transactions => {
//         const tbody = document.getElementById("transactions");
//         tbody.innerHTML = "";
//         transactions.forEach(tx => {
//           const row = document.createElement("tr");
//           row.innerHTML = `
//             <td>${tx.date}</td>
//             <td>${tx.description}</td>
//             <td>${tx.type}</td>
//             <td>$${tx.amount.toFixed(2)}</td>
//             <td>${tx.status}</td>
//           `;
//           tbody.appendChild(row);
//         });
//       })
//       .catch(() => {
//         document.getElementById("transactions").innerHTML =
//           "<tr><td colspan='5'>No transactions found</td></tr>";
//       });
//   }

//   // Logout
//   document.getElementById("logoutBtn").addEventListener("click", () => {
//     fetch("http://localhost:8080/user/auth/logout", {
//       method: "POST",
//       credentials: "include"
//     }).finally(() => {
//       window.location.href = "../login.html";
//     });
//   });
// });
