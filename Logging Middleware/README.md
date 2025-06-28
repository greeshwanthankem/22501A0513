# Logging Middleware

A reusable logging package that sends logs to the evaluation server.

## Installation

```bash
npm install
```

## Usage

### Basic Usage

```javascript
const { Log } = require('./index');

// Example: Log an error in backend handler
Log("backend", "error", "handler", "received string, expected bool");

// Example: Log info in frontend component
Log("frontend", "info", "component", "user clicked submit button");
```

### Using Convenience Methods

```javascript
const { logger } = require('./index');

// Shorthand methods
logger.error("backend", "controller", "database connection failed");
logger.info("frontend", "api", "user data fetched successfully");
logger.warn("backend", "service", "deprecated function used");
```

## Valid Parameters

### Stack
- `backend`
- `frontend`

### Level
- `debug`
- `info` 
- `warn`
- `error`
- `fatal`

### Package

**Backend Only:**
- `cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service`

**Frontend Only:**
- `api`, `component`, `hook`, `page`, `state`, `style`

**Both:**
- `auth`, `config`, `middleware`, `utils`

## Examples

```javascript
// Backend examples
Log("backend", "error", "db", "connection timeout");
Log("backend", "info", "controller", "user registration successful");

// Frontend examples  
Log("frontend", "warn", "component", "prop validation failed");
Log("frontend", "debug", "state", "updating user preferences");
```
