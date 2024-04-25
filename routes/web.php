<?php

use App\Http\Controllers\MainController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [MainController::class, 'index'])->name('index');
Route::get('cliente/index', [MainController::class, 'indexClientes'])->name('clientes');
Route::get('cliente/create', [MainController::class, 'createCliente'])->name('cliente.create');
Route::post('cliente/create', [MainController::class, 'storeCliente'])->name('cliente.store');
Route::get('cliente/show/{id}', [MainController::class, 'show'])->name('cliente.show');
Route::get('cliente/edit/{id}', [MainController::class, 'edit'])->name('cliente.edit');
Route::post('cliente/update/{id}', [MainController::class, 'update'])->name('cliente.update');
Route::post('cliente/delete/{id}', [MainController::class, 'destroy'])->name('cliente.delete');

Route::get('item/index', [MainController::class, 'indexItems'])->name('items');
Route::get('item/create', [MainController::class, 'createItem'])->name('item.create');
Route::post('item/create', [MainController::class, 'storeItem'])->name('item.store');
Route::get('item/show/{id}', [MainController::class, 'show'])->name('item.show');
Route::get('item/edit/{id}', [MainController::class, 'edit'])->name('item.edit');
Route::post('item/update/{id}', [MainController::class, 'update'])->name('item.update');
Route::post('item/delete/{id}', [MainController::class, 'destroy'])->name('item.delete');