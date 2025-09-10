export function toggleSidebar() {
  const toggleButton = document.getElementById("toggle-btn");
  const sidebar = document.getElementById("sidebar");

  sidebar.classList.toggle("close");
  toggleButton.classList.toggle("rotate");
  closeAllSubMenus();
}

export function toggleSubMenu(event) {
  const button = event.currentTarget;
  const submenu = button.nextElementSibling;

  const isOpen = submenu.classList.contains("show");

  closeAllSubMenus();

  if (!isOpen) {
    submenu.classList.add("show");
    button.classList.add("rotate");

    const sidebar = document.getElementById("sidebar");
    if (sidebar.classList.contains("close")) {
      sidebar.classList.remove("close");
      document.getElementById("toggle-btn").classList.remove("rotate");
    }
  }
}

function closeAllSubMenus() {
  const sidebar = document.getElementById("sidebar");

  Array.from(sidebar.getElementsByClassName("show")).forEach((ul) => {
    ul.classList.remove("show");
    if (ul.previousElementSibling) {
      ul.previousElementSibling.classList.remove("rotate");
    }
  });
}
