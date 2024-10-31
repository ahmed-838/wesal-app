// Function to load HTML components
function loadHTML(file, elementId) {
    fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));
}

// Load HTML components once the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    loadHTML("/components/navbar", "navbar");
    loadHTML("/components/upper-page", "upper-page"); 
    loadHTML("/components/auth", "auth");
    loadHTML("/components/cards", "cards");
    loadHTML("/components/footer", "footer");
});
