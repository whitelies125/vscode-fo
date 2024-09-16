// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "helloworld-minimal-sample" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.fo', async () => {
		// The code you place here will be executed every time your command is executed
        // 生成候选命令
        const commands = getCommandSuggestions();
        // 显示候选命令供用户选择
        const selectedCommand = await vscode.window.showQuickPick(commands, {
            placeHolder: 'Select a command'
        });
        if (!selectedCommand) {
            return
        }
        const filename = selectedCommand.file;
        const line = selectedCommand.line;

        // 获取当前工作区文件夹
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('please open a workspace folder first.');
            return;
        }
        //  生成文件对应的Uri
        const uri = vscode.Uri.file(`${workspaceFolders[0].uri.fsPath}/${filename}`);
        try {
            // 打开文件
            const document = await vscode.workspace.openTextDocument(uri);
            await vscode.window.showTextDocument(document);
            // 跳转到行号，实际行号 = 显示行号 - 1
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                const position = new vscode.Position(line-1, 0); // 行 10，列 0
                editor.selection = new vscode.Selection(position, position);
                editor.revealRange(new vscode.Range(position, position));
            }
        } catch (error) {
            vscode.window.showErrorMessage(`can not open file: ${filename}: ${error.message}`);
        }
	});

	context.subscriptions.push(disposable);
}

// 生成候选命令列表
function getCommandSuggestions() {
    const allCommands = [
        { label: 'main', file: 'src/main.cpp', line : '5' },
        { label: 'package', file: 'package.json', line: '10'},
        { label: 'rrc resume', file: 'extension.command3', line: '1'},
        { label: 'init context setup', file: 'extension.command3', line: '1'}
    ];

    return allCommands;
}

// this method is called when your extension is deactivated
function deactivate() {}

// eslint-disable-next-line no-undef
module.exports = {
	activate,
	deactivate
}
