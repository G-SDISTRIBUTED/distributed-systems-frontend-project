<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clases</title>

    <link href="{{ asset('css/datatables/jquery.dataTables.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/datatables/responsive.dataTables.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{!! asset('css/vendor.css') !!}" />
    <link rel="stylesheet" href="{!! asset('css/admin.css') !!}" />
    <script src="{{ asset('js/jquery/jquery-3.2.1.min.js') }}"></script>
    <link href="{{ asset('css/datatables/jquery.dataTables.min.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{!! asset('vendor/datatables/buttons.dataTables.min.css') !!}">
</head>

<body>
<div class="container">
    <div style="height: 20px;"></div>
    <div class="row mt-4">
        <div class="col-lg-12">
            <div class="pull-right">
                <a href="{{ route('home') }}" class="btn btn-primary">Volver</a>
                <a href="{{ route('clase.create') }}" class="btn btn-primary">Añadir Clase</a>
            </div>
        </div>
    </div>
    <div style="height: 25px;"></div>
    <div class="row mt-4">
        <div class="col-lg-12">
            <div class="ibox float-e-margins">
                <div class="ibox-content">
                    {!! $dataTable->table(['class' => 'table table-striped table-hover', 'id' => 'clase-manager']) !!}
                </div>
            </div>
        </div>
    </div>
    @if(isset($mensajes))
        @foreach($mensajes as $mensaje)
        <div class="alert alert-success" id="mensaje">
            <form method="post" action="{{route('mensaje.delete', $mensaje->id)}}">
                @csrf
                <button type="submit" id="cerrarMensaje" class="btn btn-link" style="
        float: right;
        font-size: 27px;
        font-weight: bold;
        background-color: transparent;
        border: none;
        ">&times;</button>

            </form>
            {{ $mensaje->mensaje }}
        </div>
        @endforeach
    @endif
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
        <div class="modal-contenido alert alert-danger" style="background-color: white;
    margin: 20% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 70%;">
            <span class="cerrar" id="cerrarModal" style="color: #aaaaaa;
    float: right;
    font-size: 28px;
    font-weight: bold;">&times;</span>
            <h1>{{ $errors->first() }}</h1>

        </div>
    </div>
    @endif


    <script src="{{ asset('vendor/datatables/dataTables.buttons.min.js') }}"></script>
    <script src="{{ asset('vendor/datatables/buttons.server-side.js') }}"></script>
    {!! $dataTable->scripts() !!}
    <script src="{{ asset('js/JqueryApp.js') }}" type="text/javascript"></script>
    <script src="{!! asset('js/datatables/jquery.dataTables.1.10.13.min.js') !!}" type="text/javascript"></script>
    <script src="{!! asset('js/datatables/dataTables.responsive.min.js') !!}" type="text/javascript"></script>
    <script src="{{ asset('js/datatables/datatables.bootstrap.js') }}"></script>
    <script src="{{ asset('js/scripts.js') }}"></script>
    <link href="{{ asset('css/inspinia/plugins/sweetalert/sweetalert.css') }}" rel="stylesheet">
    <script src="{{ asset('js/inspinia/plugins/sweetalert/sweetalert-dev.js') }}"></script>
    <script>
        function validateDeleteAction(form) {
            event.preventDefault();
            swal({
                title: "Eliminacion",
                text: 'Esta seguro?',
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: 'Eliminar',
                closeOnConfirm: false
            }, function() {
                document.getElementById(form).submit();
            });
        }
        cerrarModal.addEventListener("click", function() {
            modal.style.display = "none";
        });
        cerrarMensaje.addEventListener("click", function() {
            mensaje.style.display = "none";
        });
    </script>
</body>

</html>