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
        return $dataTable->render('welcome');
    }

    public function indexClientes(ClientesDataTable $dataTable)
    {
        return $dataTable->render('cliente.index');
    }

    public function indexItems(ItemsDataTable $dataTable)
    {
        return $dataTable->render('item.index');
    }

    public function createCliente()
    {
        return view('cliente.create');
    }

    public function createItem()
    {
        return view('item.create');
    }

    public function storeCliente(Request $request)
    {
        try{
            $response = Http::post('http://127.0.0.1:8000/api/servicios', [
                'clase' => 'cliente',
                'funcion' => 'store',
                'data'=>request(['ci', 'nombre', 'direccion', 'telefono'])]
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

    public function storeItem(Request $request)
    {
        try{
            $response = Http::post('http://127.0.0.1:8000/api/servicios', [
                'clase' => 'item',
                'funcion' => 'store',
                'data'=>request(['id', 'nombre', 'descripcion'])]
            );
            $jsonResponse = $response->json();
            if ($response->successful()) {
                return redirect()->route('items');
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
        /* $response = Http::put('http://127.0.0.1:8000/api/clientes/' . $ci, request(['ci', 'nombre', 'direccion', 'telefono']));
        $jsonResponse = $response->json();

        if ($jsonResponse['code'] == 700) {
            return redirect()->route('cliente.index');
        } else {
            return redirect()
                ->back()
                ->withInput()
                ->withErrors($jsonResponse['message']);
        } */
        $response = Http::post('http://127.0.0.1:8000/api/servicios', [
            'clase' => 'cliente',
            'funcion' => 'update',
            'data'=> [
            'ci' => $ci, 
            'request' => request(['nombre', 'direccion', 'telefono'])
        ]
        ]
        ); 
        return $response;
    }
    public function destroy($ci)
    {
        /* $response = Http::delete('http://localhost:8000/api/clientes/' . $ci);
        $jsonResponse = $response->json();

        if ($jsonResponse['code'] == 700) {
            return redirect()->route('cliente.index');
        } else {
            return redirect()->back()->withInput()->withErrors($jsonResponse['message']);
        } */
        $response = Http::post('http://127.0.0.1:8000/api/servicios', [
            'clase' => 'cliente',
            'funcion' => 'destroy',
            'data'=> $ci]
        );
        return $response;
    }

    public function test()
    {
        for ($i = 0; $i < 10; $i++) {
            CrearCliente::dispatch();
        }

        return response()->json(['message' => 'Trabajos lanzados']);
    }
}


