(function ($) {
    "use strict";


    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.sticky-top').addClass('shadow-sm').css('top', '0px');
        } else {
            $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // gallery
    document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.querySelector('.gallery');
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox.querySelector('img');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxInfo = lightbox.querySelector('.lightbox-info');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const zoomInBtn = lightbox.querySelector('.lightbox-zoom-in');
    const zoomOutBtn = lightbox.querySelector('.lightbox-zoom-out');
    const rotateBtn = lightbox.querySelector('.lightbox-rotate');
    const fullscreenBtn = lightbox.querySelector('.lightbox-fullscreen');
    const downloadBtn = lightbox.querySelector('.lightbox-download');
    const searchInput = document.getElementById('search');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortSelect = document.getElementById('sort');

    let currentImageIndex = 0;
    let images = [];
    let scale = 1;
    let rotation = 0;
    let isDragging = false;
    let startX, startY, translateX = 0, translateY = 0;
    let currentFilter = 'all';
    let currentSort = 'default';

    // Initialize gallery
    function initGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        images = Array.from(galleryItems).map(item => ({
            src: item.querySelector('img').src,
            alt: item.querySelector('img').alt,
            title: item.querySelector('h3').textContent,
            category: item.dataset.category
        }));

        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        // Initialize lazy loading
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.src;
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // Filter and sort functions
    function filterGallery() {
        const searchTerm = searchInput.value.toLowerCase();
        const galleryItems = document.querySelectorAll('.gallery-item');

        galleryItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const category = item.dataset.category;
            const matchesSearch = title.includes(searchTerm);
            const matchesFilter = currentFilter === 'all' || category === currentFilter;

            item.style.display = matchesSearch && matchesFilter ? 'block' : 'none';
        });

        sortGallery();
    }

    function sortGallery() {
        const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
        const gallery = document.querySelector('.gallery');

        galleryItems.sort((a, b) => {
            if (currentSort === 'name') {
                return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
            } else if (currentSort === 'category') {
                return a.dataset.category.localeCompare(b.dataset.category);
            }
            return 0;
        });

        galleryItems.forEach(item => gallery.appendChild(item));
    }

    // Enhanced lightbox functions
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        resetZoom();
        updateImageInfo();
    }

    function updateImageInfo() {
        const img = new Image();
        img.src = lightboxImg.src;
        
        img.onload = () => {
            const size = formatFileSize(getImageSize(img));
            const resolution = `${img.naturalWidth} x ${img.naturalHeight}`;
            
            lightboxInfo.querySelector('.image-size').textContent = `Size: ${size}`;
            lightboxInfo.querySelector('.image-resolution').textContent = `Resolution: ${resolution}`;
        };
    }

    function getImageSize(img) {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return canvas.toDataURL().length;
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function rotateImage() {
        rotation = (rotation + 90) % 360;
        lightboxImg.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
    }

    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            lightbox.requestFullscreen();
            fullscreenBtn.querySelector('i').classList.replace('fa-expand', 'fa-compress');
        } else {
            document.exitFullscreen();
            fullscreenBtn.querySelector('i').classList.replace('fa-compress', 'fa-expand');
        }
    }

    function downloadImage() {
        const link = document.createElement('a');
        link.href = lightboxImg.src;
        link.download = `image-${currentImageIndex + 1}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Event listeners for new features
    searchInput.addEventListener('input', filterGallery);
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            filterGallery();
        });
    });

    sortSelect.addEventListener('change', () => {
        currentSort = sortSelect.value;
        sortGallery();
    });

    rotateBtn.addEventListener('click', rotateImage);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    downloadBtn.addEventListener('click', downloadImage);

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    zoomInBtn.addEventListener('click', zoomIn);
    zoomOutBtn.addEventListener('click', zoomOut);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case '+':
                zoomIn();
                break;
            case '-':
                zoomOut();
                break;
        }
    });

    // Touch and drag events
    lightboxImg.addEventListener('mousedown', handleDragStart);
    lightboxImg.addEventListener('mousemove', handleDragMove);
    lightboxImg.addEventListener('mouseup', handleDragEnd);
    lightboxImg.addEventListener('mouseleave', handleDragEnd);

    lightboxImg.addEventListener('touchstart', handleDragStart);
    lightboxImg.addEventListener('touchmove', handleDragMove);
    lightboxImg.addEventListener('touchend', handleDragEnd);

    // Zoom functions
    function zoomIn() {
        scale = Math.min(scale + 0.25, 3);
        updateZoom();
    }

    function zoomOut() {
        scale = Math.max(scale - 0.25, 1);
        updateZoom();
    }

    function updateZoom() {
        lightboxImg.style.transform = `scale(${scale})`;
    }

    function resetZoom() {
        scale = 1;
        translateX = 0;
        translateY = 0;
        lightboxImg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    }

    // Touch and drag functionality
    function handleDragStart(e) {
        if (scale > 1) {
            isDragging = true;
            startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            startY = e.type === 'mousedown' ? e.clientY : e.touches[0].clientY;
        }
    }

    function handleDragMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
        const currentY = e.type === 'mousemove' ? e.clientY : e.touches[0].clientY;

        translateX += currentX - startX;
        translateY += currentY - startY;

        startX = currentX;
        startY = currentY;

        lightboxImg.style.transform = `scale(${scale}) translate(${translateX}px, ${translateY}px)`;
    }

    function handleDragEnd() {
        isDragging = false;
    }

    // Navigate to previous image
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightboxImage();
    }

    // Navigate to next image
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightboxImage();
    }

    // Update lightbox image
    function updateLightboxImage() {
        const image = images[currentImageIndex];
        lightboxImg.src = image.src;
        lightboxCaption.textContent = image.alt;
        resetZoom();
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        resetZoom();
    }

    // Initialize gallery
    initGallery();
}); 
	
	
	

    
})(jQuery);

