'use strict';
import * as vscode from 'vscode';

/**
 * Finds all instances of a value within a document.
 * @param document The document to search in.
 * @param value The value to search for.
 */
export function findAll(document: vscode.TextDocument, value: string) : vscode.Range[] {
    let text = document.getText();
	let matches: vscode.Range[] = [];	

	let index = 0;
	let pos = -1;
	while (index !== -1) {
		index = text.indexOf(value, pos + 1);
		if (index >= 0)  {
			let errorRange = new vscode.Range(document.positionAt(index), document.positionAt(index));

			matches.push(errorRange);
		}

		pos = index;
    }
    
    return matches;
}