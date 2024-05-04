<?php

namespace App\Http\Controllers;
use App\DataTables\ClientesDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Exception;
use Illuminate\Support\Facades\Log;

class ClienteController extends Controller
{
    public function index(ClientesDataTable $dataTable)
    {
        return $dataTable->render('cliente.index');
    }
    public function create()
    {
        return view('cliente.create');
    }
    public function store(Request $request)
    {
        try{
            $response = Http::post('http://127.0.0.1:8000/api/servicios', [
                'clase' => 'cliente',
                'funcion' => 'store',
                'data'=>request(['ci', 'nombre', 'direccion', 'telefono'])]
            );
            $jsonResponse = $response->json();
            Log::info('HTTP Response: '. json_encode($jsonResponse));
    
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
        $response = Http::get('http://127.0.0.1:8000/api/clientes/' . $ci);
        $jsonResponse = $response->json();
        $cliente = isset($jsonResponse['data']) ? $jsonResponse['data'] : null;
        return view('cliente.show', compact('cliente'));
    }

    public function edit($ci)
    {
        $response = Http::get('http://127.0.0.1:8000/api/clientes/' . $ci);
        $jsonResponse = $response->json();
        $cliente = isset($jsonResponse['data']) ? $jsonResponse['data'] : null;
        return view('cliente.edit', compact('cliente'));
    }
    public function update(Request $request, $ci)
    {
        $response = Http::post('http://127.0.0.1:8000/api/servicios', [
            'clase' => 'cliente',
            'funcion' => 'update',
            'data'=> [
            'ci' => $ci, 
            'request' => request(['nombre', 'direccion', 'telefono'])
        ]
        ]
        ); 
        $jsonResponse = $response->json();

        return  redirect()->route('clientes');
    }
    public function destroy($ci)
    {
        $response = Http::post('http://127.0.0.1:8000/api/servicios', [
            'clase' => 'cliente',
            'funcion' => 'destroy',
            'data'=> $ci]
        );
        $jsonResponse = $response->json();

        return  redirect()->route('clientes');
    }
}
