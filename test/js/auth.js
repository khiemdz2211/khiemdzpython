// User management class
class UserManager {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    }

    // Register new user
    register(userData) {
        // Check if email already exists
        if (this.users.find(user => user.email === userData.email)) {
            throw new Error('Email đã được sử dụng');
        }

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            ...userData,
            orders: [],
            cart: []
        };

        this.users.push(newUser);
        this.saveUsers();
        return newUser;
    }

    // Login user
    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        if (!user) {
            throw new Error('Email hoặc mật khẩu không đúng');
        }

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return user;
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
    }

    // Save users to localStorage
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
    }

    // Update user information
    updateUser(userId, userData) {
        const userIndex = this.users.findIndex(u => u.id === userId);
        if (userIndex === -1) throw new Error('Không tìm thấy người dùng');

        this.users[userIndex] = { ...this.users[userIndex], ...userData };
        this.saveUsers();

        if (this.currentUser && this.currentUser.id === userId) {
            this.currentUser = this.users[userIndex];
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }
}

// Initialize UserManager
const userManager = new UserManager();

// Form switching functionality
document.getElementById('showRegister').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
});

document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('registerForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
});

// Handle registration
document.getElementById('register').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const userData = {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value,
            password: document.getElementById('registerPassword').value,
            phone: document.getElementById('registerPhone').value,
            address: document.getElementById('registerAddress').value
        };

        await userManager.register(userData);
        alert('Đăng ký thành công! Vui lòng đăng nhập.');
        document.getElementById('registerForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
    } catch (error) {
        alert(error.message);
    }
});

// Handle login
document.getElementById('login').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    try {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        await userManager.login(email, password);
        window.location.href = 'profile.html';
    } catch (error) {
        alert(error.message);
    }
});

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    if (userManager.currentUser) {
        window.location.href = 'profile.html';
    }
});