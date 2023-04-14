import type { AstroIntegration } from 'astro'
import fs from "fs";
import path from "path";
import prettier from 'prettier';

type FileType = '.html' | '.css';

const getAllFiles = function (dirPath: string, arrayOfFiles: string[] = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(function (file) {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
            arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
        } else {
            arrayOfFiles.push(filePath);
        }
    });

    return arrayOfFiles;
};

const getFileContent = function(filePath: string) {
    return fs.readFileSync(filePath, 'utf8');
};

const formatFile = async (filePath: string, fileType: FileType, options: prettier.Options) => {
    const fileContent = getFileContent(filePath);
    const formattedCode = await prettier.format(fileContent, {
        ...options,
        filepath: filePath,
        parser: fileType.slice(1),
    });

    fs.writeFileSync(filePath, formattedCode);

    console.log(`Formatted ${filePath}`);
};

export default (): AstroIntegration => ({
    name: 'html-css-formatter',
    hooks: {
        "astro:build:done": async ({ dir }) => {
            const allFiles = getAllFiles(dir.pathname);
            let options = await prettier.resolveConfig(dir.pathname, {
                editorconfig: true,
            });

            if(options === null) {
                options = {}
            };

            for (const filePath of allFiles) {
                const fileType = path.extname(filePath) as FileType;
                if (fileType === '.html' || fileType === '.css') {
                    await formatFile(filePath, fileType, options);
                }
            }
        },
    },
})
