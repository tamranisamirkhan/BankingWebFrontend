document.addEventListener("DOMContentLoaded", () => {

    fetch("https://smartbankofficial.online/smartBank/customer/dashboard", {
        method: "GET",
        credentials: "include",   // 🔴 very important
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(async res => {

            if (res.status === 401 || res.status === 403) {
                window.location.href = "../pages/login.html";
                return;
            }

            return res.json();
        })
        .then(response => {

            if (!response || !response.data) {
                showEmptyTransactions();
                return;
            }

            const dashboard = response.data;

            // Header
            document.getElementById("username").textContent =
                dashboard.user.fullName;

            // Account card
            document.getElementById("accountNumber").textContent =
                dashboard.account.accountNumberMasked;

            document.getElementById("accountType").textContent =
                dashboard.account.accountType;

            document.getElementById("accountStatus").textContent =
                dashboard.account.accountStatus;

            document.getElementById("balance").textContent =
                Number(dashboard.account.balance).toFixed(2);

            // Recent transactions
            renderTransactions(dashboard.recentTransactions);
        })
        .catch(err => {
            console.error(err);
            showEmptyTransactions();
        });

    function renderTransactions(transactions) {

        const tbody = document.getElementById("transactions");
        tbody.innerHTML = "";

        if (!transactions || transactions.length === 0) {
            showEmptyTransactions();
            return;
        }

        transactions.forEach(tx => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${formatDate(tx.transactionDate)}</td>
                <td>${tx.description}</td>
                <td>${tx.type}</td>
                <td>₹${Number(tx.amount).toFixed(2)}</td>
                <td>${tx.status}</td>
            `;

            tbody.appendChild(row);
        });
    }

    function showEmptyTransactions() {
        const tbody = document.getElementById("transactions");
        tbody.innerHTML =
            "<tr><td colspan='5'>No transactions found.</td></tr>";
    }

    function formatDate(dateStr) {
        return dateStr; // yyyy-MM-dd
    }

});
