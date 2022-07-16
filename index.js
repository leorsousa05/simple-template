import util from 'util';
import prompts from "prompts"
import fs from "fs-extra"
import path from "path";
import copyDir from "copy-dir"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const questions = [
    {
        type: "text",
        name: "projectName",
        message: "Qual o nome do seu projeto?",
        validate: projectName => cwdArchives.map(cwds => projectName === cwds ? "Esse nome já existe" : true)
    },
    {
        type: 'select',
        name: 'project',
        message: 'Escolha um tipo de projeto',
        choices: [
            { title: 'Projeto React', value: 'template-react' },
            { title: 'Projeto Vanilla', value: 'template-vanilla' },
        ]
    }
]

async function init() {
    const cwd = process.cwd()
    const cwdArchives = []
    fs.readdir(cwd, (err, files) => err ? console.log(err) : files.map(file => cwdArchives.push(file)));

    console.log('Você está na pasta: ' + cwd)

    const response = await prompts(questions) // Questions for the user

    const { projectName, project } = response // desestructures the response

    const target = path.join(cwd, projectName)// set the target
    const templateDir = path.resolve( // set the template directory
        fileURLToPath(import.meta.url),
        '..',
        project,
    )
    createFolder(projectName) // create a folder

    
    copyDirectory(templateDir, target, projectName) // copy the directory
};

function createFolder(target) {
    fs.mkdir(target, (err) => console.log(err))
}

function copyDirectory(template, dest, projectName) {
    copyDir(template, dest, (err) => {
        err ? console.error(err) : console.log(`Projeto criado com sucesso! \n Use os comando: \n cd ./${projectName} \n npm i`)
    })
}

init()