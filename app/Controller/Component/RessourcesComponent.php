<?php 

/**
* 
*/
class RessourcesComponent extends Component
{
	
	function __construct()
	{
		$this->webrootUrl = WWW_ROOT;
	}

	public function getAngular($suffix = 'ng', $release='1.2.26', $lib = true, $route=false, $ressource=false, $loader=false, $animate=false){

		$angularUrl = '//code.angularjs.org';
		$urls = [];

		if ($lib == true) {
			$urls[] = $angularUrl.DS.$release.'/angular.min.js';
		}else{
			$urls[] = $lib;
		}
		if ($route == true) {
			$urls[] = $angularUrl.DS.$release.'/angular-route.min.js';
		}
		if ($ressource == true) {
			$urls[] = $angularUrl.DS.$release.'/angular-resource.min.js';
		}
		if ($loader == true) {
			$urls[] = $angularUrl.DS.$release.'/angular-loader.min.js';
		}
		if ($animate == true) {
			$urls[] = $angularUrl.DS.$release.'/angular-animate.min.js';
		}

		if (is_dir($this->webrootUrl.$suffix)) {
			$di = new RecursiveDirectoryIterator($this->webrootUrl.$suffix);
			foreach (new RecursiveIteratorIterator($di) as $filename => $file) {
				if ($file->isFile() && $file->getExtension() == 'js') {
					$path = explode('webroot', $filename);
					$urls[] = $path[1];
				}
			}
		}
		return $urls;
	}

}
 ?>