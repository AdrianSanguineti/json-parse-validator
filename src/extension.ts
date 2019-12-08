'use strict';
import * as vscode from 'vscode';

import { subscribeToDocumentChanges }  from './JsonParseValidatorDiagnostics';
import * as codeActions from './NbWhitespaceQuickFixProvider';

/**
 * This method is called only once when your extension is activated.
 * @param context The extension context.
 */
export function activate(context: vscode.ExtensionContext) {

	console.log('"json-parse-validator" is now active!');

	const collection = vscode.languages.createDiagnosticCollection('json-parse-validator');
	context.subscriptions.push(collection);

	subscribeToDocumentChanges(context, collection);

	context.subscriptions.push(
		vscode.languages.registerCodeActionsProvider('json', new codeActions.NbWhitespaceQuickFixProvider(), {
			providedCodeActionKinds: codeActions.NbWhitespaceQuickFixProvider.providedCodeActionKinds
		}));

}

/**
 * This method is called when your extension is deactivated.
 */
export function deactivate() {}