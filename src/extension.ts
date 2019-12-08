'use strict';
import * as vscode from 'vscode';

import { subscribeToDocumentChanges } from './JsonParseValidatorDiagnostics';
import { registerQuickFixActions } from './JsonParseValidatorQuickFixProvider';

/**
 * This method is called only once when your extension is activated.
 * @param context The extension context.
 */
export function activate(context: vscode.ExtensionContext) {
	console.log('"json-parse-validator" is now active!');
	subscribeToDocumentChanges(context);
	registerQuickFixActions(context);
}

/**
 * This method is called when your extension is deactivated.
 */
export function deactivate() {
	console.log('"json-parse-validator" has been deactivated');
 }