<?php
header("Content-Type: text/event-stream\n\n");

$conn = mysqli_connect("localhost","root","password") or    die('Could not connect: ' . mysqli_error());

mysqli_select_db($conn,"Canastra") or	die('Could not connect to specific database: ' . mysqli_error());

$table='voosrealizados';
$CEXEC=$_GET['CEXEC'];
$indice = $_GET['indice'];

$sql = "SELECT `indice`, `longitude`, `latitude`, `altitude`, `tempo_hora`, `tempo_minuto`, `tempo_segundo` FROM `voosrealizados` WHERE `indice` > $indice AND  `codigoExecucao` LIKE '$CEXEC'";
$result = mysqli_query($conn,$sql);

$tabela = array();
$emparray = array();
while($row = mysqli_fetch_assoc($result))
{
  $line=array('indice'=>$row['indice'], 'longitude'=>$row['longitude'], 'latitude'=>$row['latitude'], 'altitude'=>$row['altitude'], 'hora'=>$row['tempo_hora'], 'minuto'=>$row['tempo_minuto'], 'segundo'=>$row['tempo_segundo']);
  $emparray[]=$line;
}

$tabela['dados']=$emparray;
$dado = json_encode($tabela);

mysqli_close($conn);

echo 'data: ' . $dado . "\n\n";
  
  ob_flush();
  flush();
?>