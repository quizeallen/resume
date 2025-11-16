import express from 'express'
import sql from 'mssql'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Location of Vite build output (dist)
const distDir = path.resolve(__dirname, '../dist')

// Azure SQL Database configuration
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    authentication: { type: 'default' },
    options: {
        encrypt: true,
        // For local development allow trusting server certificate unless in production
        trustServerCertificate: process.env.NODE_ENV === 'production' ? false : true,
        connectTimeout: 30000,
        requestTimeout: 30000,
    },
}

// Connection pool
let pool
let dbReady = false

function getMissingEnvVars() {
    const required = ['DB_USER', 'DB_PASSWORD', 'DB_SERVER', 'DB_NAME']
    return required.filter(k => !process.env[k])
}

// Initialize database connection
async function initializeDb() {
    try {
        pool = new sql.ConnectionPool(dbConfig)
        await pool.connect()
        dbReady = true
        console.log('Connected to Azure SQL Database')
    } catch (err) {
        dbReady = false
        console.error('Database connection error (will continue without DB):', err && err.message)
    }
}

// API Routes - these must come AFTER static files in Express 5
// but we need them to match first, so we'll use a router

const apiRouter = express.Router()

// Health endpoint for diagnostics
apiRouter.get('/health', (req, res) => {
    const missing = getMissingEnvVars()
    res.json({
        nodeEnv: process.env.NODE_ENV || 'development',
        dbReady,
        missingEnvVars: missing,
        msg: dbReady ? 'ok' : 'database not ready',
    })
})

// Get all users
apiRouter.get('/users', async (req, res) => {
    try {
        if (!dbReady) return res.status(503).json({ error: 'Database not ready' })
        const request = pool.request()
        const result = await request.query('SELECT * FROM users')
        res.json(result.recordset)
    } catch (err) {
        console.error('Query error:', err)
        res.status(500).json({ error: err.message })
    }
})

// Create a new user
apiRouter.post('/users', async (req, res) => {
    try {
        // Log incoming request body to aid debugging
        console.log('POST /api/users body:', req.body)
        if (!dbReady) return res.status(503).json({ error: 'Database not ready' })
        const { name, reason } = req.body
        const request = pool.request()
        request.input('name', sql.VarChar(50), name)
        request.input('reason', sql.VarChar(255), reason)

        await request.query('INSERT INTO users (name, reason) VALUES (@name, @reason)')
        res.status(201).json({ message: 'User created successfully' })
    } catch (err) {
        // Log full error for diagnosis (stack, code). In production be careful with sensitive info.
        console.error('Insert error:', err && err.message, err && err.stack)
        // Return a structured error so the frontend can show useful info
        res.status(500).json({ error: err && err.message, code: err && err.code })
    }
})

// Mount API router BEFORE static files
app.use('/api', apiRouter)

// Serve static files from the dist directory
app.use(express.static(distDir))

// Final catch-all: serve index.html for client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
})

// Start server - Azure injects PORT (e.g., 8080)
const PORT = process.env.PORT || 8080
initializeDb().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
})