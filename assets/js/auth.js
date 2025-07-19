document.addEventListener('DOMContentLoaded', function() {
    // Simulated user data (in a real app, this would come from a database)
    const users = {
        child: [
            { id: 1, name: "Alex", age: 6, avatar: "avatar1.png" },
            { id: 2, name: "Sam", age: 8, avatar: "avatar2.png" }
        ],
        parent: [
            { username: "parent1", password: "password1" },
            { username: "parent2", password: "password2" }
        ],
        admin: [
            { username: "admin", password: "admin123" }
        ]
    };
    
    // DOM Elements
    const childLoginBtn = document.getElementById('childLogin');
    const parentLoginBtn = document.getElementById('parentLogin');
    const adminLoginBtn = document.getElementById('adminLogin');
    
    // Event Listeners
    childLoginBtn.addEventListener('click', function() {
        showChildSelection();
    });
    
    parentLoginBtn.addEventListener('click', function() {
        showParentLogin();
    });
    
    adminLoginBtn.addEventListener('click', function() {
        showAdminLogin();
    });
    
    // Functions
    function showChildSelection() {
        const modal = createModal('Select Your Profile');
        const content = document.createElement('div');
        content.className = 'child-profiles';
        
        users.child.forEach(child => {
            const profile = document.createElement('div');
            profile.className = 'child-profile';
            profile.innerHTML = `
                <img src="assets/images/avatars/${child.avatar}" alt="${child.name}">
                <h3>${child.name}</h3>
                <p>Age: ${child.age}</p>
                <button class="btn btn-primary select-child" data-id="${child.id}">Select</button>
            `;
            content.appendChild(profile);
        });
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Add event listeners to select buttons
        document.querySelectorAll('.select-child').forEach(btn => {
            btn.addEventListener('click', function() {
                const childId = this.getAttribute('data-id');
                localStorage.setItem('currentChild', childId);
                window.location.href = 'child.html';
            });
        });
    }
    
    function showParentLogin() {
        const modal = createModal('Parent Login');
        const form = document.createElement('form');
        form.className = 'login-form';
        form.innerHTML = `
            <div class="form-group">
                <label for="parent-username">Username</label>
                <input type="text" id="parent-username" required>
            </div>
            <div class="form-group">
                <label for="parent-password">Password</label>
                <input type="password" id="parent-password" required>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        `;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('parent-username').value;
            const password = document.getElementById('parent-password').value;
            
            const validUser = users.parent.find(user => 
                user.username === username && user.password === password);
            
            if (validUser) {
                localStorage.setItem('parentLoggedIn', 'true');
                window.location.href = 'parent.html';
            } else {
                alert('Invalid username or password');
            }
        });
        
        modal.appendChild(form);
        document.body.appendChild(modal);
    }
    
    function showAdminLogin() {
        const modal = createModal('Admin Login');
        const form = document.createElement('form');
        form.className = 'login-form';
        form.innerHTML = `
            <div class="form-group">
                <label for="admin-username">Username</label>
                <input type="text" id="admin-username" required>
            </div>
            <div class="form-group">
                <label for="admin-password">Password</label>
                <input type="password" id="admin-password" required>
            </div>
            <button type="submit" class="btn btn-primary">Login</button>
        `;
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('admin-username').value;
            const password = document.getElementById('admin-password').value;
            
            const validUser = users.admin.find(user => 
                user.username === username && user.password === password);
            
            if (validUser) {
                localStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'admin.html';
            } else {
                alert('Invalid username or password');
            }
        });
        
        modal.appendChild(form);
        document.body.appendChild(modal);
    }
    
    function createModal(title) {
        // Remove any existing modal
        const existingModal = document.querySelector('.modal');
        if (existingModal) {
            document.body.removeChild(existingModal);
        }
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        
        const modalHeader = document.createElement('div');
        modalHeader.className = 'modal-header';
        modalHeader.innerHTML = `
            <h2>${title}</h2>
            <span class="close-modal">&times;</span>
        `;
        
        modalContent.appendChild(modalHeader);
        modal.appendChild(modalContent);
        
        // Close modal when clicking X or outside
        modalHeader.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        return modalContent;
    }
});
