let map;
chosenRadius = 10000;
let locationType = "branches";

document.addEventListener("DOMContentLoaded", function () {
  const useCurrentLocationCheckbox = document.querySelector("#use-current-location");

  geoFindMe();

  useCurrentLocationCheckbox.addEventListener("change", function () {
    geoFindMe();
  });
  updateMapView;
});

async function fetchData(apiUrl, presetLatitude, presetLongitude, geoUsed, radiusChoice) {
    //fetching data from api
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    //resetting the map
    if (map) {
      map.remove();
    }
    
    //setting the mapview to preset values
    map = L.map("map").setView([presetLatitude, presetLongitude], 10);

    //initialising the map
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    apiUrl = `${apiUrl}`;
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
        accessibility: branch.accessibility,
        contactNumber: branch.contact_phone,
        street: branch.street_name,
        town: branch.town_name,
        county: branch.country_subdivision,
        country: branch.country,
        postCode: branch.post_code
    }));

    //creating a marker for each within radius set
    locations.forEach(function (location) {
      var marker = L.marker([location.lat, location.lng]).addTo(map);
      marker.bindPopup('<b>' + location.name + '</b><br>Opening Hours: ' 
                        + '</b><br>Monday: ' + location.openingHoursMonday
                        + '</b><br>Tuesday: ' + location.openingHoursTuesday 
                        + '</b><br>Wednesday: ' + location.openingHoursWednesday 
                        + '</b><br>Thursday: ' + location.openingHoursThursday 
                        + '</b><br>Friday: ' + location.openingHoursFriday 
                        + '</b><br>Saturday: ' + location.openingHoursSaturday 
                        + '</b><br>Sunday: ' + location.openingHoursSunday
                        + '</b><br>Sunday: ' + location.openingHoursSunday
                        + '</b><br>Accessibility: ' + location.accessibility
                          + '</b><br>Contact Number: ' + location.contactNumber 
                          + '</b><br>Street: ' + location.street 
                          + '</b><br>Town: ' + location.town 
                          + '</b><br>County: ' + location.county 
                          + '</b><br>Country: ' + location.country 
                          + '</b><br>Post Code: ' + location.postCode
                        + '</b><br><a href="https://www.google.com/maps/search/?api=1&query='+ location.latitude +','+location.longitude + '" type="button" class="btn btn-danger text-white">Navigate</a>'
                         // Adds Google maps to each marker
                        );
    });

    const firstLocation = document.querySelector("#branch-info").dataset.location;
    if (!firstLocation) {
      displayBranchDetails(apiUrl, 0);
    }

    // Determines if geo locations are used, if so create a pin at the user's location
    if (geoUsed) {
      userLocationMarker = L.marker([presetLatitude, presetLongitude]).addTo(map);
      userLocationMarker.bindPopup('You are here');
      updateMapView;
    }
    // Display the list of nearest branches
    displayNearestBranchesList(data);


  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function displayNearestBranchesList(data) {
  const nearestBranchesListDiv = document.getElementById('nearest-branches-list');

  nearestBranchesListDiv.innerHTML = '<h3>Nearest Branches</h3>';
  data.slice(0, 5).forEach(branch => {
    nearestBranchesListDiv.innerHTML += `<button class="btn btn-link" onclick="showBranchOnMap('${branch.branch_name}')">${branch.branch_name}</button><br>`;
  });
}

function showBranchOnMap(branchName) {
  const marker = map.getLayers().find(layer => layer.options.title === branchName);
  if (marker) {
    map.setView(marker.getLatLng(), 15);
    marker.openPopup();
  }
}

// Other functions remain unchanged

function performSearch() {
  const searchInput = document.getElementById('search-input').value;
  const useCurrentLocationCheckbox = document.getElementById('use-current-location');

  if (!useCurrentLocationCheckbox.checked) {
    // Only perform search if "Use Current Location" is not checked
    // Using a geocoding service, Nominatim to get the coordinates
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`)
      .then(response => response.json())
      .then(data => {
        if (data && data.length > 0) {
          const result = data[0];
          const lat = parseFloat(result.lat);
          const lon = parseFloat(result.lon);
          const apiUrl = `https://uq1fh77mk8.execute-api.us-east-1.amazonaws.com/production/res?lat=${lat}&long=${lon}&radius=${chosenRadius}&table=${locationType}`;

          fetchData(apiUrl, lat, lon);
        } else {
          alert('Location not found');
        }
      })
      .catch(error => console.error('Error:', error));
  }
}

function geoFindMe() {
    //geolocation variables and checkbox
  const status = document.querySelector("#status");
  const mapLink = document.querySelector("#map-link");
  const useCurrentLocationCheckbox = document.querySelector("#use-current-location");


  mapLink.href = "";
  mapLink.textContent = "";

  function success(position) {
    //assigning values received from geoloaction allowance
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = "";
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;

    //setting the current co-ordinates within the url
    const apiUrl = `https://uq1fh77mk8.execute-api.us-east-1.amazonaws.com/production/res?lat=${latitude}&long=${longitude}&radius=${chosenRadius}&table=${locationType}`;
    fetchData(apiUrl, latitude, longitude, true);
  }

  //preset location if geolocation is blocked
  function usePresetLocation() {
    const presetLatitude = 51.505;
    const presetLongitude = -0.09;
    const presetApiUrl = `https://uq1fh77mk8.execute-api.us-east-1.amazonaws.com/production/res?lat=${presetLatitude}&long=${presetLongitude}&radius=${chosenRadius}&table=${locationType}`;
    fetchData(presetApiUrl, presetLatitude, presetLongitude);

    const firstLocation = document.querySelector("#branch-info").dataset.location;
    if (!firstLocation) {
      displayBranchDetails(presetApiUrl, 0);
    }
  }

  //geolocation validation 
  function error() {
    status.textContent = "Unable to retrieve your location";
    
    //setting the status of checkbox
    useCurrentLocationCheckbox.checked = false;

    if (useCurrentLocationCheckbox.checked) {
    //use preset location if unchecked
      usePresetLocation();
    }
  }

  //further geolocation error handling and validation
  if (!navigator.geolocation) {
    status.textContent = "Geolocation is not supported by your browser";
    usePresetLocation();
  } else {
    status.textContent = "Locating…";
    if (useCurrentLocationCheckbox.checked) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      usePresetLocation();
    }
  }
}

function displayBranchDetails(apiUrl, index) {
  const branchInfoDiv = document.getElementById('branch-info');

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      const branch = data[index];
      //setting and displaying the values of closest branch in html
      branchInfoDiv.innerHTML = `
      h3>${branch.branch_name}</h3>
      <p><strong>Opening Hours:</strong></p>
      <p>Monday: ${branch.opening_hours_monday}</p>
      <p>Tuesday: ${branch.opening_hours_tuesday}</p>
      <p>Wednesday: ${branch.opening_hours_wednesday}</p>
      <p>Thursday: ${branch.opening_hours_thursday}</p>
      <p>Friday: ${branch.opening_hours_friday}</p>
      <p>Saturday: ${branch.opening_hours_saturday}</p>
      <p>Sunday: ${branch.opening_hours_sunday}</p>
      <p><strong>Accessibility:</strong> ${branch.accessibility}</p>
      <p>Contact Number: ${branch.contact_phone}</p>
      <p>Street: ${branch.street_name}</p>
      <p>Town: ${branch.town_name}</p>
      <p>County: ${branch.country_subdivision}</p>
      <p>Country: ${branch.country}</p>
      <p>Post Code: ${branch.post_code}</p>
      `;//<p><strong>Accessibility:</strong> ${branch.accessibility}</p>
    })
    .catch(error => console.error('Error fetching data:', error));
}


function updateMapView() {
  const useCurrentLocationCheckbox = document.querySelector("#use-current-location");

  if (useCurrentLocationCheckbox.checked) {
    const searchInput = document.getElementById('search-input').value;

    if (searchInput.trim() !== '') {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            const result = data[0];
            const lat = parseFloat(result.lat);
            const lon = parseFloat(result.lon);

            const apiUrl = `https://9o3co4oqce.execute-api.us-east-1.amazonaws.com/production/resources?lat=${lat}&long=${lon}&radius=${chosenRadius}&table=${locationType}`;

            fetchData(apiUrl, lat, lon, false);
          } else {
            alert('Location not found');
          }
        })
        .catch(error => console.error('Error:', error));
    } else {
      geoFindMe();
    }
  }

  if (!useCurrentLocationCheckbox.checked) {
    const searchInput = document.getElementById('search-input').value;

    if (searchInput.trim() !== '') {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`)
        .then(response => response.json())
        .then(data => {
          if (data && data.length > 0) {
            const result = data[0];
            const lat = parseFloat(result.lat);
            const lon = parseFloat(result.lon);

            const apiUrl = `https://9o3co4oqce.execute-api.us-east-1.amazonaws.com/production/resources?lat=${lat}&long=${lon}&radius=${chosenRadius}&table=${locationType}`;

            fetchData(apiUrl, lat, lon, false);
          } else {
            alert('Location not found');
          }
        })
        .catch(error => console.error('Error:', error));
    } else {
      geoFindMe();
    }
  }
}

function updateLocationType(checkbox) {
  document.querySelectorAll('input[type="checkbox"]').forEach((cbLT) => {
    if (cbLT !== checkbox && cbLT.id !== 'use-current-location' && cbLT.id !== 'radiusChoice') {
      cbLT.checked = false;
    }
  });

  locationType = checkbox.checked ? checkbox.value : null;

  updateMapView();
}

function updateRadius(checkbox) {
  document.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
    if (cb !== checkbox && cb.id !== 'use-current-location' && cb.id !== 'locationType') {
      cb.checked = false;
    }
  });

  chosenRadius = checkbox.checked ? parseInt(checkbox.value) : null;
  
  updateMapView();
}
// Event listener for the filter button
document.getElementById("filterDropdownButton").addEventListener("click", toggleFilterDropdown);

// Prevent the dropdown from closing when clicking inside it or on the filter button
document.addEventListener("click", function(event) {
  var filterDropdown = document.getElementById("filterDropdown");
  var filterButton = document.getElementById("filterDropdownButton");
  console.log(event.target.tagName); // Log the clicked target's tag name
  if (!filterDropdown.contains(event.target) && event.target !== filterButton && !event.target.classList.contains('switch') && event.target.tagName.toLowerCase() !== 'input') {
    filterDropdown.style.display = "none";
  }
});

function toggleFilterDropdown() {
  var filterDropdown = document.getElementById("filterDropdown");
  var filterDropdownButton = document.getElementById("filterDropdownButton");
  
  console.log("filterDropdown:", filterDropdown);
  console.log("filterDropdownButton:", filterDropdownButton);

  if (filterDropdown && filterDropdownButton) {
    if (filterDropdown.style.display === "none" || filterDropdown.style.display === "") {
      filterDropdown.style.display = "block";
    } else {
      filterDropdown.style.display = "none";
    }
  } else {
    console.log("One or both elements not found.");
  }
}
