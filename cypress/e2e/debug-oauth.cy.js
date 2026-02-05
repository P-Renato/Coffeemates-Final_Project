// cypress/e2e/debug-oauth.cy.js - UPDATED
describe('Debug OAuth Infrastructure', () => {
  beforeEach(() => {
    // Suppress AuthProvider errors
    Cypress.on('uncaught:exception', (err) => {
      if (err.message.includes('useAuth must be used within an AuthProvider')) {
        return false;
      }
      return true;
    });
  });

  it('should debug the entire OAuth stack', () => {
    console.log('=== STARTING OAUTH DEBUG ===');
    
    // Test backend endpoints
    const backendBase = 'https://coffeemates-backend-service.onrender.com';
    
    // 1. Check if debug endpoint exists
    cy.request({
      url: `${backendBase}/api/auth/debug-production`,
      failOnStatusCode: false
    }).then((response) => {
      console.log('\n=== BACKEND DEBUG INFO ===');
      console.log('Status:', response.status);
      if (response.status === 200) {
        console.log('Response:', JSON.stringify(response.body, null, 2));
        
        // Check critical info
        if (response.body.googleConfig) {
          console.log('✅ Google Client ID:', response.body.googleConfig.clientId);
          console.log('✅ Google Callback URL:', response.body.googleConfig.callbackUrl);
        }
        
        if (response.body.database) {
          console.log('✅ Database connected:', response.body.database.connected);
        }
      } else {
        console.log('❌ Debug endpoint failed:', response.status);
      }
    });

    // 2. Check OAuth config
    cy.request({
      url: `${backendBase}/api/auth/config`,
      failOnStatusCode: false
    }).then((response) => {
      console.log('\n=== GOOGLE OAUTH CONFIG ===');
      if (response.status === 200) {
        console.log('Config:', response.body);
        
        // Verify critical config
        const hasClientId = response.body.google?.clientId === '✅ Set';
        const hasClientSecret = response.body.google?.clientSecret === '✅ Set';
        
        console.log('Has Client ID:', hasClientId);
        console.log('Has Client Secret:', hasClientSecret);
        
        if (!hasClientId || !hasClientSecret) {
          console.log('❌ OAuth configuration incomplete!');
        }
      } else {
        console.log('❌ Config endpoint failed:', response.status);
      }
    });

    // 3. Test frontend OAuth page
    console.log('\n=== FRONTEND OAUTH PAGE TEST ===');
    
    cy.visit('https://coffeemates-client.onrender.com/oauth-success', {
      failOnStatusCode: false,
      timeout: 15000
    }).then(() => {
      cy.url().then(url => {
        console.log('OAuthSuccess page URL:', url);
        
        // Check if we got redirected (Render SPA redirect)
        if (url.includes('index.html')) {
          console.log('✅ Render SPA redirect is working');
          console.log('Original path preserved as query params:', url.includes('?'));
        } else if (url.includes('oauth-success')) {
          console.log('✅ Direct access to /oauth-success works');
        }
      });
      
      // Check page content
      cy.get('body').then($body => {
        const text = $body.text();
        console.log('Page content (first 200 chars):', text.substring(0, 200));
        
        if (text.includes('Processing') || text.includes('Login') || text.includes('Redirecting')) {
          console.log('✅ OAuthSuccess page shows appropriate messages');
        }
      });
    });

    // 4. Test OAuth initiation
    console.log('\n=== OAUTH INITIATION TEST ===');
    
    cy.request({
      url: `${backendBase}/api/auth/google`,
      followRedirect: false
    }).then((response) => {
      console.log('OAuth initiation status:', response.status);
      
      if (response.status === 302) {
        const authUrl = response.headers.location;
        console.log('Google Auth URL:', authUrl.substring(0, 150) + '...');
        
        // Parse the URL to check parameters
        try {
          const url = new URL(authUrl);
          const params = url.searchParams;
          
          console.log('OAuth Parameters:');
          console.log('  - Client ID present:', params.has('client_id'));
          console.log('  - Redirect URI:', params.get('redirect_uri'));
          console.log('  - Response type:', params.get('response_type'));
          console.log('  - Scope:', params.get('scope'));
          
          const expectedCallback = 'https://coffeemates-backend-service.onrender.com/api/auth/google/callback';
          const actualCallback = params.get('redirect_uri');
          
          if (actualCallback === expectedCallback) {
            console.log('✅ Callback URL is correct');
          } else {
            console.log(`❌ Callback URL mismatch:`);
            console.log(`   Expected: ${expectedCallback}`);
            console.log(`   Got: ${actualCallback}`);
          }
        } catch (e) {
          console.log('Could not parse Google Auth URL:', e.message);
        }
      } else {
        console.log('❌ OAuth initiation did not redirect to Google');
      }
    });
  });
});