import * as vscode from "vscode"

/**
 * Debug logger that provides consistent logging format across VS Code extension and CLI modes.
 * Uses VS Code output channel in extension mode, console in CLI mode.
 */
export class DebugLogger {
	private static instance: DebugLogger | null = null
	private outputChannel: vscode.OutputChannel | null = null
	private isCliMode: boolean = false

	private constructor() {
		this.isCliMode = process.env.KILO_CLI === "true"

		if (!this.isCliMode) {
			try {
				// Only create output channel if we're actually in VS Code environment
				if (typeof vscode !== "undefined" && vscode.window && vscode.window.createOutputChannel) {
					this.outputChannel = vscode.window.createOutputChannel("Kilo Code Debug")
				} else {
					this.isCliMode = true
				}
			} catch (error) {
				// Fallback to console if VS Code API is not available
				this.isCliMode = true
			}
		}
	}

	static getInstance(): DebugLogger {
		if (!DebugLogger.instance) {
			DebugLogger.instance = new DebugLogger()
		}
		return DebugLogger.instance
	}

	/**
	 * Log with consistent format: 🚀 [Context] Operation: details
	 */
	log(context: string, operation: string, details?: any): void {
		const timestamp = new Date().toISOString()
		const message = `🚀 [${context}] ${operation}${details ? `: ${this.formatDetails(details)}` : ""}`
		const fullMessage = `[${timestamp}] ${message}`

		if (this.isCliMode || !this.outputChannel) {
			console.log(fullMessage)
		} else {
			this.outputChannel.appendLine(fullMessage)
		}
	}

	/**
	 * Log configuration access
	 */
	logConfig(operation: string, configKey: string, value?: any): void {
		// this.log("CONFIG", `${operation} - ${configKey}`, value !== undefined ? { value } : undefined)
	}

	/**
	 * Log permission checks
	 */
	logPermission(operation: string, resource: string, result?: boolean): void {
		// this.log("PERMISSION", `${operation} - ${resource}`, result !== undefined ? { allowed: result } : undefined)
	}

	/**
	 * Log task operations
	 */
	logTask(taskId: string, operation: string, details?: any): void {
		// this.log("TASK", `${taskId} - ${operation}`, details)
	}

	/**
	 * Log tool operations
	 */
	logTool(toolName: string, operation: string, details?: any): void {
		// this.log("TOOL", `${toolName} - ${operation}`, details)
	}

	/**
	 * Log VS Code API calls
	 */
	logVSCodeAPI(apiCall: string, details?: any): void {
		// this.log("VSCODE-API", apiCall, details)
	}

	/**
	 * Log critical decision points
	 */
	logDecision(context: string, decision: string, reasoning?: string): void {
		// this.log("DECISION", `${context} - ${decision}`, reasoning ? { reasoning } : undefined)
	}

	/**
	 * Show the output channel (VS Code only)
	 */
	show(): void {
		if (this.outputChannel && !this.isCliMode) {
			this.outputChannel.show()
		}
	}

	/**
	 * Clear the output channel (VS Code only)
	 */
	clear(): void {
		if (this.outputChannel && !this.isCliMode) {
			this.outputChannel.clear()
		}
	}

	private formatDetails(details: any): string {
		if (typeof details === "string") {
			return details
		}
		if (typeof details === "object" && details !== null) {
			try {
				return JSON.stringify(details, null, 2)
			} catch {
				return String(details)
			}
		}
		return String(details)
	}

	/**
	 * Dispose resources
	 */
	dispose(): void {
		if (this.outputChannel) {
			this.outputChannel.dispose()
			this.outputChannel = null
		}
	}
}

// Convenience functions for easy access
export const debugLogger = DebugLogger.getInstance()

export function logConfig(operation: string, configKey: string, value?: any): void {
	debugLogger.logConfig(operation, configKey, value)
}

export function logPermission(operation: string, resource: string, result?: boolean): void {
	debugLogger.logPermission(operation, resource, result)
}

export function logTask(taskId: string, operation: string, details?: any): void {
	debugLogger.logTask(taskId, operation, details)
}

export function logTool(toolName: string, operation: string, details?: any): void {
	debugLogger.logTool(toolName, operation, details)
}

export function logVSCodeAPI(apiCall: string, details?: any): void {
	debugLogger.logVSCodeAPI(apiCall, details)
}

export function logDecision(context: string, decision: string, reasoning?: string): void {
	debugLogger.logDecision(context, decision, reasoning)
}
