const apiUrl = 'https://restcountries.com/v3.1/all';
const selectPais = document.getElementById('pais');

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        data.sort((a, b) => a.name.common.localeCompare(b.name.common));

        data.forEach(country => {
            const option = document.createElement('option');
            option.value = country.name.common;
            option.textContent = country.name.common;
            selectPais.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Erro ao carregar a lista de países:', error);
    });