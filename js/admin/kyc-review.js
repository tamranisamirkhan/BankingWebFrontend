document.addEventListener("DOMContentLoaded", () => {

  /* ================== HELPERS ================== */
  function $(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const el = $(id);
    if (!el) {
      console.error(`Missing element: ${id}`);
      return;
    }
    el.innerText = value;
  }

  function setImg(id, src) {
    const el = $(id);
    if (!el) {
      console.error(`Missing image: ${id}`);
      return;
    }
    el.src = src;
  }

  function setLoading(btn, text, loading) {
    if (!btn) return;
    btn.disabled = loading;
    btn.dataset.originalText ||= btn.innerText;
    btn.innerText = loading ? text : btn.dataset.originalText;
  }

  /* ================== READ CUSTOMER ID ================== */
  const params = new URLSearchParams(window.location.search);
  const customerId = params.get("id");

  if (!customerId) {
    alert("Invalid request: customer id missing");
    window.location.href = "admin-dashboard.html";
    return;
  }

  const BASE_URL =
    "https://smartbankofficial.online/smartBank/admin/kyc";

  /* ================== LOAD KYC DETAILS ================== */
  async function loadKycDetails() {
    try {
      const res = await fetch(`${BASE_URL}/${customerId}`, {
        credentials: "include"
      });

      if (!res.ok) {
        alert("Failed to load KYC details");
        return;
      }

      const raw = await res.json();

      // normalize backend field
      const data = {
        ...raw,
        dob: raw.bod
      };

      setText("custName", data.fullName ?? "-");
      setText("custEmail", data.email ?? "-");
      setText("custPhone", data.phoneNumber ?? "-");
      setText("custAddress", data.address ?? "-");
      setText("custKycStatus", data.kycStatus ?? "-");
      setText("custAccountStatus", data.customerStatus ?? "-");
      setText(
        "custDob",
        data.dob ? new Date(data.dob).toLocaleDateString() : "-"
      );

      setImg("aadhaarFrontImg",
        `${BASE_URL}/${customerId}/document/AADHAAR_FRONT`);
      setImg("aadhaarBackImg",
        `${BASE_URL}/${customerId}/document/AADHAAR_BACK`);
      setImg("panImg",
        `${BASE_URL}/${customerId}/document/PAN`);

      // 🔒 Lock actions if already processed
      if (data.kycStatus !== "SUBMITTED") {
        $("approveBtn").disabled = true;
        $("rejectBtn").disabled = true;
        $("rejectReason").disabled = true;
      }

    } catch (err) {
      console.error(err);
      alert("Unexpected error while loading KYC");
    }
  }

  /* ================== APPROVE ================== */
  $("approveBtn")?.addEventListener("click", async () => {
    if (!confirm("Approve this KYC?")) return;

    const btn = $("approveBtn");
    setLoading(btn, "Approving...", true);

    try {
      const res = await fetch(
        `${BASE_URL}/${customerId}/approve`,
        {
          method: "POST",
          credentials: "include"
        }
      );

      if (!res.ok) throw new Error();

      alert("KYC approved successfully");
      window.location.href = "admin-dashboard.html";

    } catch (err) {
      alert("Failed to approve KYC");
    } finally {
      setLoading(btn, "Approve KYC", false);
    }
  });

  /* ================== REJECT ================== */
  $("rejectBtn")?.addEventListener("click", async () => {
    const reason = $("rejectReason")?.value.trim();

    if (!reason) {
      alert("Rejection reason is required");
      return;
    }

    if (!confirm("Reject this KYC?")) return;

    const btn = $("rejectBtn");
    setLoading(btn, "Rejecting...", true);

    try {
      const res = await fetch(
        `${BASE_URL}/${customerId}/reject`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reason })
        }
      );

      if (!res.ok) throw new Error();

      alert("KYC rejected");
      window.location.href = "admin-dashboard.html";

    } catch (err) {
      alert("Failed to reject KYC");
    } finally {
      setLoading(btn, "Reject KYC", false);
    }
  });

  loadKycDetails();
});
