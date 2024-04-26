<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;

class CrearCliente implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $ci = rand(1, 100);
        $nombre = 'nombre'.$ci;
        $direccion = 'direccion';
        $telefono =  $ci;
        
        Http::timeout(60)->post('http://127.0.0.1:8000/api/clientes', [$ci, $nombre, $direccion, $telefono]);

        sleep(5);
        Log::info('Trabajo de prueba ejecutado.');
    }
}
