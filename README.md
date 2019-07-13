# json-parse-validator README

The "json-parse-validator" extension is meant to be used as the supplement to the in-built JSON language support in VS Code. 

I've personally found at times that VS Code shows no syntax errors or validation issues for the JSON document that I am working on, but when the JSON document is used in the target application, it cannot be read. This is often caused by bad character encoding of whitespace characters introduced by cut/paste from outside applications, that are not picked up by the in-built validator. 

Most of the time, it's a call to `JSON.parse()` which results in the JSON document being rejected as invalid JSON. Such an example is the [Azure Resource Group Deployment task](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/deploy/azure-resource-group-deployment?view=azure-devops) in Azure Devops, which presently uses the `JSON.parse()` function to validate the provided ARM template before attempting to deploy.

Therefore, this extension was built in order to detect `JSON.parse()` issues as the document is being written.

## Features

Validation errors appear within the standard PROBLEMS window:

![Errors appear in PROBLEMS window](/images/diagnosticsExtension.png)

Run `JSON.parse()` on your document on demand:

![JSON.parse() Command](/images/jsonParseCommand.gif)

## Extension Settings

This extension has no settings in v1.0.0.

## Known Issues

1. Only the first error in the JSON document will be displayed. This is due to the `JSON.parse()` method which returns only the first error it encounters.

## Release Notes

### 1.0.0

Initial release of the extension:
 - Automatically parses document when in JSON language mode, and displays error in PROBLEMS window.
 - 'Parse with JSON.parse()' command to parse any open document on demand.
