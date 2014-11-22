<?php 
/**
* 
*/
App::uses('AppController', 'Controller');


class DemandsController extends AppController
{

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
		$data = ['controller'=>'demands'];
		return new CakeResponse(array('body' => json_encode($data)));
	}

	public function add(){
		if($this->request->data){

			$this->Demand->create();
			$dataToStore = array(
				'user_id' => $data['user_id'],
				'sc_id' =>  $data['sc_id'],
				'Demand_id'    => $data['Demand_id']
			);

			if ($this->Demand->save($dataToStore, false, array('user_id', 'sc_id', 'Demand_id'))) {
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
			$this->Demand->delete($id);
		}
	}


// —————————————————————————————————————————————————————————————————————————————————————  ADMIN FUNCTIONS




// —————————————————————————————————————————————————————————————————————————————————————  GENERAL FUNCTIONS



}
 ?>