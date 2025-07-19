document.addEventListener('DOMContentLoaded', function() {
    // Sample data
    const children = [
        { id: 1, name: "Alex", age: 6, avatar: "avatar1.png", lastActive: "2023-05-15" },
        { id: 2, name: "Sam", age: 8, avatar: "avatar2.png", lastActive: "2023-05-14" }
    ];
    
    const readingActivity = [
        { childId: 1, childName: "Alex", story: "The Brave Little Turtle", date: "2023-05-15", timeSpent: "12 min", quizScore: "80%" },
        { childId: 1, childName: "Alex", story: "The Magic Paintbrush", date: "2023-05-14", timeSpent: "18 min", quizScore: "90%" },
        { childId: 2, childName: "Sam", story: "The Secret of the Old Clock", date: "2023-05-14", timeSpent: "25 min", quizScore: "70%" },
        { childId: 2, childName: "Sam", story: "The Brave Little Turtle", date: "2023-05-13", timeSpent: "15 min", quizScore: "85%" }
    ];
    
    // DOM Elements
    const navButtons = document.querySelectorAll('.parent-nav .nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const childrenList = document.querySelector('.children-list');
    const addChildButton = document.getElementById('add-child-btn');
    const addChildForm = document.getElementById('add-child-form');
    const childForm = document.getElementById('child-form');
    const cancelAddChild = document.getElementById('cancel-add-child');
    const childSelector = document.getElementById('child-selector');
    const timePeriod = document.getElementById('time-period');
    const activityTable = document.getElementById('activity-table');
    const parentSettingsForm = document.getElementById('parent-settings');
    const logoutButton = document.getElementById('parent-logout');
    
    // Initialize
    loadChildren();
    loadActivityTable();
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
        
        // Add child button
        addChildButton.addEventListener('click', function() {
            addChildForm.style.display = 'block';
            addChildButton.style.display = 'none';
        });
        
        // Cancel add child
        cancelAddChild.addEventListener('click', function() {
            addChildForm.style.display = 'none';
            addChildButton.style.display = 'flex';
            childForm.reset();
        });
        
        // Child form submission
        childForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('child-name').value;
            const age = document.getElementById('child-age').value;
            const avatar = document.querySelector('input[name="avatar"]:checked').value;
            
            // In a real app, this would save to the database
            const newChild = {
                id: children.length + 1,
                name,
                age,
                avatar,
                lastActive: new Date().toISOString().split('T')[0]
            };
            
            children.push(newChild);
            loadChildren();
            
            // Reset and hide form
            childForm.reset();
            addChildForm.style.display = 'none';
            addChildButton.style.display = 'flex';
            
            // Show success message
            alert(`${name} has been added successfully!`);
        });
        
        // Child selector change
        childSelector.addEventListener('change', filterActivity);
        
        // Time period change
        timePeriod.addEventListener('change', filterActivity);
        
        // Parent settings form
        parentSettingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newPassword = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            
            if (newPassword && newPassword !== confirmPassword) {
                alert("New passwords don't match!");
                return;
            }
            
            // In a real app, this would update the database
            alert("Settings saved successfully!");
        });
        
        // Logout
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('parentLoggedIn');
            window.location.href = 'index.html';
        });
    }
    
    function showSection(sectionId) {
        contentSections.forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById(`${sectionId}-section`).classList.add('active');
    }
    
    function loadChildren() {
        childrenList.innerHTML = '';
        
        // Update child selector in progress section
        childSelector.innerHTML = '<option value="all">All Children</option>';
        
        children.forEach(child => {
            // Add to children list
            const childCard = document.createElement('div');
            childCard.className = 'child-card';
            childCard.innerHTML = `
                <div class="child-avatar">
                    <img src="assets/images/avatars/${child.avatar}" alt="${child.name}">
                </div>
                <div class="child-info">
                    <h3>${child.name}</h3>
                    <p>Age ${child.age} • Last active: ${child.lastActive}</p>
                </div>
                <div class="child-actions">
                    <button class="edit-child" data-id="${child.id}">
                        <img src="assets/images/edit-icon.png" alt="Edit">
                    </button>
                    <button class="delete-child" data-id="${child.id}">
                        <img src="assets/images/delete-icon.png" alt="Delete">
                    </button>
                </div>
            `;
            
            childrenList.appendChild(childCard);
            
            // Add to child selector
            const option = document.createElement('option');
            option.value = child.id;
            option.textContent = child.name;
            childSelector.appendChild(option);
        });
        
        // Add event listeners to edit/delete buttons
        document.querySelectorAll('.edit-child').forEach(button => {
            button.addEventListener('click', function() {
                const childId = parseInt(this.getAttribute('data-id'));
                editChild(childId);
            });
        });
        
        document.querySelectorAll('.delete-child').forEach(button => {
            button.addEventListener('click', function() {
                const childId = parseInt(this.getAttribute('data-id'));
                deleteChild(childId);
            });
        });
    }
    
    function editChild(childId) {
        const child = children.find(c => c.id === childId);
        if (!child) return;
        
        // Fill the form with child data
        document.getElementById('child-name').value = child.name;
        document.getElementById('child-age').value = child.age;
        document.querySelector(`input[name="avatar"][value="${child.avatar}"]`).checked = true;
        
        // Show the form
        addChildForm.style.display = 'block';
        addChildButton.style.display = 'none';
        
        // In a real app, you'd have a proper edit flow with update instead of add
    }
    
    function deleteChild(childId) {
        if (confirm('Are you sure you want to delete this child profile?')) {
            const index = children.findIndex(c => c.id === childId);
            if (index !== -1) {
                children.splice(index, 1);
                loadChildren();
                filterActivity();
                alert('Child profile deleted successfully.');
            }
        }
    }
    
    function loadActivityTable() {
        activityTable.innerHTML = '';
        
        readingActivity.forEach(activity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${activity.childName}</td>
                <td>${activity.story}</td>
                <td>${activity.date}</td>
                <td>${activity.timeSpent}</td>
                <td>${activity.quizScore}</td>
            `;
            activityTable.appendChild(row);
        });
    }
    
    function filterActivity() {
        const childId = childSelector.value;
        const period = timePeriod.value;
        
        // In a real app, this would filter data from the database
        // Here we're just simulating it with the sample data
        
        let filteredActivity = [...readingActivity];
        
        // Filter by child
        if (childId !== 'all') {
            filteredActivity = filteredActivity.filter(a => a.childId === parseInt(childId));
        }
        
        // Filter by time period (simplified for this example)
        if (period === 'week') {
            // In a real app, you'd compare dates
            filteredActivity = filteredActivity.slice(0, 2); // Just show 2 most recent
        } else if (period === 'month') {
            filteredActivity = filteredActivity.slice(0, 3); // Just show 3 most recent
        }
        
        // Update table
        activityTable.innerHTML = '';
        filteredActivity.forEach(activity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${activity.childName}</td>
                <td>${activity.story}</td>
                <td>${activity.date}</td>
                <td>${activity.timeSpent}</td>
                <td>${activity.quizScore}</td>
            `;
            activityTable.appendChild(row);
        });
    }
    
    // In a real app, you would have functions to render actual charts using a library like Chart.js
    // For this example, we'll just simulate it with placeholder text
    function renderCharts() {
        document.getElementById('stories-chart').innerHTML = '<p>Stories read chart would display here</p>';
        document.getElementById('time-chart').innerHTML = '<p>Reading time chart would display here</p>';
        document.getElementById('scores-chart').innerHTML = '<p>Quiz scores chart would display here</p>';
    }
    
    // Initial chart rendering
    renderCharts();
});
