<?php

namespace App\Http\Controllers;

use App\DataTables\ClientesDataTable;
use Illuminate\Http\Request;

class MainController extends Controller
{
    public function index(ClientesDataTable $dataTable)
    {
        return $dataTable->render('cliente.index');
    }
}
