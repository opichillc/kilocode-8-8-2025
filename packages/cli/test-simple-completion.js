#!/usr/bin/env node

console.log("Testing simple API completion...")

async function testSimpleCompletion() {
    try {
        console.log("1. Setting up environment...")

        // Set API key from environment
        if (!process.env.ANTHROPIC_API_KEY) {
            console.log("❌ No ANTHROPIC_API_KEY found in environment")
            console.log("Please set: export ANTHROPIC_API_KEY=your_key_here")
            process.exit(1)
        }

        console.log("2. Importing Anthropic SDK...")
        const { Anthropic } = require('@anthropic-ai/sdk')

        console.log("3. Creating Anthropic client...")
        const anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
        })

        console.log("4. Making simple completion request...")
        const message = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 100,
            messages: [{
                role: "user",
                content: "Say hello and confirm you can respond. Keep it brief."
            }]
        })

        console.log("✅ API completion successful!")
        console.log("Response:", message.content[0].text)

        process.exit(0)

    } catch (error) {
        console.error("❌ API completion failed:", error.message)
        if (error.status) {
            console.error("Status:", error.status)
        }
        if (error.error) {
            console.error("Error details:", error.error)
        }
        process.exit(1)
    }
}

testSimpleCompletion()