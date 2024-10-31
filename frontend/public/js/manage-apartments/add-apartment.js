// قائمة لتخزين الصور
let imageList = [];

function initMap() {
    const initialLocation = [30.0444, 31.2357]; // القاهرة

    const map = L.map('map').setView(initialLocation, 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    const marker = L.marker(initialLocation, { draggable: true }).addTo(map);

    marker.on('dragend', function(event) {
        const position = marker.getLatLng();
        document.getElementById('latitude').value = position.lat;
        document.getElementById('longitude').value = position.lng;
    });

    map.on('click', function(event) {
        marker.setLatLng(event.latlng);
        document.getElementById('latitude').value = event.latlng.lat;
        document.getElementById('longitude').value = event.latlng.lng;
    });
}

function previewImages(event) {
    const previewContainer = document.getElementById('image-preview');
    const files = event.target.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();

        reader.onload = function (e) {
            // إضافة الصورة الجديدة إلى قائمة الصور
            imageList.push(e.target.result);
            const img = document.createElement('img');
            img.src = e.target.result;
            img.style.width = '100px';
            img.style.margin = '5px';
            img.style.border = '1px solid #ced4da';
            img.style.borderRadius = '4px';

            const removeButton = createRemoveButton(e.target.result);
            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.appendChild(removeButton);
            wrapper.appendChild(img);
            previewContainer.appendChild(wrapper);
        }

        reader.readAsDataURL(file);
    }
}

function createRemoveButton(src) {
    const removeButton = document.createElement('span');
    removeButton.innerHTML = 'X';
    removeButton.style.color = 'red';
    removeButton.style.cursor = 'pointer';
    removeButton.style.position = 'absolute';
    removeButton.style.backgroundColor = 'white';
    removeButton.style.borderRadius = '50%';
    removeButton.style.padding = '2px 5px';
    removeButton.style.fontWeight = 'bold';
    removeButton.style.top = '0';
    removeButton.style.left = '0';

    removeButton.onclick = function () {
        imageList = imageList.filter(imgSrc => imgSrc !== src);
        updateImagePreview(document.getElementById('image-preview'));
    };

    return removeButton;
}

function updateImagePreview(previewContainer) {
    previewContainer.innerHTML = '';
    imageList.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.style.width = '100px';
        img.style.margin = '5px';
        img.style.border = '1px solid #ced4da';
        img.style.borderRadius = '4px';

        const removeButton = createRemoveButton(src);
        const wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.appendChild(removeButton);
        wrapper.appendChild(img);
        previewContainer.appendChild(wrapper);
    });
}

window.onload = function() {
    initMap();
};
