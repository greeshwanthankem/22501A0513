// Frontend version using fetch API
const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

const VALID_STACKS = ['backend', 'frontend'];
const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'];

const BACKEND_PACKAGES = ['cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service'];
const FRONTEND_PACKAGES = ['api', 'component', 'hook', 'page', 'state', 'style'];
const SHARED_PACKAGES = ['auth', 'config', 'middleware', 'utils'];

const ALL_PACKAGES = [...BACKEND_PACKAGES, ...FRONTEND_PACKAGES, ...SHARED_PACKAGES];

function validatePackageForStack(stack, packageName) {
    if (stack === 'backend') {
        return BACKEND_PACKAGES.includes(packageName) || SHARED_PACKAGES.includes(packageName);
    } else if (stack === 'frontend') {
        return FRONTEND_PACKAGES.includes(packageName) || SHARED_PACKAGES.includes(packageName);
    }
    return false;
}

export async function Log(stack, level, packageName, message) {
    try {
        if (!VALID_STACKS.includes(stack)) {
            console.error(`Invalid stack: ${stack}`);
            return false;
        }

        if (!VALID_LEVELS.includes(level)) {
            console.error(`Invalid level: ${level}`);
            return false;
        }

        if (!ALL_PACKAGES.includes(packageName)) {
            console.error(`Invalid package: ${packageName}`);
            return false;
        }

        if (!validatePackageForStack(stack, packageName)) {
            console.error(`Package '${packageName}' not allowed for stack '${stack}'`);
            return false;
        }

        if (!message || typeof message !== 'string') {
            console.error('Message must be a non-empty string');
            return false;
        }

        const logData = {
            stack: stack,
            level: level,
            package: packageName,
            message: message
        };

        const response = await fetch(LOG_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(logData)
        });

        if (response.ok) {
            return true;
        } else {
            console.error(`Logging failed with status: ${response.status}`);
            return false;
        }

    } catch (error) {
        console.error('Failed to send log:', error.message);
        console.log(`[${stack}][${level}][${packageName}] ${message}`);
        return false;
    }
}

export const logger = {
    debug: (stack, packageName, message) => Log(stack, 'debug', packageName, message),
    info: (stack, packageName, message) => Log(stack, 'info', packageName, message),
    warn: (stack, packageName, message) => Log(stack, 'warn', packageName, message),
    error: (stack, packageName, message) => Log(stack, 'error', packageName, message),
    fatal: (stack, packageName, message) => Log(stack, 'fatal', packageName, message)
};
