<?php
//database connection details
$host = "bankdatabase.ct2cs466y605.us-east-1.rds.amazonaws.com";
$username = "admin";
$password = "Group3MasterPassword!";
$database = "BankDatabase";
	
//create connection
try{
	$con = new PDO("mysql:host=".$host.";dbname=".$database,$username, $password);
	$con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}
//catch any errors that may appear and display message
catch (PDOException $e){
	echo "Error in Connection ". $e->getMessage();
}
?>