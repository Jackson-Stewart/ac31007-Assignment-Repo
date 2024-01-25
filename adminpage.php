<?php 
session_start();

// Check if the user is not logged in, redirect to the login page
if (!isset($_SESSION['staffID']) || $_SESSION['role'] != "Admin") {
    
    header("login.php");
    exit();
}
?>

<!DOCTYPE html>

<html lang="en">

<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css"/>
<link rel="stylesheet" href="adminpage.css"/>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<title>Admin Page</title>
</head>

<body>

<!-- this is the navigation bar at the top of the page, has logout button -->
    <nav>
        <div class="navbar">
            <div class="nav-buttons">
                <a href="login.php"><button class="logout-button">Sign Out</button></a>
            </div>
        </div>
    </nav>

<!-- this is the main content of the page, has map, form and results container -->    
<div id="AdminManagement" class="tabcontent">
    <div class="form-container">
        <h2>Branch and ATM Information Management</h2>
        <!-- this is where the map is displayed --> 
        <div id="map"></div>
        <!-- form used to get user input --> 
        <form action='' id='branchForm' method='post' onsubmit="fetchData(); return false;">
            <p>please enter longitude and latitude or select Branch/ATM on map<p>
                <button id="getLocationButton">Get My Location</button>
            <input type='text' id='latitude' name='latitude' placeholder='latitude of branch' required>
            <input type='text' id='longitude' name='longitude' placeholder='longitude of branch' required>
            <!--<input type='text' id='radius' name='radius' placeholder='radius of search' required> -->

            <!-- this allows the user to view branches or atms --> 
            <select id='action' name='action'>
                <option value='branches'>Branches</option> <!-- Branches Table -->
                <option value='atm'>ATM</option> <!-- ATM Table -->
            </select>

            <button type='submit' name='branchFormSubmit'>Enter</button> <!-- Enter button -->
        </form>
        <!-- this is where branch or atm results are displayed --> 
        <div id="resultContainer"></div>
    </div>
</div>

<script>

let map;
    // this fetches the inputs from the forms
    async function fetchData() 
    {
        const latitude = document.getElementById('latitude').value;
        const longitude = document.getElementById('longitude').value;
        //const radius = document.getElementById('radius').value;
        const selectedAction = document.getElementById('action').value;

        // checks if both have inputs in them and are not left empty
        if (isNaN(latitude) || isNaN(longitude)) {
            alert("Invalid input. Please enter numeric values for Latitude and Longitude.");
            return;
        }

        // either atm or branches is selected, updates api link to get the correct data
        const table = selectedAction === 'atm' ? 'atm' : 'branches';
        const apiLink = `https://hhlvbz9p77.execute-api.us-east-1.amazonaws.com/testStage/transactions?lat=${latitude}&long=${longitude}&radius=10&table=${table}`;

        // attempts to fetch the data from the api, either returns data or displays error message
        try {
            const response = await fetch(apiLink);
            if (response.ok) {
                const data = await response.json();
                displayData(data);
            } else {
                alert(`Error: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    
    // this function displays the fetched data from the api, its displayed in the resultsContainer
    function displayData(data) {
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.innerHTML = `<h5>Branches/ATMs Found in your area:</h5>`;
    
    // if the fetched data returns empty, it lets the user know there are no branches/atm within the radius
    if (data.length === 0) 
    {
        resultContainer.innerHTML += `<p>No Branches/ATMs found within the specified radius.</p>`;
        return;
    }

    // this is a table which is used to store fetched data into columns and rows, with appriopriate column names
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Brand</th>
                <th>Branch</th>
                <th>Street</th>
                <th>Town</th>
                <th>Country</th>
                <th>Post Code</th>
                <th>Contact</th>
                <th>Edit</th>
                <th>Delete</th>
            </tr>
        </thead>
        <tbody>
    `;

    // inserts data into the table columns
    data.forEach(branch => {
        table.innerHTML += `
            <tr>
                <td>${branch.branch_identification}</td>
                <td>${branch.brand_name}</td>
                <td>${branch.branch_name}</td>
                <td>${branch.street_name}</td>
                <td>${branch.town_name}</td>
                <td>${branch.country}</td>
                <td>${branch.post_code}</td>
                <td>${branch.contact_phone}</td>
                <td><button onclick="editRow(${branch.branch_id})">Edit</button></td>
                <td><button onclick="editRow(${branch.branch_id})">Delete</button></td>
            </tr>
        `;
    });

    table.innerHTML += `</tbody>`;
    resultContainer.appendChild(table);


        // creates a new map or reuses the existing one
        if (!map) {
        initializeMap(); // initializes the map if not already initialized
    }

    // clears existing markers
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    const markers = []; //array for the markers
    // adds markers to the map
    data.forEach(branch => 
    {
        const marker = L.marker([parseFloat(branch.latitude), parseFloat(branch.longitude)]).addTo(map);
        marker.bindPopup(`
            <b>${branch.branch_name}</b><br>
            Opening Hours: ${branch.opening_hours}<br>
            Contact: ${branch.contact_phone}
        `);
        markers.push(marker)
    });

    //zooms in on the markers
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds());
    }
}

    // this is a function used to initialize the map
    function initializeMap() 
    {
    // this sets the initial coordinated of the map (what area should be visible on the map when it loads)    
    const initialCoordinates = [54.7023545, -3.2765753]; // coordinates set to look at United Kingdom
    // creation of the map, setting visible area on the map, and how zoomed in it is.
    map = L.map('map').setView(initialCoordinates, 5);
    // this adds a tile layer to the map(OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    }



    // this calls the function to initialize the map when the DOM is loaded
    document.addEventListener('DOMContentLoaded', initializeMap);
   
    document.addEventListener('DOMContentLoaded', function () 
    {
        // event listener on the button which gets user's location
        const getLocationButton = document.getElementById('getLocationButton');
        getLocationButton.addEventListener('click', geoFindMe);
    });

    // this is a function used to get user's current location
    function geoFindMe() 
    {
        if (!navigator.geolocation) 
        {
            alert('Geolocation is not supported by your browser');
            return;
        }

        navigator.geolocation.getCurrentPosition(success, error);
    }

    //if the request is successful the latitude and longitude are set with the user's current location
    function success(position) 
    {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        document.getElementById('latitude').value = latitude;
        document.getElementById('longitude').value = longitude;

        fetchData(); // this triggers fetching data after getting location
    }

    //error message if getting users location does not work
    function error() 
    {
        alert('Unable to retrieve your location');
    }

</script>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

</body>
</html>