<?php
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
$response = array();
$server_url = 'logisticar';
if($_FILES['imagen'])
{
    $imagen_name = $_FILES["imagen"]["name"];
    $imagen_tmp_name = $_FILES["imagen"]["tmp_name"];
    $error = $_FILES["imagen"]["error"];
    if($error > 0){
        $response = array(
            "status" => "error",
            "error" => true,
            "message" => "Error uploading the file!"
        );
    }else
    {
        $dir_subida = "../assets/imagenes/";
        $upload_name = $dir_subida . basename($imagen_name);

        $upload_name = preg_replace('/\s+/', '-', $upload_name);

        if(move_uploaded_file($imagen_tmp_name , $upload_name)) {
            $response = array(
                "status" => "success",
                "error" => false,
                "message" => "File uploaded successfully",
                "url" => $server_url."/".$upload_name
              );
        }
        else
        {
            $response = array(
                "status" => "error",
                "error" => true,
                "message" => "Error uploading the file!"
            );
        }
    }

}
else
{
    $response = array(
        "status" => "error",
        "error" => true,
        "message" => "No file was sent!"
    );
}
echo json_encode($response);
?>
