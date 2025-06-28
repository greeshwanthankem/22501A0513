const axios = require('axios');

// API endpoint for logging
const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

// Valid values for validation
const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];

const BACKEND_PACKAGES = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
const FRONTEND_PACKAGES = ['api', 'component', 'hook', 'page', 'state', 'style'];
const SHARED_PACKAGES = ['auth', 'config', 'middleware', 'utils'];

const ALL_PACKAGES = [...BACKEND_PACKAGES, ...FRONTEND_PACKAGES, ...SHARED_PACKAGES];

/**
 * Validates if the package is allowed for the given stack
 */
function validatePackageForStack(stack, packageName) {
    if (stack === 'backend') {
        return BACKEND_PACKAGES.includes(packageName) || SHARED_PACKAGES.includes(packageName);
    } else if (stack === 'frontend') {
        return FRONTEND_PACKAGES.includes(packageName) || SHARED_PACKAGES.includes(packageName);
    }
    return false;
}

/**
 * Main logging function
 * @param {string} stack - Either 'backend' or 'frontend'
 * @param {string} level - Log level: 'debug', 'info', 'warn', 'error', 'fatal'
 * @param {string} package - Package name from allowed list
 * @param {string} message - Log message
 */
async function Log(stack, level, package, message) {
    try {
        // Input validation
        if (!VALID_STACKS.includes(stack)) {
            console.error(`Invalid stack: ${stack}. Must be one of: ${VALID_STACKS.join(', ')}`);
            return false;
        }

        if (!VALID_LEVELS.includes(level)) {
            console.error(`Invalid level: ${level}. Must be one of: ${VALID_LEVELS.join(', ')}`);
            return false;
        }

        if (!ALL_PACKAGES.includes(package)) {
            console.error(`Invalid package: ${package}. Must be one of: ${ALL_PACKAGES.join(', ')}`);
            return false;
        }

        if (!validatePackageForStack(stack, package)) {
            console.error(`Package '${package}' is not allowed for stack '${stack}'`);
            return false;
        }

        if (!message || typeof message !== 'string') {
            console.error('Message must be a non-empty string');
            return false;
        }

        // Prepare request payload
        const logData = {
            stack: stack,
            level: level,
            package: package,
            message: message
        };

        // Make API call
        const response = await axios.post(LOG_API_URL, logData, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000 // 5 second timeout
        });

        if (response.status === 200 || response.status === 201) {
            return true;
        } else {
            console.error(`Logging failed with status: ${response.status}`);
            return false;
        }

    } catch (error) {
        // Fallback to console logging if API fails
        console.error('Failed to send log to server:', error.message);
        console.log(`[${stack}][${level}][${package}] ${message}`);
        return false;
    }
}

// Convenience methods for different log levels
const logger = {
    debug: (stack, package, message) => Log(stack, 'debug', package, message),
    info: (stack, package, message) => Log(stack, 'info', package, message),
    warn: (stack, package, message) => Log(stack, 'warn', package, message),
    error: (stack, package, message) => Log(stack, 'error', package, message),
    fatal: (stack, package, message) => Log(stack, 'fatal', package, message)
};

module.exports = { Log, logger };
