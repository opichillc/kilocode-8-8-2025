// This file provides a complete vscode module mock for testing
import { VSCodeAPI } from "./api/VSCodeAPI"
import { FileSystemAdapter } from "./adapters/FileSystemAdapter"
import { UserInterfaceAdapter } from "./adapters/UserInterfaceAdapter"
import { EventEmitter } from "events"

// Create a minimal mock setup for testing without full CLI provider
const fileSystemAdapter = new FileSystemAdapter(process.cwd())
const userInterfaceAdapter = new UserInterfaceAdapter()
const vscodeAPI = new VSCodeAPI(fileSystemAdapter, userInterfaceAdapter)

// Export all VS Code APIs
export const workspace = vscodeAPI.workspace
export const window = vscodeAPI.window
export const commands = vscodeAPI.commands
export const languages = vscodeAPI.languages
export const env = vscodeAPI.env

// Export classes
export const Uri = VSCodeAPI.Uri
export const Disposable = VSCodeAPI.Disposable
export const RelativePattern = VSCodeAPI.RelativePattern

// Export Node.js EventEmitter for Task class compatibility
export { EventEmitter }

// Export enums and constants
export enum FileType {
	Unknown = 0,
	File = 1,
	Directory = 2,
	SymbolicLink = 64,
}

export enum EndOfLine {
	LF = 1,
	CRLF = 2,
}

export enum StatusBarAlignment {
	Left = 1,
	Right = 2,
}

export enum ViewColumn {
	Active = -1,
	Beside = -2,
	One = 1,
	Two = 2,
	Three = 3,
	Four = 4,
	Five = 5,
	Six = 6,
	Seven = 7,
	Eight = 8,
	Nine = 9,
}

export enum ProgressLocation {
	SourceControl = 1,
	Window = 10,
	Notification = 15,
}

export enum UIKind {
	Desktop = 1,
	Web = 2,
}

// Export extension context creator
export function createExtensionContext() {
	return vscodeAPI.createExtensionContext()
}

// Default export for compatibility
export default {
	workspace,
	window,
	commands,
	languages,
	env,
	Uri,
	Disposable,
	RelativePattern,
	EventEmitter,
	FileType,
	EndOfLine,
	StatusBarAlignment,
	ViewColumn,
	ProgressLocation,
	UIKind,
	createExtensionContext,
}
