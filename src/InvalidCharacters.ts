import * as vscode from 'vscode';
import * as nls from 'vscode-nls';
const localize = nls.config({ messageFormat: nls.MessageFormat.file })();

import { ERROR_SOURCE } from './JsonParseValidatorDiagnostics';

/**
 * Represents a configuration item for an invalid character.
 */
export class InvalidCharacterConfiguration {
    /**
     * The character's unicode value as a string.
     */
    unicode: string;

    /**
     * The diagnostic code use to identify this configuration.
     */
    diagnosticCode: string;

    /**
     * The message to display to the user.
     */
    message: string;

    /**
     * The fix configuration.
     */
    fixConfig: QuickFixConfiguration[];

    /**
     * If the configuration is enabled.
     */
    enabled: boolean = true;

    /**
     * Constructs a new instance of the InvalidCharacter class.
     * @param unicode
     * @param diagnosticCode 
     * @param message 
     * @param fixConfig 
     */
    constructor(unicode: string, diagnosticCode: string, message: string, fixConfig: QuickFixConfiguration[] = [replaceWithWhiteSpaceAction, removeAction]) {
        this.unicode = unicode;
        this.diagnosticCode = diagnosticCode;
        this.message = message;
        this.fixConfig = fixConfig;
    }

    /**
     * Creates a new diagnostic object.
     * @param range The text range.
     */
    public createDiagnostic(range: vscode.Range): vscode.Diagnostic {
        var diagnostic = new vscode.Diagnostic(range, this.message, vscode.DiagnosticSeverity.Error);
        diagnostic.code = this.diagnosticCode;
        diagnostic.source = ERROR_SOURCE;
        return diagnostic;
    }
}

/**
 * Represents the configuration for creating a quick fix action.
 */
export class QuickFixConfiguration {
    /**
     * The text to replace the source text with.
     */
    replacement: string;

    /**
     * The text to display for the action.
     */
    ActionText: string;

    /**
     * Constructs a new instance of the QuickFixConfiguration class.
     * @param replacement 
     * @param quickFixText 
     */
    constructor(replacement: string, quickFixText: string) {
        this.replacement = replacement;
        this.ActionText = quickFixText;
    }

    /**
     * Creates a new CodeAction to quick fix the provided document using the diagnostic information with this configuration.
     * @param document The document to fix.
     * @param diagnostic The diagnostic information.
     */
    public createQuickFixAction(document: vscode.TextDocument, diagnostic: vscode.Diagnostic): vscode.CodeAction {
        const fix = new vscode.CodeAction(this.ActionText, vscode.CodeActionKind.QuickFix);
        fix.isPreferred = true;
        fix.diagnostics = [diagnostic];

        fix.edit = new vscode.WorkspaceEdit();
        if (this.replacement === '') {
            fix.edit.delete(document.uri, new vscode.Range(diagnostic.range.start, diagnostic.range.end.translate(0, 1)));
        }
        else {
            fix.edit.replace(document.uri, new vscode.Range(diagnostic.range.start, diagnostic.range.end.translate(0, this.replacement.length)), this.replacement);
        }

        return fix;
    }
}

/**
 * Default replace with normal white space action.
 */
const replaceWithWhiteSpaceAction = new QuickFixConfiguration('\u0020', localize('quickFix.ReplaceWithWhiteSpace', `Replace with normal whitespace (\\u0020) character.`));
const removeAction = new QuickFixConfiguration('', localize('quickFix.Remove', `Remove the character.`));

/**
 * All the characters that results in JSON.parse() thrown a syntax error for.
 */
export const All: ReadonlyArray<InvalidCharacterConfiguration> = [
    new InvalidCharacterConfiguration('\u000C', 'form-feed', localize('formFeed.text', 'Unexpected form feed character (\\u000C) detected.')),
    new InvalidCharacterConfiguration('\u0085', 'next-line', localize('formFeed.text', 'Unexpected next line character (\\u0085) detected.')),
    new InvalidCharacterConfiguration('\u00A0', 'nb-whitespace', localize('nbWhitespace.text', 'Unexpected non-breaking space (\\u0040) detected.')),
    new InvalidCharacterConfiguration('\u2002', 'en-space', localize('enSpace.text', 'Unexpected en space character (\\u2002) detected.')),
    new InvalidCharacterConfiguration('\u2003', 'em-space', localize('emSpace.text', 'Unexpected em space character (\\u2003) detected.')),
    new InvalidCharacterConfiguration('\u2004', 'three-per-em-space', localize('threePerEmSpace.text', 'Unexpected three per em space character (\\u2004) detected.')),
    new InvalidCharacterConfiguration('\u2005', 'four-per-em-space', localize('fourPerEmSpace.text', 'Unexpected four per em space character (\\u2005) detected.')),
    new InvalidCharacterConfiguration('\u2006', 'six-per-em-space', localize('sizPerEmSpace.text', 'Unexpected siz per em space character (\\u2006) detected.')),
    new InvalidCharacterConfiguration('\u2007', 'figure-space', localize('figureSpace.text', 'Unexpected figure space character (\\u2007) detected.')),
    new InvalidCharacterConfiguration('\u2008', 'punctuation-space', localize('punctuationSpace.text', 'Unexpected punctuation space character (\\u2008) detected.')),
    new InvalidCharacterConfiguration('\u2009', 'thin-space', localize('thinSpace.text', 'Unexpected thin space character (\\u2009) detected.')),
    new InvalidCharacterConfiguration('\u200A', 'hair-space', localize('hairSpace.text', 'Unexpected hair space character (\\u200A) detected.')),
    new InvalidCharacterConfiguration('\u202F', 'narrow-nb-space', localize('narrowNbSpace.text', 'Unexpected narrow no-break space character (\\u202F) detected.')),
    new InvalidCharacterConfiguration('\u205F', 'medium-mathematical-space', localize('mediumMathSpace.text', 'Unexpected medium mathematical space character (\\u205F) detected.')),
    new InvalidCharacterConfiguration('\u3000', 'ideographic-space', localize('ideographicSpace.text', 'Unexpected ideographic space character (\\u3000) detected.')),
    new InvalidCharacterConfiguration('\u180E', 'mongolian-vowel-separator', localize('mongolianVowelSeparator.text', 'Unexpected mongolian vowel separator character (\\u180E) detected.')),
    new InvalidCharacterConfiguration('\u200B', 'zero-width-space', localize('zeroWidthSpace.text', 'Unexpected zero width space character (\\u200B) detected.')),
    new InvalidCharacterConfiguration('\u200C', 'zero-width-non-joiner', localize('zeroWidthNonJoiner.text', 'Unexpected zero width non-joiner character (\\u200C) detected.')),
    new InvalidCharacterConfiguration('\u200D', 'zero-width-joiner', localize('zeroWidthJoinerSpace.text', 'Unexpected zero width joiner character (\\u200D) detected.')),
    new InvalidCharacterConfiguration('\u2060', 'word-joiner', localize('wordJoiner.text', 'Unexpected word joiner character (\\u2060) detected.')),
    new InvalidCharacterConfiguration('\uFEFF', 'zero-width-nb-space', localize('zeroWidthNbSpace.text', 'Unexpected zero width non-breaking space character (\\uFEFF) detected.')),
];