<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <meta name="description" content="Meet My Music application">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Meet My Music</title>
        <link rel="author" href="<?= WEBROOT_DIR ?>/humans.txt">
        <?php
			echo $this->Html->meta('icon');
			echo $this->Html->css('style');
			echo $this->fetch('meta');
			echo $this->fetch('css');
			
		?>
    </head>
    <body ng-app="mmmApp">
    	<div class="container">
    		<?php echo $this->fetch('content'); ?>
    	</div>
    <?php
    	if (!empty($angularUrls)) {
    		foreach ($angularUrls as $k => $v) {
    			echo '<script type="text/javascript" src="'.$v.'"></script>';
    		}
    	}
        echo $this->fetch('script');
     ?>
     <?php 
     // <script type="text/javascript" src="//code.angularjs.org/1.2.26/angular.min.js"></script>
     // <script type="text/javascript" src="//code.angularjs.org/1.2.26/angular-route.min.js"></script>
     // <script type="text/javascript" src="//code.angularjs.org/1.2.26/angular-resource.min.js"></script>
     // <script type="text/javascript" src="//code.angularjs.org/1.2.26/angular-loader.min.js"></script>
     // <script type="text/javascript" src="//code.angularjs.org/1.2.26/angular-animate.min.js"></script>
     // <script type="text/javascript" src="/ng/meetmymusic.js"></script>
     // <script type="text/javascript" src="/ng/services/SocketFactory.js"></script>
     // <script type="text/javascript" src="/ng/controllers/DebugCtrl.js"></script>
     // <script type="text/javascript" src="/ng/modules/socket.js"></script>
      ?>
    
    
     <?php 
     	// Dump SQL pour le dev
     	echo $this->element('sql_dump');
     ?>
    </body>
</html>