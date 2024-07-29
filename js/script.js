const FLICKR_API_KEY = 'YOUR_FLICKR_API_KEY';
const GROUP_ID = '3853331@N25'; // Group ID for "Field Guide: Birds of the World"
let currentQuestionIndex = 0;
let birdData = [];

async function fetchBirdData() {
    const response = await fetch(`https://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=${FLICKR_API_KEY}&group_id=${GROUP_ID}&per_page=10&format=json&nojsoncallback=1`);
    const data = await response.json();
    birdData = data.photos.photo.map(photo => ({
        image_url: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_w.jpg`,
        options: generateOptions(photo),
        correct_answer: photo.title || 'Bird'
    }));
    loadNextQuestion();
}

function generateOptions(photo) {
    const options = [photo.title || 'Bird', "Option 2", "Option 3", "Option 4"];
    return shuffleArray(options);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadNextQuestion() {
    if (currentQuestionIndex >= birdData.length) {
        alert('Quiz Completed!');
        return;
    }
    
    const bird = birdData[currentQuestionIndex];
    document.getElementById('bird-image').src = bird.image_url;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    bird.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => checkAnswer(option, bird.correct_answer);
        optionsContainer.appendChild(button);
    });
    
    currentQuestionIndex++;
}

function checkAnswer(selectedOption, correctAnswer) {
    if (selectedOption === correctAnswer) {
        alert('Correct!');
    } else {
        alert('Wrong!');
    }
}

document.addEventListener('DOMContentLoaded', fetchBirdData);
