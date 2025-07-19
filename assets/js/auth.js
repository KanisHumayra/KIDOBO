document.addEventListener('DOMContentLoaded', function() {
    // Debugging check - verify script is loaded
    console.log("auth.js loaded successfully!");
    
    // Get buttons more safely
    const childLoginBtn = document.getElementById('childLogin');
    const parentLoginBtn = document.getElementById('parentLogin');
    const adminLoginBtn = document.getElementById('adminLogin');
    
    // Debugging - check if buttons are found
    console.log("Child button:", childLoginBtn);
    console.log("Parent button:", parentLoginBtn);
    console.log("Admin button:", adminLoginBtn);
    
    // Check if buttons exist before adding event listeners
    if (childLoginBtn) {
        childLoginBtn.addEventListener('click', function() {
            console.log("Child login clicked!");
            showChildSelection();
        });
    } else {
        console.error("Child login button not found!");
    }
    
    if (parentLoginBtn) {
        parentLoginBtn.addEventListener('click', function() {
            console.log("Parent login clicked!");
            showParentLogin();
        });
    } else {
        console.error("Parent login button not found!");
    }
    
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', function() {
            console.log("Admin login clicked!");
            showAdminLogin();
        });
    } else {
        console.error("Admin login button not found!");
    }
    
    // Modal functions with basic implementations
    function showChildSelection() {
        console.log("Showing child selection modal");
        alert("Child selection modal would appear here!");
        // In your full implementation, this would show the modal
        // window.location.href = 'child.html'; // Uncomment to redirect
    }
    
    function showParentLogin() {
        console.log("Showing parent login modal");
        alert("Parent login modal would appear here!");
        // window.location.href = 'parent.html'; // Uncomment to redirect
    }
    
    function showAdminLogin() {
        console.log("Showing admin login modal");
        alert("Admin login modal would appear here!");
        // window.location.href = 'admin.html'; // Uncomment to redirect
    }
    
    // Create a simple modal (you can replace with your actual modal code)
    function createModal(title) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
        modal.style.display = 'flex';
        modal.style.justifyContent = 'center';
        modal.style.alignItems = 'center';
        modal.style.zIndex = '1000';
        
        const modalContent = document.createElement('div');
        modalContent.style.backgroundColor = 'white';
        modalContent.style.padding = '20px';
        modalContent.style.borderRadius = '10px';
        modalContent.innerHTML = `
            <h2>${title}</h2>
            <p>This is a simple modal implementation</p>
            <button id="close-modal">Close</button>
        `;
        
        modal.appendChild(modalContent);
        document.body.appendChild(modal);
        
        // Add close functionality
        document.getElementById('close-modal').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
        
        return modal;
    }
});