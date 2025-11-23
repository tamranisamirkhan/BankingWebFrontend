// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.getElementById("transferForm");
//   const confirmationBox = document.getElementById("confirmationMessage");
//   const txnIdEl = document.getElementById("txnId");

//   // Load user's accounts (in case multiple)
//   fetch("http://localhost:8080/api/accounts/me", {
//     method: "GET",
//     credentials: "include"
//   })
//     .then(res => res.json())
//     .then(account => {
//       const select = document.getElementById("fromAccount");
//       const option = document.createElement("option");
//       option.value = account.accountNumber;
//       option.textContent = `${account.accountType} - ${account.accountNumber}`;
//       select.appendChild(option);
//     })
//     .catch(() => alert("Session expired. Please log in again."));

//   // Handle form submit
//   form.addEventListener("submit", e => {
//     e.preventDefault();

//     const transferData = {
//       fromAccount: document.getElementById("fromAccount").value,
//       toAccount: document.getElementById("toAccount").value,
//       amount: parseFloat(document.getElementById("amount").value),
//       description: document.getElementById("description").value
//     };

//     fetch("http://localhost:8080/api/transactions/transfer", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       credentials: "include",
//       body: JSON.stringify(transferData)
//     })
//       .then(res => {
//         if (!res.ok) throw new Error("Transfer failed");
//         return res.json();
//       })
//       .then(data => {
//         form.classList.add("hidden");
//         confirmationBox.classList.remove("hidden");
//         txnIdEl.textContent = data.transactionId;
//       })
//       .catch(err => {
//         alert("❌ " + err.message);
//       });
//   });
// });
