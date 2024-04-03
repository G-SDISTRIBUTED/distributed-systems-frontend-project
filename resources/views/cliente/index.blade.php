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
    <script src="{{ asset('js/jquery/jquery-3.2.1.min.js') }}"></script>
    <link href="{{ asset('css/datatables/jquery.dataTables.min.css') }}" rel="stylesheet">
    <link rel="stylesheet" href="{!! asset('vendor/datatables/buttons.dataTables.min.css') !!}">
</head>
<body>
    <div class="container">
    <div style="height: 20px;"></div>
        <div class="row mt-4">
            <div class="col-lg-12">
                <a href="{{ url('cliente/create') }}" class="btn btn-primary pull-right"><i class="fa fa-plus"></i> Añadir Cliente</a>
            </div>
        </div>
        <div style="height: 25px;"></div>
        <div class="row mt-4">
            <div class="col-lg-12">

                <div class="ibox float-e-margins">
                    <div class="ibox-content">
                        {!! $dataTable->table(['class' => 'table table-striped table-hover', 'id' => 'cliente-manager']) !!}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="{{ asset('vendor/datatables/dataTables.buttons.min.js') }}"></script>
    <script src="{{ asset('vendor/datatables/buttons.server-side.js') }}"></script>
    {!! $dataTable->scripts() !!}
    <script src="{{ asset('js/JqueryApp.js') }}" type="text/javascript"></script>
<script src="{!! asset('js/datatables/jquery.dataTables.1.10.13.min.js') !!}" type="text/javascript"></script>
<script src="{!! asset('js/datatables/dataTables.responsive.min.js') !!}" type="text/javascript"></script>
<script src="{{ asset('js/datatables/datatables.bootstrap.js') }}"></script>
<script src="{{ asset('js/scripts.js') }}"></script>
</body>
</html>
