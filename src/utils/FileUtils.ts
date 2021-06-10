const path = require('path');
const fs = require('fs');

export const absolutePath = function(relativePath: string): string {
	return path.resolve(process.cwd(), relativePath)
}

export const fileExistsAtRelativePath = function(relativePath: string): boolean {
	return fs.existsSync(absolutePath(relativePath));
}

export const readFileSync = function(relativePath: string): any {
	return fs.readFileSync(absolutePath(relativePath));
}

export const writeFileSync = function(relativePath: string, data: any, options: any): any {
	return fs.writeFileSync(absolutePath(relativePath), data, options);
}
