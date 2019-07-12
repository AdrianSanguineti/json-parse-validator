# json-parse-validator README

The "json-parse-validtor" extension is meant to be used as the supplement to the in-built JSON language support in VS Code. 

As good as the in-built JSON validator is, I've personally found at times that VS Code shows no errors for the JSON document I am working on, but when the JSON document is used in the target application, it cannot be read. This is often caused by bad character encoding of whitespace characters introduced by cut/paste from outside applications, that are not picked up by the in-built validator. 

Calling `JSON.parse()` on the document often matches the use cases as to when the parse errors occur. Such an example is the [Azure Resource Group Deployment task](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/deploy/azure-resource-group-deployment?view=azure-devops) in Azure Devops, which presently uses the `JSON.parse()` function to validate the provided ARM template before attempting to deploy.

## Features

Validation errors appear within the standard PROBLEMS window:

![Errors appear in PROBLEMS window](/images/diagnosticsExtension.png)

Run `JSON.parse()` on your document on demand:

![JSON.parse() Command](/images/jsonParseCommand.gif)

## Extension Settings

This extension has no settings in v1.0.0.

## Known Issues

1. Only the first error in the JSON document will be displayed. This is a side-affect of the `JSON.parse()` which returns only the first error it encounters.

## Release Notes

### 1.0.0

Initial release of the extension:
 - Automatically parses document when in JSON language mode, and displays error in PROBLEMS window.
 - 'Parse with JSON.parse()' command to parse any open document on demand.
