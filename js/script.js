"use strict";

function setupMobileNavigation() {
    const toggleBtn = document.getElementById("nav-toggle");
    const nav = document.getElementById("main-nav");

    if (!toggleBtn || !nav) return;

    toggleBtn.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("open");
        toggleBtn.setAttribute("aria-expanded", String(isOpen));
        toggleBtn.textContent = isOpen ? "✕ Close" : "☰ Menu";
    });

    // Close the menu after a link is clicked (better mobile UX)
    nav.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            nav.classList.remove("open");
            toggleBtn.setAttribute("aria-expanded", "false");
            toggleBtn.textContent = "☰ Menu";
        });
    });
}

function setupThemeSwitch() {
    // Create the theme button dynamically and place it in the header
    const header = document.querySelector(".site-header");
    if (!header) return;

    const themeBtn = document.createElement("button");
    themeBtn.id = "theme-toggle";
    themeBtn.type = "button";
    themeBtn.className = "btn-secondary";
    themeBtn.textContent = "🌙 Dark Mode";
    header.appendChild(themeBtn);

    // Restore the saved theme (optional, but nice)
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeBtn.textContent = "☀️ Light Mode";
    }

    themeBtn.addEventListener("click", function () {
        const isDark = document.body.classList.toggle("dark-theme");
        themeBtn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

function setupProjectFilter() {
    const searchInput = document.getElementById("project-search");
    const levelSelect = document.getElementById("project-filter");
    const resetBtn = document.getElementById("reset-filter");
    const messageEl = document.getElementById("filter-message");
    const cards = Array.from(document.querySelectorAll(".project-card"));

    if (!searchInput || !levelSelect || !resetBtn || !messageEl) return;

    function applyFilter() {
        const keyword = searchInput.value.trim().toLowerCase();
        const level = levelSelect.value;
        let visibleCount = 0;

        cards.forEach(function (card) {
            const text = card.textContent.toLowerCase();
            const cardLevel = card.getAttribute("data-level");

            const matchesKeyword = keyword === "" || text.includes(keyword);
            const matchesLevel = level === "all" || cardLevel === level;

            if (matchesKeyword && matchesLevel) {
                card.style.display = "";
                visibleCount++;
            } else {
                card.style.display = "none";
            }
        });

        // Friendly feedback message
        if (visibleCount === 0) {
            messageEl.textContent = "No projects match your search. Try a different keyword.";
        } else {
            messageEl.textContent = "Showing " + visibleCount + " project(s).";
        }
    }

    searchInput.addEventListener("input", applyFilter);
    levelSelect.addEventListener("change", applyFilter);

    resetBtn.addEventListener("click", function () {
        searchInput.value = "";
        levelSelect.value = "all";
        applyFilter();
    });

    applyFilter();
}

function setupStudyCalculator() {
    const form = document.getElementById("study-form");
    const resultEl = document.getElementById("study-result");
    if (!form || !resultEl) return;

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // stay on the same page

        const hoursInput = document.getElementById("hours-per-day");
        const daysInput = document.getElementById("days-per-week");

        const hours = Number(hoursInput.value);
        const days = Number(daysInput.value);

        // Validate hours
        if (hoursInput.value.trim() === "" || isNaN(hours) || hours < 0) {
            resultEl.textContent = "❌ Please enter a valid, non-negative number of hours per day.";
            return;
        }

        // Validate days (1–7 only)
        if (daysInput.value.trim() === "" || isNaN(days) || days < 1 || days > 7) {
            resultEl.textContent = "❌ Days per week must be a whole number between 1 and 7.";
            return;
        }

        const total = hours * days;
        resultEl.textContent =
            "✅ You plan to study about " + total + " hour(s) per week.";
    });
}

function setupContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const topicInput = document.getElementById("topic");
    const messageInput = document.getElementById("message");

    const nameError = document.getElementById("name-error");
    const emailError = document.getElementById("email-error");
    const messageError = document.getElementById("message-error");
    const preview = document.getElementById("form-preview");

    // Simple, clear email pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function clearErrors() {
        nameError.textContent = "";
        emailError.textContent = "";
        messageError.textContent = "";
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        clearErrors();

        let valid = true;

        // ---- Validate name (not blank / whitespace only) ----
        if (nameInput.value.trim() === "") {
            nameError.textContent = "Please enter your name (spaces are not allowed).";
            valid = false;
        }

        // ---- Validate email ----
        if (emailInput.value.trim() === "") {
            emailError.textContent = "Please enter your email address.";
            valid = false;
        } else if (!emailPattern.test(emailInput.value.trim())) {
            emailError.textContent = "Please enter a valid email (e.g. name@example.com).";
            valid = false;
        }

        // ---- Validate message (not blank / whitespace only) ----
        if (messageInput.value.trim() === "") {
            messageError.textContent = "Please enter your message (spaces are not allowed).";
            valid = false;
        }

        if (!valid) {
            preview.classList.remove("visible");
            preview.textContent = "";
            return;
        }

        // ---- Build a text-only preview using textContent (safe) ----
        const summary =
            "✅ Your data was validated successfully (no message was sent).\n\n" +
            "Name: " + nameInput.value.trim() + "\n" +
            "Email: " + emailInput.value.trim() + "\n" +
            "Topic: " + (topicInput.value.trim() || "(none provided)") + "\n" +
            "Message: " + messageInput.value.trim();

        preview.textContent = summary;
        preview.classList.add("visible");

        form.reset();
    });
}

document.addEventListener("DOMContentLoaded", function () {
    setupMobileNavigation();
    setupThemeSwitch();
    setupProjectFilter();
    setupStudyCalculator();
    setupContactForm();
});