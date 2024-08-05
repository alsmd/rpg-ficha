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

    <!-- Modal -->
    <div class="modal fade" id="messageModal" tabindex="-1" role="dialog" aria-labelledby="messageModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="messageModalLabel">Message</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body" id="modalMessage">
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                </div>
            </div>
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
                    showModal('Success', 'File uploaded successfully');
                },
                error: function(error) {
                    showModal('Error', 'Error uploading file');
                }
            });
        } else {
            showModal('Error', 'Please select a valid CSV file');
        }
    });

    function showModal(title, message) {
        $('#messageModalLabel').text(title);
        $('#modalMessage').text(message);
        $('#messageModal').modal('show');
    }
});
Explicação
HTML:

Inclui links para Bootstrap CSS e JS.
Adiciona o modal do Bootstrap, que será usado para exibir as mensagens de sucesso ou erro.
CSS:

Estilização básica para centralizar o conteúdo.
JavaScript:

Usa jQuery para capturar o clique no botão "Select CSV" e acionar o clique no input de arquivo oculto.
Habilita o botão de upload quando um arquivo é selecionado.
Envia o arquivo selecionado para a API usando AJAX.
Usa a função showModal para exibir o modal com a mensagem de sucesso ou erro.
Certifique-se de 
