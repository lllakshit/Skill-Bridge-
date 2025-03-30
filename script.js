document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      // Get filter value
      const filterValue = button.getAttribute("data-filter");

      // Filter projects
      projectCards.forEach((card) => {
        const categories = card.getAttribute("data-category").split(" ");

        if (filterValue === "all" || categories.includes(filterValue)) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });

  // Stats Counter Animation
  const statNumbers = document.querySelectorAll(".stat-number");

  // Function to animate number counting
  function animateCounter(element) {
    const target = parseInt(element.getAttribute("data-count"));
    const duration = 2000; // 2 seconds
    const step = (target / duration) * 10; // Update every 10ms
    let current = 0;

    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 10);
  }

  // Intersection Observer to trigger counter animation when in view
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  statNumbers.forEach((stat) => {
    observer.observe(stat);
  });
  const styleTag = document.createElement("style");
  styleTag.textContent = `
    .skill-slide {
      opacity: 1 !important;
      visibility: visible !important;
      min-height: 200px;
      background-color: rgba(50, 50, 100, 0.2);
      border: 1px solid rgba(106, 17, 203, 0.2);
      border-radius: 15px;
      padding: 30px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      transition: all 0.3s ease;
      color: white;
    }

    .skill-slide-icon {
      width: 70px;
      height: 70px;
      background: linear-gradient(135deg, #6a11cb, #2575fc);
      border-radius: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
    }

    .skill-slide-icon svg {
      stroke: white;
    }

    .skills-track {
      display: flex;
      gap: 20px;
      transition: transform 0.5s ease;
      min-height: 250px;
    }

    .skills-slider {
      overflow: hidden;
      padding: 20px 0;
      min-height: 250px;
    }

    .skill-slide.visible {
      opacity: 1 !important;
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(106, 17, 203, 0.3);
      background-color: rgba(50, 50, 100, 0.4);
    }

    .slider-controls {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      transform: translateY(-50%);
      display: flex;
      justify-content: space-between;
      pointer-events: none;
      padding: 0 20px;
    }

    .slider-arrow {
      width: 50px;
      height: 50px;
      background-color: rgba(0, 0, 0, 0.5);
      border: none;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      transition: all 0.3s ease;
      pointer-events: auto;
    }

    .slider-arrow:hover {
      background-color: #6a11cb;
      transform: scale(1.1);
    }

    .slider-arrow svg {
      stroke: white;
    }

    .skills-slider-section {
      padding: 30px 5% 60px;
      position: relative;
    }

    .skills-slider-container {
      position: relative;
      max-width: 1200px;
      margin: 0 auto;
      overflow: hidden;
    }
  `;
  document.head.appendChild(styleTag);

  function initPortfolioPage() {
    // Initialize skills slider
    initSkillsSlider();

    // Initialize portfolio filter
    initPortfolioFilter();

    // Initialize stats counter
    initStatsCounter();

    // Add animations to elements
    initAnimations();
  }

  // Function to initialize skills slider
  function initSkillsSlider() {
    const track = document.querySelector(".skills-track");
    const slides = document.querySelectorAll(".skill-slide");
    const nextBtn = document.querySelector(".next-arrow");
    const prevBtn = document.querySelector(".prev-arrow");

    // If elements don't exist, exit function
    if (!track || !slides.length || !nextBtn || !prevBtn) return;

    // Set initial opacity for all slides to make them visible
    slides.forEach((slide) => {
      slide.style.opacity = "1";
      slide.style.visibility = "visible";
    });

    let slideWidth = slides[0].getBoundingClientRect().width;
    let slideIndex = 0;
    let slidesToShow = getSlidesToShow();
    const totalSlides = slides.length;

    // Set initial position and add visibility class to visible slides
    updateSliderPosition();
    updateVisibleSlides();

    // Function to determine how many slides to show based on screen width
    function getSlidesToShow() {
      if (window.innerWidth < 768) {
        return 1;
      } else if (window.innerWidth < 1024) {
        return 2;
      } else {
        return 3;
      }
    }

    // Add event listeners to buttons
    nextBtn.addEventListener("click", () => {
      if (slideIndex < totalSlides - slidesToShow) {
        slideIndex++;
        updateSliderPosition();
        updateVisibleSlides();
      } else {
        // Loop back to start with animation
        slideIndex = 0;
        track.style.transition = "none";
        setTimeout(() => {
          track.style.transition = "transform 0.5s ease";
          updateSliderPosition();
          updateVisibleSlides();
        }, 10);
      }
    });

    prevBtn.addEventListener("click", () => {
      if (slideIndex > 0) {
        slideIndex--;
        updateSliderPosition();
        updateVisibleSlides();
      } else {
        // Loop to end with animation
        slideIndex = totalSlides - slidesToShow;
        track.style.transition = "none";
        setTimeout(() => {
          track.style.transition = "transform 0.5s ease";
          updateSliderPosition();
          updateVisibleSlides();
        }, 10);
      }
    });

    // Update slider position
    function updateSliderPosition() {
      track.style.transform = `translateX(-${
        slideIndex * (slideWidth + 20)
      }px)`;
    }

    // Update visible slides with animation class
    function updateVisibleSlides() {
      // First make all slides visible but with reduced opacity
      slides.forEach((slide) => {
        slide.classList.remove("visible");
        slide.style.opacity = "0.7";
        slide.style.transform = "scale(0.95)";
      });

      // Add visible class to currently visible slides with full opacity
      for (
        let i = slideIndex;
        i < slideIndex + slidesToShow && i < totalSlides;
        i++
      ) {
        setTimeout(() => {
          slides[i].classList.add("visible");
          slides[i].style.opacity = "1";
          slides[i].style.transform = "translateY(-10px)";
        }, (i - slideIndex) * 100); // Staggered animation
      }
    }

    // Handle window resize
    window.addEventListener("resize", () => {
      // Recalculate slide width
      slideWidth = slides[0].getBoundingClientRect().width;

      // Update slides to show
      const newSlidesToShow = getSlidesToShow();

      // If slidesToShow changed, adjust slideIndex if needed
      if (newSlidesToShow !== slidesToShow) {
        slidesToShow = newSlidesToShow;
        if (slideIndex > totalSlides - slidesToShow) {
          slideIndex = totalSlides - slidesToShow;
        }
      }

      // Update slider position
      updateSliderPosition();
      updateVisibleSlides();
    });

    // Add touch swipe functionality for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener("touchstart", (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener("touchend", (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50; // Minimum distance to register as swipe

      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - go to next slide
        nextBtn.click();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - go to previous slide
        prevBtn.click();
      }
    }

    // Initialize animations for visible slides
    updateVisibleSlides();

    // Trigger a resize event to ensure proper initial layout
    window.dispatchEvent(new Event("resize"));
  }

  // Function to initialize portfolio filter
  function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const projectCards = document.querySelectorAll(".project-card");

    // If elements don't exist, exit function
    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"));

        // Add active class to clicked button
        button.classList.add("active");

        // Get filter value
        const filterValue = button.getAttribute("data-filter");

        // Filter projects
        projectCards.forEach((card) => {
          if (filterValue === "all") {
            card.style.display = "block";
            setTimeout(() => {
              card.classList.add("visible");
            }, 100);
          } else {
            const cardCategories = card.getAttribute("data-category");
            if (cardCategories && cardCategories.includes(filterValue)) {
              card.style.display = "block";
              setTimeout(() => {
                card.classList.add("visible");
              }, 100);
            } else {
              card.classList.remove("visible");
              setTimeout(() => {
                card.style.display = "none";
              }, 300);
            }
          }
        });
      });
    });

    // Set all projects visible initially
    projectCards.forEach((card) => {
      card.classList.add("visible");
    });
  }

  // Function to initialize stats counter
  function initStatsCounter() {
    const statNumbers = document.querySelectorAll(".stat-number");

    // If elements don't exist, exit function
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const count = parseInt(target.getAttribute("data-count"));
            let current = 0;
            const increment = Math.ceil(count / 50);
            const timer = setInterval(() => {
              current += increment;
              if (current >= count) {
                current = count;
                clearInterval(timer);
              }
              target.textContent = current;
            }, 30);
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((stat) => {
      observer.observe(stat);
    });
  }

  // Function to initialize animations
  function initAnimations() {
    // Add animation classes to filter buttons
    const filterButtons = document.querySelectorAll(".filter-btn");
    filterButtons.forEach((btn, index) => {
      btn.style.setProperty("--btn-index", index);
    });

    // Add reveal animations to sections
    const revealElements = document.querySelectorAll(".reveal");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    revealElements.forEach((el) => {
      revealObserver.observe(el);
    });

    // Add hover effects to project cards
    const projectCards = document.querySelectorAll(".project-card");
    projectCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        const overlay = card.querySelector(".project-overlay");
        if (overlay) overlay.style.opacity = "1";
      });

      card.addEventListener("mouseleave", () => {
        const overlay = card.querySelector(".project-overlay");
        if (overlay) overlay.style.opacity = "0";
      });
    });
  }

  // Check if we're on the portfolio page
  const portfolioContent = document.querySelector(".portfolio-intro");
  if (portfolioContent) {
    initPortfolioPage();
  }

  // Contact form submission
  const contactForm = document.querySelector(".contact-form-full");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you for your message! We will get back to you soon.");
      contactForm.reset();
    });
  }
  // Page content templates
  const pageContents = {
    home: `
          <section class="hero">
            <div class="hero-content">
              <h1>Build scalable websites with <br />Skill Bridge</h1>
              <p>Empowering businesses with tailored digital solutions</p>
              <button class="cta-button">Let's Talk</button>
            </div>
            <div class="hero-image">
              <img src="developer-illustration.svg" alt="Developer workspace" onerror="this.src='https://via.placeholder.com/500x300?text=Developer+Workspace'" />
            </div>
          </section>

          <section class="skills">
            <h2>Skills We Provide</h2>
            <div class="skills-grid">
              <div class="skill-card">
                <h3>Graphic Designing</h3>
                <p class="skill-description">
                  Professional logos, banners, social media posts, and branding assets.
                </p>
              </div>
              <div class="skill-card">
                <h3>Web Applications</h3>
                <p class="skill-description">
                  Development of scalable and responsive web applications.
                </p>
              </div>
              <div class="skill-card">
                <h3>UI/UX Design (Figma & Flutter)</h3>
                <p class="skill-description">
                  User-friendly designs and mobile app UI/UX solutions.
                </p>
              </div>
              <div class="skill-card">
                <h3>Digital Marketing</h3>
                <p class="skill-description">
                  SEO, PPC, content marketing, and social media marketing strategies.
                </p>
              </div>
              <div class="skill-card">
                <h3>Basic Cybersecurity Audits</h3>
                <p class="skill-description">
                  Security assessments to identify vulnerabilities in digital assets.
                </p>
              </div>
              <div class="skill-card">
                <h3>AI Services & Training Models</h3>
                <p class="skill-description">
                  AI-powered automation, machine learning models, and chatbot development.
                </p>
              </div>
            </div>
          </section>

          <section class="client-testimonials">
            <h2>Hear From My Clients</h2>
            <div class="testimonial-grid">
              <div class="testimonial-card">
                <p>"Amazing work and professional team"</p>
                <div class="client-info">
                  <img
                    src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
                    alt="Client Vikram"
                  />
                  <span>Vikram</span>
                </div>
              </div>

              <div class="testimonial-card">
                <p>"Exceeded my expectations"</p>
                <div class="client-info">
                  <img
                    src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
                    alt="Client Shashank"
                  />
                  <span>Shashank</span>
                </div>
              </div>

              <div class="testimonial-card">
                <p>"Fantastic digital solutions"</p>
                <div class="client-info">
                  <img
                    src="https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=1"
                    alt="Client Anonymous"
                  />
                  <span>Anonymous</span>
                </div>
              </div>
            </div>
          </section>

          <section class="contact">
            <h2>Let's Connect With Us</h2>
            <div class="contact-content">
              <div class="contact-form">
                <input type="text" placeholder="Say Hello" />
                <button>Send</button>
              </div>
            </div>
          </section>
        `,

    services: `
          <section class="hero">
            <div class="hero-content">
              <h1>Services</h1>

            </div>
          </section>

          <section class="services">
            <h2>OFFERED SERVICES</h2>
            <div class="services-grid">
              <div class="service-card">
                <div class="service-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="3" y1="9" x2="21" y2="9"></line>
                    <line x1="9" y1="21" x2="9" y2="9"></line>
                  </svg>
                </div>
                <h3>Web Design</h3>
              </div>
              <div class="service-card">
                <div class="service-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M12 2l10 6.5v7L12 22l-10-6.5v-7L12 2z"></path>
                    <line x1="12" y1="12" x2="12" y2="22"></line>
                    <line x1="12" y1="2" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h3>Web Development</h3>
              </div>
              <div class="service-card">
                <div class="service-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                    <rect x="9" y="9" width="6" height="6"></rect>
                    <line x1="9" y1="1" x2="9" y2="4"></line>
                    <line x1="15" y1="1" x2="15" y2="4"></line>
                    <line x1="9" y1="20" x2="9" y2="23"></line>
                    <line x1="15" y1="20" x2="15" y2="23"></line>
                    <line x1="20" y1="9" x2="23" y2="9"></line>
                    <line x1="20" y1="14" x2="23" y2="14"></line>
                    <line x1="1" y1="9" x2="4" y2="9"></line>
                    <line x1="1" y1="14" x2="4" y2="14"></line>
                  </svg>
                </div>
                <h3>Android App Development</h3>
              </div>
              <div class="service-card">
                <div class="service-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                    <path d="M2 2l7.586 7.586"></path>
                    <circle cx="11" cy="11" r="2"></circle>
                  </svg>
                </div>
                <h3>iOS App Development</h3>
              </div>
              <div class="service-card">
                <div class="service-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <circle cx="12" cy="12" r="4"></circle>
                    <line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line>
                    <line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line>
                    <line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line>
                    <line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line>
                    <line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line>
                  </svg>
                </div>
                <h3>Animation</h3>
              </div>
              <div class="service-card">
                <div class="service-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </div>
                <h3>SEO</h3>
              </div>
            </div>
          </section>

          <section class="additional-services">
            <h2>Additional Services</h2>
            <div class="services-grid">
              <div class="service-card">
                <div class="service-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                    ></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="12" x2="12" y2="18"></line>
                  </svg>
                </div>
                <h3>API Development And Integration</h3>
              </div>
              <div class="service-card">
                <div class="service-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                  </svg>
                </div>
                <h3>Logo and Banner Designing</h3>
              </div>
              <div class="service-card">
                <div class="service-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polyline points="16 18 22 12 16 6"></polyline>
                    <polyline points="8 6 2 12 8 18"></polyline>
                    <line x1="12" y1="2" x2="12" y2="22"></line>
                  </svg>
                </div>
                <h3>ML Model Development</h3>
              </div>
            </div>
          </section>

          <section class="start-project">
            <h2>Want to start a project?</h2>
            <p>Let's</p>
            <a href="mailto:support@studiosolver.com" class="contact-btn">Contact Us</a>
          </section>
        `,

    studio: `
          <section class="hero">
            <div class="hero-content">
              <h1>Our Studio</h1>
              <div class="hero-breadcrumb">
               
              </div>
            </div>
          </section>

          <section class="studio-intro">
            <div class="studio-container">
              <div class="studio-text">
                <h2>Where Creativity Meets Technology</h2>
                <p>Welcome to Skill Bridge Studio, our creative workspace where innovation happens. Our studio is equipped with cutting-edge technology and staffed by talented professionals dedicated to bringing your vision to life.</p>
                <div class="studio-stats">
                  <div class="stat-item">
                    <span class="stat-number" data-count="150">0</span>
                    <span class="stat-label">Projects Completed</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number" data-count="50">0</span>
                    <span class="stat-label">Happy Clients</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number" data-count="15">0</span>
                    <span class="stat-label">Team Members</span>
                  </div>
                </div>
              </div>
              <div class="studio-image">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80" alt="Our creative studio workspace" class="rounded-image" />
              </div>
            </div>
          </section>

          <section class="studio-features">
            <h2>Our Studio Features</h2>
            <div class="features-grid">
              <div class="feature-card">
                <div class="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <h3>Modern Equipment</h3>
                <p>State-of-the-art computers, design tablets, and development tools.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3>Expert Team</h3>
                <p>Skilled designers, developers, and digital marketing specialists.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                </div>
                <h3>Quality Assurance</h3>
                <p>Rigorous testing and quality control for all deliverables.</p>
              </div>
              <div class="feature-card">
                <div class="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <h3>Timely Delivery</h3>
                <p>Commitment to deadlines and efficient project management.</p>
              </div>
            </div>
          </section>

          <section class="studio-process">
            <h2>Our Work Process</h2>
            <div class="process-timeline">
              <div class="process-step">
                <div class="process-number">1</div>
                <div class="process-content">
                  <h3>Discovery</h3>
                  <p>We begin by understanding your business, goals, and target audience to create a tailored strategy.</p>
                </div>
              </div>
              <div class="process-step">
                <div class="process-number">2</div>
                <div class="process-content">
                  <h3>Planning</h3>
                  <p>Our team creates a detailed roadmap with timelines, deliverables, and key milestones.</p>
                </div>
              </div>
              <div class="process-step">
                <div class="process-number">3</div>
                <div class="process-content">
                  <h3>Design & Development</h3>
                  <p>We bring your vision to life with creative designs and robust development.</p>
                </div>
              </div>
              <div class="process-step">
                <div class="process-number">4</div>
                <div class="process-content">
                  <h3>Testing</h3>
                  <p>Rigorous quality assurance ensures everything works flawlessly.</p>
                </div>
              </div>
              <div class="process-step">
                <div class="process-number">5</div>
                <div class="process-content">
                  <h3>Launch & Support</h3>
                  <p>We deploy your project and provide ongoing support and maintenance.</p>
                </div>
              </div>
            </div>
          </section>

          <section class="studio-team">
            <h2>Meet Our Team</h2>
            <div class="team-grid">
              <div class="team-member">
                <div class="member-image">
                  <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80" alt="Team Member - John Doe" />
                </div>
                <h3>John Doe</h3>
                <p>Creative Director</p>
                <div class="social-links">
                  <a href="#" class="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a href="#" class="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div class="team-member">
                <div class="member-image">
                  <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80" alt="Team Member - Jane Smith" />
                </div>
                <h3>Jane Smith</h3>
                <p>Lead Developer</p>
                <div class="social-links">
                  <a href="#" class="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a href="#" class="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                </div>
              </div>
              <div class="team-member">
                <div class="member-image">
                  <img src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80" alt="Team Member - Mike Johnson" />
                </div>
                <h3>Mike Johnson</h3>
                <p>UI/UX Designer</p>
                <div class="social-links">
                  <a href="#" class="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                  <a href="#" class="social-link">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </section>

          <section class="studio-cta">
            <div class="cta-content">
              <h2>Ready to work with our studio?</h2>
              <p>Let's create something amazing together</p>
              <button class="cta-button">Start a Project</button>
            </div>
          </section>
        `,

    portfolio: `
        <section class="hero">
          <div class="hero-content">
            <h1>Our Portfolio</h1>
            <div class="hero-breadcrumb">

            </div>
          </div>
        </section>

        <section class="portfolio-intro">
          <div class="portfolio-intro-content">
            <h2>Showcasing Our <span class="gradient-text">Creative Excellence</span></h2>
            <p>Explore our diverse portfolio of successful projects across various industries. Each project represents our commitment to quality, innovation, and client satisfaction.</p>
          </div>
        </section>

        <section class="skills-slider-section">
          <div class="skills-slider-container">
            <div class="skills-slider">
              <div class="skills-track">
                <div class="skill-slide" data-category="web-design">
                  <div class="skill-slide-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="3" y1="9" x2="21" y2="9"></line>
                      <line x1="9" y1="21" x2="9" y2="9"></line>
                    </svg>
                  </div>
                  <h3>Web Design</h3>
                  <p>Creating beautiful, responsive websites with intuitive user experiences.</p>
                </div>
                <div class="skill-slide" data-category="web-development">
                  <div class="skill-slide-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                  </div>
                  <h3>Web Development</h3>
                  <p>Building robust, scalable web applications with modern technologies.</p>
                </div>
                <div class="skill-slide" data-category="mobile-app">
                  <div class="skill-slide-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                      <line x1="12" y1="18" x2="12.01" y2="18"></line>
                    </svg>
                  </div>
                  <h3>Mobile App Development</h3>
                  <p>Crafting native and cross-platform mobile applications for iOS and Android.</p>
                </div>
                <div class="skill-slide" data-category="ui-ux">
                  <div class="skill-slide-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
                      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
                      <path d="M2 2l7.586 7.586"></path>
                      <circle cx="11" cy="11" r="2"></circle>
                    </svg>
                  </div>
                  <h3>UI/UX Design</h3>
                  <p>Designing intuitive interfaces and seamless user experiences.</p>
                </div>
                <div class="skill-slide" data-category="graphic-design">
                  <div class="skill-slide-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path>
                    </svg>
                  </div>
                  <h3>Graphic Design</h3>
                  <p>Creating stunning visual assets for branding and marketing.</p>
                </div>
                <div class="skill-slide" data-category="digital-marketing">
                  <div class="skill-slide-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                  </div>
                  <h3>Digital Marketing</h3>
                  <p>Driving growth through SEO, content marketing, and social media strategies.</p>
                </div>
              </div>
            </div>
            <div class="slider-controls">
              <button class="slider-arrow prev-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
              </button>
              <button class="slider-arrow next-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        </section>

        <section class="portfolio-filter">
          <div class="filter-container">
            <h3>Filter Projects</h3>
            <div class="filter-buttons">
              <button class="filter-btn active" data-filter="all">All</button>
              <button class="filter-btn" data-filter="web-design">Web Design</button>
              <button class="filter-btn" data-filter="web-development">Web Development</button>
              <button class="filter-btn" data-filter="mobile-app">Mobile Apps</button>
              <button class="filter-btn" data-filter="ui-ux">UI/UX</button>
              <button class="filter-btn" data-filter="graphic-design">Graphic Design</button>
            </div>
          </div>
        </section>

        <section class="portfolio-projects">
          <div class="projects-grid">
            <div class="project-card" data-category="web-design web-development">
              <div class="project-image">
                <img src="https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&w=800&q=80" alt="E-commerce Website" />
                <div class="project-overlay">
                  <div class="project-details">
                    <h3>E-commerce Platform</h3>
                    <p>A full-featured online store with payment integration</p>
                    <a href="#" class="view-project-btn">View Project</a>
                  </div>
                </div>
              </div>
              <div class="project-info">
                <h3>E-commerce Platform</h3>
                <div class="project-tags">
                  <span class="project-tag">Web Design</span>
                  <span class="project-tag">Web Development</span>
                </div>
              </div>
            </div>

            <div class="project-card" data-category="mobile-app ui-ux">
              <div class="project-image">
                <img src="https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=800&q=80" alt="Fitness App" />
                <div class="project-overlay">
                  <div class="project-details">
                    <h3>Fitness Tracking App</h3>
                    <p>Mobile application for tracking workouts and nutrition</p>
                    <a href="#" class="view-project-btn">View Project</a>
                  </div>
                </div>
              </div>
              <div class="project-info">
                <h3>Fitness Tracking App</h3>
                <div class="project-tags">
                  <span class="project-tag">Mobile App</span>
                  <span class="project-tag">UI/UX</span>
                </div>
              </div>
            </div>

            <div class="project-card" data-category="graphic-design">
              <div class="project-image">
                <img src="https://images.unsplash.com/photo-1634942537034-2531766767d1?auto=format&fit=crop&w=800&q=80" alt="Brand Identity" />
                <div class="project-overlay">
                  <div class="project-details">
                    <h3>Brand Identity Package</h3>
                    <p>Complete branding solution for a startup company</p>
                    <a href="#" class="view-project-btn">View Project</a>
                  </div>
                </div>
              </div>
              <div class="project-info">
                <h3>Brand Identity Package</h3>
                <div class="project-tags">
                  <span class="project-tag">Graphic Design</span>
                </div>
              </div>
            </div>

            <div class="project-card" data-category="web-development">
              <div class="project-image">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80" alt="Dashboard" />
                <div class="project-overlay">
                  <div class="project-details">
                    <h3>Analytics Dashboard</h3>
                    <p>Real-time data visualization platform for business intelligence</p>
                    <a href="#" class="view-project-btn">View Project</a>
                  </div>
                </div>
              </div>
              <div class="project-info">
                <h3>Analytics Dashboard</h3>
                <div class="project-tags">
                  <span class="project-tag">Web Development</span>
                </div>
              </div>
            </div>

            <div class="project-card" data-category="ui-ux web-design">
              <div class="project-image">
                <img src="https://images.unsplash.com/photo-1481487196290-c152efe083f5?auto=format&fit=crop&w=800&q=80" alt="Website Redesign" />
                <div class="project-overlay">
                  <div class="project-details">
                    <h3>Corporate Website Redesign</h3>
                    <p>Complete overhaul of a corporate website with modern design</p>
                    <a href="#" class="view-project-btn">View Project</a>
                  </div>
                </div>
              </div>
              <div class="project-info">
                <h3>Corporate Website Redesign</h3>
                <div class="project-tags">
                  <span class="project-tag">UI/UX</span>
                  <span class="project-tag">Web Design</span>
                </div>
              </div>
            </div>

            <div class="project-card" data-category="mobile-app">
              <div class="project-image">
                <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80" alt="Mobile Banking App" />
                <div class="project-overlay">
                  <div class="project-details">
                    <h3>Mobile Banking Application</h3>
                    <p>Secure and user-friendly banking app with advanced features</p>
                    <a href="#" class="view-project-btn">View Project</a>
                  </div>
                </div>
              </div>
              <div class="project-info">
                <h3>Mobile Banking Application</h3>
                <div class="project-tags">
                  <span class="project-tag">Mobile App</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="portfolio-stats">
          <div class="stats-container">
            <div class="stat-box">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div class="stat-number" data-count="200">0</div>
              <div class="stat-label">Projects Completed</div>
            </div>
            <div class="stat-box">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <div class="stat-number" data-count="85">0</div>
              <div class="stat-label">Happy Clients</div>
            </div>
            <div class="stat-box">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <div class="stat-number" data-count="95">0</div>
              <div class="stat-label">5-Star Reviews</div>
            </div>
            <div class="stat-box">
              <div class="stat-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </div>
              <div class="stat-number" data-count="12">0</div>
              <div class="stat-label">Countries Served</div>
            </div>
          </div>
        </section>

        <section class="portfolio-cta">
          <div class="cta-content">
            <h2>Ready to start your project?</h2>
            <p>Let's create something amazing together</p>
            <button class="cta-button">Get in Touch</button>
          </div>
        </section>
      `,

    contact: `
        <section class="hero">
          <div class="hero-content">
            <h1>Contact Us</h1>
            <div class="hero-breadcrumb">
            </div>
          </div>
        </section>

        <section class="contact-page">
          <div class="contact-container">
            <div class="contact-form-section">
              <div class="contact-form-card">
                <h2>Let's make your business brilliant!</h2>
                <p>We are here to help and answer any questions you might have.</p>
                <p>We look forward to hearing from you.</p>

                <form class="contact-form-full">
                  <div class="form-group">
                    <label for="fullName">Full Name</label>
                    <input type="text" id="fullName" placeholder="John Doe" required>
                  </div>

                  <div class="form-group">
                    <label for="emailAddress">Email Address</label>
                    <input type="email" id="emailAddress" placeholder="abc@xyz.com" required>
                  </div>

                  <div class="form-group">
                    <label for="contactNumber">Contact Number</label>
                    <input type="tel" id="contactNumber" placeholder="+91 987-654-3210" required>
                  </div>

                  <div class="form-group">
                    <label for="service">Service you are interested in</label>
                    <select id="service" required>
                      <option value="" disabled selected>Select a service</option>
                      <option value="web-design">Web Design</option>
                      <option value="web-development">Web Development</option>
                      <option value="app-development">App Development</option>
                      <option value="digital-marketing">Digital Marketing</option>
                      <option value="seo">SEO</option>
                      <option value="graphic-design">Graphic Design</option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label for="message">Your Message</label>
                    <textarea id="message" placeholder="Write your message..." rows="4" required></textarea>
                  </div>

                  <button type="submit" class="send-message-btn">Send Message →</button>
                </form>
              </div>
            </div>

            <div class="contact-info-section">
              <div class="contact-info-card">
                <div class="contact-info-item">
                  <div class="contact-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </div>
                  <div class="contact-info-text">
                    <h3>Phone</h3>
                    <p>+91 74270 550 84</p>
                  </div>
                </div>

                <div class="contact-info-item">
                  <div class="contact-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </div>
                  <div class="contact-info-text">
                    <h3>Email</h3>
                    <p>support@studiosolver.com</p>
                  </div>
                </div>

                <div class="contact-info-item">
                  <div class="contact-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div class="contact-info-text">
                    <h3>Address</h3>
                    <p>Jaipur, Rajasthan, 302017</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="start-project">
          <h2>Want to start a project?</h2>
          <p>Let's</p>
          <a href="mailto:support@studiosolver.com" class="contact-btn">Contact Us</a>
        </section>
      `,
  };

  // Get page content container
  const pageContent = document.getElementById("page-content");

  // Get all navigation links
  const navLinks = document.querySelectorAll(".nav-links a");

  // Function to load page content
  function loadPage(page) {
    // Add fade out effect
    pageContent.classList.add("fade");

    // Wait for fade out animation to complete
    setTimeout(() => {
      // Update content
      pageContent.innerHTML = pageContents[page];

      // Remove active class from all links
      navLinks.forEach((link) => link.classList.remove("active"));

      // Add active class to current link
      document
        .querySelector(`.nav-links a[data-page="${page}"]`)
        .classList.add("active");

      // Add event listeners to any new buttons
      addEventListeners();

      // Remove fade out effect
      setTimeout(() => {
        pageContent.classList.remove("fade");
      }, 50);
    }, 300);
  }

  // Add click event listeners to navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.getAttribute("data-page");
      loadPage(page);
    });
  });

  // Function to add event listeners to dynamically loaded content
  function addEventListeners() {
    // Add hover effect to service cards
    const serviceCards = document.querySelectorAll(
      ".service-card, .feature-card, .team-member"
    );
    serviceCards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-15px)";
        card.style.boxShadow = "0 15px 30px rgba(106, 17, 203, 0.3)";
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "none";
      });
    });

    // Add event listener to "Let's Talk" buttons
    const ctaButtons = document.querySelectorAll(".cta-button");
    ctaButtons.forEach((button) => {
      button.addEventListener("click", () => {
        loadPage("contact");
      });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector(".newsletter form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector("input");

        if (validateEmail(emailInput.value)) {
          alert("Thank you for subscribing to our newsletter!");
          emailInput.value = "";
        } else {
          alert("Please enter a valid email address.");
        }
      });
    }

    // Animate stats counter in studio page
    const statNumbers = document.querySelectorAll(".stat-number");
    if (statNumbers.length > 0) {
      animateStatNumbers();
    }

    // Add animation to process timeline
    const processSteps = document.querySelectorAll(".process-step");
    if (processSteps.length > 0) {
      animateProcessTimeline();
    }
  }

  // Function to animate stat numbers
  function animateStatNumbers() {
    const statNumbers = document.querySelectorAll(".stat-number");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const count = parseInt(target.getAttribute("data-count"));
            let current = 0;
            const increment = Math.ceil(count / 50);
            const timer = setInterval(() => {
              current += increment;
              if (current >= count) {
                current = count;
                clearInterval(timer);
              }
              target.textContent = current;
            }, 30);
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach((stat) => {
      observer.observe(stat);
    });
  }

  // Function to animate process timeline
  function animateProcessTimeline() {
    const processSteps = document.querySelectorAll(".process-step");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("active");
            }, index * 300);
          }
        });
      },
      { threshold: 0.2 }
    );

    processSteps.forEach((step) => {
      observer.observe(step);
    });
  }

  // Email validation function
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Load the default page (home) on initial load
  loadPage("home");

  // Add event listeners to initial content
  addEventListeners();
});
