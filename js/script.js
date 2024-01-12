var lastColor = "";
var lastQuote = "";

var colors = [
    {background: '#FF6347', text: '#FFFFFF'},
    {background: '#40E0D0', text: '#000000'},
    {background: '#228B22', text: '#FFFFFF'},
    {background: '#FFD700', text: '#000000'},
    {background: '#4B0082', text: '#FFFFFF'}
];

function newQuote() {
    fetch('https://type.fit/api/quotes')
        .then(response => response.json())
        .then(data => {
            // Verifica se a resposta da API é um array e não está vazia
            if (Array.isArray(data) && data.length > 0) {
                // Seleciona um quote aleatório do array
                const randomIndex = Math.floor(Math.random() * data.length);
                const quote = data[randomIndex];

                // Acessa o texto (text) e o autor (author) do quote
                const text = quote.text;
                // Remove ", type.fit" do autor
                const author = quote.author.replace(", type.fit", "").replace("type.fit", "");

                // Cria a string formatada com texto e autor
                const formattedQuote = author.length === 0 ? text : `${text} - ${author}`;
                
                // Se a citação é a mesma que a última, chama a função newQuote()
                if (formattedQuote === lastQuote) {
                    newQuote();
                    return;
                }
                lastQuote = formattedQuote;

                // Traduz a citação para o português usando a API MyMemory
                fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(formattedQuote) + '&langpair=en|pt-br')
                    .then(response => response.json())
                    .then(data => {
                        const translatedQuote = data.responseData.translatedText;
                        document.getElementById('quote').textContent = translatedQuote;
                    })
                    .catch(error => {
                        console.log('Error:', error);
                    });

                // Restante do seu código para alterar cores etc.
                var color = lastColor;
                while (color === lastColor) {
                    color = colors[Math.floor(Math.random() * colors.length)];
                }
                lastColor = color;
                document.body.style.backgroundColor = color.background;
                document.getElementById('quote').style.color = color.text;
                document.getElementById('button').style.backgroundColor = color.text;
                document.getElementById('button').style.color = color.background;
                document.getElementById('copyButton').style.backgroundColor = color.text;
                document.getElementById('copyButton').style.color = color.background;
            } else {
                console.error('Resposta da API vazia ou em um formato inesperado.');
            }
        })
        .catch(error => {
            console.error('Erro ao acessar a API:', error);
        });
}

document.getElementById('button').addEventListener('click', newQuote);

// Adiciona funcionalidade de cópia ao botão de cópia
document.getElementById('copyButton').addEventListener('click', function() {
    var tempInput = document.createElement('input');
    // tempInput.value = lastQuote;
    tempInput.value = document.getElementById('quote').textContent; // Copia o texto traduzido
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    // Muda o texto do botão para "Copiado"
    this.textContent = "✔ Copiado";

    // Muda o texto do botão de volta para "Copiar" após 3 segundos
    setTimeout(function() {
        document.getElementById('copyButton').textContent = "📎 Copiar";
    }, 3000);
});

// Gera uma nova citação e muda a cor assim que a página é carregada
newQuote();
