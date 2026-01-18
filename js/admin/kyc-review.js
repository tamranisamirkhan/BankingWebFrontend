document.addEventListener("DOMContentLoaded", () => {

  // ---------- helpers ----------
  function setText(id, value) {
    const el = document.getElementById(id);
    if (!el) {
      console.error(`Missing element: ${id}`);
      return;
    }
    el.innerText = value;
  }

  function setImg(id, src) {
    const el = document.getElementById(id);
    if (!el) {
      console.error(`Missing image: ${id}`);
      return;
    }
    el.src = src;
  }

  // ---------- read ID ----------
  const params = new URLSearchParams(window.location.search);
  const customerId = params.get("id");

  if (!customerId) {
    alert("Invalid request");
    return;
  }

  const BASE_URL =
    "https://smartbankofficial.online/smartBank/admin/kyc";

  async function loadKycDetails() {
    try {
      const res = await fetch(`${BASE_URL}/${customerId}`, {
        credentials: "include"
      });

      if (!res.ok) throw new Error("API error");

      const raw = await res.json();

      // ✅ normalize backend fields
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

    } catch (err) {
      console.error(err);
      alert("Failed to load KYC details");
    }
  }

  loadKycDetails();
});
