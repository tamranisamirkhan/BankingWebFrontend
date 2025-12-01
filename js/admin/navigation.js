// navigation.js

export function setupNavigation(sectionMap, showSection, updateHeader, loadCustomers) {
  const menuItems = document.querySelectorAll(".menu-item");

  menuItems.forEach(item => {
    item.addEventListener("click", () => {
      menuItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");

      const sectionId = sectionMap[item.id];

      if (sectionId) {
        showSection(sectionId);
        updateHeader(item.id);

        // If Manage Users is clicked
        if (item.id === "usersMenu") {
          loadCustomers();
        }
      }
    });
  });
}
