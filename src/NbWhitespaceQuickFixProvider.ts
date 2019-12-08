'use strict';
import * as vscode from 'vscode';
import * as jsonParseValidator from './JsonParseValidatorDiagnostics';

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
    return context.diagnostics
      .filter(this.canQuickFix)
      .map(diagnostic => this.createFix(document, diagnostic));
  }

  private canQuickFix(diagnostic: vscode.Diagnostic): boolean {
    return diagnostic.code === jsonParseValidator.CODE_NB_WHITESPACE;
  }

  private createFix(document: vscode.TextDocument, diagnostic: vscode.Diagnostic): vscode.CodeAction {
    const fix = new vscode.CodeAction(`Replace with whitepace.`, vscode.CodeActionKind.QuickFix);
    fix.edit = new vscode.WorkspaceEdit();
    fix.edit.replace(document.uri, new vscode.Range(diagnostic.range.start, diagnostic.range.end.translate(0, 1)), ' ');
    fix.isPreferred = true;
    return fix;
  }
}