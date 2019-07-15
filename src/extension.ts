'use strict';
import * as vscode from 'vscode';

const errorSource: string = 'json-parse-validator';

/**
 * This method is called only once when your extension is activated.
 * @param context The extension context.
 */
export function activate(context: vscode.ExtensionContext) {

	console.log('"json-parse-validator" is now active!');

	const collection = vscode.languages.createDiagnosticCollection('test');

	// Run the validation straight away.
	if (vscode.window.activeTextEditor) {
		updateDiagnostics(vscode.window.activeTextEditor.document, collection);
	}
	
	// Run every time the active text editor is changed.
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
			updateDiagnostics(editor.document, collection);
		}
	}));

	// Run every time the text is modified in the document.
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(editor => {
		if (editor) {
			updateDiagnostics(editor.textEditor.document, collection);
		}
	}));

	let disposable = vscode.commands.registerCommand('extension.json-parse-validator', () => {
		
		if (vscode.window.activeTextEditor) {
			updateDiagnostics(vscode.window.activeTextEditor.document, collection, true);
			vscode.window.showInformationMessage('JSON.parse() executed!');
		}
	});
	
	context.subscriptions.push(disposable);
}

/**
 * This method is called when your extension is deactivated.
 */
export function deactivate() {}

/**
 * Updates the diagnostics information for a document.
 * @param document The document to process.
 * @param collection The DiagnosticCollection to add validation issues to.
 * @param skipLanguageCheck Skips checking whether the document language is json.
 */
function updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection, skipLanguageCheck:boolean = false): void {
	if (document && (skipLanguageCheck || vscode.languages.match('json', document))) {
		try {
			JSON.parse(document.getText());
			collection.clear();
		}
		catch(error) {
			handleError(error, document, collection);
		}
	} else {
		collection.clear();
	}
}

/**
 * Handles error thrown by JSON.parse().
 * @param error The error thron by JSON.parse().
 * @param document The document being processed.
 * @param collection The diagnostic collection.
 */
function handleError(error: Error, document: vscode.TextDocument, collection: vscode.DiagnosticCollection) {
	let positionError = parseJsonPositionError(error.message);
	let errorRange = new vscode.Range(document.positionAt(positionError), document.positionAt(positionError));

	if (containsNoBreakWhitespace(error.message)) {
		collection.set(document.uri, [{
			code: 'unexpected-nbsp',
			message: 'Unexpected non-breaking space (\\u0040) detected.',
			range: errorRange,
			severity: vscode.DiagnosticSeverity.Error,
			source: errorSource,
			relatedInformation: []
		}]);
	}
	else {
		collection.set(document.uri, [{
			code: 'unexpected-token',
			message: error.message,
			range: errorRange,
			severity: vscode.DiagnosticSeverity.Error,
			source: errorSource,
			relatedInformation: []
		}]);
	}
}

/**
 * Parses a position number returned in the error message text.
 * @param errorMessage The error message text from the JSON.parse() function.
 */
function parseJsonPositionError(errorMessage: string): number {
	try {
		let pattern = /(JSON at position )(?<position>\d+)$/i;
		let result = pattern.exec(errorMessage);

		if (result)	{
			return <number>(<any>result).groups.position;
		}
	}
	catch {
		console.error('Failed to parse the position number of the JSON error.');
	}

	return 0;
}

/**
 * Checks if the error message has indicated that an unexpected non-breaking whitespace
 * character was found.
 * @param errorMessage The error message string.
 */
function containsNoBreakWhitespace(errorMessage: string) : boolean {
	// Example error:
	// Unexpected token   in JSON at position 38
	return errorMessage.indexOf('\u00A0') > 0;
}