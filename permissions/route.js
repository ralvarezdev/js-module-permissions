import path from 'path'

// Errors that can be thrown by this class
export const METHOD_NOT_DEFINED_ERROR = new Error("Method name not defined")
export const OBJECT_NOT_DEFINED_ERROR = new Error("Object name not defined")
export const BASE_DIR_NOT_DEFINED_ERROR = new Error("Base directory not defined")
export const SCRIPT_NOT_DEFINED_ERROR = new Error("Script name not defined")

// Route represents a module permission path in the file system
export default class Route {
    #baseDir
    #modulesName
    #scriptName
    #objectName
    #methodName

    // Route constructor
    constructor(baseDir, scriptName, objectName, methodName, ...modulesName) {
        // Check if the base directory, script name, object name, and method name are defined
        if (!baseDir)
            throw BASE_DIR_NOT_DEFINED_ERROR;
        if (!scriptName)
            throw SCRIPT_NOT_DEFINED_ERROR;
        if (!objectName)
            throw OBJECT_NOT_DEFINED_ERROR;
        if (!methodName)
            throw METHOD_NOT_DEFINED_ERROR;

        // Set the base directory, script name, modules name, object name, and method name
        this.#baseDir = baseDir;
        this.#scriptName = scriptName;
        this.#modulesName = modulesName;
        this.#objectName = objectName
        this.#methodName = methodName;
    }

    // Check if it has a nested module
    hasNestedModule() {
        return this.#modulesName.length > 0;
    }

    // Get the modules name
    get modulesName() {
        return this.#modulesName;
    }

    // Get the base directory
    get baseDir() {
        return this.#baseDir;
    }

    // Get the script name
    get scriptName() {
        return this.#scriptName;
    }

    // Get the object name
    get objectName() {
        return this.#objectName;
    }

    // Get the method name
    get methodName() {
        return this.#methodName;
    }

    // Get the script path
    get path() {
        return path.join(this.baseDir, ...this.modulesName, this.scriptName);
    }
}