'use strict';
import * as vscode from 'vscode';
import * as jsonParseValidator from './JsonParseValidatorDiagnostics';
import * as invalidCharacters from './InvalidCharacters';

import * as nls from 'vscode-nls';
const localize = nls.config({ messageFormat: nls.MessageFormat.file })();

export class NbWhitespaceQuickFixProvider implements vscode.CodeActionProvider {

  public static readonly providedCodeActionKinds = [
    vscode.CodeActionKind.QuickFix
  ];

  public provideCodeActions(
    document: vscode.TextDocument,
    range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext,
    token: vscode.CancellationToken
  ): vscode.CodeAction[] | undefined {
    return this.createQuickFixes(document, context.diagnostics);
  }

  private createQuickFixes(document: vscode.TextDocument, diagnostics: ReadonlyArray<vscode.Diagnostic>): vscode.CodeAction[] | undefined  {
    let actions: vscode.CodeAction[] = [];

    for (const diagnostic of diagnostics) {
      const config = invalidCharacters.All.find(config => config.diagnosticCode === diagnostic.code);

      if (config === undefined || config === null) {
        continue;
      }

      actions.push(config.fixConfig.createQuickFixAction(document, diagnostic));
    }

    return actions;
  }
}