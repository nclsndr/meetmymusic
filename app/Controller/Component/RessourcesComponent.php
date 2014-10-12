<?php 

/**
* 
*/
class RessourcesComponent extends Component
{
	
	function __construct()
	{
		$this->webrootUrl = WWW_ROOT;
		$this->protectedDir = ['node_modules', 'bower_components', 'server.js'];
	}

	public function getAngular($suffix = 'ng',$main=null, $release='1.2.26', $lib = true, $route=false, $ressource=false, $loader=false, $animate=false){

		$angularUrl = '//code.angularjs.org';
		$libs = [];

		if ($lib == true) {
			$libs[] = $angularUrl.DS.$release.'/angular.min.js';
		}else{
			$libs[] = $lib;
		}
		if ($route == true) {
			$libs[] = $angularUrl.DS.$release.'/angular-route.min.js';
		}
		if ($ressource == true) {
			$libs[] = $angularUrl.DS.$release.'/angular-resource.min.js';
		}
		if ($loader == true) {
			$libs[] = $angularUrl.DS.$release.'/angular-loader.min.js';
		}
		if ($animate == true) {
			$libs[] = $angularUrl.DS.$release.'/angular-animate.min.js';
		}

		$urls = [];
		if (is_dir($this->webrootUrl.$suffix)) {
			$di = new RecursiveDirectoryIterator($this->webrootUrl.$suffix);
			foreach (new RecursiveIteratorIterator($di) as $filename => $file) {

				if ($file->isFile() && $file->getExtension() == 'js' && !$this->isProtected($file)) {
					$path = explode('webroot', $filename);
					if ($file->getFilename() == $main) {
						array_unshift($urls, $path[1]);
					}else{
						$urls[] = $path[1];
					}
				}	
			}
		}

		$total = array_merge($libs, $urls);
		return $total;
	}
	private function isProtected($file){
		$protected = $this->protectedDir;
		foreach ($protected as $k => $v) {
			if (strstr($file->getPath(), $v)!== false) {
				return true;
			}
			if ($file->isFile() && strstr($file->getFilename(), $v)!== false) {
				return true;
			}
		}
	}

}
 ?>