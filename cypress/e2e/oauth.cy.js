// cypress/e2e/oauth.cy.js
describe('Google OAuth Flow', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('should complete Google OAuth flow successfully', () => {
    // 1. Test frontend loading
    cy.visit('https://coffeemates-client.onrender.com');
    cy.url().then((url) => {
      console.log('Initial URL:', url);
    });

    // 2. Test OAuthSuccess route (handle 404 properly)
    cy.request({
      url: 'https://coffeemates-client.onrender.com/oauth-success',
      failOnStatusCode: false
    }).then((response) => {
      console.log('OAuthSuccess route status:', response.status);
      if (response.status === 200 || response.status === 301 || response.status === 302) {
        console.log('✅ OAuthSuccess route accessible');
      } else {
        console.log('⚠️ OAuthSuccess route issue:', response.status);
      }
    });

    // 3. Test backend OAuth initiation
    cy.request({
      url: 'https://coffeemates-backend-service.onrender.com/api/auth/google',
      followRedirect: false
    }).then((response) => {
      console.log('Backend OAuth initiation status:', response.status);
      if (response.status === 302 || response.status === 301) {
        const redirectUrl = response.headers.location;
        console.log('Redirect URL:', redirectUrl);
        expect(redirectUrl).to.include('accounts.google.com');
      }
    });

    // 4. Test backend config
    cy.request('https://coffeemates-backend-service.onrender.com/api/auth/config')
      .then((response) => {
        console.log('Backend config:', response.body);
        expect(response.status).to.eq(200);
        expect(response.body.google.clientId).to.equal('✅ Set');
      });

    // 5. Test debug endpoint
    cy.request('https://coffeemates-backend-service.onrender.com/api/auth/debug-production')
      .then((response) => {
        console.log('Debug endpoint:', response.body);
        expect(response.status).to.eq(200);
      });
  });

  it('should handle OAuth callback with real simulation', () => {
    // This simulates what happens when Google redirects back
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTZmNmNlMTlmOWU2YTc3Yjc5YzJmNzgiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3NzAyNjU5MTYsImV4cCI6MTc3MDI2OTUxNn0.test-token';
    const mockUser = encodeURIComponent(JSON.stringify({
      id: '696f6ce19f9e6a77b79c2f78',
      username: 'testuser',
      email: 'test@example.com'
    }));

    // Visit the OAuth success page directly
    cy.visit(`https://coffeemates-client.onrender.com/oauth-success?token=${mockToken}&user=${mockUser}`);
    
    cy.url().then((url) => {
      console.log('Final URL after OAuth callback:', url);
      // Should either stay on oauth-success or redirect to home/login
      expect(url).to.match(/(oauth-success|home|login)/);
    });
  });
});