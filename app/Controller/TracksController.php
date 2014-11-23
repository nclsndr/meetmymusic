<?php 
/**
* 
*/
App::uses('AppController', 'Controller');


class TracksController extends AppController
{
	public $uses = array('Track', 'User');

// —————————————————————————————————————————————————————————————————————————————————————  CAKE CORE FUNCTIONS
	/**
	 * beforeFilter callback
	 *
	 * @return void
	 */
		public function beforeFilter() {
			parent::beforeFilter();
		}
	

// —————————————————————————————————————————————————————————————————————————————————————  VISITORS FUNCTIONS
	public function index(){
		$data = ['controller'=>'sounds'];
		return new CakeResponse(array('body' => json_encode($data)));
	}

	public function gethistory($user_id=null, $limit=10){
		if($user_id != null){
			$res = $this->Track->find('all', [
				'conditions'=>['Track.user_id'=>$user_id], 
				'contain'=>false,
				'limit'=>$limit
			]);
			if (!empty($res)) {
				return new CakeResponse(array('body' => json_encode($res)));
			}else{
				$return = ['empty'=>true];
				return new CakeResponse(array('body' => json_encode($return)));
			}
		}
	}

	public function add(){
		if($this->request->data){
			$data = $this->request->data;
			$this->Track->create();
			$dataToStore = array(
				'user_id' => $data['user_id'],
				'sc_id' =>  $data['sc_id'],
				'track_id'    => $data['track_id']
			);

			if ($this->Track->save($dataToStore, false, array('user_id', 'sc_id', 'track_id'))) {
				$return = ['success'=>true];
				return new CakeResponse(array('body' => json_encode($return)));
			}else{
				$return = ['error'=>true];
				return new CakeResponse(array('body' => json_encode($return)));
			}
		}
	}

	public function delete(){
		if($this->request->data) {
			$id = $this->request->data['id'];
			$this->Track->delete($id);
		}
	}


// —————————————————————————————————————————————————————————————————————————————————————  ADMIN FUNCTIONS




// —————————————————————————————————————————————————————————————————————————————————————  GENERAL FUNCTIONS



}
 ?>