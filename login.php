
<?php
    // this starts a session, storing information which will be used for other pages until quit
    session_start();
?>


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="login.css">
    <title>Admin Login Page</title>
</head>

<body>

    <!-- navigation bar at the top of the page, has return button which redirects to index.html -->
    <nav>
        <div class="navbar">
            <div class="nav-buttons">
                <a href="index.html"><button class="return-button">Return to Main Page</button></a>
            </div>
        </div>
    </nav>

    <div id="login-container">
        <h2>Admin Login</h2>
        <!-- this is the form which is used to get email and password input from the user -->
        <form method="post" action="">
            <input type="text" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit" name='loginFormButton' class ="login-button">Login</button>
        </form>
    </div>
</body>

    <?php
    //database connection file
    include 'dbconnection.php';

    // this checks if the form is submitted
    if ($_SERVER["REQUEST_METHOD"] == "POST") 
    {
        // checks if email & password form is submitted
        if (isset($_POST['loginFormButton'])) 
        {
            // get user input
            $inputEmail = $_POST["email"];
            $inputPassword = $_POST["password"];

            // this will hash password
            $hashedPassword = hash('sha256', $inputPassword);

            // query to check user credentials
            $queryAdmin = "SELECT * FROM login_data WHERE email = :email AND password = :password";

            //preparation of sql statement with php data objects (pdo), binding parameters
            // so :email being a placeholder, inputEmail being value stored in that variable. prevents sql injections.
            $stmtAdmin = $con->prepare($queryAdmin);
            $stmtAdmin->bindParam(':email', $inputEmail);
            $stmtAdmin->bindParam(':password', $hashedPassword);
            $stmtAdmin->execute();

            // check if data found
            if ($stmtAdmin->rowCount() > 0) 
            {
                // this fetches the result of the executed admin login query as an associative array (row)
                $user = $stmtAdmin->fetch(PDO::FETCH_ASSOC);

                // store user information in the session
                $_SESSION['staffID'] = $user['staffID'];
                $_SESSION['role'] = $user['role'];
                $_SESSION['AdminEmail'] = $inputEmail;

                // redirect to the otp_verification.php page
                if ($_SESSION['role'] == "Admin") 
                {
                    header("Location: otp_verification.php");
                    exit();
                } 
            }

            else 
            {   //error message if wrong email or password entered
                echo "<p style='color: red;'>Invalid email or password.</p>";
            }

        }   
    }
?>

<script>
// this is a function for hashing passwords using SHA256 to further improve security. The database stores hashed passwords.
async function hash($inputPassword) 
{
  const utf8 = new TextEncoder().encode($inputPassword);
  const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((bytes) => bytes.toString(16).padStart(2, '0'))
    .join('');
  return hashHex;
}
</script>

</html>