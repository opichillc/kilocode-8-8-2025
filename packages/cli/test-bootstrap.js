#!/usr/bin/env node

console.log("Starting CLI bootstrap test...")

async function testBootstrap() {
    try {
        console.log("1. Importing bootstrap...")
        const { initializeCLI } = require('./src/bootstrap.ts')

        console.log("2. Initializing CLI environment...")
        const result = await initializeCLI({
            workingDirectory: process.cwd()
        })

        console.log("3. CLI environment initialized successfully!")
        console.log("Mock context created:", !!result.mockContext)
        console.log("CLI provider created:", !!result.cliProvider)

        console.log("4. Testing basic VS Code API access...")
        const vscode = global.vscode
        console.log("Global vscode object:", !!vscode)
        console.log("Workspace folders:", vscode?.workspace?.workspaceFolders?.length || 0)

        console.log("5. Testing TelemetryService...")
        const { TelemetryService } = require('@roo-code/telemetry')
        console.log("TelemetryService has instance:", TelemetryService.hasInstance())

        console.log("✅ Bootstrap test completed successfully!")
        process.exit(0)

    } catch (error) {
        console.error("❌ Bootstrap test failed:", error.message)
        console.error("Stack:", error.stack)
        process.exit(1)
    }
}

testBootstrap()