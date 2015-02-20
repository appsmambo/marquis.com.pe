<!DOCTYPE html>
<html lang="es">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Marquis Primavera Verano 2015</title>
		<meta name="description" content="Descubre la nueva colección Primavera-Verano 2015 de Marquis.">
		<meta property="fb:app_id" content="607517932691219">
		<meta property="og:site_name" content="Marquis Primavera Verano 2015">
		<meta property="og:title" content="Marquis Primavera Verano 2015">
		<meta itemprop="name" content="Marquis Primavera Verano 2015">
		<meta property="og:url" content="{{ url() }}/">
		<meta property="og:type" content="website">
		<meta property="og:description" content="Descubre la nueva colección Primavera-Verano 2015 de Marquis.">
		<meta property="og:image" content="{{ url() }}/public/images/compartir.jpg">
		<!-- Bootstrap -->
		{{ HTML::style('public/css/normalize.css'); }}
		{{ HTML::style('public/css/bootstrap.min.css'); }}
		{{ HTML::style('public/css/estilos.css'); }}
	</head>
	<body>
		<div id="wrapper">
			<!--div id="rotame">
				<img src="img/rotame.png" alt="Rótame, por favor.">
			</div-->
			<header>
				<a href="#" class="menu"></a>
				<div class="sociales">
					<a href="#" class="facebook"></a>
					<a href="#" class="twitter"></a>
					<a href="#" class="pinterest"></a>
					<a href="#" class="googleplus"></a>
				</div>
			</header>
			<div class="rcWrapper">
				<ul>
					<li class="fondo-inicio">
						<div class="content-a">
							<div class="content-b inicio">
								"HOY SOY COMO QUIERO SER"
							</div>
						</div>
					</li>
					<li class="fondo-filosofia">
						<div class="content-a">
							<div class="content-b">
								<img src="img/play.png" alt="" class="boton play">
							</div>
						</div>
					</li>
				</ul>
			</div>
			<a><img class="rcL" src="{{asset('public/images/flecha.png')}}" alt=""></a>
			<a><img class="rcR" src="{{asset('public/images/flecha.png')}}" alt=""></a>
			<footer>
				<img src="{{asset('public/images/logo.png')}}" alt="MARQUIS">
			</footer>
		</div>








		@yield('content')

		{{ HTML::script('public/js/jquery.min.js'); }}
		{{ HTML::script('public/js/bootstrap.min.js'); }}
		{{ HTML::script('public/js/responsive-carousel.js'); }}
		{{ HTML::script('public/js/scripts.js'); }}
	</body>
</html>