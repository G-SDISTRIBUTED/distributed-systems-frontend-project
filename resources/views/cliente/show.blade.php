<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transporte</title>

    <link href="{{ asset('css/datatables/jquery.dataTables.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/datatables/responsive.dataTables.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{!! asset('css/vendor.css') !!}"/>
    <link rel="stylesheet" href="{!! asset('css/admin.css') !!}"/>
    <link href="{{ asset('css/datatables/jquery.dataTables.min.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{!! asset('vendor/datatables/buttons.dataTables.min.css') !!}">
</head>
<body>
    <div class="container" style="margin: 0;
  padding: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;">
  <div  style="border: 2px solid white; border-radius: 20px; padding: 20px; background-color: white; color:black;">
        
        <div class="row mt-4" style="text-align: center;">
            <div class="col-lg-12">
                <h1>Ver detalles del cliente</h1>
            </div>
        </div>
        <div style="height: 25px;"></div>
        <div class="row mt-4">
            <div class="col-lg-6">
                <form action="{{ route('clientes') }}" method="GET" style="width: 350px;">
                    @csrf
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="ci">CI:</label>
                        <input type="text" name="ci" class="form-control" placeholder="CI" value="{{$cliente['ci']}}" readonly>
                    </div>
                    <div class="form-group">
                        <label for="nombre">Nombre:</label>
                        <input type="text" name="nombre" class="form-control" placeholder="Nombre" value="{{$cliente['nombre']}}" readonly>
                    </div>
                    <div class="form-group">
                        <label for="direccion">Dirección:</label>
                        <input type="text" name="direccion" class="form-control" placeholder="Dirección" value="{{$cliente['direccion']}}" readonly>
                    </div>
                    <div class="form-group">
                        <label for="telefono">Teléfono:</label>
                        <input type="text" name="telefono" class="form-control" placeholder="Teléfono" value="{{$cliente['telefono']}}" readonly>
                    </div>
                    <button type="submit" class="btn btn-primary">Volver</button>
                </form>
            </div>
        </div>
    </div>
    </div>

    @if ($errors->any())
  <div id="modal" class="modal" style="display: block;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);">
  <div class="modal-contenido" style="background-color: white;
    margin: 20% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 70%;">
    <span class="cerrar" id="cerrarModal" style="color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;">&times;</span>

  <div class="alert alert-danger">
        <h1>{{ $errors->first() }}</h1>
  </div>
  </div>
</div>
@endif

    <script src="{{ asset('vendor/datatables/dataTables.buttons.min.js') }}"></script>
    <script src="{{ asset('vendor/datatables/buttons.server-side.js') }}"></script>
    <script src="{{ asset('js/JqueryApp.js') }}" type="text/javascript"></script>
    <script src="{!! asset('js/datatables/jquery.dataTables.1.10.13.min.js') !!}" type="text/javascript"></script>
    <script src="{!! asset('js/datatables/dataTables.responsive.min.js') !!}" type="text/javascript"></script>
    <script src="{{ asset('js/datatables/datatables.bootstrap.js') }}"></script>
    <script src="{{ asset('js/scripts.js') }}"></script>
    <script>
        cerrarModal.addEventListener("click", function() {
        modal.style.display = "none";
        });

    </script>
</body>
</html>
