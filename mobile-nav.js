document.addEventListener("DOMContentLoaded", () => {
  // Create mobile menu button
  const nav = document.querySelector("nav");
  const mobileMenuBtn = document.createElement("button");
  mobileMenuBtn.className = "mobile-menu-btn";
  mobileMenuBtn.setAttribute("aria-label", "Toggle navigation menu");
  mobileMenuBtn.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
  nav.appendChild(mobileMenuBtn);

  // Create mobile navigation overlay
  const mobileNav = document.createElement("div");
  mobileNav.className = "mobile-nav";

  // Clone navigation links for mobile
  const navLinks = document.querySelector(".nav-links");
  const mobileNavLinks = document.createElement("div");
  mobileNavLinks.className = "mobile-nav-links";

  // Clone each link
  navLinks.querySelectorAll("a").forEach((link) => {
    const newLink = link.cloneNode(true);
    mobileNavLinks.appendChild(newLink);
  });

  // Clone CTA button for mobile
  const ctaButton = document.querySelector(".cta-button");
  const mobileCta = ctaButton.cloneNode(true);

  // Add elements to mobile nav
  mobileNav.appendChild(mobileNavLinks);
  mobileNav.appendChild(mobileCta);
  document.body.appendChild(mobileNav);

  // Toggle mobile menu
  mobileMenuBtn.addEventListener("click", function () {
    this.classList.toggle("active");
    mobileNav.classList.toggle("active");
    document.body.classList.toggle("menu-open");
  });

  // Close mobile menu when clicking a link
  mobileNavLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", function (e) {
      // Get the page to load
      const page = this.getAttribute("data-page");

      // Close the mobile menu
      mobileMenuBtn.classList.remove("active");
      mobileNav.classList.remove("active");
      document.body.classList.remove("menu-open");

      // Update active class on mobile links
      mobileNavLinks
        .querySelectorAll("a")
        .forEach((l) => l.classList.remove("active"));
      this.classList.add("active");
    });
  });

  // Close mobile menu when clicking CTA button
  mobileCta.addEventListener("click", () => {
    mobileMenuBtn.classList.remove("active");
    mobileNav.classList.remove("active");
    document.body.classList.remove("menu-open");

    // If CTA button should navigate to contact page
    const contactLink = document.querySelector('a[data-page="contact"]');
    if (contactLink) {
      contactLink.click();
    }
  });

  // Handle window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768 && mobileNav.classList.contains("active")) {
      mobileMenuBtn.classList.remove("active");
      mobileNav.classList.remove("active");
      document.body.classList.remove("menu-open");
    }
  });

  // Sync active states between desktop and mobile navigation
  function syncActiveNavLinks() {
    const activeDesktopLink = navLinks.querySelector("a.active");
    if (activeDesktopLink) {
      const activePage = activeDesktopLink.getAttribute("data-page");
      mobileNavLinks.querySelectorAll("a").forEach((link) => {
        if (link.getAttribute("data-page") === activePage) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    }
  }

  // Initial sync
  syncActiveNavLinks();

  // Update mobile nav active link when page changes
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", syncActiveNavLinks);
  });
});
