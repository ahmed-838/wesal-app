document.addEventListener("DOMContentLoaded", function() {
    const map = L.map('map').setView([30.0444, 31.2357], 12); // مركز الخريطة على القاهرة
    const markers = []; // مصفوفة لتخزين الماركرات
    

    // تحديد الفلتر الافتراضي ليكون "الكل"
    document.querySelector('input[name="filter"][value="الكل"]').checked = true;

    // إعدادات الخريطة
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
    }).addTo(map);

    // جلب البيانات من السيرفر
    async function fetchListings() {
        try {
            const response = await fetch('/rental/listings'); // تأكد من صحة المسار
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const listings = await response.json();

            // إخفاء الماركرات الحالية
            markers.forEach(marker => marker.remove());
            markers.length = 0; // مسح المصفوفة

            listings.forEach(listing => {
                const marker = L.marker([listing.location.latitude, listing.location.longitude]).addTo(map)
                    .bindPopup(`
                        <b>${listing.title}</b><br>
                        النوع: ${listing.type}<br>
                        السعر: ${listing.price} جنيه
                    `);

                // إضافة النوع كمعلومة للماركر
                marker.type = listing.type; // إضافة خاصية النوع للماركر
                marker.listingDetails = listing; // إضافة التفاصيل الخاصة بالشقة للماركر

                markers.push(marker); // تخزين الماركر في المصفوفة

                // إضافة حدث للنقر على الماركر لعرض التفاصيل في الـ details card
                marker.on('click', function() {
                    displayListingDetails(marker.listingDetails); // عرض التفاصيل في الـ details card
                });
            });

            applyFilter(); // تطبيق الفلتر في البداية

        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    }

    document.querySelectorAll('input[name="filter"]').forEach(radio => {
        radio.addEventListener('change', function() {
            console.log("Filter Changed to:", this.value);
            applyFilter();
        });
    });

    function applyFilter() {
        const selectedFilter = document.querySelector('input[name="filter"]:checked').value; 
        console.log("Filter Selected:", selectedFilter); 
    
        const filteredListings = markers.filter(marker => {
            const listingType = marker.type;
            return selectedFilter === "الكل" || selectedFilter === listingType;
        });
    
        const filterCountElement = document.getElementById('filter-count');
        if (filterCountElement) {
            filterCountElement.innerHTML = `عدد النتائج: ${filteredListings.length}`;
        }
    
        markers.forEach(marker => {
            if (filteredListings.includes(marker)) {
                marker.addTo(map); 
            } else {
                map.removeLayer(marker); 
            }
        });
    }
    

    function displayListingDetails(listing) {
        const detailsContainer = document.getElementById('details');
        const imageContainer = document.getElementById('image-container');
    
        if (!detailsContainer || !imageContainer) {
            console.error('One or both containers are missing.');
            return;
        }
    
        // إعداد الـ Swiper لعرض الصور
        const imagesHtml = `
            <div class="swiper-container">
                <div class="swiper-wrapper">
                    ${listing.images.map(image => {
                        const imageUrl = `http://localhost:3001/${image}`;
                        return `<div class="swiper-slide"><img src="${imageUrl}" class="listing-image" style="width:100%; height:auto;" /></div>`;
                    }).join('')}
                </div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
        `;
        imageContainer.innerHTML = imagesHtml;
    
        const swiper = new Swiper('.swiper-container', {
            slidesPerView: 1,
            spaceBetween: 10,
            loop: true,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev'
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            }
        });
    
        // عرض التفاصيل الأخرى مع زر "احجز الآن"
        detailsContainer.innerHTML = `
            <b><strong>العنوان:</strong> ${listing.title}</b><br>
            <strong>نوع المسكن:</strong> ${listing.type}<br>
            <strong>السعر:</strong> ${listing.price} جنيه<br>
            <a href="/booking/${listing._id}" id="book-now" class="btn btn-primary" style="margin-top: 20px;">احجز الآن</a>
        `;
    }
    
    
    

    
    fetchListings(); // جلب البيانات
});
