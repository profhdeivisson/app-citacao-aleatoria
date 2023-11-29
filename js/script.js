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
    fetch('https://api.quotable.io/random')
        .then(response => response.json())
        .then(data => {
            var quote = `${data.content} - ${data.author}`;
            if (quote === lastQuote) {
                newQuote();
                return;
            }
            lastQuote = quote;

            // Traduz a citação para o português usando a API MyMemory
            fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(quote) + '&langpair=en|pt-br')
                .then(response => response.json())
                .then(data => {
                    var translatedQuote = data.responseData.translatedText;
                    document.getElementById('quote').textContent = translatedQuote;
                })
                .catch(error => {
                    console.log('Error:', error);
                });

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
        })
        .catch(error => {
            console.log('Error:', error);
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
