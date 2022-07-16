import util from 'util';
import prompts from "prompts"
import fs from "fs-extra"
import path from "path";
import copyDir from "copy-dir"
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cwd = process.cwd()

const questions = [
    {
        type: "text",
        name: "projectName",
        message: "Qual o nome do seu projeto?",
        validate: value => value.length === 0 ? `Escolha um nome` : true 
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
    console.log('Você está na pasta: ' + cwd)
    let result = {}

    try {
        result = await prompts(questions) // Questions for the user
    } catch(cancelled) {
        console.log("Operação cancelada:", cancelled)
        return
    }

    const { projectName, project } = result // desestructures the response

    const target = path.join(cwd, projectName)// set the target
    const templateDir = path.resolve( // set the template directory
        fileURLToPath(import.meta.url),
        '..',
        project,
    )
    const existsFolder = createFolder(projectName, projectName) // create a folder

    !existsFolder && copyDirectory(templateDir, target, projectName) // copy the directory
};

function createFolder(target, projectName) {
    let dirExists = false;
    fs.readdir(cwd, (err, files) => {
        const allFiles = files
        const file = allFiles.filter(theFile => theFile === projectName);
        let dirs = false;
        if(file.length === 0) {
            fs.mkdir(projectName)
            console.log("Pasta criada com sucesso!")
            dirExists = true
        } else {
            console.log("Pasta já existe")
            dirExists = false
        }   
    })
    return dirExists
}


function copyDirectory(template, dest, projectName) {
    copyDir(template, dest, (err) => {
        err ? console.error(err) : console.log(`Projeto criado com sucesso! \n Use os comando: \n cd ./${projectName} \n npm i`)
    })
}

init()