<?php

App::uses('AppController', 'Controller');

class QrController extends AppController {

// —————————————————————————————————————————————————————————————————————————————————————  VISITORS FUNCTIONS
	public function index() {
		$result = '';
		$urlBase='http://mmm.nclsndr.fr/qr/';

		if ($this->request->data) {
			$data = $this->request->data;
			$result = 'http://api.qrserver.com/v1/create-qr-code/?data='.$data['Qr']['token'].'!&size=400x400&margin=30';
		}
		$this->set('url', $result);
	}


// —————————————————————————————————————————————————————————————————————————————————————  ADMIN FUNCTIONS

	public function admin_index() {
		$result = '';
		$urlBase='http://mmm.nclsndr.fr/qr/';

		if ($this->request->data) {
			$data = $this->request->data;
			$result = 'http://api.qrserver.com/v1/create-qr-code/?data='.$urlBase.$data['Qr']['token'].'!&size=400x400&margin=30';
		}
		$this->set('url', $result);
		// $curl = curl_init('http://api.qrserver.com/v1/create-qr-code/?data=coucou!&size=400x400&margin=30');

		// curl_setopt_array($curl, array(
		//     CURLOPT_RETURNTRANSFER => 1,
		// ));
		// $result = curl_exec($curl);
		// curl_close($curl);
		
	}
}
