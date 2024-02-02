let map;
chosenRadius = 10000;
let locationType = "branches";
let fetchAsyncCount = 0;

document.addEventListener("DOMContentLoaded", function () {
  const useCurrentLocationCheckbox = document.querySelector("#use-current-location");

// Event listener for the change of event on filter toggles

  document.querySelectorAll('.filter-checkbox').forEach(function (checkbox) {
    checkbox.addEventListener('change', function () {
      FetchFilters();
    });
  });

  geoFindMe();

  useCurrentLocationCheckbox.addEventListener("change", function () {
    geoFindMe();
  });
  updateMapView();
});

 
async function fetchData(apiUrl, presetLatitude, presetLongitude, geoUsed, radiusChoice) {
  //fetching data from api
  fetchAsyncCount++;
  if(fetchAsyncCount<5){
    const PassFilter = FetchFilters();
    apiUrl += PassFilter;
    try {
  const response = await fetch(apiUrl, {   headers: {     'x-api-key': 'WeqnBxTK6oAojiK25NXj1JT6aNa2B4z21heNJahg',   } });

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

        var locations = [];

      if (locationType === "branches") {
        //assigning branch data objects
            locations = data.map(branch => ({
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
          var weekendOpeningHours = {
           Saturday: (location.openingHoursSaturday === "00:00 - 00:00") ? "Closed" : location.openingHoursSaturday,
            Sunday: (location.openingHoursSunday === "00:00 - 00:00") ? "Closed" : location.openingHoursSunday
          };
          var accessibilityInfo = '<b>Accessibility:</b><br>';
          var accessibilityItems = location.accessibility.split(',');

          accessibilityItems.forEach(function (item) {
            accessibilityInfo += item.trim() + '<br>';
          });
          marker.bindPopup('<b>' + location.name + '</b><br>Opening Hours: '
                            + '</b><br>Monday: ' + location.openingHoursMonday
                            + '</b><br>Tuesday: ' + location.openingHoursTuesday 
                            + '</b><br>Wednesday: ' + location.openingHoursWednesday 
                            + '</b><br>Thursday: ' + location.openingHoursThursday 
                            + '</b><br>Friday: ' + location.openingHoursFriday 
                            + '</b><br>Saturday: ' + weekendOpeningHours.Saturday
                            + '</b><br>Sunday: ' + weekendOpeningHours.Sunday
                            + '<br>'
                            + '<br>' + accessibilityInfo
                              + '</b><br>Contact Number: ' + location.contactNumber 
                              + '</b><br>Street: ' + location.street 
                              + '</b><br>Town: ' + location.town 
                              + '</b><br>County: ' + location.county 
                              + '</b><br>Country: ' + location.country 
                              + '</b><br>Post Code: ' + location.postCode
                            + '</b><br><a href="https://www.google.com/maps/search/?api=1&query='+ location.lat +','+location.lng + '" type="button" class="btn btn-danger text-white">Navigate</a>'
                            // Adds Google maps to each marker
                            );
        });

      } else if (locationType === 'atm') {
        // assign ATM data objects
        locations = data.map(atm => ({
            lat: parseFloat(atm.latitude),
            lng: parseFloat(atm.longitude),
            atm_identification: atm.atm_identification,
            supported_languages: atm.supported_languages,
            atm_services: atm.atm_services,
            accessibility: atm.accessibility,
            access_24_hours: atm.access_24_hours,
            supported_currencies: atm.supported_currencies,
            minimum_amount: atm.minimum_amount,
            other_accessibility_code: atm.other_accessibility_code,
            other_accessibility_name: atm.other_accessibility_name,
            typelocation: atm.other_location_category_description,
            street_name: atm.street_name,
            town_name: atm.town_name,
            country_subdivision: atm.country_subdivision,
            country: atm.country,
            post_code: atm.post_code,
          }));
          
          //plotting atm markers
          locations.forEach(function (atm) {
            var marker = L.marker([atm.lat, atm.lng]).addTo(map);

            //display validation for closed days and list formatting
            var access = (atm.access_24_hours === 1) ? '<span style="color: green;">&#10004;</span>' : '<span style="color: red;">&#10008;</span>';
            var accessibilityInfo = '<b>Accessibility:</b><br>';
            var accessibilityItems = atm.accessibility.split(',');
            var servicesInfo = '<b>ATM Services:</b><br>';
            var servicesItems = atm.atm_services.split(',')

            var otherAccessInfo = '<b>Other Accessibility:</b><br>'
            var otherAccessItems = atm.other_accessibility_name.split(',');

            accessibilityItems.forEach(function (item) {
              accessibilityInfo += item .trim() + '<br>';

            });

            servicesItems.forEach(function (item) {
              servicesInfo += item.trim() + '<br>';
            });

            otherAccessItems.forEach(function (item) {
              otherAccessInfo += item.trim() + '<br>';
            });
            
            //formatting displayed information

            marker.bindPopup('<b>Street Name: ' + atm.street_name 
              + '</b><br>'
                + '</b><br>Supported Currencies: ' + atm.supported_currencies
                + '</b><br>Supported Languages: ' + atm.supported_languages
                + '</b><br>Accessibility: ' + atm.accessibility
                + '</b><br>Street Name: ' + atm.street_name
                + '</b><br>Supported Languages: ' + atm.supported_languages
                + '</b>'
                + '<br>' + servicesInfo
                + '</b>'
                + '<br>' + accessibilityInfo
                + '</b>'
                + '<br>' + otherAccessInfo
                + '</b><br>24-Hour Access: ' + access
                + '</b><br>Supported Currencies: ' + atm.supported_currencies
                + '</b><br>Minimum Amount: £' + atm.minimum_amount
                + '</b><br>Type of Location: ' + atm.typelocation
                + '</b><br>Town Name: ' + atm.town_name
                + '</b><br>Country Subdivision: ' + atm.country_subdivision
                + '</b><br>Country: ' + atm.country
                + '</b><br>Post Code: ' + atm.post_code
                + '</b><br><a href="https://www.google.com/maps/search/?api=1&query='+ atm.lat +','+ atm.lng + '" type="button" class="btn btn-danger text-white">Navigate</a>'

            );
        });
        
    }


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

        //dependant on that which is being displayed
        if (locationType === "branches")
          {
            //display branch data
            displayNearestBranchesList(data);
          }
        else if (locationType === "atm")
          {
            //display atm data
            displayNearestATMsList(data);
          }

        fetchAsyncCount--;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
  }
}

function showBranchOnMap(branchName) {
  const marker = map.getLayers().find(layer => layer.options.title === branchName);
  if (marker) {
    map.setView(marker.getLatLng(), 15);
    marker.openPopup();
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
          const apiUrl = `https://8vl4yr0ldj.execute-api.eu-west-2.amazonaws.com/production/resources?lat=${lat}&long=${lon}&radius=${chosenRadius}&table=${locationType}`;

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
    const apiUrl = `https://8vl4yr0ldj.execute-api.eu-west-2.amazonaws.com/production/resources?lat=${latitude}&long=${longitude}&radius=${chosenRadius}&table=${locationType}`;
    fetchData(apiUrl, latitude, longitude, true);
  }
 
  //preset location if geolocation is blocked
  function usePresetLocation() {
    const presetLatitude = 51.505;
    const presetLongitude = -0.09;

    const presetApiUrl = `https://8vl4yr0ldj.execute-api.eu-west-2.amazonaws.com/production/resources?lat=${presetLatitude}&long=${presetLongitude}&radius=${chosenRadius}&table=${locationType}&filter=`;

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

function FetchFilters() {
  var filters = '';
  var WheelChairAccessSwitch = document.getElementById("WheelchairAccessible");
  var AudioCashMachineSwitch = document.getElementById("AudioCashMachine");
  var PinChangeSwitch = document.getElementById("PinChange");
  var CashDepositSwitch = document.getElementById("CashDeposits");
  var ChequeDepositsSwitch = document.getElementById("ChequeDeposits");

  if (WheelChairAccessSwitch.checked) {
    filters += ' AND accessibility LIKE "%WheelchairAccess%"';
  }
  if (AudioCashMachineSwitch.checked) {
    filters += ' AND accessibility LIKE "%AudioCashMachine%"';
  }
  if (PinChangeSwitch.checked) {
    filters += ' AND atm_services LIKE "%PINChange%"';
  }
  if (CashDepositSwitch.checked) {
    filters += ' AND atm_services LIKE "%CashDeposits%"';
  }
  if (ChequeDepositsSwitch.checked) {
    filters += ' AND atm_services LIKE "%ChequeDeposits%"';
  }

  console.log("This function works");
  console.log(filters);
  var encodedString = encodeURIComponent(filters);
  return ("&filter=" + encodedString)
}

function displayNearestBranchesList(data) {
    const nearestThingyListDiv = document.getElementById('nearest-thingy-list');

  // clear existing div 
    nearestThingyListDiv.innerHTML = '<h3>Nearest Branches</h3>';

  // iterating through all branches and creating dropdown buttons for each
    data.slice(0, 10).forEach(branch => {
    const branchDropdown = document.createElement('div');
    branchDropdown.classList.add('dropdown');

    const dropdownButton = document.createElement('button');
    //formatting button
    dropdownButton.classList.add('btn', 'btn-outline-danger', 'dropdown-toggle', 'mb-2'); // Added 'mr-2' class for right margin
    dropdownButton.setAttribute('type', 'button');
    dropdownButton.setAttribute('data-toggle', 'dropdown');
    dropdownButton.textContent = branch.branch_name;

    const dropdownMenu = document.createElement('div');
    dropdownMenu.classList.add('dropdown-menu');

    // event listener to display branch details on click
    dropdownButton.addEventListener('click', function () {
      showBranchDetails(branch, dropdownMenu);
    });

    // appending button and menu to dropdown
    branchDropdown.appendChild(dropdownButton);
    branchDropdown.appendChild(dropdownMenu);

    // appending the dropdown to the approproate div
    nearestThingyListDiv.appendChild(branchDropdown);
  });
}
function displayBranchDetails(apiUrl, index) {
  const nearestThingyListDiv = document.getElementById('nearest-thingy-list');
  fetchAsyncCount++;
  if (fetchAsyncCount < 5) {
    fetch(apiUrl, {   headers: {     'x-api-key': 'WeqnBxTK6oAojiK25NXj1JT6aNa2B4z21heNJahg',   } })
      .then(response => response.json())
      .then(data => {
        
        const branch = data[index];
        fetchAsyncCount--;
      })
      .catch(error => console.error('Error fetching data:', error));
  }
}

// Function to show branch details when a branch button is clicked
function showBranchDetails(branch, dropdownMenu) {
  const branchInfoDiv = document.getElementById('branch-info');
  dropdownMenu.innerHTML = '';
  const openingHoursSaturday = (branch.opening_hours_saturday === "00:00 - 00:00") ? "Closed" : branch.opening_hours_saturday;
  const openingHoursSunday = (branch.opening_hours_sunday === "00:00 - 00:00") ? "Closed" : branch.opening_hours_sunday;
  var accessibilityInfo = '<strong>Accessibility:</strong><br>';
  var accessibilityItems = branch.accessibility.split(',');

      accessibilityItems.forEach(function (item) {
      accessibilityInfo += item.trim() + '<br>';
  });

  // Setting and displaying the values of the selected branch in HTML
  const branchDetails = document.createElement('div');
  branchDetails.innerHTML = `

      <p>Branch Name: ${branch.name}</p>
      <p><strong>Opening Hours:</strong></p>
      <p>Monday: ${branch.opening_hours_monday}</p>
      <p>Tuesday: ${branch.opening_hours_tuesday}</p>
      <p>Wednesday: ${branch.opening_hours_wednesday}</p>
      <p>Thursday: ${branch.opening_hours_thursday}</p>
      <p>Friday: ${branch.opening_hours_friday}</p>
      <p>Saturday: ${openingHoursSaturday}</p>
      <p>Sunday: ${openingHoursSunday}</p>
      <p>${accessibilityInfo}</p>
      <p>Contact Number: ${branch.contact_phone}</p>
      <p>Street: ${branch.street_name}</p>
      <p>Town: ${branch.town_name}</p>
      <p>County: ${branch.country_subdivision}</p>
      <p>Country: ${branch.country}</p>
      <p>Post Code: ${branch.post_code}</p>
  `;

  dropdownMenu.appendChild(branchDetails);
}

function displayNearestATMsList(data) {
  const nearestThingyListDiv = document.getElementById('nearest-thingy-list');

  // clear existing div 
    nearestThingyListDiv.innerHTML = '<h3>Nearest ATMs</h3>';

  // iterating through all branches and creating dropdown buttons for each
    data.slice(0, 10).forEach(atm => {
    const atmDropdown = document.createElement('div');
    atmDropdown.classList.add('dropdown');

    const dropdownButton = document.createElement('button');
    //formatting button
    dropdownButton.classList.add('btn', 'btn-outline-danger', 'dropdown-toggle', 'mb-2'); // Added 'mr-2' class for right margin
    dropdownButton.setAttribute('type', 'button');
    dropdownButton.setAttribute('data-toggle', 'dropdown');
    dropdownButton.textContent = atm.street_name;

    const dropdownMenu = document.createElement('div');
    dropdownMenu.classList.add('dropdown-menu');

    // event listener to display branch details on click
    dropdownButton.addEventListener('click', function () {
      showATMDetails(atm, dropdownMenu);
    });

    // appending button and menu to dropdown
    atmDropdown.appendChild(dropdownButton);
    atmDropdown.appendChild(dropdownMenu);

    // appending the dropdown to the approproate div
    nearestThingyListDiv.appendChild(atmDropdown);
  });
}

function displayATMDetails(apiUrl, index) {
  const nearestThingyListDiv = document.getElementById('nearest-thingy-list');
  fetchAsyncCount++;
  if (fetchAsyncCount < 5) {
    fetch(apiUrl, {   headers: {     'x-api-key': 'WeqnBxTK6oAojiK25NXj1JT6aNa2B4z21heNJahg',   } })

      .then(response => response.json())
      .then(data => {
        const atm = data[index];


        ATMButton.addEventListener('click', function () {
          showATMDetails(atm);
        });

    // appending the dropdown to the approproate div
    nearestThingyListDiv.appendChild(ATMButton);


        fetchAsyncCount--;
      })
      .catch(error => console.error('Error fetching data:', error));
  }
}

function showATMDetails(atm, dropdownMenu) {
  const branchInfoDiv = document.getElementById('branch-info');
  var access = (atm.access_24_hours === 1) ? '<span style="color: green;">&#10004;</span>' : '<span style="color: red;">&#10008;</span>';
  var accessibilityInfo = '<b>Accessibility:</b><br>';
  var accessibilityItems = atm.accessibility.split(',');
  var servicesInfo = '<b>ATM Services:</b><br>';
  var servicesItems = atm.atm_services.split(',')
  var otherAccessInfo = '<b>Other Accessibility:</b><br>'
  var otherAccessItems = atm.other_accessibility_name.split(',');
  
    accessibilityItems.forEach(function (item) {
        accessibilityInfo += item.trim() + '<br>';
    });

    servicesItems.forEach(function (item) {
      servicesInfo += item.trim() + '<br>';
    });

    otherAccessItems.forEach(function (item) {
      otherAccessInfo += item.trim() + '<br>';
    });
  // Setting and displaying the values of the selected branch in HTML
  const atmDetails = document.createElement('div');
  atmDetails.innerHTML = `

        <p><strong>Nearest ATM Details:</strong></p>
        <p>Street Name: ${atm.street_name}</p>
        <p>Supported Currencies: ${atm.supported_currencies}</p>
        <p>Supported Languages: ${atm.supported_languages}</p>
        <p>ATM Services: ${servicesInfo}</p>
        <p>Accessibility: ${accessibilityInfo}</p>
        <p>${otherAccessInfo}</p>
        <p>24-Hour Access: ${access}</p>
        <p>Minimum Amount: £${atm.minimum_amount}</p>

        <p>Type of Location: ${atm.typelocation}</p>
        <p>Town Name: ${atm.town_name}</p>
        <p>Country Subdivision: ${atm.country_subdivision}</p>
        <p>Country: ${atm.country}</p>
        <p>Post Code: ${atm.post_code}</p>
  `;
        dropdownMenu.appendChild(atmDetails);

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

            const apiUrl = `https://8vl4yr0ldj.execute-api.eu-west-2.amazonaws.com/production/resources?lat=${lat}&long=${lon}&radius=${chosenRadius}&table=${locationType}`;

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

            const apiUrl = `https://8vl4yr0ldj.execute-api.eu-west-2.amazonaws.com/production/resources?lat=${lat}&long=${lon}&radius=${chosenRadius}&table=${locationType}`;

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
 
// Preventing dropdown from closure when clicking inside it or on the filter button
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
