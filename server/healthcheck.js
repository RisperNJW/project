import http from 'http';

// ======================
// CONFIGURATION
// ======================
const config = {
  host: process.env.HOST || 'localhost',    // Configurable host (for Docker/K8s)
  port: process.env.PORT || 5000,           // Flexible port binding
  path: '/api/health',                      // Health check endpoint
  timeout: parseInt(process.env.TIMEOUT_MS) || 2000,  // Configurable timeout
  maxRetries: parseInt(process.env.MAX_RETRIES) || 3, // Retry attempts
  retryDelay: parseInt(process.env.RETRY_DELAY_MS) || 1000 // Delay between retries
};

// HEALTH CHECK LOGIC
let retries = 0;

function executeHealthCheck() {
  const req = http.request({
    hostname: config.host,
    port: config.port,
    path: config.path,
    method: 'GET',
    timeout: config.timeout
  }, (res) => {
    let responseData = '';

    res.on('data', (chunk) => responseData += chunk);

    res.on('end', () => {
      // Basic status code check
      if (res.statusCode === 200) {

        // Optional: Deep health validation (if API returns JSON)
        if (process.env.VALIDATE_JSON === 'true') {
          try {
            const healthStatus = JSON.parse(responseData);
            if (healthStatus.status === 'healthy') {
              console.log('Health check passed with valid payload');
              process.exit(0);
            } else {
              console.error('API returned unhealthy status');
              handleRetryOrFail();
            }
          } catch (e) {
            console.error('Failed to parse health check response', e);
            handleRetryOrFail();
          }
        } else {
          console.log('Health check passed (200 OK)');
          process.exit(0);
        }

      } else {
        console.error(`Health check failed: HTTP ${res.statusCode}`);
        handleRetryOrFail();
      }
    });
  });

  // ERROR HANDLERS
  req.on('error', (err) => {
    console.error('Health check connection error:', err.message);
    handleRetryOrFail();
  });

  req.on('timeout', () => {
    console.error(`Health check timed out after ${config.timeout}ms`);
    req.destroy(); // Critical: Clean up sockets
    handleRetryOrFail();
  });

  req.end();
}

// RETRY MECHANISM
function handleRetryOrFail() {
  retries++;

  if (retries < config.maxRetries) {
    console.log(`Retry ${retries}/${config.maxRetries} in ${config.retryDelay}ms...`);
    setTimeout(executeHealthCheck, config.retryDelay);
  } else {
    console.error(`Health check failed after ${config.maxRetries} attempts`);
    process.exit(1); // Exit with failure code
  }
}

// EXECUTION
console.log(`Starting health check for ${config.host}:${config.port}${config.path}`);
executeHealthCheck();