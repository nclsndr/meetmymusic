<?php
/**
 * Application level Controller
 *
 * This file is application-wide controller file. You can put all
 * application-wide controller-related methods here.
 *
 * CakePHP(tm) : Rapid Development Framework (http://cakephp.org)
 * Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 *
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE.txt
 * Redistributions of files must retain the above copyright notice.
 *
 * @copyright     Copyright (c) Cake Software Foundation, Inc. (http://cakefoundation.org)
 * @link          http://cakephp.org CakePHP(tm) Project
 * @package       app.Controller
 * @since         CakePHP(tm) v 0.2.9
 * @license       http://www.opensource.org/licenses/mit-license.php MIT License
 */

App::uses('Controller', 'Controller');

/**
 * Application Controller
 *
 * Add your application-wide methods in the class below, your controllers
 * will inherit them.
 *
 * @package		app.Controller
 * @link		http://book.cakephp.org/2.0/en/controllers.html#the-app-controller
 */
class AppController extends Controller {

	public $components = array(
        'Session', 'RequestHandler',
        'Auth' => array(
        	'loginAction' => array(
            'controller' => 'users',
            'action' => 'login'
        ),
        'authError' => 'Vous n\'êtes pas autorisé à voir ce contenu',
        'authenticate' => array(
            'Form' => array(
                'fields' => array(
                	'username' => 'username',
                	'password' => 'password'
                ),
                'passwordHasher'=>array(
                    'className' => 'Simple',
                    'HashType' => 'sha256'
                )
            )
        ),
        // 'logoutRedirect' => array('controller'=> 'users', 'action' => 'login', 'admin'=>true),
        // 'loginRedirect' => array('controller'=> 'dashboard', 'action' => 'index'),
        'authorize' => array('Controller')
        ),
        'Ressources'
    );


	/**
	 * beforeFilter callback
	 *
	 * @return void
	 */
	public function beforeFilter() {
		parent::beforeFilter();

		// PROVISOIRE
        $this->Auth->allow();

        $this->request->addDetector('angular',array(
            'env' => 'HTTP_INIREQUESTAJAX',
            'value' => 'angular request'
        ));

        if($this->Auth->user()){
            $this->set('authUser',$this->Auth->user());
        }else{
            $this->set('authUser',false);
        }
	}

    /**
     * beforeRender callback
     *
     * @return void
     */
    public function beforeRender() {
        
        parent::beforeRender();
        // getAngular($suffix = 'ng', $release='1.2.26', $lib = true, $route=false, $ressource=false, $loader=false, $animate=false)
        // $angularUrls = $this->Ressources->getAngular('ng', 'meetmymusic.js','1.2.26',true,true,true,true,true);
        // $this->set('angularUrls', $angularUrls);
    }

    public function isAuthorized($user) {
        
        if (isset($user['role']) && $user['role'] === 'admin') {
            return true;
        }
        return false;
    }

    protected function checkToken($token){
        $this->loadModel('User');
        if ($token) {
            $count = $this->User->find('count', ['conditions'=>['User.token'=>$token]]);
            if ($count>0) {
                return true;
            }
        }
        return false;
    }






}
