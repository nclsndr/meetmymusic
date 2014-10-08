<?php

if(isset($_POST['geturl']) and !empty($_POST['geturl'])) {
$data = file_get_contents($_POST['geturl']);
print $data;
}

?>