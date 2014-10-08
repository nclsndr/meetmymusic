<?php
 
$app_id     = "144951";
$app_secret = "295c00fb59682cb3ca23c53eacb6aa07";
$my_url     = "http://demo.hengpatrick.fr/DeezerAPI/connect.php";
 
session_start();

$code  = $_REQUEST["code"];
// $code  = "fr8ab2efeccd8b067a008303729e3f3e&state=7a4305f84987748d7551239d992bf3f4";


if(empty($code)){
	$_SESSION['state'] = md5(uniqid(rand(), TRUE)); //CSRF protection
 
	$dialog_url = "https://connect.deezer.com/oauth/auth.php?app_id=".$app_id
		."&redirect_uri=".urlencode($my_url)."&perms=email,offline_access,listening_history,manage_library"
		."&state=". $_SESSION['state'];
 
	header("Location: ".$dialog_url);
	exit;
 
	}
 
if($_REQUEST['state'] == $_SESSION['state']) {
	$token_url = "https://connect.deezer.com/oauth/access_token.php?app_id="
	.$app_id."&secret="
	.$app_secret."&code=".$code;
 
	$response  = file_get_contents($token_url);
	$params    = null;
	parse_str($response, $params);
	$api_url   = "https://api.deezer.com/user/me?access_token="
			.$params['access_token'];
 
	$user = json_decode(file_get_contents($api_url));
	echo("Photo : <br/> <img src='" . $user->picture . " '/><br/><br/>"); 
	echo("Coucou " . $user->name . "  " . $user->lastname . "<br/>");
	echo("Genre : " . $user->gender . "<br/>");
	echo("Pays : " . $user->country . "<br/>");
	echo("Langue : " . $user->lang . "<br/>");
	echo("User Json : <a href='" . $api_url . "'>Json</a> <br/><br/>"  );
	

	$history_url = "http://api.deezer.com/user/" . $user->id . "/history?access_token=" . $params['access_token'] . "&index=4&limit=5";
	$history = json_decode(file_get_contents($history_url));
	echo("Historique de  " . $user->name . "  " . $user->lastname . " : ");
	echo("<a href='" . $history_url . "'>Json</a> <br/>" );
	
	$track_url = "http://api.deezer.com/user/" . $user->id . "/tracks";
	$track = json_decode(file_get_contents($track_url));
	echo("Morceaux favories de  " . $user->name . "  " . $user->lastname . " : ");
	echo("<a href='" . $track_url . "'>Json</a> <br/>" );
	
	$album_url = "http://api.deezer.com/user/" . $user->id . "/albums";
	$album = json_decode(file_get_contents($album_url));
	echo("Albums favories de  " . $user->name . "  " . $user->lastname . " : ");
	echo("<a href='" . $album_url . "'>Json</a> <br/>" );

	$artist_url = "http://api.deezer.com/user/" . $user->id . "/artists";
	$artist = json_decode(file_get_contents($artist_url));
	echo("Artistes favories de  " . $user->name . "  " . $user->lastname . " : ");
	echo("<a href='" . $artist_url . "'>Json</a> <br/>" );

	$Playlist_url = "http://api.deezer.com/user/" . $user->id . "/playlists";
	$Playlist = json_decode(file_get_contents($Playlist_url));
	echo("Playlist favories de  " . $user->name . "  " . $user->lastname . " : ");
	echo("<a href='" . $Playlist_url . "'>Json</a> <br/>" );


}else{
	echo("The state does not match. You may be a victim of CSRF.");
}
?>