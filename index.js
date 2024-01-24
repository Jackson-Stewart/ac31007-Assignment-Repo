document.addEventListener("DOMContentLoaded", function () {
    var map = L.map("map").setView([51.505, -0.09], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Sample ATM and Bank Branch data (replace this with your actual data)
    var apiResponse = [
        {
            'latitude': 51.513534,
            'longitude': -0.092826,
            'branch_name': 'Cheapside 69',
            'opening_hours_monday': '09:00 - 16:30',
            'opening_hours_friday': '09:00 - 16:30',
            'contact_phone': '08000284157'
        },
        // Add more API response data as needed
    ];

    // Function to create markers for API locations
    function createAPIMarkers(apiLocations) {
        apiLocations.forEach(function (location) {
            var marker = L.marker([location.latitude, location.longitude]).addTo(map);
            marker.bindPopup('<b>' + location.branch_name + '</b><br>' + 'Opening hours: ' + location.opening_hours_monday + ' - ' + location.opening_hours_friday + '<br>' + 'Phone: ' + location.contact_phone);
        });
    }

    // Use the API response data to create markers
    createAPIMarkers(apiResponse);

    // Add a popup to the initial marker
    var initialPopup = L.popup()
        .setLatLng([51.1, -0.09])
        .setContent("Closing time: " + "Opening time: " + "This branch is wheelchair accessible")
        .openOn(map);

    // Add an event to the map to display coordinates on click
    map.on('click', function (e) {
        var clickPopup = L.popup()
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(map);
    });

    async function PullData() {
        const response = await fetch("https://hhlvbz9p77.execute-api.us-east-1.amazonaws.com/testStage/transactions?lat=52.415085&long=-4.083687&radius=15&table=branches");
        const ATM = await response.json();
        console.log(ATM);
    }

    PullData;


//    fetch('https://hhlvbz9p77.execute-api.us-east-1.amazonaws.com/testStage/transactions?lat=52.415085&long=-4.083687&radius=15&table=branches')
// .then(response => response.json())
//  .then(data => console.log(data))
//  .catch(error => console.error('Error:', error));

    // Add more functionalities as needed
});
