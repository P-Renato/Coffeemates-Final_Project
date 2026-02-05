// cypress/e2e/full-oauth-debug.cy.js
describe('Full OAuth Diagnostics', () => {
  it('should diagnose the entire OAuth flow', () => {
    cy.log('=== STARTING FULL OAUTH DIAGNOSTICS ===');
    
    // Test 1: Backend health
    cy.request({
      url: 'https://coffeemates-backend-service.onrender.com/api/auth/health',
      failOnStatusCode: false
    }).then((response) => {
      cy.log('Backend Health:', JSON.stringify(response.body, null, 2));
      expect(response.status).to.equal(200);
      expect(response.body.database.connected).to.be.true;
    });
    
    // Test 2: OAuth configuration
    cy.request('https://coffeemates-backend-service.onrender.com/api/auth/config')
      .then((response) => {
        cy.log('OAuth Config:', JSON.stringify(response.body, null, 2));
        expect(response.body.google.clientId).to.equal('✅ Set');
        expect(response.body.google.clientSecret).to.equal('✅ Set');
      });
    
    // Test 3: Frontend routing
    cy.visit('https://coffeemates-client.onrender.com');
    cy.url().then(url => cy.log(`Frontend loaded at: ${url}`));
    
    // Check if React Router is working
    cy.get('body').then(body => {
      if (body.text().includes('404') || body.text().includes('Not Found')) {
        cy.log('⚠️ Frontend SPA routing not working properly');
      } else {
        cy.log('✅ Frontend SPA appears to be working');
      }
    });
    
    // Test 4: Manual OAuth simulation
    // First, let's see what the OAuth initiation does
    cy.request({
      url: 'https://coffeemates-backend-service.onrender.com/api/auth/google',
      followRedirect: false
    }).then((response) => {
      cy.log(`OAuth initiation status: ${response.status}`);
      if (response.status === 302) {
        const googleAuthUrl = response.headers.location;
        cy.log(`Google Auth URL: ${googleAuthUrl.substring(0, 100)}...`);
        
        // Check if URL is valid
        expect(googleAuthUrl).to.include('accounts.google.com');
        expect(googleAuthUrl).to.include('response_type=code');
        expect(googleAuthUrl).to.include('scope=profile%20email');
        
        // Extract callback URL from Google Auth URL
        const urlParams = new URL(googleAuthUrl).searchParams;
        const redirectUri = urlParams.get('redirect_uri');
        cy.log(`Google expects callback at: ${redirectUri}`);
        
        // Verify callback URL matches our backend
        expect(redirectUri).to.equal('https://coffeemates-backend-service.onrender.com/api/auth/google/callback');
      }
    });
    
    // Test 5: Simulate the full flow
    cy.log('\n=== SIMULATING FULL FLOW ===');
    cy.log('1. User clicks "Login with Google"');
    cy.log('2. Redirects to Google');
    cy.log('3. Google redirects back to backend callback');
    cy.log('4. Backend processes OAuth and redirects to frontend');
    cy.log('5. Frontend handles token and logs user in');
    
    // Since we can't actually complete Google OAuth in Cypress,
    // let's test what happens with a mock callback
    const testCallbackUrl = 'https://coffeemates-backend-service.onrender.com/api/auth/google/callback?code=mock-test-code-123&scope=email%20profile';
    
    cy.request({
      url: testCallbackUrl,
      failOnStatusCode: false
    }).then((response) => {
      cy.log(`Mock callback response: ${response.status}`);
      
      if (response.status === 302) {
        const frontendRedirect = response.headers.location;
        cy.log(`Frontend redirect: ${frontendRedirect}`);
        
        // Should redirect to frontend with token
        expect(frontendRedirect).to.include('coffeemates-client.onrender.com');
        expect(frontendRedirect).to.include('token=');
        expect(frontendRedirect).to.include('user=');
      } else if (response.status === 500) {
        cy.log('❌ Backend callback failing with 500');
        // Try to get error details
        cy.log('Error response:', response.body);
      }
    });
  });
});