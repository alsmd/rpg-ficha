/* Estilização do modal */
.modal-content {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    width: 80%; 
    max-width: 600px; /* Limita a largura máxima do modal */
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    position: relative; /* Para posicionar o botão de fechar corretamente */
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
    margin-bottom: 10px;
}

.modal-header h2 {
    margin: 0;
    color: #ff6600; /* Cor laranja para o título no modal */
}

.modal-body {
    font-size: 14px; /* Tamanho da fonte para o corpo do modal */
    color: #333; /* Cor de texto escuro para contraste */
    line-height: 1.6; /* Espaçamento entre linhas */
}

.modal-body p {
    margin: 0;
    padding: 5px 0;
}

.modal-body strong {
    color: #ff6600; /* Destaque em laranja para nomes de campos */
}

/* Estilização do botão de fechar */
.close {
    color: #ff6600;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
}

.close:hover,
.close:focus {
    color: #e65c00; /* Tom mais escuro de laranja para o hover */
    text-decoration: none;
}

.modal-content {
    overflow: auto; /* Permite rolagem se o conteúdo for muito longo */
}
