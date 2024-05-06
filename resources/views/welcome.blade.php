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
                <li><a href="{{ route('clientes') }}">Clientes</a></li>
                <li><a href="{{ route('items') }}">Items</a></li>
                <li><a href="{{ route('clases') }}">Clases</a></li>
            </ul>
        </nav>

        <div id="content">
            @yield('content')
        </div>
    </div>

    <script src="{{ asset('js/app.js') }}"></script>
</body>
</html>
