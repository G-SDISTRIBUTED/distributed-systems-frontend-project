<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ServiciosController extends Controller
{
    public function index(Request $request)
    {
        return view('consulta.index');
    }
}
