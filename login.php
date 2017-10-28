<?php

require 'auth.php';
    
?>

<!doctype html>
<html lang="en-US">
<head>
    <meta charset="utf-8">
    <title>...:: SISTRAM -- Sistema Integral paa el Seguimiento de Trabajos Mec&aacute;nicos -- Login ::...</title>
    <link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Varela+Round" type="text/css" />
    <link href="login.css" rel="stylesheet" type="text/css" />
</head>
<body style="background-image: url('images/fondo-body.jpg'); background-repeat: no-repeat;
                    background-attachment: fixed; background-size: cover; background-position: center; ">
    <div id="login" style="position: relative;">
        <h2>SISTRAM - Acceso</h2><img src="images/icon_sistram.png" title="Sistram" style="position: absolute; right: 10px; top: 14px;"/>
        <form action="" method="POST">
		<fieldset>
                    <p><label for="user">Usuario</label></p>
                    <p><input type="text" id="user" name="user" value="usuario" onBlur="if(this.value=='')this.value='usuario'" onFocus="if(this.value=='usuario')this.value=''"></p>
                    <p><label for="password">Clave</label></p>
                    <p><input type="password" id="password" name="password" value="clave" onBlur="if(this.value=='')this.value='clave'" onFocus="if(this.value=='clave')this.value=''"></p>

                    <p><input type="submit" value="Acceder"></p>
		</fieldset>
            </form>
	</div> <!-- end login -->
</body>	
</html>