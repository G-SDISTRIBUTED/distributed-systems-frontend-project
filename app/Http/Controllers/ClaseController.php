<?php

namespace App\Http\Controllers;
use App\DataTables\ClasesDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Exception;
use Illuminate\Support\Facades\Log;
use App\Models\Mensaje;

class ClaseController extends Controller
{
    public function index(ClasesDataTable $dataTable)
    {
        $mensajes = Mensaje::all();
        return $dataTable->render('clase.index', compact('mensajes'));
    }
    public function create()
    {
        return view('clase.create');
    }
    public function store(Request $request)
    {
        try{
            $response = Http::post(env('URL_API_BACK').'/servicios', [
                'clase' => 'clase',
                'funcion' => 'store',
                'data'=>request(['id', 'nombre', 'descripcion']), 
                'webhook' => env('URL_API_FRONT').'/respuesta']
            );
            $jsonResponse = $response->json();
    
            if ($response->successful()) {
                return redirect()->route('clases');
            } else {
                return redirect()->back()->withErrors($jsonResponse['message']);
            } 
        }catch(Exception $e){
            return redirect()->back()->withErrors($e->getMessage());
        }
    }
    public function show($id)
    {
        $response = Http::get(env('URL_API_BACK').'/clases/' . $id);
        $jsonResponse = $response->json();
        $clase = isset($jsonResponse['data']) ? $jsonResponse['data'] : null;
        return view('clase.show', compact('clase'));
    }

    public function edit($id)
    {
        $response = Http::get(env('URL_API_BACK').'/clases/' . $id);
        $jsonResponse = $response->json();
        $clase = isset($jsonResponse['data']) ? $jsonResponse['data'] : null;
        return view('clase.edit', compact('clase'));
    }
    public function update(Request $request, $id)
    {
        $response = Http::post(env('URL_API_BACK').'/servicios', [
            'clase' => 'clase',
            'funcion' => 'update',
            'data'=> [
                'id' => $id, 
                'request' => request(['nombre', 'descripcion'])], 
            'webhook' => env('URL_API_FRONT').'/respuesta'
        ]
        ); 
        $jsonResponse = $response->json();

        return  redirect()->route('clases');
    }
    public function destroy($id)
    {
        $response = Http::post(env('URL_API_BACK').'/servicios', [
            'clase' => 'clase',
            'funcion' => 'destroy',
            'data'=> $id, 
            'webhook' => env('URL_API_FRONT').'/respuesta']
        );
        $jsonResponse = $response->json();

        return  redirect()->route('clases');
    }
}
