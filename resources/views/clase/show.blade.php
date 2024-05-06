<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clase</title>

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
                <h1>Ver detalles del clase</h1>
            </div>
        </div>
        <div style="height: 25px;"></div>
        <div class="row mt-4">
            <div class="col-lg-6">
                <form action="{{ route('clases') }}" method="GET" style="width: 350px;">
                    @csrf
                    <div class="form-group" style="margin-bottom: 15px;">
                        <label for="id">ID:</label>
                        <input type="text" name="id" class="form-control" placeholder="ID" value="{{$clase['id']}}" readonly>
                    </div>
                    <div class="form-group">
                        <label for="nombre">Nombre:</label>
                        <input type="text" name="nombre" class="form-control" placeholder="Nombre" value="{{$clase['nombre']}}" readonly>
                    </div>
                    <div class="form-group">
                        <label for="descripcion">Descripción:</label>
                        <input type="text" name="descripcion" class="form-control" placeholder="Descripción" value="{{$clase['descripcion']}}" readonly>
                    </div>
                    <button type="submit" class="btn btn-primary">Volver</button>
                </form>
            </div>
        </div>
    </div>
    </div>

    <script src="{{ asset('vendor/datatables/dataTables.buttons.min.js') }}"></script>
    <script src="{{ asset('vendor/datatables/buttons.server-side.js') }}"></script>
    <script src="{{ asset('js/JqueryApp.js') }}" type="text/javascript"></script>
    <script src="{!! asset('js/datatables/jquery.dataTables.1.10.13.min.js') !!}" type="text/javascript"></script>
    <script src="{!! asset('js/datatables/dataTables.responsive.min.js') !!}" type="text/javascript"></script>
    <script src="{{ asset('js/datatables/datatables.bootstrap.js') }}"></script>
    <script src="{{ asset('js/scripts.js') }}"></script>
</body>
</html>
