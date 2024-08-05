HTML
html
Copy code
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload CSV</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container mt-5">
        <div class="upload-container text-center">
            <input type="file" id="csvFileInput" accept=".csv" style="display:none;">
            <button id="selectFileButton" class="btn btn-primary mb-2">Select CSV</button>
            <button id="uploadButton" class="btn btn-success" disabled>Upload CSV</button>
        </div>
    </div>

    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
CSS (styles.css)
css
Copy code
.upload-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 50px;
}
JavaScript (script.js)
javascript
Copy code
$(document).ready(function() {
    $('#selectFileButton').on('click', function() {
        $('#csvFileInput').click();
    });

    $('#csvFileInput').on('change', function() {
        if (this.files.length > 0) {
            $('#uploadButton').prop('disabled', false);
        }
    });

    $('#uploadButton').on('click', function() {
        var fileInput = $('#csvFileInput')[0];
        var file = fileInput.files[0];

        if (file && file.type === "text/csv") {
            var formData = new FormData();
            formData.append('file', file);

            $.ajax({
                url: 'YOUR_API_ENDPOINT', // Substitua pelo seu endpoint
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(response) {
                    alert('File uploaded successfully');
                },
                error: function(error) {
                    alert('Error uploading file');
                }
            });
        } else {
            alert('Please select a valid CSV file');
        }
    });
});
Explicação
HTML:

Inclui links para o Bootstrap CSS e JS.
Um botão estilizado com Bootstrap (btn btn-primary) que abre a tela de seleção de arquivos ao clicar.
Um botão estilizado com Bootstrap (btn btn-success) para enviar o arquivo, que é inicialmente desabilitado.
CSS:

Estilização básica para centralizar o conteúdo.
JavaScript:

Usa jQuery para ca
