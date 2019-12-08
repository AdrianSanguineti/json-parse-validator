'use strict';
import * as vscode from 'vscode';
import * as invalidCharacters from './InvalidCharacters';
import { SUPPORTED_LANGUAGES } from './JsonParseValidatorDiagnostics';
/**
 * A code action provider for providing the quick fix actions for
 * diagnostic objects created by the Json-Parse-Validator extension.
 */
export class JsonParseValidatorQuickFixProvider implements vscode.CodeActionProvider {

  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
  ];

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.CodeAction[] | undefined {
    let actions: vscode.CodeAction[] = [];

    for (const diagnostic of context.diagnostics) {
      const config = invalidCharacters.All.find(config => config.diagnosticCode === diagnostic.code);
      if (config === undefined || config === null) {
        continue;
      }

      config.fixConfig.forEach(config => {
        actions.push(config.createQuickFixAction(document, diagnostic));
      });
    }

    return actions;
  }
}

/**
 * Registers the Quick Fix actions for the JsonParseValidator.
 * @param context The extensions context.
 */
export function registerQuickFixActions(context: vscode.ExtensionContext) {
  const provider = new JsonParseValidatorQuickFixProvider();
  SUPPORTED_LANGUAGES.forEach(selector => {
    context.subscriptions.push(vscode.languages.registerCodeActionsProvider(selector, provider, {
      providedCodeActionKinds: JsonParseValidatorQuickFixProvider.providedCodeActionKinds
    }));
  });

}