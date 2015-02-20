<?php

class PrendaController extends BaseController {

	/*
	|--------------------------------------------------------------------------
	| Default Home Controller
	|--------------------------------------------------------------------------
	|
	| You may wish to use controllers instead of, or in addition to, Closure
	| based routes. That's great! Here is an example controller method to
	| get you started. To route to this controller, just add the route:
	|
	|	Route::get('/', 'HomeController@showWelcome');
	|
	*/

	public function verPrenda($url_prenda = 'enterito-nim') {
		$prenda = Prenda::where('url', '=', $url_prenda)->first();
		$detalle = PrendaDetalle::where('prenda', '=', $prenda->id)->get();
		return View::make('inicio')
						->with('prenda', $prenda)
						->with('prendas', $detalle);
	}
	
	public function ajaxVerPrenda($url_prenda = 'enterito-nim') {
		$prenda = Prenda::where('url', '=', $url_prenda)->first();
		$detalle = PrendaDetalle::where('prenda', '=', $prenda->id)->get();
		$resultado = array('prenda' => $prenda, 'detalle' => $detalle);
		return json_encode($resultado);
	}

}
