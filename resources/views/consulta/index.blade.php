<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consulta de Estado</title>
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>

<body>
    <div class="container">
        <div class="form-container">
            <div class="title">
                <h1>Consultar Estado del Servicio</h1>
            </div>
            <form id="tokenForm">
                @csrf
                <div class="form-group">
                    <label for="token">Token:</label>
                    <input type="text" name="token" id="token" class="form-control" placeholder="Ingrese su token aquí">
                </div>
                <button type="button" class="btn btn-primary" onclick="consultarDatos()">Consultar</button>
            </form>
        </div>
        <div id="resultados" class="resultados">
            <!-- Los resultados de la consulta se mostrarán aquí -->
        </div>
    </div>

    <script>
        function consultarDatos() {
            const token = document.getElementById('token').value;
            const url = `http://127.0.0.1:8000/api/servicios/status/${token}`;
            fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error de solicitud');
                    }
                    return response.json();
                })
                .then(data => {
                    const resultados = document.getElementById('resultados');
                    resultados.innerHTML = '';
                    if (data.status === 'success' && data.data) {
                        resultados.innerHTML = `<div>Estado: ${data.data.status}</div>` +
                            `<div>ID: ${data.data.id}</div>` +
                            `<div>Token: ${data.data.token}</div>` +
                            `<div>Creado en: ${data.data.created_at}</div>` +
                            `<div>Actualizado en: ${data.data.updated_at}</div>`;
                    } else {
                        let errorMessage = data.message || "No se encontraron datos o token inválido.";
                        resultados.innerHTML = `<div>${errorMessage}</div>`;
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    document.getElementById('resultados').innerHTML = `<div>Error: ${error.message}</div>`;
                });
        }
    </script>
</body>

</html>