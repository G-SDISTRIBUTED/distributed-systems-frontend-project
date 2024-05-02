<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use App\Events\JobCompleted;
use App\Models\Mensaje;
use Illuminate\Support\Facades\Log;

class RespuestaController extends Controller
{
    public function respuesta(Request $request){
        Log::info("Response: ".json_encode($request->response));
        try{
            Mensaje::create(['mensaje' => $request->input('response')]);
            return "guardado";
        }catch(\Exception $e){
            return $e->getMessage();
        }
    }
    public function destroy($id)
    {
        try {
            $mensaje = Mensaje::findOrFail($id);
            $mensaje->delete();
        }catch(\Exception $e){

        }
        return redirect()->back();
    }
}
