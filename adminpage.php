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
</head>

<body>

<nav>
    <div class="tab">
        <div class="buttons">
            <button class="tablinks" onclick="openTab('branchManagement')">Branch Management</button>
            <button class="tablinks" onclick="openTab('ATMManagement')">ATM Management</button>
            <a href="login.php"><button class="tablinks">Sign Out</button></a>
        </div>
    </div>
</nav>


<!-- ** THE LOOK OF THESE TABS WILL BE CHANGED LATER -->
<div id="branchManagement" class="tabcontent">
<div class="form-container">
        <h1>Branch Management</h1>
        <form action='' method='post'>
            <p>please enter longitude, latitude and radius or select location on map<p>
            <input type='text' name='longitude' placeholder='longitude of branch' required> <!-- 'longitude' text input field -->
            <input type='text' name='latitude' placeholder='latitude of branch' required> <!-- 'latitude' text input field -->
            <input type='text' name='radius' placeholder='radius of search' required> <!-- 'radius' text input field -->

            <select name='action'>
                <option value='branches'>Branches</option> <!-- Branches Table -->
                <option value='atm'>ATM</option> <!-- ATM Table -->
            </select>

            <button type='submit'>Enter</button> <!-- Enter button -->
        </form>

    </div>
</div>

<?php



// this is a function used to fetch data from the API
// https://www.w3schools.com/php/func_filesystem_file_get_contents.asp
function fetchDataFromAPI($latitude, $longitude, $radius, $table) {
    $apiLink = "https://hhlvbz9p77.execute-api.us-east-1.amazonaws.com/testStage/transactions?lat=$latitude&long=$longitude&radius=$radius&table=$table";
    
    $apiResponse = file_get_contents($apiLink);

    return $apiResponse;
}

    // checks if the form is submitted
    // https://www.w3schools.com/php/php_superglobals_request.asp
if ($_SERVER['REQUEST_METHOD'] === 'POST') 
{

    // get latitude, longitude,radius and table from the submitted form
    $latitude = $_POST['latitude'];
    $longitude = $_POST['longitude'];
    $radius = $_POST['radius'];
    $selectedAction = $_POST['action'];

    // Based on the selected action, perform the appropriate logic
    if ($selectedAction === 'atm') {
        $table = 'atm';
    } elseif ($selectedAction === 'branches') {
        $table = 'branches';
    }

    // checks if the latitude, longitude and radius received are numeric, if yes then send error message
    if (!is_numeric($latitude) || !is_numeric($longitude) || !is_numeric($radius)) 
    {
        echo "Invalid input. Please enter numeric values for Latitude, Longitude and radius.";
    }
    else 
    {
        // fetch data from the API based on entered latitude, longitude and radius
        $apiResponse = fetchDataFromAPI($latitude, $longitude, $radius, $table);

        // this displays the API response in a box
        // https://www.w3schools.com/tags/tag_textarea.asp
        // ****TEXT AREA ADDED TEMPORARILY, WILL BE DISPLAYED IN A DIFFERENT FORMAT LATER****
        echo "<h5>Branches Found within the radius given:</h5>";
        echo "<textarea rows='15' cols='150'>" . htmlspecialchars($apiResponse) . "</textarea>";
    }
}
?>


<div id="ATMManagement" class="tabcontent">
<div class="form-container">
        <h1>ATM Management</h1>

        <form action='' method='post'>
            <p>please enter address of ATM or click on map<p>
            <input type='text' name='address' placeholder='address' required> <!-- 'address' text input field -->
            <button type='submit'>Enter</button> <!-- Enter button -->
        </form>

    </div>
</div>

<div id="infoPage" class="tabcontent">
<div class="form-container">
        <h1>Random Info page</h1>
        <p>Some random text, this tab might not be needed<p>
    </div>
</div>






<script>
    //this script handles switching between tabs.   **THIS WILL NEED TO BE IMPROVED STILL**
    function openTab(tabName) 
    {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        document.getElementById(tabName).style.display = "block";
    }

// Set the default tab to be active               **THIS WILL NEED TO BE IMPROVED STILL**
openTab("branchManagement");
</script>

</body>
</html>