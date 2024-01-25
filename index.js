let map;

document.addEventListener("DOMContentLoaded", function () {
  const useCurrentLocationCheckbox = document.querySelector("#use-current-location");

  geoFindMe();

  useCurrentLocationCheckbox.addEventListener("change", function () {
    geoFindMe();
  });
});

async function fetchData(apiUrl, presetLatitude, presetLongitude) {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (map) {
      map.remove();
    }

    map = L.map("map").setView([presetLatitude, presetLongitude], 10);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

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
      marker.bindPopup('<b>' + location.name + '</b><br>Opening Hours: ' 
                        + '</b><br>Monday: ' + location.openingHoursMonday
                        + '</b><br>Tuesday: ' + location.openingHoursTuesday 
                        + '</b><br>Wednesday: ' + location.openingHoursWednesday 
                        + '</b><br>Thursday: ' + location.openingHoursThursday 
                        + '</b><br>Friday: ' + location.openingHoursFriday 
                        + '</b><br>Saturday: ' + location.openingHoursSaturday 
                        + '</b><br>Sunday: ' + location.openingHoursSunday);
    });

    const firstLocation = document.querySelector("#branch-info").dataset.location;
    if (!firstLocation) {
      displayBranchDetails(apiUrl, 0);
    }

  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
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

          const apiUrl = `https://hhlvbz9p77.execute-api.us-east-1.amazonaws.com/production/transactions?lat=${lat}&long=${lon}&radius=10&table=branches`;

          fetchData(apiUrl, lat, lon);
        } else {
          alert('Location not found');
        }
      })
      .catch(error => console.error('Error:', error));
  }
}
function geoFindMe() {
  const status = document.querySelector("#status");
  const mapLink = document.querySelector("#map-link");
  const useCurrentLocationCheckbox = document.querySelector("#use-current-location");

  mapLink.href = "";
  mapLink.textContent = "";

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    status.textContent = "";
    mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    mapLink.textContent = `Latitude: ${latitude} °, Longitude: ${longitude} °`;

    const apiUrl = `https://hhlvbz9p77.execute-api.us-east-1.amazonaws.com/production/transactions?lat=${latitude}&long=${longitude}&radius=10&table=branches`;

    fetchData(apiUrl, latitude, longitude);
  }

  function usePresetLocation() {
    const presetLatitude = 51.505;
    const presetLongitude = -0.09;
    const presetApiUrl = `https://hhlvbz9p77.execute-api.us-east-1.amazonaws.com/testStage/transactions?lat=${presetLatitude}&long=${presetLongitude}&radius=10&table=branches`;
    fetchData(presetApiUrl, presetLatitude, presetLongitude);

    const firstLocation = document.querySelector("#branch-info").dataset.location;
    if (!firstLocation) {
      displayBranchDetails(presetApiUrl, 0);
    }
  }

  function error() {
    status.textContent = "Unable to retrieve your location";
    
    useCurrentLocationCheckbox.checked = false;

    if (useCurrentLocationCheckbox.checked) {
      usePresetLocation();
    }
  }

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
      branchInfoDiv.innerHTML = `
        <h3>${branch.branch_name}</h3>
        <p><strong>Opening Hours:</strong></p>
        <p>Monday: ${branch.opening_hours_monday}</p>
        <p>Tuesday: ${branch.opening_hours_tuesday}</p>
        <p>Wednesday: ${branch.opening_hours_wednesday}</p>
        <p>Thursday: ${branch.opening_hours_thursday}</p>
        <p>Friday: ${branch.opening_hours_friday}</p>
        <p>Saturday: ${branch.opening_hours_saturday}</p>
        <p>Sunday: ${branch.opening_hours_sunday}</p>
        <p><strong>Accessibility:</strong> ${branch.accessibility}</p>
      `;
    })
    .catch(error => console.error('Error fetching data:', error));
}