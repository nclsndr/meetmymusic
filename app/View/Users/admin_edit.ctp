<div class="row bc_tpl">
	<?php if (isset($this->request->data['User']['id'])): ?>
			<h1 class="column_title">Éditer un utilisateur</h1>
		<?php else: ?>
			<h1 class="column_title">Ajouter un utilisateur</h1>
		<?php endif ?>
	<div class="columns large-6 large-centered medium-centered">
		<div class="">
			<div class="letter_form ">
				<?= $this->Form->create('User',array('div' => false, 'class' => 'login_form', 'inputDefaults' => array('class' => 'letter_style', 'label'=>false)));?>
				<?php if (isset($this->request->data['User']['id'])): ?>
					<?= $this->Form->hidden($this->request->data['User']['id']); ?>
				<?php endif ?>

				<?php 
				// PLACE TO SET CLIENT_ID
				 ?>
				 <h5>Données de connexion</h5>
				 <div class="">
					<?= $this->Form->input('username', array('placeholder' => 'Nom d\'utilisateur', 'type' => 'text'));?>
				</div>
				<div class="">
					<?= $this->Form->input('password', array('placeholder' => 'Mot de passe', 'type' => 'password'));?>
				</div>
				<div class="">
					<?= $this->Form->select('role', ['admin'=>'Administrateur', 'user'=>'Utilisateur'], ['empty'=>'Choisir un role']); ?>
				</div>

				<h5>informations personnelles</h5>
				<div class="">
					<?= $this->Form->input('mail', array('placeholder' => 'Addresse e-mail', 'type' => 'email'));?>
				</div>
				<div class="">
					<?= $this->Form->input('name', array('placeholder' => 'Nom', 'type' => 'text'));?>
				</div>
				<div class="">
					<?= $this->Form->input('firstname', array('placeholder' => 'Prénom', 'type' => 'text'));?>
				</div>
				<div class="">
					<?= $this->Form->input('tel', array('placeholder' => 'Téléphone', 'type' => 'text'));?>
				</div>

				<h5>Données internes</h5>
				<div class="">
					<label for="">API id</label>
					<?= $this->Form->input('api_id', array('placeholder' => 'API id', 'type' => 'text'));?>
				</div>
				<div class="">
					<label for="">token</label>
					<?= $this->Form->input('token', array('placeholder' => 'token', 'type' => 'text'));?>
				</div>

				<input type="submit" class="submit cta button" value="Enregistrer">
				<?= $this->Form->end();?>
			</div>
		</div>
	</div>
</div>