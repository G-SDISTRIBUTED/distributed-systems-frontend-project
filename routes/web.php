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

Route::get('/', [MainController::class, 'index'])->name('cliente.index');
Route::get('cliente/create', [MainController::class, 'create'])->name('cliente.create');
Route::post('cliente/create', [MainController::class, 'store'])->name('cliente.store');
Route::get('cliente/edit/{id}', [MainController::class, 'edit'])->name('cliente.edit');
Route::post('cliente/edit/{id}', [MainController::class, 'update'])->name('cliente.update');
Route::get('cliente/delete/{id}', [MainController::class, 'destroy'])->name('cliente.delete');