document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("transferForm");
  const confirmationBox = document.getElementById("confirmationMessage");
  const txnIdEl = document.getElementById("txnId");

  // Create dynamic message box
  const messageBox = document.createElement("div");
  messageBox.style.marginTop = "15px";
  messageBox.style.fontWeight = "bold";
  form.appendChild(messageBox);

  function showMessage(text, isSuccess = false) {
    messageBox.textContent = text;
    messageBox.style.color = isSuccess ? "green" : "red";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const transferData = {
      amount: parseFloat(document.getElementById("amount").value),
      receiversAccountNumber: document.getElementById("toAccount").value,
      pin: document.getElementById("pin").value,
      description: document.getElementById("description").value || ""
    };

    try {
      const response = await fetch(
        "https://smartbankofficial.online/smartBank/toTransfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include", // 🔥 sends JWT cookie automatically
          body: JSON.stringify(transferData)
        }
      );

      const result = await response.json();

      // 🔍 Handle all 4 cases
      if (result.status === "OK") {
        showMessage("✅ Transfer successful!", true);

        // Show success UI
        form.classList.add("hidden");
        confirmationBox.classList.remove("hidden");

        // If backend doesn't return txn id, fallback
        txnIdEl.textContent = result.timestamp || "SUCCESS";

      } else if (result.status === "BAD_REQUEST") {
        // Handle specific backend errors
        switch (result.error) {
          case "Insufficient balance":
            showMessage("❌ Insufficient balance in your account");
            break;

          case "Invalid transaction PIN":
            showMessage("❌ Invalid PIN. Please try again");
            break;

          case "Receiver account not found":
            showMessage("❌ Receiver account not found");
            break;

          default:
            showMessage("❌ " + result.error);
        }
      } else {
        showMessage("❌ Unexpected server response");
      }

    } catch (error) {
      console.error(error);
      showMessage("❌ Network error or session expired. Please login again.");
    }
  });
});