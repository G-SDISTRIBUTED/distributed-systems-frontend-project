<?php

namespace App\Http\Controllers;

use App\DataTables\ItemsDataTable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Exception;
use Illuminate\Support\Facades\Log;

class ItemController extends Controller
{
    public function index(ItemsDataTable $dataTable)
    {
        return $dataTable->render('item.index');
    }
    public function create()
    {
        return view('item.create');
    }

    public function store(Request $request)
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

    public function show($id)
    {
        $response = Http::get('http://127.0.0.1:8000/api/items/' . $id);
        $jsonResponse = $response->json();
        $item = isset($jsonResponse['data']) ? $jsonResponse['data'] : null;
        return view('item.show', compact('item'));
    }

    public function edit($id)
    {
        $response = Http::get('http://127.0.0.1:8000/api/items/' . $id);
        $jsonResponse = $response->json();
        $item = isset($jsonResponse['data']) ? $jsonResponse['data'] : null;
        return view('item.edit', compact('item'));
    }

    public function update(Request $request, $id)
    {
        $response = Http::post('http://127.0.0.1:8000/api/servicios', [
            'clase' => 'item',
            'funcion' => 'update',
            'data'=> [
                'id' => $id, 
                'request' => request(['nombre', 'descripcion'])
            ]
        ]
        ); 
        $jsonResponse = $response->json();

        return  redirect()->route('items');
    }
    public function destroy($id)
    {
        $response = Http::post('http://127.0.0.1:8000/api/servicios', [
            'clase' => 'item',
            'funcion' => 'destroy',
            'data'=> $id]
        );
        $jsonResponse = $response->json();

        return  redirect()->route('items');
    }
}


