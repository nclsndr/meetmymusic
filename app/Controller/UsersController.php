<?php 
/**
* 
*/
App::uses('AppController', 'Controller');


class UsersController extends AppController
{

// —————————————————————————————————————————————————————————————————————————————————————  CAKE CORE FUNCTIONS
	/**
	 * beforeFilter callback
	 *
	 * @return void
	 */
		public function beforeFilter() {
			parent::beforeFilter();
			$this->Auth->allow('admin_login');
		}
	

// —————————————————————————————————————————————————————————————————————————————————————  VISITORS FUNCTIONS
	public function index(){
		$data = ['controller'=>'users'];
		return new CakeResponse(array('body' => json_encode($data)));
	}

	public function login(){
		if (!empty($this->request->data)) {
			$data['User'] = $this->request->data;
			if ($this->Auth->login()) {
				$user = $this->generateToken($data, false);
				return new CakeResponse(array('body' => json_encode($user)));
			}else{
				$error = ['error'=>'Votre identifiant ou mot de passe n\'est pas valide'];
				return new CakeResponse(array('body' => json_encode($error)));
			}
		}else{
			$error = ['error'=>'une erreur est survenue'];
			return new CakeResponse(array('body' => json_encode('no POST')));
		}
	}

	public function hasaccount(){
		$return = ['hasNoAccount'=>true];
		if (!empty($this->request->data) && is_int($this->request->data)) {
			$api_id = $this->request->data;
			$res = $this->User->find('count', ['conditions'=>['User.api_id'=>$api_id]]);
			if($res>0){
				$id = (int)($api_id);
				$user = $this->generateToken($id, false);
				$return = $user;
				return new CakeResponse(array('body' => json_encode($return)));
			}else{
				return new CakeResponse(array('body' => json_encode($return)));
			}
		}else{
			return new CakeResponse(array('body' => json_encode('no POST')));
		}
	}

	public function usernameexist(){
		$return = ['usernameExist'=>false];
		if (!empty($this->request->data)) {
			$username = $this->request->data;
			$res = $this->User->find('count', ['conditions'=>['User.username'=>$username]]);
			if($res>0){
				$return = ['usernameExist'=>true];
				return new CakeResponse(array('body' => json_encode($return)));
			}else{
				return new CakeResponse(array('body' => json_encode($return)));
			}
		}else{
			return new CakeResponse(array('body' => json_encode('no POST')));
		}
	}

	public function logout(){
		$user = $this->Auth->User();
		$this->deleteToken($user['id']);
		$this->Session->write('User', false);
		$this->Auth->logout();
		return true;
	}

	public function getpeerbytoken(){
		$return = ['error'=>true];
		if (!empty($this->request->data)) {
			$values = $this->request->data;
			$res = $this->User->find('first', ['conditions'=>['User.token'=>$values['token']]]);
			if($res){
				return new CakeResponse(array('body' => json_encode($res)));
			}else{
				return new CakeResponse(array('body' => json_encode($return)));
			}
		}else{
			return new CakeResponse(array('body' => json_encode('no POST')));
		}
	}

	public function updategeoloc(){
		$return = ['error'=>true];
		if (!empty($this->request->data)) {
			$values = $this->request->data;
			
			if ($this->checkToken($values['token'])) {
				$this->User->id = $values['id'];
				$toStore = ['User'=>
					[
						'lat'=> $values['lat'],
						'lng'=>$values['lng']
					]
				];
				$res = $this->User->save($toStore, false, ['lat', 'lng']);
				if($res){
					$return = ['error'=>false];
					return new CakeResponse(array('body' => json_encode($return)));
				}else{
					return new CakeResponse(array('body' => json_encode($return)));
				}
			}
			
		}else{
			return new CakeResponse(array('body' => json_encode('no POST')));
		}
	}

	public function edit($id=null){

		if($this->request->data) {
			$data = $this->request->data;
			$this->User->save($data);
		}

		if ($id!=null) {
			$this->request->data = $this->User->find('first', array(
				'conditions'=>array('User.id'=>$id)
			));
		}
		
	}

	public function add(){
		if($this->request->data){

			$this->User->set($this->request->data);
			if($this->User->validates()){
				$data = $this->request->data;

				$this->User->create();
				$dataToStore = array(
					'api_id' => $data['api_id'],
					'username' =>  $data['username'],
					'role'    => 'user',
					'mail'    => $data['mail'],
					'avatar_url' => $data['avatar_url'],
					'sc_url' => $data['sc_url'],
					'lat' => $data['lat'],
					'lng' => $data['lng'],
					'is_geoloc'=>$data['is_geoloc'],
					'city' => $data['city']
				);

				if ($this->User->save($dataToStore, false, array('api_id', 'username', 'role', 'mail', 'avatar_url', 'sc_url', 'lat', 'lng', 'is_geoloc', 'city'))) {
					$UID = [];
					$UID['user_id'] = $this->User->id;
					$user = $this->generateToken($UID);
					return new CakeResponse(array('body' => json_encode($user)));

					// RETURN USER
					
					// DEBUT DE LOGIQUE POUR LA VERIF EMAIL NEW USER 

					// App::uses('CakeEmail', 'Network/Email');
					// $mail = new CakeEmail('default');
					// $mail->to($this->request->data['User']['mail']);
					// $mail->subject('Votre Compte d\'administration | Frédéric Kazan');
					// $mail->viewVars(array(
					// 	'username'=>$this->request->data['User']['username'],
					// 	'password'=>$this->request->data['User']['password']
					// ));
					// $mail->emailFormat('html');
					// $mail->template('adduser', 'admin_mail');
					// $mail->send();	
				}
				
			}else{
				$error = $this->User->validationErrors;
				return new CakeResponse(array('body' => json_encode($error)));
			}
		}
	}
// —————————————————————————————————————————————————————————————————————————————————————  ADMIN FUNCTIONS
	public function admin_login(){
		$auth = $this->Auth->User();
		if (!empty($auth)) {
			$this->Session->setFlash('Vous êtes déjà connecté(e)', 'flash_bck',array('class' => 'info'));
		}
		if($this->request->data) {
			$data = $this->request->data;
			if($this->Auth->login()){
				$user = $this->Auth->User();
				$token = $this->generateToken($user);
				$this->Session->setFlash('Vous êtes connecté(e)', 'flash_bck', array('class' => 'success'));
			}else{
				$this->Session->setFlash('Votre identifiant ou mot de passe n\'est pas valide', 'flash_bck', array('class' => 'error'));
			}
		}else{
			return false;
		}
	}

	public function admin_logout(){
		$user = $this->Auth->User();
		$this->deleteToken($user['id']);
		$this->Session->write('User', false);
		$this->Auth->logout();
		return true;
	}

	public function admin_edit($id=null){
		if ($this->request->data) {
			$data=$this->request->data;
			if (!empty($data['User']['id'])) {
				$this->User->id=$data['User']['id'];
			}
			$this->User->create();
			$data['User']['password'] = $this->Auth->password($data['User']['password']);
			if($this->User->save($data, false)){
				$this->Session->setFlash('Enregistrement terminé', 'flash_bck', array('class' => 'success'));
			}else{
				$this->Session->setFlash('Enregistrement échoué', 'flash_bck', array('class' => 'error'));
			}
			
		}

		if ($id!=null) {
			$res = $this->User->find('first', array(
					'conditions'=>array('User.id'=>$id)
				));	
			if ($res!=null) {
				$res['User']['password']='';
				$this->request->data = $res;
			}else{
				return $this->redirect(array('controller'=>'users', 'action'=>'admin_index'));
			}
			
		}
	}




// —————————————————————————————————————————————————————————————————————————————————————  GENERAL FUNCTIONS




	protected function generateToken($data, $token_only=false){
		if (isset($data['User']['username'])) {
			$user = $this->User->findByUsername($data['User']['username']);
		}else if(isset($data['user_id'])){
			$user = $this->User->findById($data['user_id']);
		}else if(isset($data['username'])){
			$user = $this->User->findByUsername($data['username']);
		}else if(is_int($data)){
			$user = $this->User->findByApiId($data);
			// ('first', ['conditions'=>['User.api_id'=>$data]]);
		}else{
			return false;
		}
		$user = $user['User'];

		unset($user['password']);
		$user['token'] = null;
		
		if (isset($user['id'])) {
			$token = md5(uniqid(mt_rand(), false).'lst'.uniqid(mt_rand(), false));
			$this->User->id = $user['id'];
			$req = $this->User->find();
			$count = $req['User']['login_count']+1;
			$this->User->set('token', $token);
			$this->User->set('login_count', $count);
			$this->User->save($this->User, false);
			
			$user['token'] = $token;
			// $this->Session->write('User', $user);
			if ($token_only) {
				return $token;
			}else{
				return $user;
			}
			
		}else{
			return false;
		}
		
	}
	protected function deleteToken($id){
		if (isset($id)) {
			$this->User->id = $id;
			$this->User->set('token', null);
			$this->User->save();
			return true;
		}else{
			return false;
		}
	}

}
 ?>