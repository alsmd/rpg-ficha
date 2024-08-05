html
Copy code
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload CSV</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="upload-container">
        <input type="file" id="csvFileInput" accept=".csv">
        <button id="uploadButton">Upload CSV</button>
    </div>
    
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
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

input[type="file"] {
    margin-bottom: 10px;
}

button {
    background-color: rgba(132, 113, 241, 0.75);
    border: none;
    padding: .8em 1.2em;
    border-radius: 1.25em;
    color: rgba(255, 255, 255, .75);
    box-shadow: 1px 0 0 gray;
    font-size: 1em;
}

button:hover {
    cursor: pointer;
    background-color: #8471F1;
    font-family: Arial;
}
JavaScript (script.js)
javascript
Copy code
$(document).ready(function() {
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

Um campo de entrada de arquivo (<input type="file">) que aceita apenas arquivos .csv.
Um botão para iniciar o upload do arquivo.
CSS:

Estilização básica para o botão e a entrada de arquivo, baseada no estilo que você forneceu anteriormente.
JavaScript:

Usa jQuery para capturar o clique no botão.
Verifica se um arquivo válido foi selecionado.
Usa FormData para criar uma solicitação de upload de arquivo.
Faz uma requisição AJAX para enviar o arquivo para o
