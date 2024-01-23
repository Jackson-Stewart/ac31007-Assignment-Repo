<?php
session_start();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="css/login.css">
    <title>Staff Login Page</title>
</head>

<body>
    <div id="login-container">
        <h2>Staff Login</h2>

        <?php
        include 'dbconnection.php';

        // this checks if the form is submitted
        if ($_SERVER["REQUEST_METHOD"] == "POST") 
        {
            
            // get user input
            $inputEmail = $_POST["email"];
            $inputPassword = $_POST["password"];


            // query to check user credentials
            $queryStaff = "SELECT * FROM login_data WHERE email = :email AND password = :password";

            $stmtStaff = $con->prepare($queryStaff);
            $stmtStaff->bindParam(':email', $inputEmail);
            $stmtStaff->bindParam(':password', $inputPassword);
            $stmtStaff->execute();

            // Check if data found
            if ($stmtStaff->rowCount() > 0) 
            {
                $user = $stmtStaff->fetch(PDO::FETCH_ASSOC);

                // Store user information in the session
                $_SESSION['staffID'] = $user['staffID']; // Adjust the key and value according to your database structure
                $_SESSION['role'] = $user['role'];

                // Redirect to the appropriate page based on the role
                if ($_SESSION['role'] == "Admin") 
                    {
                    header("Location: adminpage.php");
                    exit();
                    }
            }
            
            else
            {
                echo "<p style='color: red;'>Invalid username or password.</p>";
            }
        }

        ?>

        <form method="post" action="">
            <input type="text" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <button type="submit">Login</button>
        </form>
    </div>
</body>
</html>