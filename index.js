document.addEventListener("DOMContentLoaded", function () {
    var map = L.map("map").setView([51.505, -0.09], 6);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    fetch('https://hhlvbz9p77.execute-api.us-east-1.amazonaws.com/production/transactions?lat=52.415085&long=-4.083687&radius=10&table=branches')
        .then(response => response.json())
        .then(data => {
            var locations = data.map(branch => ({
                lat: parseFloat(branch.latitude),
                lng: parseFloat(branch.longitude),
                name: branch.branch_name,
                openingHoursMonday: branch.opening_hours_monday,
                openingHoursTuesday: branch.opening_hours_tuesday,
                openingHoursWednesday: branch.opening_hours_wednesday,
                openingHoursThursday: branch.opening_hours_thursday,
                openingHoursFriday: branch.opening_hours_friday,
                openingHoursSaturday: branch.opening_hours_saturday,
                openingHoursSunday: branch.opening_hours_sunday,
                accessibility: branch.accessibility

            }));

            locations.forEach(function (location) {
                var marker = L.marker([location.lat, location.lng]).addTo(map);
                marker.bindPopup('<b>' + location.name + '</b><br>Opening Hours: ' + '</b><br>Monday: ' + location.openingHoursMonday + '</b><br>Tueday: ' + location.openingHoursTuesday + '</b><br>Wednesday: ' + location.openingHoursWednesday + '</b><br>Thursday: ' + location.openingHoursThursday +  '</b><br>Friday: ' + location.openingHoursFriday +  '</b><br>Saturday: ' + location.openingHoursSaturday +  '</b><br>Sunday: ' + location.openingHoursSunday);
                });

            map.on('click', function (e) {
                var clickPopup = L.popup()
                    .setLatLng(e.latlng)
                    .setContent("You clicked the map at " + e.latlng.toString())
                    .openOn(map);
            });

        })
        .catch(error => console.error('Error fetching data:', error));
});
