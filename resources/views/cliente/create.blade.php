<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crear Cliente</title>
    <!-- Estilos CSS -->
    <style>
        /* Estilos personalizados */
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        h1 {
            color: #333;
            text-align: center;
            margin-top: 30px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            font-weight: bold;
        }
        input[type="text"],
        input[type="password"],
        select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            box-sizing: border-box;
        }
        .row {
            display: flex;
            flex-wrap: wrap;
            margin-right: -15px;
            margin-left: -15px;
        }
        .col-lg-6 {
            flex: 0 0 50%;
            max-width: 50%;
            padding-right: 15px;
            padding-left: 15px;
        }
        .btn {
            display: inline-block;
            font-weight: 400;
            color: #212529;
            text-align: center;
            vertical-align: middle;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            background-color: #f8f9fa;
            border: 1px solid transparent;
            padding: .375rem .75rem;
            font-size: 1rem;
            line-height: 1.5;
            border-radius: .25rem;
            transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
            cursor: pointer;
        }
        .btn-primary {
            color: #fff;
            background-color: #007bff;
            border-color: #007bff;
        }
        .btn-default {
            color: #212529;
            background-color: #f8f9fa;
            border-color: #f8f9fa;
        }
    </style>
</head>
<body>

    <h1>Crear Cliente</h1>

    <form action="" method="POST" id="client-form">
        @csrf

        <section>

            <div class="ibox-content">
                <div class="row">
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="CI">{{ __('CI') }}:</label>
                            <input type="text" name="CI" class="form-control" placeholder="{{ __('CI') }}" autofocus>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="form-group">
                            <label for="Nombre">{{ __('Nombre') }}:</label>
                            <input type="text" name="Nombre" class="form-control" placeholder="{{ __('Nombre') }}">
                        </div>
                    </div>
                    <!-- Agrega aquí los otros campos del cliente -->
                </div>
            </div>
        </section>

        <div class="form-group">
            <button type="submit" class="btn btn-primary">{{ __('Guardar') }}</button>
            <a href="" class="btn btn-default">{{ __('Cancelar') }}</a>
        </div>
    </form>

</body>
</html>
