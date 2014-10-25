<div class="row">
	<h1 class="column_title">Se connecter</h1>
	<div class="columns large-6 large-centered medium-centered bordered">
		<?= $this->Form->create('User',array('div' => false, 'class' => 'login_form', 'inputDefaults' => array('class' => 'letter_style', 'label'=>false)));?>
		<?php 
		// PLACE TO SET CLIENT_ID
		 ?>
		 <h5>Username</h5>
		 <div class="">
			<?= $this->Form->input('username', array('placeholder' => 'Nom d\'utilisateur', 'type' => 'text'));?>
		</div>
		<h5>Password</h5>
		<div class="">
			<?= $this->Form->input('password', array('placeholder' => 'Mot de passe', 'type' => 'password'));?>
		</div>
		<input type="submit" class="submit cta button" value="Se connecter">
		<?= $this->Form->end();?>
	</div>
</div>