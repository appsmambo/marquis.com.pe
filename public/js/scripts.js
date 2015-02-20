var videoComercial;  //, videoLookbook;
var carousel, BV;
//var bloques = ['inicio', 'comercial', 'mi-vida-y-yo', 'y-mi-casa', 'y-el', 'y-mi-trabajo', 'y-mis-amigos', 'video-lookbook', 'falda-midi', 'blazer-kari', 'casaca-biker', 'abrigo-caro', 'jean-boy', 'chompa-window', 'info'];
var bloques = ['inicio', 'comercial', 'mi-vida-y-yo', 'y-mi-casa', 'y-el', 'y-mi-trabajo', 'y-mis-amigos', 'falda-midi', 'blazer-kari', 'casaca-biker', 'abrigo-caro', 'jean-boy', 'chompa-window', 'info'];
$(window).bind('popstate', function(event) {
	var page = window.location.pathname.split('/');
	loadContent("/" + page[page.length - 1], 0, false);
});
$.validator.addMethod("nombre", function(value, element) {
	return this.optional(element) || /^[a-zA-Z áéíóúÁÉÍÓÚÑñ]+$/.test(value);
});
function fullscreenFix() {
	var h = $('body').height();
	// set .fullscreen height
	$(".content-b").each(function(i) {
		if ($(this).innerHeight() <= h) {
			$(this).closest(".fullscreen").addClass("not-overflow");
		}
	});
}
$(window).resize(fullscreenFix);
fullscreenFix();

function loadContent(href, push) {
	if (Modernizr.history && push) {
		history.pushState({}, 'New URL: ' + href, href);
	}
}
function verPagina() {
	e = urlActual.indexOf('inicio');
	if (e > 0)
		carousel.showPage(1);
	
	e = urlActual.indexOf('filosofia');
	if (e > 0)
		carousel.showPage(2);
	
	e = urlActual.indexOf('mi-vida-y-yo');
	if (e > 0)
		carousel.showPage(3);
	
	e = urlActual.indexOf('y-mi-casa');
	if (e > 0)
		carousel.showPage(4);
	
	e = urlActual.indexOf('y-el');
	if (e > 0)
		carousel.showPage(5);
	
	e = urlActual.indexOf('y-mi-trabajo');
	if (e > 0)
		carousel.showPage(6);
	
	e = urlActual.indexOf('y-mis-amigos');
	if (e > 0)
		carousel.showPage(7);
	
	/*e = urlActual.indexOf('video-lookbook');
	if (e > 0)
		carousel.showPage(8);*/
	
	e = urlActual.indexOf('falda-midi');
	if (e > 0)
		carousel.showPage(8);
	
	e = urlActual.indexOf('blazer-kari');
	if (e > 0)
		carousel.showPage(9);
	
	e = urlActual.indexOf('casaca-biker');
	if (e > 0)
		carousel.showPage(10);
	
	e = urlActual.indexOf('abrigo-caro');
	if (e > 0)
		carousel.showPage(11);
	
	e = urlActual.indexOf('jean-boy');
	if (e > 0)
		carousel.showPage(12);
	
	e = urlActual.indexOf('chompa-window');
	if (e > 0)
		carousel.showPage(13);
	
	e = urlActual.indexOf('info');
	if (e > 0)
		carousel.showPage(14);
	
	/*e = urlActual.indexOf('info/catalogo');
	if (e > 0) {
		carousel.showPage(9);
		$('.catalogo').trigger('click');
	}*/
	
}
function iniciaCarousel() {
	carousel = $('#wrapper').responsiveCarousel({
		direction: 'horizontal',
		keyControl: true,
		arrows: true,
		tapToReturn: true,
		callback: carouselStateChanged
	});
}
function carouselStateChanged() {
	//e = /lookbook[1-5]\/\w/.test(urlActual);
	curPage = this.state.curPage;
	if (curPage > 1) {
		loadContent(urlBase + '/' + bloques[curPage-1], true);
		ga('send', 'pageview', {'page': urlBase + '/' + bloques[curPage-1], 'title': bloques[curPage-1]});
	} else {
		loadContent(urlBase + '/inicio', true);
	}
}
$(document).ready(function () {
	videoComercial = $('body').videoBG({
		mp4:urlBase+"/video/comercial.mp4",
		videoVolume:0.5,
		autoplay:false
	});
	/*videoLookbook = $('body').videoBG({
		youtube:"iC_4iVpO3wQ",
		videoVolume:0.5,
		autoplay:false
	});*/
	iniciaCarousel();
	$('li', '.submenu').hover(function() {
		$(this).removeClass('pulse animated').addClass('pulse animated');
	}, function() {
		$(this).removeClass('pulse animated');
	});
	$('.menu').click(function(e) {
		e.preventDefault();
		activo = $(this).hasClass('activo');
		if (activo) {
			$(this).removeClass('activo');
			$('.submenu').fadeOut('fast');
		} else {
			$(this).addClass('activo');
			$('.submenu').fadeIn('slow');
		}
	});
	$('a', '.submenu').click(function(e) {
		e.preventDefault();
		pagina = $(this).attr('href');
		switch(pagina) {
			case urlBase+'/comercial':
				carousel.showPage(2);
				break;
			case urlBase+'/mi-vida-y-yo':
				carousel.showPage(3);
				break;
			
			case urlBase+'/falda-midi':
				carousel.showPage(8);
				break;
			case urlBase+'/info':
				carousel.showPage(14);
				break;
		}
		$('.menu').removeClass('activo');
		$('.submenu').fadeOut('fast');
		loadContent(pagina, true);
	});
	$('.play').click(function(event) {
		event.preventDefault();
		videoComercial.videoBgRewind();
		$('#wrapper').fadeOut('slow', function() {
			$('footer, header').fadeOut();
			videoComercial.videoBgPlay();
			$('.control-video').fadeIn('fast');
		});
	});
	$('.play-lookbook').click(function(event) {
		event.preventDefault();
		$('#wrapper').fadeOut('slow', function() {
			$('footer, header').fadeOut();
			//videoLookbook.videoBgPlay();
			$('.control-video').fadeIn('fast');
		});
	});
	$('.cerrar').click(function(event) {
		event.preventDefault();
		$('.control-video').fadeOut('fast');
		videoComercial.videoBgRewind();
		videoComercial.videoBgPause();
		//videoLookbook.videoBgRewind();
		//videoLookbook.videoBgPause();
		$('#wrapper').fadeIn('fast', function() {
			$('footer, header').fadeIn();
		});
	});
	$('.comercial, .makingoff, .catalogo, .registro, .prenda').hover(function() {
		$(this).removeClass('pulse animated').addClass('pulse animated');
	}, function() {
		$(this).removeClass('pulse animated');
	});
	$('.comercial').click(function(e) {
		e.preventDefault();
		$.fancybox({
			padding:0,
			margin:0,
			openEffect:'elastic',
			closeEffect:'elastic',
			wrapCSS:'blanco',
			allowfullscreen:'true',
			type:'iframe',
			href:'http://www.youtube.com/embed/iC_4iVpO3wQ?autoplay=1&rel=0'
		});
	});
	$('.makingoff').click(function(e) {
		e.preventDefault();
		$.fancybox({
			padding:0,
			margin:0,
			openEffect:'elastic',
			closeEffect:'elastic',
			wrapCSS:'blanco',
			allowfullscreen:'true',
			type:'iframe',
			href:'http://www.youtube.com/embed/HUVu9iQeUmE?autoplay=1&rel=0'
		});
	});
	$('.catalogo').click(function(e) {
		e.preventDefault();
		$.fancybox({
			padding:0,
			margin:0,
			autoSize:false,
			width:'800',
			height:'600',
			openEffect:'elastic',
			closeEffect:'elastic',
			wrapCSS:'blanco',
			scrolling: 'no',
			type:'inline',
			href:'#catalogo'
		});
	});
	$('.registro').click(function(e) {
		e.preventDefault();
		$.fancybox({
			padding:0,
			margin:0,
			openEffect:'elastic',
			closeEffect:'elastic',
			type:'inline',
			href:'#registro'
		});
	});
	$('.deseo').click(function() {
		valor = $(this).data('valor');
		if (valor == '0') {
			$(this).data('valor', '1').prop('src', urlBase + '/public/images/check-on.jpg');
			$('#info').val('todos');
		} else {
			$(this).data('valor', '0').prop('src', urlBase + '/public/images/check.jpg');
			$('#info').val('');
		}
	});
	$('#formRegistro').validate({
		rules: {
			nombre: {
				required:true,
				nombre:true
			},
			email: {
				required:true,
				email:true
			},
			telefono: {
				number:true
			}
		},
		messages: {
			nombre: {
				required: "Ingrese su nombre y apellidos",
				nombre: "Ingrese su nombre correctamente"
			},
			email: {
				required: "Ingrese su email",
				email: "Ingrese su email correctamente"
			},
			telefono: {
				number: "Ingrese su teléfono correctamente"
			}
		},
		submitHandler: function(form) {
			$('#registrar').prop('disabled', 'disabled');
			$.ajax({
				type: "POST",
				url: urlBase + '/public/registro.php',
				data: $('#formRegistro').serialize(),
				success: function(res) {
					if (res == 'OK') {
						$('#registro').block({css: {width:'300px', border: 'none', padding: '15px', backgroundColor: '#000', '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: .9, color: '#fff'}, message: 'Gracias, tus datos han sido registrados.'});
						setTimeout(function() {
							$('.inputbox').val('');
							$('#registro').unblock({
								onUnblock: function() {
								}
							});
						}, 3000);
					} else {
						$('#registro').block({css: {width:'300px', border: 'none', padding: '15px', backgroundColor: '#000', '-webkit-border-radius': '10px', '-moz-border-radius': '10px', opacity: .9, color: '#fff'}, message: 'Vuelva a intentarlo.'});
						setTimeout(function() {
							$('#registro').unblock({
								onUnblock: function() {
								}
							});
						}, 3000);
					}
					$('#registrar').prop('disabled');
					$('.deseo').data('valor', '0').prop('src', urlBase + '/public/images/check.jpg');
					$('#info').val('');
				},
				dataType: 'text'
			});
			return false;
		}
	});
});
$(window).load(function() {
	verPagina();
});
