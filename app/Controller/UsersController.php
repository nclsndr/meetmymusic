<?php 
/**
* 
*/
class UsersController extends AppController
{
	
	public function login(){
		// debug($this->request->method());
		// die();
		if ($this->request->is('angular')) {
			$data['User'] = $this->request->data;
			if ($this->Auth->login($data)) {
				$user = $this->generateToken($data, false);
				return new CakeResponse(array('body' => json_encode($user)));
			}else{
				echo '[{error : une erreur est survenue}]';
				return;
			}
		}
		if($this->request->data) {
			$data = $this->request->data;

			if($this->Auth->login()){

				$user = $this->Auth->User();
				$token = $this->generateToken($user);
				$this->Session->setFlash('Vous êtes connecté(e)', 'flash_lustou', array('class' => 'succes'));

			}else{
				$this->Session->setFlash('Votre identifiant ou mot de passe n\'est pas valide', 'flash_lustou', array('class' => 'error'));
			}
			
		}else{
			return false;
		}
	}

	public function admin_login(){
		return $this->redirect(array('controller'=>'users', 'action'=>'login', 'admin'=>false));
	}

	public function logout(){
		$user = $this->Auth->User();
		$this->deleteToken($user['id']);
		$this->Session->write('User', false);
		$this->Auth->logout();
		return true;
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
				$data = array(
					'username' => $data['User']['username'],
					'password' => $this->Auth->password($data['User']['password']),
					'name'     => $data['User']['name'],
					'firstname'    => $data['User']['firstname'],
					'mail'    => $data['User']['mail'],
					'role' => $data['User']['role'],
					'tel' => $data['User']['tel']
				);
				$this->User->save($data, true, array('username', 'password', 'name', 'firstname', 'mail', 'role', 'tel'));
				if ($this->User->save()) {
					App::uses('CakeEmail', 'Network/Email');
					$mail = new CakeEmail('default');
					$mail->to($this->request->data['User']['mail']);
					$mail->subject('Votre Compte d\'administration | Frédéric Kazan');
					$mail->viewVars(array(
						'username'=>$this->request->data['User']['username'],
						'password'=>$this->request->data['User']['password']
					));
					$mail->emailFormat('html');
					$mail->template('adduser', 'admin_mail');
					$mail->send();
					
					$this->Session->setFlash('Enregistrement terminé', 'flash', array('class' => 'success'));
					$this->redirect(array('admin' => true, 'controller' => 'dashboard', 'action' => 'index'));	
				}
				
			}else{
				// $this->request->data = $this->User->validationErrors;
				$this->Session->setFlash('Erreur', 'flash', array('class' => 'error'));
			}
		}
	}

	protected function generateToken($data, $token_only=false){
		
		if (isset($data['User']['username'])) {
			$user = $this->User->findByUsername($data['User']['username']);
			$user = $user['User'];
		}else if(isset($data['username'])){
			$user = $this->User->findByUsername($data['username']);
		}else{
			return false;
		}

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
			$this->Session->write('User', $user);
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