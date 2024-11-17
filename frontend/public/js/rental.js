document.addEventListener("DOMContentLoaded", function() {
    const map = L.map('map').setView([30.0444, 31.2357], 12); // مركز الخريطة على القاهرة
    const markers = []; // مصفوفة لتخزين الماركرات

    // تحديد الفلتر الافتراضي ليكون "الكل"
    document.querySelector('input[name="filter"][value="الكل"]').checked = true;

    // إعدادات الخريطة
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
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

    // إضافة حدث عند تغيير الاختيار في الفلاتر
    document.querySelectorAll('input[name="filter"]').forEach(radio => {
        radio.addEventListener('change', function() {
            console.log("Filter Changed to:", this.value);
            applyFilter();
        });
    });

    // دالة لتصفية الماركرات بناءً على الفلتر المختار
    function applyFilter() {
        const selectedFilter = document.querySelector('input[name="filter"]:checked').value; // الحصول على القيمة المختارة من الفلاتر
        console.log("Filter Selected:", selectedFilter);  // طباعة الفلتر الذي تم اختياره

        markers.forEach(marker => {
            const listingType = marker.type;
            console.log("Marker Type:", listingType);  // طباعة نوع الماركر

            if (selectedFilter === "الكل" || selectedFilter === listingType) {
                marker.addTo(map); // إضافة الماركر إذا كان يتوافق مع الفلتر
            } else {
                map.removeLayer(marker); // إزالة الماركر إذا لم يتوافق مع الفلتر
            }
        });
    }

    // دالة لعرض التفاصيل في الـ details card
    function displayListingDetails(listing) {
        const detailsContainer = document.getElementById('details');
        const imageContainer = document.getElementById('image-container');
    
        // Debugging: log the containers
        console.log('Details container:', detailsContainer);
        console.log('Image container:', imageContainer);
    
        // Check if the containers are found
        if (!detailsContainer || !imageContainer) {
            console.error('One or both containers are missing.');
            return;
        }

        // عرض الصور الحقيقية
        const imagesHtml = listing.images.map(image => {
            const imageUrl = `http://localhost:3001/${image}`;  // رابط الصورة الصحيح
            return `<img src="${imageUrl}" class="listing-image" style="width:100%; height:auto;" />`;
        }).join('');

        imageContainer.innerHTML = imagesHtml; // عرض الصور في الـ container

        // عرض التفاصيل الأخرى
        detailsContainer.innerHTML = `
            <b> <strong>العنوان:</strong>  ${listing.title}</b><br>
            <strong>نوع المسكن:</strong> ${listing.type}<br>
            <strong>السعر:</strong> ${listing.price} جنيه<br>
        `;
    }

    
    fetchListings(); // جلب البيانات
});
