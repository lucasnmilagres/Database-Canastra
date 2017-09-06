<?php
$conn = mysqli_connect("localhost","username","password") or    die('Could not connect: ' . mysqli_error());

mysqli_select_db($conn,"Canastra") or	die('Could not connect to specific database: ' . mysqli_error());

$table='voosrealizados';
$sql = "SELECT * FROM `$table`";
$result = mysqli_query($conn, $sql) or die('Invalid query: ' . mysqli_error());

$indice = mysqli_num_rows($result);
$codigoExecucao=$_GET['codigoExecucao'];
$luminosidade=$_GET['luminosidade'];
$tempExterna=$_GET['tempExterna'];
$tempInterna=$_GET['tempInterna'];
$pressao=$_GET['pressao'];
$aceleracao=$_GET['aceleracao'];
$longitude=$_GET['longitude'];
$latitude=$_GET['latitude'];
$altitude=$_GET['altitude'];
$tempo_hora=$_GET['tempo_hora'];
$tempo_minuto=$_GET['tempo_minuto'];
$tempo_segundo=$_GET['tempo_segundo'];
$velocidade=$_GET['velocidade'];
$tempo_inicial=$_GET['tempo_inicial'];

$sql = "INSERT INTO `$table` (`indice`, `codigoExecucao`, `luminosidade`, `tempExterna`, `tempInterna`, `pressao`, `aceleracao`, `longitude`, `latitude`, `altitude`, `tempo_hora`, `tempo_minuto`, `tempo_segundo`, `velocidade`, `tempo_inicial`) 
        VALUES ('$indice', '$codigoExecucao', '$luminosidade', '$tempExterna', '$tempInterna', '$pressao', '$aceleracao', '$longitude', '$latitude', '$altitude', '$tempo_hora', '$tempo_minuto', '$tempo_segundo', '$velocidade', '$tempo_inicial')";
$result = mysqli_query($conn,$sql);
 
//create an variable
$emparray="ERROR";
if($result)
{
  $emparray="OK\n";
}

mysqli_close($conn);
?>
