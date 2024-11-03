const searchBtn1 = document.getElementById('search-btn1');
const searchBtn2 = document.getElementById('search-btn2');
const searchInput = document.getElementById('search-input');
const wordOutput = document.getElementById('word');
const definitionOutput = document.getElementById('definition');


const apiKey = '9c5919a965mshd51b96f3f870486p1ef889jsn9c14e6d10b37';
const apiHost = 'dictionary-by-api-ninjas.p.rapidapi.com';


const fetchDictionaryData = async (query) => {
    try {
        const response = await fetch(`https://${apiHost}/v1/dictionary?word=${query}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': apiHost
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.definition) {
            wordOutput.textContent = "Meaning of : " + data.word;
            definitionOutput.textContent = data.definition;
        } else {
            wordOutput.textContent = 'No Results Found';
            definitionOutput.textContent = 'Please try searching for another word.';
        }
    } catch (error) {
        console.error('Fetch Error:', error);
        wordOutput.textContent = 'Error';
        definitionOutput.textContent = 'Unable to fetch definition. Please try again later.';
    }
};


searchBtn1.addEventListener('click', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (query) {
        fetchDictionaryData(query);
    } else {
        wordOutput.textContent = 'Input Required';
        definitionOutput.textContent = 'Please enter a word to search.';
    }
});
searchBtn2.addEventListener('click', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (query) {
        fetchDictionaryData(query);
    } else {
        wordOutput.textContent = 'Input Required';
        definitionOutput.textContent = 'Please enter a word to search.';
    }
});