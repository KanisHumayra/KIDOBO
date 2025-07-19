document.addEventListener('DOMContentLoaded', function() {
    // Sample data
    const stories = [
        {
            id: 1,
            title: "The Brave Little Turtle",
            ageGroup: "4-6",
            cover: "story1-cover.jpg",
            pages: [
                { image: "story1-page1.jpg", text: "Once upon a time, there was a little turtle named Tommy." },
                { image: "story1-page2.jpg", text: "Tommy was smaller than all the other turtles, but he had a big heart." }
            ]
        },
        {
            id: 2,
            title: "The Magic Paintbrush",
            ageGroup: "7-8",
            cover: "story2-cover.jpg",
            pages: [
                { image: "story2-page1.jpg", text: "Lena loved to draw, but she didn't have any art supplies." },
                { image: "story2-page2.jpg", text: "One day, an old woman gave Lena a magic paintbrush." }
            ]
        }
    ];
    
    const parents = [
        { id: 1, name: "Sarah Johnson", email: "sarah@example.com", children: 2, lastActive: "2023-05-15" },
        { id: 2, name: "Michael Brown", email: "michael@example.com", children: 1, lastActive: "2023-05-14" }
    ];
    
    const children = [
        { id: 1, name: "Alex Johnson", age: 6, parent: "Sarah Johnson", lastActive: "2023-05-15" },
        { id: 2, name: "Sam Johnson", age: 8, parent: "Sarah Johnson", lastActive: "2023-05-14" },
        { id: 3, name: "Emma Brown", age: 5, parent: "Michael Brown", lastActive: "2023-05-13" }
    ];
    
    // DOM Elements
    const navButtons = document.querySelectorAll('.admin-nav .nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const storiesList = document.querySelector('.stories-list');
    const addStoryButton = document.getElementById('add-story-btn');
    const storyFormModal = document.getElementById('story-form');
    const storyForm = document.getElementById('story-form-data');
    const closeModalButton = document.querySelector('.close-modal');
    const cancelStoryButton = document.getElementById('cancel-story');
    const pagesContainer = document.getElementById('pages-container');
    const addPageButton = document.getElementById('add-page-btn');
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const parentsTab = document.getElementById('parents-tab');
    const childrenTab = document.getElementById('children-tab');
    const parentsList = parentsTab.querySelector('.users-list');
    const childrenList = childrenTab.querySelector('.users-list');
    const reportType = document.getElementById('report-type');
    const reportPeriod = document.getElementById('report-period');
    const generateReportButton = document.getElementById('generate-report');
    const exportReportButton = document.getElementById('export-report');
    const reportChart = document.getElementById('report-chart');
    const reportData = document.getElementById('report-data');
    const logoutButton = document.getElementById('admin-logout');
    
    // State variables
    let isEditing = false;
    let currentStoryId = null;
    
    // Initialize
    loadStories();
    loadParents();
    loadChildren();
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
        
        // Add story button
        addStoryButton.addEventListener('click', function() {
            isEditing = false;
            currentStoryId = null;
            document.getElementById('form-title').textContent = 'Add New Story';
            storyForm.reset();
            pagesContainer.innerHTML = '';
            document.getElementById('cover-preview').innerHTML = '';
            storyFormModal.style.display = 'block';
        });
        
        // Close modal
        closeModalButton.addEventListener('click', closeModal);
        cancelStoryButton.addEventListener('click', closeModal);
        
        // Story form submission
        storyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const title = document.getElementById('story-title').value;
            const ageGroup = document.getElementById('story-age-group').value;
            const coverFile = document.getElementById('story-cover').files[0];
            
            // Get pages data
            const pages = [];
            document.querySelectorAll('.page-item').forEach(pageItem => {
                const pageImageFile = pageItem.querySelector('input[type="file"]').files[0];
                const pageText = pageItem.querySelector('textarea').value;
                
                if (pageText) {
                    pages.push({
                        image: pageImageFile ? pageImageFile.name : '',
                        text: pageText
                    });
                }
            });
            
            if (isEditing) {
                // Update existing story
                const storyIndex = stories.findIndex(s => s.id === currentStoryId);
                if (storyIndex !== -1) {
                    stories[storyIndex] = {
                        ...stories[storyIndex],
                        title,
                        ageGroup,
                        cover: coverFile ? coverFile.name : stories[storyIndex].cover,
                        pages
                    };
                }
            } else {
                // Add new story
                const newStory = {
                    id: stories.length + 1,
                    title,
                    ageGroup,
                    cover: coverFile ? coverFile.name : 'default-cover.jpg',
                    pages
                };
                stories.push(newStory);
            }
            
            // In a real app, you would upload files to a server here
            
            loadStories();
            closeModal();
            alert(`Story "${title}" saved successfully!`);
        });
        
        // Cover image preview
        document.getElementById('story-cover').addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('cover-preview');
                    preview.innerHTML = `<img src="${e.target.result}" alt="Cover Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
        
        // Add page button
        addPageButton.addEventListener('click', addPage);
        
        // Tab buttons
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                showTab(tabId);
                
                // Update active state
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
        // Report generation
        generateReportButton.addEventListener('click', generateReport);
        exportReportButton.addEventListener('click', exportReport);
        
        // Logout
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
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
        storiesList.innerHTML = '';
        
        if (stories.length === 0) {
            storiesList.innerHTML = '<p class="no-stories">No stories found. Add your first story!</p>';
            return;
        }
        
        stories.forEach(story => {
            const storyItem = document.createElement('div');
            storyItem.className = 'story-item';
            storyItem.innerHTML = `
                <img src="assets/images/stories/${story.cover}" alt="${story.title}" class="story-cover">
                <div class="story-info">
                    <h3>${story.title}</h3>
                    <p>Ages ${story.ageGroup} • ${story.pages.length} pages</p>
                </div>
                <div class="story-actions">
                    <button class="edit-story" data-id="${story.id}">
                        <img src="assets/images/edit-icon.png" alt="Edit">
                    </button>
                    <button class="delete-story" data-id="${story.id}">
                        <img src="assets/images/delete-icon.png" alt="Delete">
                    </button>
                </div>
            `;
            
            storiesList.appendChild(storyItem);
        });
        
        // Add event listeners to edit/delete buttons
        document.querySelectorAll('.edit-story').forEach(button => {
            button.addEventListener('click', function() {
                const storyId = parseInt(this.getAttribute('data-id'));
                editStory(storyId);
            });
        });
        
        document.querySelectorAll('.delete-story').forEach(button => {
            button.addEventListener('click', function() {
                const storyId = parseInt(this.getAttribute('data-id'));
                deleteStory(storyId);
            });
        });
    }
    
    function editStory(storyId) {
        const story = stories.find(s => s.id === storyId);
        if (!story) return;
        
        isEditing = true;
        currentStoryId = storyId;
        document.getElementById('form-title').textContent = 'Edit Story';
        
        // Fill the form with story data
        document.getElementById('story-id').value = story.id;
        document.getElementById('story-title').value = story.title;
        document.getElementById('story-age-group').value = story.ageGroup;
        
        // Set cover preview
        const coverPreview = document.getElementById('cover-preview');
        coverPreview.innerHTML = `<img src="assets/images/stories/${story.cover}" alt="Cover Preview">`;
        
        // Load pages
        pagesContainer.innerHTML = '';
        story.pages.forEach(page => {
            addPage(page);
        });
        
        // Show the modal
        storyFormModal.style.display = 'block';
    }
    
    function deleteStory(storyId) {
        if (confirm('Are you sure you want to delete this story? This cannot be undone.')) {
            const index = stories.findIndex(s => s.id === storyId);
            if (index !== -1) {
                stories.splice(index, 1);
                loadStories();
                alert('Story deleted successfully.');
            }
        }
    }
    
    function addPage(pageData = { image: '', text: '' }) {
        const pageId = Date.now(); // Unique ID for the page
        const pageItem = document.createElement('div');
        pageItem.className = 'page-item';
        pageItem.innerHTML = `
            <input type="file" accept="image/*" class="page-image">
            <textarea placeholder="Page text...">${pageData.text || ''}</textarea>
            <div class="page-actions">
                <button type="button" class="move-up" title="Move up">
                    <img src="assets/images/up-arrow.png" alt="Up">
                </button>
                <button type="button" class="move-down" title="Move down">
                    <img src="assets/images/down-arrow.png" alt="Down">
                </button>
                <button type="button" class="delete-page" title="Delete page">
                    <img src="assets/images/delete-icon.png" alt="Delete">
                </button>
            </div>
        `;
        
        // If editing and page has an image, show preview
        if (pageData.image && isEditing) {
            const imageInput = pageItem.querySelector('.page-image');
            imageInput.nextElementSibling.textContent = pageData.image;
        }
        
        pagesContainer.appendChild(pageItem);
        
        // Add event listeners to page actions
        pageItem.querySelector('.move-up').addEventListener('click', function() {
            const prev = pageItem.previousElementSibling;
            if (prev) {
                pagesContainer.insertBefore(pageItem, prev);
            }
        });
        
        pageItem.querySelector('.move-down').addEventListener('click', function() {
            const next = pageItem.nextElementSibling;
            if (next) {
                pagesContainer.insertBefore(next, pageItem);
            }
        });
        
        pageItem.querySelector('.delete-page').addEventListener('click', function() {
            if (confirm('Delete this page?')) {
                pageItem.remove();
            }
        });
    }
    
    function closeModal() {
        storyFormModal.style.display = 'none';
    }
    
    function loadParents() {
        parentsList.innerHTML = '';
        
        parents.forEach(parent => {
            const parentItem = document.createElement('div');
            parentItem.className = 'user-item';
            parentItem.innerHTML = `
                <img src="assets/images/parent-avatar.png" alt="${parent.name}" class="user-avatar">
                <div class="user-info">
                    <h3>${parent.name}</h3>
                    <p>${parent.email} • ${parent.children} child${parent.children !== 1 ? 'ren' : ''}</p>
                </div>
                <div class="user-actions">
                    <button class="edit-user" data-id="${parent.id}">
                        <img src="assets/images/edit-icon.png" alt="Edit">
                    </button>
                    <button class="delete-user" data-id="${parent.id}">
                        <img src="assets/images/delete-icon.png" alt="Delete">
                    </button>
                </div>
            `;
            
            parentsList.appendChild(parentItem);
        });
        
        // Add event listeners to edit/delete buttons
        document.querySelectorAll('.edit-user').forEach(button => {
            button.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                editUser(userId, 'parent');
            });
        });
        
        document.querySelectorAll('.delete-user').forEach(button => {
            button.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                deleteUser(userId, 'parent');
            });
        });
    }
    
    function loadChildren() {
        childrenList.innerHTML = '';
        
        children.forEach(child => {
            const childItem = document.createElement('div');
            childItem.className = 'user-item';
            childItem.innerHTML = `
                <img src="assets/images/avatars/avatar${child.id % 4 + 1}.png" alt="${child.name}" class="user-avatar">
                <div class="user-info">
                    <h3>${child.name}</h3>
                    <p>Age ${child.age} • Parent: ${child.parent}</p>
                </div>
                <div class="user-actions">
                    <button class="edit-user" data-id="${child.id}">
                        <img src="assets/images/edit-icon.png" alt="Edit">
                    </button>
                    <button class="delete-user" data-id="${child.id}">
                        <img src="assets/images/delete-icon.png" alt="Delete">
                    </button>
                </div>
            `;
            
            childrenList.appendChild(childItem);
        });
        
        // Add event listeners to edit/delete buttons
        document.querySelectorAll('.edit-user').forEach(button => {
            button.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                editUser(userId, 'child');
            });
        });
        
        document.querySelectorAll('.delete-user').forEach(button => {
            button.addEventListener('click', function() {
                const userId = parseInt(this.getAttribute('data-id'));
                deleteUser(userId, 'child');
            });
        });
    }
    
    function showTab(tabId) {
        tabContents.forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }
    
    function editUser(userId, userType) {
        // In a real app, this would open a form to edit the user
        alert(`Editing ${userType} with ID ${userId}`);
    }
    
    function deleteUser(userId, userType) {
        if (confirm(`Are you sure you want to delete this ${userType}?`)) {
            // In a real app, this would delete from the database
            alert(`${userType} with ID ${userId} deleted successfully.`);
            
            // Update the UI
            if (userType === 'parent') {
                const index = parents.findIndex(p => p.id === userId);
                if (index !== -1) {
                    parents.splice(index, 1);
                    loadParents();
                }
            } else {
                const index = children.findIndex(c => c.id === userId);
                if (index !== -1) {
                    children.splice(index, 1);
                    loadChildren();
                }
            }
        }
    }
    
    function generateReport() {
        const type = reportType.value;
        const period = reportPeriod.value;
        
        // In a real app, this would fetch data from the server
        // For this example, we'll just simulate it
        
        reportChart.innerHTML = `<p>${type} report for ${period} would display here</p>`;
        
        // Simulate report data
        reportData.innerHTML = '';
        const metrics = [
            { name: "Total Active Users", value: "142", change: "+12% from last period" },
            { name: "Stories Read", value: "387", change: "+23% from last period" },
            { name: "Average Reading Time", value: "14.5 min", change: "+2.3 min from last period" },
            { name: "Quiz Completion Rate", value: "78%", change: "+5% from last period" }
        ];
        
        metrics.forEach(metric => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${metric.name}</td>
                <td>${metric.value}</td>
                <td>${metric.change}</td>
            `;
            reportData.appendChild(row);
        });
    }
    
    function exportReport() {
        // In a real app, this would generate and download a CSV file
        alert("Report exported to CSV successfully!");
    }
});
