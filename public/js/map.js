const coords = listing.geometry.coordinates;

const compassIcon = L.divIcon({
    html: '<i class="fa-solid fa-compass" style="font-size:30px; color:red;"></i>',
    className: 'custom-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
});

const map = L.map('map').setView([coords[1], coords[0]], 9);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

L.marker([coords[1], coords[0]], { icon: compassIcon })
    .addTo(map)
    .bindPopup(`<b>${listing.title}</b><br>${listing.location}`)
    .openPopup();