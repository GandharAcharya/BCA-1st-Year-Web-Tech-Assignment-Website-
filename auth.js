// Minimal auth.js for testing
window.authManager = {
    isLoggedIn: () => true,
    getCurrentUser: () => ({ userId: 'test-user-123', name: 'Test User' })
};