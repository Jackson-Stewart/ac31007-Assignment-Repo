<?php
// this resumes the session
session_start();

// this checks if session variables staffID, AdminEmail and admin role are set
// if something is not set then redirects the user to the login page and quits session
if (!isset($_SESSION['staffID']) || !isset($_SESSION['AdminEmail']) || $_SESSION['role'] != "Admin") 
{    
    //redirects to login.php page
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="login.css">
    <title>OTP Verification</title>
</head>

<body>

    <!-- navigation bar at the top of the page, has return button which redirects to login.php -->
    <nav>
        <div class="navbar">
            <div class="nav-buttons">
                <a href="login.php"><button class="return-button">Return to Login Page</button></a>
            </div>
        </div>
    </nav>

    <div id="login-container">
        <h2>Two Factor Authentication (2FA)</h2>
        <!-- this is the form which is used to get OTP input from the user -->
        <form method="post" action="">
            <!-- this displays the ID of the admin currently logged in -->
            <h5>For your security, a One-Time Password (OTP) has been sent to <strong><?php echo $_SESSION['AdminEmail'];?></strong></h5>
            <input type="text" name="OTPInput" placeholder="OTP" required>
            <button type="submit" name='LoginButton' class ="login-button">Submit</button>
        </form>
    </div>
</body>

</html>


<?php
//necessary library for sending OTP emails
// https://github.com/PHPMailer/PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// this retrieves the saved session email and stores it in the userEmail variable
$userEmail = $_SESSION['AdminEmail'];

// this checks if OTP is already generated and stored in the session. prevents multiple OTPs from generating and changing.
// if its not stored yet, generates a new one and stores it in the StoredOTP variable
if (!isset($_SESSION['otp'])) 
{
    $_SESSION['otp'] = generateAndStoreOTP();
}

// this is a function to generate and store OTP in session, random 6 digit code.
function generateAndStoreOTP() 
{
    $otp = rand(100000, 999999);
    $_SESSION['otp'] = $otp;
    return $otp;
}

// this will send an email with the OTP to the email provided by the user. uses userEmail (obtained from session saved 'AdminEmail') and OTP
// also checks if both otp and AdminEmail are set in session
if (isset($_SESSION['otp']) && isset($_SESSION['AdminEmail']))
{
    sendVerificationEmail($userEmail, $_SESSION['otp']); 
}

// this functions sends an email with OTP to the user's provided email. uses PHPMailer library.
// https://github.com/PHPMailer/PHPMailer
// https://www.smtp2go.com/ is used as SMTP (simple mail transfer protocol) provider. free version can send 1000 emails per month
function sendVerificationEmail($email, $otp) 
{
    $subject = "ATM Locator One-Time Password Confirmation"; // title of the mail
    $message = "Hello! You are trying to log in into ATM Locator admin page and as an additional security measure you are required
    to enter the OTP on the website<br>
    Your OTP is: <strong>$otp</strong>, don't share this code with anyone!"; // content of the mail

    $mail = new PHPMailer(true); // new instance

    try 
    {
        // SMTP2GO configuration
        $mail->isSMTP();
        $mail->Host = 'mail.smtp2go.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'Group3'; // SMTP2GO username
        $mail->Password = 'RmcRBCyxyxebCuem'; // password generated on SMTP2GO
        $mail->SMTPSecure = 'tls'; //transport layer security
        $mail->Port = 2525; 

        // sender and recipient details
        $mail->setFrom('2449949@dundee.ac.uk', 'ATM Locator');
        $mail->addAddress($email); 

        // email content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $message;

        $mail->send();
        return true;
    } 

    //catches any errors and displays them if something goes wrong with sending mail
    catch (Exception $e) 
    {
        echo "Message could not be sent. Error: {$mail->ErrorInfo}";
        return false;
    }
}

// this is a function to check if OTP is valid. compares stored in session otp with otp entered in form
// returns either true or false match
function isOTPValid($enteredOTP) 
{
    $storedOTP = $_SESSION['otp'];
    return ($enteredOTP == $storedOTP);
}

// this checks if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") 
{
    // Check if the form was submitted with the correct button name
    if (isset($_POST['LoginButton'])) 
    {
        // get the entered OTP from the form
        $enteredOTP = $_POST['OTPInput'];

        // uncomment for echo messages used for debugging, checks stored OTP vs entered by user OTP.
        //echo "Stored OTP: " . $_SESSION['otp'] . "<br>";
        //echo "Entered OTP: " . $enteredOTP . "<br>";

        // checks if entered OTP is valid
        if (isOTPValid($enteredOTP)) 
        {
            // OTP is valid, redirect to adminpage.php
            unset($_SESSION['otp']); // otp no longer needed in session, removed for security
            header("Location: adminpage.php"); // redirects to adminpage.php
            exit();
        }

        if (!isOTPValid($enteredOTP))
        {
            // OTP is not valid, displays simple error message
            echo "<p style='color: red;'>Invalid OTP. Please try again.</p>";
        }
    }
}
?>

