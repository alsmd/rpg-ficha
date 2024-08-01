body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4; /* Cor de fundo neutra para contraste */
}

h1 {
    color: #ff6600; /* Tom laranja para o título */
    text-align: center;
    margin-top: 20px;
}

input[type="text"], input[type="file"], button {
    margin: 10px;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
}

input[type="text"] {
    width: calc(100% - 22px); /* Ajuste para largura total menos padding e border */
    max-width: 300px; /* Limita a largura máxima */
}

button {
    background-color: #ff6600; /* Laranja para o fundo dos botões */
    color: white;
    border: none;
    cursor: pointer;
}

button:hover {
    background-color: #e65c00; /* Tom mais escuro de laranja para hover */
}

#graph {
    width: 100vw;
    height: 80vh;
    border: 1px solid #ddd;
    margin: 0 auto;
    padding: 0;
    overflow: hidden;
    background-color: white; /* Cor de fundo para o gráfico */
}

.modal {
    display: none; /* Hidden by default */
    position: fixed; 
    z-index: 1; 
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto; 
    background-color: rgba(0,0,0,0.4); 
    padding-top: 60px;
}

.modal-content {
    background-color: #fff;
    margin: 5% auto; 
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 80%; 
}

.close {
    color: #ff6600;
    float: right;
    font-size: 28px;
    font-weight: bold;
}

.close:hover,
.close:focus {
    color: #e65c00;
    text-decoration: none;
    cursor: pointer;
}

input[type="file"] {
    font-size: 14px; /* Ajuste o tamanho da fonte para o input de arquivo */
}
