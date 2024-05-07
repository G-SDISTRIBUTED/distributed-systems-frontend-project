<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>App de Gestión</title>
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
</head>
<body>
    <div class="wrapper">
        <nav id="sidebar">
            <div class="sidebar-header">
                <h3>Menú</h3>
            </div>
            <ul class="list-unstyled components">
                <li class="submenu">
                    <a href="#" data-toggle="collapse" aria-expanded="false">CRUD</a>
                    <ul class="collapse list-unstyled" id="crudSubmenu">
                        <li><a href="{{ route('clientes') }}">Clientes</a></li>
                        <li><a href="{{ route('items') }}">Items</a></li>
                        <li><a href="{{ route('clases') }}">Clases</a></li>
                    </ul>
                </li>
                <li class="submenu">
                    <a href="#" data-toggle="collapse" aria-expanded="false">Servicios</a>
                    <ul class="collapse list-unstyled" id="servicesSubmenu">
                        <li><a href="{{ route('consultas') }}">Consultas</a></li>
                    </ul>
                </li>
            </ul>
        </nav>

        <div id="content">
            @yield('content')
        </div>
    </div>

    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
