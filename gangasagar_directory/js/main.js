
<script>

/* ==========================================================
   SERVICE SEARCH
========================================================== */

const searchInput = document.getElementById("searchInput");
const categoryCards = document.querySelectorAll(".category-card");
const noResult = document.getElementById("noResult");
const servicesSection = document.getElementById("services");


function filterServices() {

    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();
    let count = 0;

    categoryCards.forEach(function(card) {

        const name = card.getAttribute("data-name") || "";
        const text = card.innerText || "";

        const searchableText =
            (name + " " + text).toLowerCase();

        if (query === "" || searchableText.includes(query)) {

            card.classList.remove("hidden");
            count++;

        } else {

            card.classList.add("hidden");

        }

    });


    if (noResult) {

        if (count === 0) {
            noResult.classList.remove("hidden");
        } else {
            noResult.classList.add("hidden");
        }

    }
}


/* Search Typing */

if (searchInput) {

    searchInput.addEventListener("input", filterServices);


    /* Search Enter */

    searchInput.addEventListener("keydown", function(e) {

        if (e.key === "Enter") {

            e.preventDefault();

            filterServices();

            if (servicesSection) {

                servicesSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        }

    });

}


/* Focus Search */

function focusServices() {

    if (servicesSection) {

        servicesSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    }

    setTimeout(function() {

        if (searchInput) {
            searchInput.focus();
        }

    }, 500);

}



/* ==========================================================
   BANNER SLIDER
========================================================== */

let slideIndex = 0;
let autoSlide;

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");


/* SHOW SLIDE */
function showSlide(index) {

    if (slides.length === 0) {
        return;
    }

    /* Loop to first slide */
    if (index >= slides.length) {
        slideIndex = 0;
    }

    /* Loop to last slide */
    if (index < 0) {
        slideIndex = slides.length - 1;
    }


    /* Remove active from all slides */
    slides.forEach(function(slide) {
        slide.classList.remove("active");
    });


    /* Remove active from all dots */
    dots.forEach(function(dot) {
        dot.classList.remove("active");
    });


    /* Show current slide */
    slides[slideIndex].classList.add("active");


    /* Active dot */
    if (dots[slideIndex]) {
        dots[slideIndex].classList.add("active");
    }
}


/* NEXT / PREVIOUS */
function changeSlide(direction) {

    slideIndex = slideIndex + direction;

    showSlide(slideIndex);

    restartAutoSlide();
}


/* DOT CLICK */
function currentSlide(index) {

    slideIndex = index;

    showSlide(slideIndex);

    restartAutoSlide();
}


/* AUTO SLIDE */
function startAutoSlide() {

    autoSlide = setInterval(function() {

        slideIndex++;

        if (slideIndex >= slides.length) {
            slideIndex = 0;
        }

        showSlide(slideIndex);

    }, 5000);
}


/* RESTART AUTO SLIDE */
function restartAutoSlide() {

    clearInterval(autoSlide);

    startAutoSlide();
}


/* INITIALIZE */
showSlide(0);
startAutoSlide();




</script>

