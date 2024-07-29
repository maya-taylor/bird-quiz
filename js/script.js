const FLICKR_API_KEY = '15786247322ab080d4926abdc12b1e40';
const GROUP_ID = '3853331@N25'; // Group ID for "Field Guide: Birds of the World"
let currentQuestionIndex = 0;
let birdData = [];

async function fetchBirdData() {
    try {
        const response = await fetch(`https://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=${FLICKR_API_KEY}&group_id=${GROUP_ID}&per_page=10&format=json&nojsoncallback=1`);
        const data = await response.json();
        
        // Debug: Log data to check structure
        console.log(data);
        
        if (data.photos && data.photos.photo.length > 0) {
            birdData = data.photos.photo.map(photo => ({
                image_url: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_w.jpg`,
                options: generateOptions(photo),
                correct_answer: photo.title || 'Bird'
            }));
            loadNextQuestion();
        } else {
            console.error('No photos found.');
        }
    } catch (error) {
        console.error('Error fetching bird data:', error);
    }
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
    const birdImageElement = document.getElementById('bird-image');
    
    if (birdImageElement) {
        birdImageElement.src = bird.image_url;
    } else {
        console.error('No element with id "bird-image" found.');
    }
    
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
