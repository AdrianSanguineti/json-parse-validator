'use strict';
import * as vscode from 'vscode';
import {findAll} from './Utilities';

export const ERROR_SOURCE: string = 'json-parse-validator';
export const CODE_NB_WHITESPACE: string = 'nb-whitespace';
export const CODE_UNEXPECTED_TOKEN: string = 'unexpected-token';

const nbWhitespace: string = '\u00A0';

export function subscribeToDocumentChanges(context: vscode.ExtensionContext, diagnostics: vscode.DiagnosticCollection): void {
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

    let disposable = vscode.commands.registerCommand('extension.json-parse-validator', () => {
		
		if (vscode.window.activeTextEditor) {
			updateDiagnostics(vscode.window.activeTextEditor.document, diagnostics, true);
			vscode.window.showInformationMessage('JSON.parse() executed!');
		}
	});
	
	context.subscriptions.push(disposable);
}

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
 * Checks if the error message has indicated that an unexpected non-breaking whitespace
 * character was found.
 * @param errorMessage The error message string.
 */
function containsNbWhitespace(errorMessage: string) : boolean {
	// Example error:
	// Unexpected token   in JSON at position 38
	return errorMessage.indexOf(nbWhitespace) > 0;
}

/**
 * Finds all non-breaking whitespaces within a document.
 * @param document The document to search.
 * @returns The diagnostics objects for all instances of non-breaking-whitespaces.
 */
function findAllNbWhitespace(document: vscode.TextDocument): vscode.Diagnostic[] {
    let ranges = findAll(document, nbWhitespace);
    let diagnostics = ranges.map(range => createDiagnostic('Unexpected non-breaking space (\\u0040) detected.', range));
    return diagnostics;
}

/**
 * Creates a new diagnostic object.
 * @param message The message to display.
 * @param range The text range.
 */
function createDiagnostic(message: string, range: vscode.Range) : vscode.Diagnostic {
    var diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
    diagnostic.code = CODE_NB_WHITESPACE;
    diagnostic.source = ERROR_SOURCE;
    return diagnostic;
}

/**
 * Handles error thrown by JSON.parse().
 * @param error The error thron by JSON.parse().
 * @param document The document being processed.
 * @param collection The diagnostic collection.
 */
function handleError(error: Error, document: vscode.TextDocument, collection: vscode.DiagnosticCollection) {
    let diagnostics: vscode.Diagnostic[] = [];
    
    diagnostics = diagnostics.concat(findAllNbWhitespace(document));

    if (diagnostics.length === 0) {
        // Add a single diagnostic error if the issue couldn't be detected.
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
