<?php

namespace App\Http\Controllers;

use App\DataTables\ClientesDataTable;
use App\DataTables\ItemsDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Jobs\CrearCliente;
use Exception;
use Illuminate\Support\Facades\Log;
use PgSql\Lob;

class MainController extends Controller
{
    public function index(ClientesDataTable $dataTable)
    {
        return view('welcome');
    }
}


