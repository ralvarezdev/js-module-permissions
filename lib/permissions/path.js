// Errors that can be thrown by this class
export const METHOD_NOT_DEFINED_ERROR = new Error("Method not defined")

// Path represents a module permission path in the file system
export default class Path {
    #nestedModules
    #method

    // Path constructor
    constructor(method, ...modules) {
        // If the method is not defined, throw an error
        if (!method)
            throw METHOD_NOT_DEFINED_ERROR;

        // Set the modules and method
        this.#nestedModules = modules;
        this.#method = method;
    }

    // Check if it has a nested module
    hasNestedModule() {
        return this.#nestedModules.length > 0;
    }

    // Get the nested module
    get nestedModule() {
        // If there are no modules, return null
        if (!this.hasNestedModule())
            return null;
        return this.#nestedModules[0];
    }

    // Remove the nested module
    removeNestedModule() {
        this.#nestedModules.shift();
    }

    // Get the method
    get method() {
        return this.#method;
    }
}