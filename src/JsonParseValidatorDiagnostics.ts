'use strict';
import * as vscode from 'vscode';
import {findAll} from './Utilities';
import * as invalidCharacters from './InvalidCharacters';

export const ERROR_SOURCE: string = 'json-parse-validator';
export const CODE_UNEXPECTED_TOKEN: string = 'unexpected-token';
export const SUPPORTED_LANGUAGES:vscode.DocumentSelector[] = [
	{ scheme: 'file', language: 'json' },
	{ scheme: 'untitled', language: 'json' }
];

/**
 * Registers the Json-Parse-Validator to document changes.
 * @param context The extension context.
 */
export function subscribeToDocumentChanges(context: vscode.ExtensionContext): void {
	const diagnostics = vscode.languages.createDiagnosticCollection('json-parse-validator');
	context.subscriptions.push(diagnostics);

    	// Run the validation straight away.
	if (vscode.window.activeTextEditor) {
		updateDiagnostics(vscode.window.activeTextEditor.document, diagnostics);
	}
	
	// Run every time the active text editor is changed.
	context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
		if (editor) {
			updateDiagnostics(editor.document, diagnostics);
		}
	}));

	// Run every time the text is modified in the document.
	context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(editor => {
		if (editor) {
			updateDiagnostics(editor.textEditor.document, diagnostics);
		}
	}));

    let command = vscode.commands.registerCommand('extension.json-parse-validator', () => {

		if (vscode.window.activeTextEditor) {
			updateDiagnostics(vscode.window.activeTextEditor.document, diagnostics, true);
			vscode.window.showInformationMessage('JSON.parse() executed!');
		}
	});
	
	context.subscriptions.push(command);
}

/**
 * Updates the diagnostics information for a document.
 * @param document The document to process.
 * @param collection The DiagnosticCollection to add validation issues to.
 * @param skipLanguageCheck Skips checking whether the document language is json.
 */
function updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection, skipLanguageCheck:boolean = false): void {
	if (document && (skipLanguageCheck || SUPPORTED_LANGUAGES.some(selector => vscode.languages.match(selector, document)))) {
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
 * Finds all invalid characters within a document.
 * @param document The document to search.
 * @returns The diagnostics objects for all instances of non-breaking-whitespaces.
 */
function findAllInvalidCharacters(document: vscode.TextDocument): vscode.Diagnostic[] {
	let diagnostics: vscode.Diagnostic[] = [];

	for (const invalidCharacter of invalidCharacters.All) {
		let ranges = findAll(document, invalidCharacter.unicode);
		diagnostics = diagnostics.concat(ranges.map(range => invalidCharacter.createDiagnostic(range)));	
	}

    return diagnostics;
}

/**
 * Handles error thrown by JSON.parse().
 * @param error The error thron by JSON.parse().
 * @param document The document being processed.
 * @param collection The diagnostic collection.
 */
function handleError(error: Error, document: vscode.TextDocument, collection: vscode.DiagnosticCollection) {
    let diagnostics: vscode.Diagnostic[] = [];
    
    diagnostics = diagnostics.concat(findAllInvalidCharacters(document));

    if (diagnostics.length === 0) {
        // Add a single diagnostic error if the issue couldn't be detected for a supported reason.
		let positionError = parseJsonPositionError(error.message);
		let errorRange = new vscode.Range(document.positionAt(positionError), document.positionAt(positionError));
		collection.set(document.uri, [{
			code: CODE_UNEXPECTED_TOKEN,
			message: error.message,
			range: errorRange,
			severity: vscode.DiagnosticSeverity.Error,
			source: ERROR_SOURCE,
			relatedInformation: []
		}]);
	} else {
        collection.set(document.uri, diagnostics);
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
