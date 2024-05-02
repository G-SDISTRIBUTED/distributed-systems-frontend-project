<?php

use App\Http\Controllers\ClienteController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\ItemController;
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
Route::get('/', function () { return view('welcome');})->name('home');
Route::get('cliente/index', [ClienteController::class, 'index'])->name('clientes');
Route::get('cliente/create', [ClienteController::class, 'create'])->name('cliente.create');
Route::post('cliente/create', [ClienteController::class, 'store'])->name('cliente.store');
Route::get('cliente/show/{ci}', [ClienteController::class, 'show'])->name('cliente.show');
Route::get('cliente/edit/{ci}', [ClienteController::class, 'edit'])->name('cliente.edit');
Route::post('cliente/update/{ci}', [ClienteController::class, 'update'])->name('cliente.update');
Route::post('cliente/delete/{ci}', [ClienteController::class, 'destroy'])->name('cliente.delete');

Route::get('item/index', [ItemController::class, 'index'])->name('items');
Route::get('item/create', [ItemController::class, 'create'])->name('item.create');
Route::post('item/create', [ItemController::class, 'store'])->name('item.store');
Route::get('item/show/{id}', [ItemController::class, 'show'])->name('item.show');
Route::get('item/edit/{id}', [ItemController::class, 'edit'])->name('item.edit');
Route::post('item/update/{id}', [ItemController::class, 'update'])->name('item.update');
Route::post('item/delete/{id}', [ItemController::class, 'destroy'])->name('item.delete');

Route::get('empresa/index', [EmpresaController::class, 'index'])->name('empresas');
Route::get('empresa/create', [EmpresaController::class, 'create'])->name('empresa.create');
Route::post('empresa/create', [EmpresaController::class, 'store'])->name('empresa.store');
Route::get('empresa/show/{id}', [EmpresaController::class, 'show'])->name('empresa.show');
Route::get('empresa/edit/{id}', [EmpresaController::class, 'edit'])->name('empresa.edit');
Route::post('empresa/update/{id}', [EmpresaController::class, 'update'])->name('empresa.update');
Route::post('empresa/delete/{id}', [EmpresaController::class, 'destroy'])->name('empresa.delete');