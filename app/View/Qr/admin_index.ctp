<div class="row">
	<h1>QR CODES</h1>
	<?= $this->Form->create('Qr',array('div' => false, 'class' => 'login_form', 'inputDefaults' => array('class' => 'letter_style', 'label'=>false)));?>
		<div class="">
			<?= $this->Form->input('token', array('placeholder' => 'token', 'type' => 'text'));?>
		</div>
		<input type="submit" class="submit cta button" value="tester">
	<?= $this->Form->end();?>
	<img src="<?= $url ?>" alt="">
</div>