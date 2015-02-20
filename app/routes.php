<?php

Route::get('/', 'HomeController@verPagina');

Route::get('/{pagina}', 'HomeController@verPagina')
	->where('pagina', 'inicio|comercial|mi-vida-y-yo|y-mi-casa|y-el|y-mi-trabajo|y-mis-amigos|video-lookbook|blazer-kari|falda-midi|casaca-biker|abrigo-caro|jean-boy|chompa-window|info');

/*Route::get('/info/catalogo', function()
{
	return View::make('inicio');
});



Route::get('/lookbook1/{url_prenda}', 'PrendaController@verPrenda');
Route::get('/lookbook2/{url_prenda}', 'PrendaController@verPrenda');
Route::get('/lookbook3/{url_prenda}', 'PrendaController@verPrenda');
Route::get('/lookbook4/{url_prenda}', 'PrendaController@verPrenda');
Route::get('/lookbook5/{url_prenda}', 'PrendaController@verPrenda');

Route::post('/lookbook1/{url_prenda}', 'PrendaController@ajaxVerPrenda');
Route::post('/lookbook2/{url_prenda}', 'PrendaController@ajaxVerPrenda');
Route::post('/lookbook3/{url_prenda}', 'PrendaController@ajaxVerPrenda');
Route::post('/lookbook4/{url_prenda}', 'PrendaController@ajaxVerPrenda');
Route::post('/lookbook5/{url_prenda}', 'PrendaController@ajaxVerPrenda');

*/