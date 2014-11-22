<?php 
/**
* 
*/
class Track extends AppModel
{
	public $actsAs = array('Containable');
	
	public $useTable = 'tracks';

	public $belongsTo = [
		'User'=>[
			'foreignKey'=>'user_id'
		]
	];
	
}
 ?>