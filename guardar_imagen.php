<?php
include "conexion.php";
if (isset($_POST['imageData'])) {
    $imgData = $_POST['imageData'];
    $imgData = str_replace('data:image/webp;base64,', '', $imgData);
    $imgData = str_replace(' ', '+', $imgData);
    $imgBinaryData = base64_decode($imgData);

    $url = '';

    $img = 'Prueba.jpg';

    file_put_contents($url . $img, $imgBinaryData);

} else {
    echo "No se recibió ningún dato de imagen";
}
