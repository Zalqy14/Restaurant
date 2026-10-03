<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "form";

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$json_pedido = file_get_contents("php://input");
$json_pedido = json_decode($json_pedido, true);

$conn->query("INSERT INTO pedidos VALUES()");
$idGrupo = $conn->insert_id; // Te devuelve el id del ultimo insert que es la linea anterior 

$stmt = $conn->prepare("INSERT INTO pedidos(idGrupo, idCliente, plato1, plato2, bebida,postre) VALUES(?,?,?,?,?,?)");
$stmt->bind_param("iissss", $idGrupo, $idCliente, $plato1, $plato2, $bebida, $postre);
// como hemos cogido la informacion del json y se a guardado en un array asociativo (basicamente un diccionario creo) hay que recorrelo
$errores = 0;
foreach ($json_pedido as $cliente) {
    $idCliente = $cliente["idCliente"];
    $plato1 = $cliente["plato1"];
    $plato2 = $cliente["plato2"];
    $bebida = $cliente["bebida"];
    $postre = $cliente["postre"];
    if (!$stmt->execute()) {
        $errores++;
    }
}

if ($errores == 0) {
    echo "Pedido Guardado de forma exitosa";
} else {
    echo "Se ha producido algun error al mandar los datos";
}


// cierra la conexión con la base de datos y de el prepared statement
$stmt->close();
$conn->close();

