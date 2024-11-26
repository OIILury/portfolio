const themeToggle = document.getElementById("theme-toggle");
const body = document.body;

// Vérifie et applique le thème stocké
const savedTheme = localStorage.getItem("theme") || "light-mode";
body.classList.add(savedTheme);
themeToggle.checked = savedTheme === "dark-mode";

// Écoute les changements d'état du toggle
themeToggle.addEventListener("change", () => {
  if (themeToggle.checked) {
    body.classList.replace("light-mode", "dark-mode");
    localStorage.setItem("theme", "dark-mode");
  } else {
    body.classList.replace("dark-mode", "light-mode");
    localStorage.setItem("theme", "light-mode");
  }
});
