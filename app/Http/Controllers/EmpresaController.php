<?php

namespace App\Http\Controllers;

use App\DataTables\EmpresasDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Exception;
use Illuminate\Support\Facades\Log;
use App\Models\Mensaje;

class EmpresaController extends Controller
{
    public function index(EmpresasDataTable $dataTable)
    {
        $mensajes = Mensaje::all();
        return $dataTable->render('empresa.index', compact('mensajes'));
    }
    public function create()
    {
        return view('empresa.create');
    }

    public function store(Request $request)
    {
        try{
            $response = Http::post('http://127.0.0.1:8000/api/servicios', [
                'clase' => 'empresa',
                'funcion' => 'store',
                'data'=>request(['id', 'nombre', 'telefono', 'direccion','saldo', 'id_clase']), 
                'webhook' => 'http://127.0.0.1:8001/api/respuesta']
            );
            $jsonResponse = $response->json();
            if ($response->successful()) {
                return redirect()->route('empresas');
            } else {
                return redirect()->back()->withErrors($jsonResponse['message']);
            }
            
        }catch(Exception $e){
            return redirect()->back()->withErrors($e->getMessage());
        }
    }

    public function show($id)
    {
        $response = Http::get('http://127.0.0.1:8000/api/empresas/' . $id);
        $jsonResponse = $response->json();
        $empresa = isset($jsonResponse['data']) ? $jsonResponse['data'] : null;
        return view('empresa.show', compact('empresa'));
    }

    public function edit($id)
    {
        $response = Http::get('http://127.0.0.1:8000/api/empresas/' . $id);
        $jsonResponse = $response->json();
        $empresa = isset($jsonResponse['data']) ? $jsonResponse['data'] : null;
        return view('empresa.edit', compact('empresa'));
    }

    public function update(Request $request, $id)
    {
        $response = Http::post('http://127.0.0.1:8000/api/servicios', [
            'clase' => 'empresa',
            'funcion' => 'update',
            'data'=> [
                'id' => $id, 
                'request' => request(['nombre', 'telefono', 'direccion','saldo', 'id_clase'])
            ], 
            'webhook' => 'http://127.0.0.1:8001/api/respuesta'
        ]
        ); 
        $jsonResponse = $response->json();

        return  redirect()->route('empresa.index')->withErrors($jsonResponse['message']);
    }
    public function destroy($id)
    {
        $response = Http::post('http://127.0.0.1:8000/api/servicios', [
            'clase' => 'empresa',
            'funcion' => 'destroy',
            'data'=> $id, 
            'webhook' => 'http://127.0.0.1:8001/api/respuesta']
        );
        $jsonResponse = $response->json();

        return  redirect()->route('empresa.index')->withErrors($jsonResponse['message']);
    }
}


