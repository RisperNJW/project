const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const axios = require('axios');
const os = require('os');

// Custom format for logs
const logFormat = printf(({ level, message, timestamp, ...metadata }) => {
  return `${timestamp} [${level.toUpperCase()}] ${message} ${Object.keys(metadata).length ? JSON.stringify(metadata, null, 2) : ''}`;
});

// Create logger instance
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' })
  ]
});

// System monitoring
class SystemMonitor {
  constructor() {
    this.metrics = {
      startTime: Date.now(),
      requests: 0,
      errors: 0,
      responseTimes: []
    };
  }

  trackRequest(req, res, time) {
    this.metrics.requests++;
    this.metrics.responseTimes.push(time);
    
    // Keep only last 1000 response times
    if (this.metrics.responseTimes.length > 1000) {
      this.metrics.responseTimes.shift();
    }
    
    // Log slow requests
    if (time > 1000) { // 1 second
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.originalUrl,
        time: `${time}ms`,
        user: req.user?.id || 'anonymous'
      });
    }
  }

  trackError(error, req) {
    this.metrics.errors++;
    
    logger.error(error.message, {
      stack: error.stack,
      method: req?.method,
      url: req?.originalUrl,
      user: req?.user?.id || 'anonymous',
      timestamp: new Date().toISOString()
    });
    
    // Send critical errors to admin
    if (error.statusCode >= 500) {
      this.alertAdmin(error);
    }
  }

  async alertAdmin(error) {
    try {
      await axios.post(process.env.SLACK_WEBHOOK_URL, {
        text: `🚨 Critical Error Alert: ${error.message}\n\`\`\`${error.stack}\`\`\``
      });
    } catch (err) {
      console.error('Failed to send alert:', err);
    }
  }

  getMetrics() {
    const responseTimes = this.metrics.responseTimes;
    const avgResponseTime = responseTimes.length > 0 
      ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length) 
      : 0;

    return {
      uptime: process.uptime(),
      timestamp: Date.now(),
      system: {
        platform: os.platform(),
        load: os.loadavg(),
        memory: process.memoryUsage(),
        cpu: os.cpus().length,
        freeMemory: os.freemem(),
        totalMemory: os.totalmem()
      },
      metrics: {
        requests: this.metrics.requests,
        errors: this.metrics.errors,
        avgResponseTime: `${avgResponseTime}ms`,
        responseTimePercentiles: {
          p50: this.percentile(50),
          p90: this.percentile(90),
          p99: this.percentile(99)
        }
      }
    };
  }

  percentile(p) {
    const responseTimes = [...this.metrics.responseTimes].sort((a, b) => a - b);
    if (responseTimes.length === 0) return 0;
    
    const index = Math.ceil(p / 100 * responseTimes.length) - 1;
    return responseTimes[Math.max(0, index)];
  }
}

// Create singleton instance
const monitor = new SystemMonitor();

// Middleware to track requests
const monitorMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    monitor.trackRequest(req, res, duration);
    
    // Log request details
    logger.info(`${req.method} ${req.originalUrl}`, {
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      user: req.user?.id || 'anonymous'
    });
  });
  
  next();
};

module.exports = {
  logger,
  monitor,
  monitorMiddleware
};
