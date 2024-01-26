<?php
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

        <?php
        //database connection file
        include 'dbconnection.php';

        // this checks if the form is submitted
        if ($_SERVER["REQUEST_METHOD"] == "POST") 
        {
            
            // get user input
            $inputEmail = $_POST["email"];
            $inputPassword = $_POST["password"];


            // query to check user credentials
            $queryAdmin = "SELECT * FROM login_data WHERE email = :email AND password = :password";

            $stmtAdmin = $con->prepare($queryAdmin);
            $stmtAdmin->bindParam(':email', $inputEmail);
            $stmtAdmin->bindParam(':password', $inputPassword);
            $stmtAdmin->execute();

            // check if data found
            if ($stmtAdmin->rowCount() > 0) 
            {
                $user = $stmtAdmin->fetch(PDO::FETCH_ASSOC);

                // store user information in the session
                $_SESSION['staffID'] = $user['staffID'];
                $_SESSION['role'] = $user['role'];

                // redirect to the adminpage
                if ($_SESSION['role'] == "Admin") 
                    {
                    header("Location: adminpage.php");
                    exit();
                    }
            }
            
            // error message if incorrect login info entered
            else
            {
                echo "<p style='color: red;'>Invalid username or password.</p>";
            }
        }

        ?>

        <!-- this is the form which is used to get email and password input from the user -->
        <form method="post" action="">
            <input type="text" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit" class ="login-button">Login</button>
        </form>
    </div>
</body>
</html>