'use strict';
import * as vscode from 'vscode';

/**
 * This method is called only once when your extension is activated.
 * @param context The extension context.
 */
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "json-parse-validator" is now active!');

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
			vscode.window.showInformationMessage('JSON.parse() executed! See problems windows for validation errors or press F8.');
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
			
			let positionError = parseJsonPositionError(error.message);

			collection.set(document.uri, [{
				code: '',
				message: 'JSON.parse() validation error:' + error.message,
				range: new vscode.Range(document.positionAt(positionError), document.positionAt(positionError)),
				severity: vscode.DiagnosticSeverity.Error,
				source: 'json-parse-validator',
				relatedInformation: []
			}]);
		}
	} else {
		collection.clear();
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