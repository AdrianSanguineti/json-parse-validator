import * as vscode from 'vscode';
import * as nls from 'vscode-nls';
const localize = nls.config({ messageFormat: nls.MessageFormat.file })();

export class InvalidCharacterConfig {
    unicode:string;
    diagnosticCode:string;
    message:string;
    fixConfig:InvalidCharacterFixConfig;
    
    constructor(unicode: string, diagnosticCode:string, message: string, fixConfig:InvalidCharacterFixConfig = replaceWithWhiteSpaceAction) {
        this.unicode = unicode;
        this.diagnosticCode = diagnosticCode;
        this.message = message;
        this.fixConfig = fixConfig;
    }
}

export class InvalidCharacterFixConfig {
    replacement:string;
    quickFixText:string;

    constructor(replacement:string, quickFixText:string) {
        this.replacement = replacement;
        this.quickFixText = quickFixText;
    }

    public createQuickFixAction(document: vscode.TextDocument, diagnostic: vscode.Diagnostic): vscode.CodeAction {
        const fix = new vscode.CodeAction(this.quickFixText, vscode.CodeActionKind.QuickFix);
        fix.edit = new vscode.WorkspaceEdit();
        fix.edit.replace(document.uri, new vscode.Range(diagnostic.range.start, diagnostic.range.end.translate(0, this.replacement.length)), this.replacement);
        fix.isPreferred = true;
        return fix;
    }
}

let replaceWithWhiteSpaceAction = new InvalidCharacterFixConfig('\u0020', localize('quickFix.ReplaceWithWhiteSpace',`Replace with whitespace.`));

export let All:InvalidCharacterConfig[] = [
    new InvalidCharacterConfig('\u000C','form-feed', localize('formFeed.text', 'Unexpected form feed character (\\u000C) detected.')),
    new InvalidCharacterConfig('\u0085','next-line', localize('formFeed.text', 'Unexpected next line character (\\u0085) detected.')),
    new InvalidCharacterConfig('\u00A0','nb-whitespace', localize('nbWhitespace.text', 'Unexpected non-breaking space (\\u0040) detected.')),
    new InvalidCharacterConfig('\u2002','en-space', localize('enSpace.text', 'Unexpected en space character (\\u2002) detected.')),
    new InvalidCharacterConfig('\u2003','em-space', localize('emSpace.text', 'Unexpected em space character (\\u2003) detected.')),
    new InvalidCharacterConfig('\u2004','three-per-em-space', localize('threePerEmSpace.text', 'Unexpected three per em space character (\\u2004) detected.')),
    new InvalidCharacterConfig('\u2005','four-per-em-space', localize('fourPerEmSpace.text', 'Unexpected four per em space character (\\u2005) detected.')),
    new InvalidCharacterConfig('\u2006','six-per-em-space', localize('sizPerEmSpace.text', 'Unexpected siz per em space character (\\u2006) detected.')),
    new InvalidCharacterConfig('\u2007','figure-space', localize('figureSpace.text', 'Unexpected figure space character (\\u2007) detected.')),
    new InvalidCharacterConfig('\u2008','punctuation-space', localize('punctuationSpace.text', 'Unexpected punctuation space character (\\u2008) detected.')),
    new InvalidCharacterConfig('\u2009','thin-space', localize('thinSpace.text', 'Unexpected thin space character (\\u2009) detected.')),
    new InvalidCharacterConfig('\u200A','hair-space', localize('hairSpace.text', 'Unexpected hair space character (\\u200A) detected.')),
    new InvalidCharacterConfig('\u202F','narrow-nb-space', localize('narrowNbSpace.text', 'Unexpected narrow no-break space character (\\u202F) detected.')),
    new InvalidCharacterConfig('\u205F','medium-mathematical-space', localize('mediumMathSpace.text', 'Unexpected medium mathematical space character (\\u205F) detected.')),
    new InvalidCharacterConfig('\u3000','ideographic-space', localize('ideographicSpace.text', 'Unexpected ideographic space character (\\u3000) detected.')),
    new InvalidCharacterConfig('\u180E','mongolian-vowel-separator', localize('mongolianVowelSeparator.text', 'Unexpected mongolian vowel separator character (\\u180E) detected.')),
    new InvalidCharacterConfig('\u200B','zero-width-space', localize('zeroWidthSpace.text', 'Unexpected zero width space character (\\u200B) detected.')),
    new InvalidCharacterConfig('\u200C','zero-width-non-joiner', localize('zeroWidthNonJoiner.text', 'Unexpected zero width non-joiner character (\\u200C) detected.')),
    new InvalidCharacterConfig('\u200D','zero-width-joiner', localize('zeroWidthJoinerSpace.text', 'Unexpected zero width joiner character (\\u200D) detected.')),
    new InvalidCharacterConfig('\u2060','word-joiner', localize('wordJoiner.text', 'Unexpected word joiner character (\\u2060) detected.')),
    new InvalidCharacterConfig('\uFEFF','zero-width-nb-space', localize('zeroWidthNbSpace.text', 'Unexpected zero width non-breaking space character (\\uFEFF) detected.')),
];