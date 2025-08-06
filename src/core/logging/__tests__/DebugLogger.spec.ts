import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { DebugLogger, logConfig, logTask, logTool, logVSCodeAPI, logPermission } from "../DebugLogger"

describe("DebugLogger", () => {
	let consoleSpy: any
	let originalEnv: string | undefined

	beforeEach(() => {
		consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {})
		originalEnv = process.env.KILO_CLI
	})

	afterEach(() => {
		consoleSpy.mockRestore()
		process.env.KILO_CLI = originalEnv
		// Reset singleton instance
		;(DebugLogger as any).instance = null
	})

	describe("CLI Mode", () => {
		beforeEach(() => {
			process.env.KILO_CLI = "true"
		})

		it("should log to console in CLI mode", () => {
			const logger = DebugLogger.getInstance()
			logger.log("TEST", "operation", "details")

			expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/\[.*\] 🚀 \[TEST\] operation: details/))
		})

		it("should log configuration access", () => {
			logConfig("get", "test.setting", "value")

			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringMatching(/🚀 \[CONFIG\] get - test\.setting: {"value":"value"}/),
			)
		})

		it("should log task operations", () => {
			logTask("task-123", "start", { hasProvider: true })

			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringMatching(/🚀 \[TASK\] task-123 - start: {"hasProvider":true}/),
			)
		})

		it("should log tool operations", () => {
			logTool("readFile", "execute", { path: "/test/file.txt" })

			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringMatching(/🚀 \[TOOL\] readFile - execute: {"path":"\/test\/file\.txt"}/),
			)
		})

		it("should log VS Code API calls", () => {
			logVSCodeAPI("workspace.getConfiguration", { section: "test" })

			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringMatching(/🚀 \[VSCODE-API\] workspace\.getConfiguration: {"section":"test"}/),
			)
		})

		it("should log permission checks", () => {
			logPermission("file-read", "/test/file.txt", true)

			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringMatching(/🚀 \[PERMISSION\] file-read - \/test\/file\.txt: {"allowed":true}/),
			)
		})
	})

	describe("VS Code Mode", () => {
		beforeEach(() => {
			process.env.KILO_CLI = "false"
		})

		it("should create output channel in VS Code mode", () => {
			// Mock VS Code API
			const mockOutputChannel = {
				appendLine: vi.fn(),
				show: vi.fn(),
				clear: vi.fn(),
				dispose: vi.fn(),
			}

			// Mock vscode.window.createOutputChannel
			vi.doMock("vscode", () => ({
				window: {
					createOutputChannel: vi.fn().mockReturnValue(mockOutputChannel),
				},
			}))

			const logger = DebugLogger.getInstance()
			logger.log("TEST", "operation", "details")

			// Should not log to console in VS Code mode
			expect(consoleSpy).not.toHaveBeenCalled()
		})
	})

	describe("Logging Format", () => {
		beforeEach(() => {
			process.env.KILO_CLI = "true"
		})

		it("should format details as JSON", () => {
			const logger = DebugLogger.getInstance()
			logger.log("TEST", "operation", { key: "value", number: 42 })

			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringMatching(/🚀 \[TEST\] operation: {\s*"key": "value",\s*"number": 42\s*}/),
			)
		})

		it("should handle string details", () => {
			const logger = DebugLogger.getInstance()
			logger.log("TEST", "operation", "simple string")

			expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/🚀 \[TEST\] operation: simple string/))
		})

		it("should handle undefined details", () => {
			const logger = DebugLogger.getInstance()
			logger.log("TEST", "operation")

			expect(consoleSpy).toHaveBeenCalledWith(expect.stringMatching(/🚀 \[TEST\] operation$/))
		})
	})

	describe("Singleton Pattern", () => {
		it("should return the same instance", () => {
			const logger1 = DebugLogger.getInstance()
			const logger2 = DebugLogger.getInstance()

			expect(logger1).toBe(logger2)
		})
	})
})
