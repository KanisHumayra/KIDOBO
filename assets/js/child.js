document.addEventListener('DOMContentLoaded', function() {
    // Sample data
    const stories = [
        {
            id: 1,
            title: "The Brave Little Turtle",
            cover: "story1-cover.jpg",
            ageGroup: "4-6",
            pages: [
                {
                    image: "story1-page1.jpg",
                    text: "Once upon a time, there was a little turtle named Tommy."
                },
                {
                    image: "story1-page2.jpg",
                    text: "Tommy was smaller than all the other turtles, but he had a big heart."
                },
                {
                    image: "story1-page3.jpg",
                    text: "One day, Tommy saw a baby bird fall from its nest."
                },
                {
                    image: "story1-page4.jpg",
                    text: "Even though he was small, Tommy helped the baby bird get back to its nest."
                },
                {
                    image: "story1-page5.jpg",
                    text: "From that day on, all the animals knew Tommy was the bravest turtle in the pond."
                }
            ]
        },
        {
            id: 2,
            title: "The Magic Paintbrush",
            cover: "story2-cover.jpg",
            ageGroup: "7-8",
            pages: [
                {
                    image: "story2-page1.jpg",
                    text: "Lena loved to draw, but she didn't have any art supplies."
                },
                {
                    image: "story2-page2.jpg",
                    text: "One day, an old woman gave Lena a magic paintbrush."
                },
                {
                    image: "story2-page3.jpg",
                    text: "Everything Lena painted with the brush came to life!"
                },
                {
                    image: "story2-page4.jpg",
                    text: "Lena used the brush to help her village by painting food and tools."
                },
                {
                    image: "story2-page5.jpg",
                    text: "When a greedy king tried to steal the brush, Lena painted a dragon to protect her village."
                }
            ]
        },
        {
            id: 3,
            title: "The Secret of the Old Clock",
            cover: "story3-cover.jpg",
            ageGroup: "9-10",
            pages: [
                {
                    image: "story3-page1.jpg",
                    text: "Jake found an old clock in his grandfather's attic."
                },
                {
                    image: "story3-page2.jpg",
                    text: "When he wound it up, something strange happened - time stopped!"
                },
                {
                    image: "story3-page3.jpg",
                    text: "Jake discovered he could move around while everyone else was frozen."
                },
                {
                    image: "story3-page4.jpg",
                    text: "He used this power to stop a robbery at the bank."
                },
                {
                    image: "story3-page5.jpg",
                    text: "After returning the clock to its place, Jake realized some mysteries are best left unsolved."
                }
            ]
        }
    ];
    
    // DOM Elements
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const ageFilterButtons = document.querySelectorAll('.age-btn');
    const storyGrid = document.querySelector('.story-grid');
    const storyReaderModal = document.getElementById('story-reader');
    const closeReaderButton = document.querySelector('.close-reader');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageIndicator = document.querySelector('.page-indicator');
    const readAloudButton = document.getElementById('read-aloud-btn');
    const bookmarkButton = document.getElementById('bookmark-btn');
    const storyPagesContainer = document.querySelector('.story-pages');
    const storyReaderTitle = document.getElementById('story-reader-title');
    const logoutButton = document.getElementById('logout-btn');
    
    // State variables
    let currentStory = null;
    let currentPageIndex = 0;
    let isReadAloudActive = false;
    let speechSynthesis = window.speechSynthesis;
    
    // Initialize
    loadStories();
    setupEventListeners();
    
    // Functions
    function setupEventListeners() {
        // Navigation buttons
        navButtons.forEach(button => {
            button.addEventListener('click', function() {
                const sectionId = this.getAttribute('data-section');
                showSection(sectionId);
                
                // Update active state
                navButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Age filter buttons
        ageFilterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const ageGroup = this.getAttribute('data-age');
                filterStories(ageGroup);
                
                // Update active state
                ageFilterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Story reader controls
        closeReaderButton.addEventListener('click', closeStoryReader);
        prevPageButton.addEventListener('click', goToPreviousPage);
        nextPageButton.addEventListener('click', goToNextPage);
        readAloudButton.addEventListener('click', toggleReadAloud);
        bookmarkButton.addEventListener('click', toggleBookmark);
        
        // Game cards
        document.querySelectorAll('.game-card').forEach(card => {
            card.addEventListener('click', function() {
                const gameId = this.getAttribute('data-game');
                alert(`Starting ${gameId} game! (This would launch the actual game in a real app)`);
            });
        });
        
        // Logout
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('currentChild');
            window.location.href = 'index.html';
        });
    }
    
    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById(`${sectionId}-section`).classList.add('active');
    }
    
    function loadStories() {
        storyGrid.innerHTML = '';
        
        stories.forEach(story => {
            const storyCard = document.createElement('div');
            storyCard.className = 'story-card';
            storyCard.setAttribute('data-id', story.id);
            storyCard.setAttribute('data-age', story.ageGroup);
            storyCard.innerHTML = `
                <img src="assets/images/stories/${story.cover}" alt="${story.title}">
                <h3>${story.title}</h3>
                <p>Ages ${story.ageGroup}</p>
            `;
            
            storyCard.addEventListener('click', function() {
                openStoryReader(story);
            });
            
            storyGrid.appendChild(storyCard);
        });
    }
    
    function filterStories(ageGroup) {
        const allStoryCards = document.querySelectorAll('.story-card');
        
        allStoryCards.forEach(card => {
            if (ageGroup === 'all' || card.getAttribute('data-age') === ageGroup) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    function openStoryReader(story) {
        currentStory = story;
        currentPageIndex = 0;
        
        // Set story title
        storyReaderTitle.textContent = story.title;
        
        // Load pages
        storyPagesContainer.innerHTML = '';
        story.pages.forEach((page, index) => {
            const pageElement = document.createElement('div');
            pageElement.className = 'story-page';
            if (index === 0) pageElement.classList.add('active');
            
            pageElement.innerHTML = `
                <img src="assets/images/stories/${page.image}" alt="Page ${index + 1}">
                <p>${page.text}</p>
            `;
            
            storyPagesContainer.appendChild(pageElement);
        });
        
        // Update page indicator
        updatePageIndicator();
        
        // Show modal
        storyReaderModal.style.display = 'block';
        
        // Stop any ongoing speech
        if (isReadAloudActive) {
            speechSynthesis.cancel();
            isReadAloudActive = false;
        }
    }
    
    function closeStoryReader() {
        storyReaderModal.style.display = 'none';
        
        // Stop any ongoing speech
        if (isReadAloudActive) {
            speechSynthesis.cancel();
            isReadAloudActive = false;
        }
    }
    
    function updatePageIndicator() {
        const totalPages = currentStory.pages.length;
        pageIndicator.textContent = `Page ${currentPageIndex + 1} of ${totalPages}`;
        
        // Update navigation buttons
        prevPageButton.disabled = currentPageIndex === 0;
        nextPageButton.disabled = currentPageIndex === totalPages - 1;
        
        // Update active page
        document.querySelectorAll('.story-page').forEach((page, index) => {
            page.classList.toggle('active', index === currentPageIndex);
        });
        
        // If read aloud is active, read the new page
        if (isReadAloudActive) {
            readCurrentPage();
        }
    }
    
    function goToPreviousPage() {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            updatePageIndicator();
        }
    }
    
    function goToNextPage() {
        if (currentPageIndex < currentStory.pages.length - 1) {
            currentPageIndex++;
            updatePageIndicator();
        }
    }
    
    function toggleReadAloud() {
        isReadAloudActive = !isReadAloudActive;
        
        if (isReadAloudActive) {
            readAloudButton.classList.add('active');
            readCurrentPage();
        } else {
            speechSynthesis.cancel();
            readAloudButton.classList.remove('active');
        }
    }
    
    function readCurrentPage() {
        if (!isReadAloudActive) return;
        
        const currentPage = currentStory.pages[currentPageIndex];
        const utterance = new SpeechSynthesisUtterance(currentPage.text);
        
        // Set voice properties
        utterance.rate = 0.9; // Slightly slower than normal
        utterance.pitch = 1.2; // Slightly higher pitch for child-friendliness
        
        // Find a child-friendly voice if available
        const voices = speechSynthesis.getVoices();
        const childVoice = voices.find(voice => 
            voice.name.includes('Child') || 
            voice.name.includes('Kids') || 
            voice.name.includes('Young'));
        
        if (childVoice) {
            utterance.voice = childVoice;
        }
        
        utterance.onend = function() {
            // Auto-advance to next page after a short delay
            setTimeout(() => {
                if (currentPageIndex < currentStory.pages.length - 1 && isReadAloudActive) {
                    currentPageIndex++;
                    updatePageIndicator();
                } else if (currentPageIndex === currentStory.pages.length - 1) {
                    isReadAloudActive = false;
                    readAloudButton.classList.remove('active');
                    
                    // Show completion celebration
                    alert('You finished the story! Great job!');
                }
            }, 1000);
        };
        
        speechSynthesis.speak(utterance);
    }
    
    function toggleBookmark() {
        bookmarkButton.classList.toggle('active');
        // In a real app, this would save to localStorage or database
    }
    
    // Load voices when they become available
    speechSynthesis.onvoiceschanged = function() {
        if (isReadAloudActive) {
            readCurrentPage();
        }
    };
});
