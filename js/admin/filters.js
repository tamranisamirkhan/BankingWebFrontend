// filters.js

export function setupFilters(filterButtons, setFilter, loadCustomers) {
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      setFilter(btn.dataset.filter);
      highlightFilter(filterButtons, btn.dataset.filter);
      loadCustomers();
    });
  });
}

export function highlightFilter(filterButtons, currentFilter) {
  filterButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === currentFilter);
  });
}
