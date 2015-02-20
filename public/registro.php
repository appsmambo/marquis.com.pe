<?php

if (empty($_POST))
	die('error');

/*
 * localhost
 */
/*$hostname = 'localhost';
$username = 'root';
$password = 'desarr0ll0';
$db_name  = 'ripley_plataforma';*/

/*
 * marquiss.com.pe
 */
$hostname = 'localhost';
$username = 'marquisc_userdb';
$password = 'mo%#soHX8L;L';
$db_name  = 'marquisc_prendas';

$nombre = ucwords(strtolower($_POST['nombre']));
$email = $_POST['email'];
$telefono = $_POST['telefono'];
$info = $_POST['info'];
$ip = $_SERVER['REMOTE_ADDR'];

try {
	$dbh = new PDO("mysql:host=$hostname;dbname=$db_name", $username, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES  \'UTF8\''));
	$count = $dbh->exec("INSERT INTO registro(nombre, email, telefono, info, ip) VALUES ('$nombre', '$email', '$telefono', '$info', '$ip')");
    echo 'OK';
    $dbh = null;
} catch (PDOException $e) {
	echo 'error';
	error_log($e->getMessage(), 0);
}
