'use strict';
    mport * as vscode from 'vscode';
    mport {findAll} from './Utilities';
    mport * as invalidCharacters from './InvalidCharacters';
    
    xport const ERROR_SOURCE: string = 'json-parse-validator';
        port const CODE_UNEXPECTED_TOKEN: string = 'unexpected-token';
            ort const SUPPORTED_LANGUAGES:vscode.DocumentSelector[] = [
            scheme: 'file', language: 'json' },
            scheme: 'untitled', language: 'json' }
            
            
                
            Registers the Json-Parse-Validator to document changes.
         @param context The extension context.
        /
            ort function subscribeToDocumentChanges(context: vscode.ExtensionContext): void {
            nst diagnostics = vscode.languages.createDiagnosticCollection('json-parse-validator');
            ntext.subscriptions.push(diagnostics);
            
          	// Run the validation straight away.
        f (vscode.window.activeTextEditor) {
            pdateDiagnostics(vscode.window.activeTextEditor.document, diagnostics);
            
            
             Run every time the active text editor is changed.
            ntext.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
                 (editor) {
                pdateDiagnostics(editor.document, diagnostics);
                
            );
        
        / Run every time the text is modified in the document.
            ntext.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(editor => {
            f (editor) {
            updateDiagnostics(editor.textEditor.document, diagnostics);
            
        ));
        
             let command = vscode.commands.registerCommand('extension.json-parse-validator', () => {
            
            f (vscode.window.activeTextEditor) {
            updateDiagnostics(vscode.window.activeTextEditor.document, diagnostics, true);
            vscode.window.showInformationMessage('JSON.parse() executed!');
                
                
                
            ntext.subscriptions.push(command);
        
        
            
            Updates the diagnostics information for a document.
            @param document The document to process.
            @param collection The DiagnosticCollection to add validation issues to.
         @param skipLanguageCheck Skips checking whether the document language is json.
        /
            ction updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection, skipLanguageCheck:boolean = false): void {
             (document && (skipLanguageCheck || SUPPORTED_LANGUAGES.some(selector => vscode.languages.match(selector, document)))) {
            ry {
                     JSON.parse(document.getText());
                  collection.clear();
              }
                 catch(error) {
                     handleError(error, document, collection);
                 }
            else {
        collection.clear();
        
            
            
            
            Finds all invalid characters within a document.
         @param document The document to search.
         @returns The diagnostics objects for all instances of non-breaking-whitespaces.
            
            ction findAllInvalidCharacters(document: vscode.TextDocument): vscode.Diagnostic[] {
            t diagnostics: vscode.Diagnostic[] = [];
            
            r (const invalidCharacter of invalidCharacters.All) {
                t ranges = findAll(document, invalidCharacter.unicode);
            iagnostics = diagnostics.concat(ranges.map(range => invalidCharacter.createDiagnostic(range)));	
        
        
             return diagnostics;
            
            
            
         Handles error thrown by JSON.parse().
         @param error The error thron by JSON.parse().
            @param document The document being processed.
            @param collection The diagnostic collection.
            
            ction handleError(error: Error, document: vscode.TextDocument, collection: vscode.DiagnosticCollection) {
             let diagnostics: vscode.Diagnostic[] = [];
                
             diagnostics = diagnostics.concat(findAllInvalidCharacters(document));
        
          if (diagnostics.length === 0) {
                 // Add a single diagnostic error if the issue couldn't be detected for a supported reason.
            et positionError = parseJsonPositionError(error.message);
            et errorRange = new vscode.Range(document.positionAt(positionError), document.positionAt(positionError));
            ollection.set(document.uri, [{
        	code: CODE_UNEXPECTED_TOKEN,
        	message: error.message,
            range: errorRange,
            severity: vscode.DiagnosticSeverity.Error,
            source: ERROR_SOURCE,
            relatedInformation: []
            ]);
                lse {
                 collection.set(document.uri, diagnostics);
          }
        
            
            
            Parses a position number returned in the error message text.
            @param errorMessage The error message text from the JSON.parse() function.
        /
        nction parseJsonPositionError(errorMessage: string): number {
            y {
            et pattern = /(JSON at position )(?<position>\d+)$/i;
            et result = pattern.exec(errorMessage);
            
            f (result)	{
                eturn <number>(<any>result).groups.position;
            
        
        atch {
            onsole.error('Failed to parse the position number of the JSON error.');
            
            
            turn 0;
        
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        