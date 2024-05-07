<?php

namespace App\Http\Controllers;
use App\DataTables\ClientesDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Exception;
use Illuminate\Support\Facades\Log;
use App\Models\Mensaje;

class ClienteController extends Controller
{
    public function index(ClientesDataTable $dataTable)
    {
        $mensajes = Mensaje::all();
        return $dataTable->render('cliente.index', compact('mensajes'));
    }
    public function create()
    {
        return view('cliente.create');
    }
    public function store(Request $request)
    {
        try{
            $response = Http::post(env('URL_API_BACK').'/servicios', [
                'clase' => 'cliente',
                'funcion' => 'store',
                'data'=>request(['ci', 'nombre', 'direccion', 'telefono']), 
                'webhook' => env('URL_API_FRONT').'/respuesta']
            );
            $jsonResponse = $response->json();
    
            if ($response->successful()) {
                return redirect()->route('clientes');
            } else {
                return redirect()->back()->withErrors($jsonResponse['message']);
            } 
        }catch(Exception $e){
            return redirect()->back()->withErrors($e->getMessage());
        }
    }
    public function show($ci)
    {
        $response = Http::get(env('URL_API_BACK').'/clientes/' . $ci);
        $jsonResponse = $response->json();
        $cliente = isset($jsonResponse['data']) ? $jsonResponse['data'] : null;
        return view('cliente.show', compact('cliente'));
    }

    public function edit($ci)
    {
        $response = Http::get(env('URL_API_BACK').'/clientes/' . $ci);
        $jsonResponse = $response->json();
        $cliente = isset($jsonResponse['data']) ? $jsonResponse['data'] : null;
        return view('cliente.edit', compact('cliente'));
    }
    public function update(Request $request, $ci)
    {
        $response = Http::post(env('URL_API_BACK').'/servicios', [
            'clase' => 'cliente',
            'funcion' => 'update',
            'data'=> [
                'ci' => $ci, 
                'request' => request(['nombre', 'direccion', 'telefono'])], 
            'webhook' => env('URL_API_FRONT').'/respuesta'
        ]
        ); 
        $jsonResponse = $response->json();

        return  redirect()->route('clientes');
    }
    public function destroy($ci)
    {
        $response = Http::post(env('URL_API_BACK').'/servicios', [
            'clase' => 'cliente',
            'funcion' => 'destroy',
            'data'=> $ci, 
            'webhook' => env('URL_API_FRONT').'/respuesta']
        );
        $jsonResponse = $response->json();

        return  redirect()->route('clientes');
    }
}
