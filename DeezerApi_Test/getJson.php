<?php
if(isset($_GET['q'])) {
$data = file_get_contents("http://api.deezer.com/search?q=".$_GET['q']);
print $data;
}

?>