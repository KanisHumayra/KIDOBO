document.addEventListener('DOMContentLoaded', function() {
    // Data
    const stories = [
        {
            id: 1,
            title: "The Brave Little Turtle",
            cover: "story1-cover.jpg",
            ageGroup: "4-6",
            pages: [
                {
                    image: "story1-page1.jpg",
                    text: "Once upon a time, there was a little turtle named Tommy.",
                    audio: "story1-page1.mp3"
                },
                {
                    image: "story1-page2.jpg",
                    text: "Tommy was smaller than all the other turtles, but he had a big heart.",
                    audio: "story1-page2.mp3"
                }
            ]
        }
    ];

    const games = [
        {
            id: "word-match",
            title: "Word Match",
            icon: "word-match-game.png",
            description: "Match pictures to words!",
            words: [
                { word: "cat", image: "cat.png" },
                { word: "dog", image: "dog.png" }
            ]
        },
        {
            id: "spelling-bee",
            title: "Spelling Bee",
            icon: "spelling-game.png",
            description: "Spell the word you hear!",
            words: ["apple", "book"]
        }
    ];

    // DOM Elements
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const storyGrid = document.querySelector('.story-grid');
    const gameGrid = document.querySelector('.game-grid');
    let currentStory = null;
    let currentPageIndex = 0;

    // Initialize
    loadStories();
    loadGames();
    setupEventListeners();

    function setupEventListeners() {
        navButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const section = this.dataset.section;
                showSection(section);
                
                navButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }

    function showSection(sectionId) {
        contentSections.forEach(s => s.classList.remove('active'));
        document.getElementById(`${sectionId}-section`).classList.add('active');
    }

    // Story Functions
    function loadStories() {
        storyGrid.innerHTML = '';
        stories.forEach(story => {
            const storyCard = document.createElement('div');
            storyCard.className = 'story-card';
            storyCard.innerHTML = `
                <img src="assets/images/stories/${story.cover}" alt="${story.title}">
                <h3>${story.title}</h3>
                <p>Ages ${story.ageGroup}</p>
            `;
            storyCard.addEventListener('click', () => openStoryReader(story));
            storyGrid.appendChild(storyCard);
        });
    }

    function openStoryReader(story) {
        currentStory = story;
        currentPageIndex = 0;
        
        const reader = document.createElement('div');
        reader.className = 'story-reader-modal';
        reader.innerHTML = `
            <div class="story-reader-content">
                <button class="close-reader">✕</button>
                <div class="story-header">
                    <h2>${story.title}</h2>
                </div>
                <div class="story-pages"></div>
                <div class="story-navigation">
                    <button class="prev-page">Previous</button>
                    <span class="page-indicator">Page 1 of ${story.pages.length}</span>
                    <button class="next-page">Next</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(reader);
        renderCurrentPage();
        
        reader.querySelector('.close-reader').addEventListener('click', () => {
            reader.remove();
        });
        
        reader.querySelector('.prev-page').addEventListener('click', goToPreviousPage);
        reader.querySelector('.next-page').addEventListener('click', goToNextPage);
    }

    function renderCurrentPage() {
        const page = currentStory.pages[currentPageIndex];
        const pagesContainer = document.querySelector('.story-pages');
        
        pagesContainer.innerHTML = `
            <div class="story-page">
                <img src="assets/images/stories/${page.image}" alt="Page ${currentPageIndex + 1}">
                <p>${page.text}</p>
            </div>
        `;
        
        document.querySelector('.page-indicator').textContent = 
            `Page ${currentPageIndex + 1} of ${currentStory.pages.length}`;
        
        document.querySelector('.prev-page').disabled = currentPageIndex === 0;
        document.querySelector('.next-page').disabled = currentPageIndex === currentStory.pages.length - 1;
    }

    function goToPreviousPage() {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            renderCurrentPage();
        }
    }

    function goToNextPage() {
        if (currentPageIndex < currentStory.pages.length - 1) {
            currentPageIndex++;
            renderCurrentPage();
        } else {
            alert(`You finished "${currentStory.title}"! Great job!`);
        }
    }

    // Game Functions
    function loadGames() {
        gameGrid.innerHTML = '';
        games.forEach(game => {
            const gameCard = document.createElement('div');
            gameCard.className = 'game-card';
            gameCard.dataset.game = game.id;
            gameCard.innerHTML = `
                <img src="assets/images/${game.icon}" alt="${game.title}">
                <h3>${game.title}</h3>
                <p>${game.description}</p>
            `;
            gameCard.addEventListener('click', () => launchGame(game.id));
            gameGrid.appendChild(gameCard);
        });
    }

    function launchGame(gameId) {
        const game = games.find(g => g.id === gameId);
        if (!game) return;
        
        const container = document.createElement('div');
        container.className = 'game-container';
        container.innerHTML = `
            <div class="game-header">
                <h2>${game.title}</h2>
                <button class="close-game">✕</button>
            </div>
            <div class="game-content" id="game-content"></div>
        `;
        
        document.body.appendChild(container);
        container.querySelector('.close-game').addEventListener('click', () => {
            container.remove();
        });
        
        loadGameContent(game, container.querySelector('#game-content'));
    }

    function loadGameContent(game, container) {
        switch(game.id) {
            case 'word-match':
                loadWordMatch(game, container);
                break;
            case 'spelling-bee':
                loadSpellingBee(game, container);
                break;
        }
    }

    function loadWordMatch(game, container) {
        container.innerHTML = `
            <div class="word-match-game">
                <h3>Match the words to pictures!</h3>
                <div class="word-match-grid"></div>
            </div>
        `;
        
        const grid = container.querySelector('.word-match-grid');
        game.words.forEach(item => {
            const card = document.createElement('div');
            card.className = 'match-card';
            card.innerHTML = `<img src="assets/images/${item.image}" alt="${item.word}">`;
            grid.appendChild(card);
            
            const wordCard = document.createElement('div');
            wordCard.className = 'match-card';
            wordCard.textContent = item.word;
            grid.appendChild(wordCard);
        });
    }

    function loadSpellingBee(game, container) {
        container.innerHTML = `
            <div class="spelling-game">
                <h3>Spell the word: <span class="current-word">${game.words[0]}</span></h3>
                <input type="text" class="spelling-input">
                <button class="check-spelling">Check</button>
                <div class="feedback"></div>
            </div>
        `;
    }
});
