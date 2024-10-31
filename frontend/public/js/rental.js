document.addEventListener("DOMContentLoaded", function() {
    const map = L.map('map').setView([30.0444, 31.2357], 12); // مركز الخريطة على القاهرة

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    async function fetchListings() {
        try {
            const response = await fetch('/rental/listings'); // تأكد من صحة المسار
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const listings = await response.json();
    
            listings.forEach(listing => {
                const marker = L.marker([listing.location.latitude, listing.location.longitude]).addTo(map)
                    .bindPopup(`
                        <b>${listing.title}</b><br>
                        النوع: ${listing.type}<br>
                        السعر: ${listing.price} جنيه
                    `);
    
                marker.on('click', () => {
                    const detailsDiv = document.getElementById("details");
                    if (detailsDiv) { // تحقق من وجود العنصر
                        // إنشاء معرّف للصورة الحالية
                        let currentImageIndex = 0;
    
                        // إنشاء كود HTML لعرض الصور
                        const imagesHtml = listing.images.map((img, index) => `
                            <img src="${img}" alt="صورة الشقة" style="width:100%; height:auto; display: ${index === currentImageIndex ? 'block' : 'none'};" class="listing-image" data-index="${index}">
                        `).join('');
    
                        // إضافة أزرار لتبديل الصور
                        detailsDiv.innerHTML = `
                            <strong>تفاصيل:</strong><br>
                            النوع: ${listing.type}<br>
                            العنوان: ${listing.title}<br>
                            السعر: ${listing.price} جنيه<br>
                            <div id="image-container">
                                ${imagesHtml}
                            </div>
                            <button id="prev-button">السابق</button>
                            <button id="next-button">التالي</button>
                        `;
    
                        // إضافة الأحداث للأزرار
                        document.getElementById("prev-button").onclick = () => {
                            currentImageIndex = (currentImageIndex - 1 + listing.images.length) % listing.images.length;
                            updateImage();
                        };
                        document.getElementById("next-button").onclick = () => {
                            currentImageIndex = (currentImageIndex + 1) % listing.images.length;
                            updateImage();
                        };
    
                        function updateImage() {
                            const images = document.querySelectorAll('.listing-image');
                            images.forEach((img, index) => {
                                img.style.display = (index === currentImageIndex) ? 'block' : 'none';
                            });
                        }
                    } else {
                        console.error('Element with id "details" not found.');
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching listings:', error);
        }
    }
    

    fetchListings();
});
