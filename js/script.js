const FLICKR_API_KEY = '15786247322ab080d4926abdc12b1e40';
const GROUP_ID = 'u002Fpool'; // Group ID for "Field Guide: Birds of the World"
let birdData = [];

async function fetchBirdData() {
    try {
        const response = await fetch(`https://api.flickr.com/services/rest/?method=flickr.groups.pools.getPhotos&api_key=${FLICKR_API_KEY}&group_id=${GROUP_ID}&per_page=50&format=json&nojsoncallback=1`);
        
        // Check if the response is ok (status 200)
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.statusText}`);
        }

        const data = await response.json();
        
        // Debug: Log data to check structure
        console.log('Fetched data:', data);
        
        if (data.photos && data.photos.photo.length > 0) {
            birdData = data.photos.photo.map(photo => ({
                image_url: `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_w.jpg`,
                title: photo.title || 'Bird'
            }));
            displayRandomImage();
        } else {
            console.error('No photos found in the response data.');
        }
    } catch (error) {
        console.error('Error fetching bird data:', error);
    }
}

function displayRandomImage() {
    try {
        if (birdData.length === 0) {
            throw new Error('No bird data available.');
        }
        const randomIndex = Math.floor(Math.random() * birdData.length);
        const bird = birdData[randomIndex];
        const birdImageElement = document.getElementById('bird-image');
        
        if (birdImageElement) {
            birdImageElement.src = bird.image_url;
            birdImageElement.alt = bird.title;

            // Debug: Log image URL and title
            console.log('Displaying image:', bird.image_url, 'Title:', bird.title);
        } else {
            console.error('No element with id "bird-image" found.');
        }
    } catch (error) {
        console.error('Error displaying image:', error);
    }
}

document.addEventListener('DOMContentLoaded', fetchBirdData);
