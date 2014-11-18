<?php 
/**
* 
*/
class User extends AppModel
{
	
	public $useTable = 'users';

	// Check for validations

	/**
	 * beforeValidate callback
	 *
	 * @param $options array
	 * @return boolean
	 */
		// public function beforeValidate() {
		// 	debug($this->data);
		// 	return true;
		// }
	

	public $validate = array(
		'username' => array(
			'length'=> array(
				'rule' => array('minLength', '2'),
				'required' => true,
				'message' => 'Veuillez entrer un nom d\'utilisateur'
			),
			'uniq' => array(     
				'rule'    => 'isUnique',
				'message' => 'Ce nom appartient déjà à un utilisateur'
			)
		),
		'api_id' => array(
			'length'=> array(
				'rule' => array('minLength', '4'),
				'required' => true,
				'message' => 'Cet identifiant SoundCloud est trop court'
			),
			'uniq' => array(     
				'rule'    => 'isUnique',
				'message' => 'Cet identifiant SoundCloud existe deja'
			)
		),
		'mail' => array(         
			'mail' => array(
				'rule' => 'email',
				'message' => 'Entrez un email valide'
			),
			'uniq' => array(     
				'rule'    => 'isUnique',
				'message' => 'Cette adresse appartient déjà à un utilisateur'
			)
		)
	);
	
}
 ?>