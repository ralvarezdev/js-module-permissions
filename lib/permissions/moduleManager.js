// Errors that can be thrown by the module manager
import MethodManager from "./methodManager";

export const METHOD_NOT_FOUND_ERROR = 'Method not found'
export const NESTED_MODULE_NOT_FOUND_ERROR = 'Nested module not found'
export const NESTED_MODULE_ALREADY_EXISTS_ERROR = 'Nested module already exists'
export const METHOD_ALREADY_EXISTS_ERROR = 'Method already exists'

// Routes module management for permissions
export default class ModuleManager {
    #name
    #nestedModules
    #methods

    // Initialize the module manager
    constructor(name) {
        // Set the module manager name
        this.#name = name

        // Initialize the modules and methods objects
        this.#nestedModules = {}
        this.#methods = {}
    }

    // Get the module manager name
    get name() {
        return this.#name
    }

    // Add a nested module to the module manager
    addNestedModule(nestedModule) {
        // Check if the nested module already exists
        if (this.#nestedModules[nestedModule.name])
            throw new Error(NESTED_MODULE_ALREADY_EXISTS_ERROR + ": "+ nestedModule.name)

        this.#nestedModules[nestedModule.name] = nestedModule
    }

    // Add nested modules to the module manager
    addNestedModules(...nestedModules) {
        nestedModules.forEach(nestedModule => this.addNestedModule(nestedModule))
    }

    // Create a new nested module in the module manager
    createNestedModule(name) {
        // Create a new nested module
        const nestedModule = new ModuleManager(name)

        // Add the nested module to the module manager
        this.addNestedModule(nestedModule)

        return nestedModule
    }

    // Checks if a nested module exists in the module manager
    hasNestedModule(name) {
        return this.#nestedModules[name]!==undefined
    }

    // Get a nested module from the module manager
    getNestedModule(name) {
        return this.#nestedModules[name]
    }

    // Get all nested modules from the module manager
    get nestedModules() {
        return this.#nestedModules
    }

    // Remove a nested module from the module manager
    removeNestedModule(name) {
        // Check if the nested module exists
        if (!this.#nestedModules[name])
            throw new Error(NESTED_MODULE_NOT_FOUND_ERROR + ": "+ name)

        delete this.#nestedModules[name]
    }

    // Remove nested modules from the module manager
    removeNestedModules(...names) {
        names.forEach(name => this.removeNestedModule(name))
    }

    // Remove all nested modules from the module manager
    removeAllNestedModules() {
        this.#nestedModules = {}
    }

    // Add a method to the module manager
    addMethod(method) {
        // Check if the method already exists
        if (this.#methods[method.name])
            throw new Error(METHOD_ALREADY_EXISTS_ERROR + ": "+ method.name)

        this.#methods[method.name] = method
    }

    // Add methods to the module manager
    addMethods(...methods) {
        methods.forEach(method => this.addMethod(method))
    }

    // Create a new method in the module manager
    createMethod(name, ...allowedProfiles) {
        // Create a new method
        const method = new MethodManager(name)

        // Set the allowed profiles for the method
        method.allow(allowedProfiles)

        // Add the method to the module manager
        this.addMethod(method)

        return method
    }

    // Checks if a method exists in the module manager
    hasMethod(name) {
        return this.#methods[name]!==undefined
    }

    // Get a method from the module manager
    getMethod(name) {
        return this.#methods[name]
    }

    // Get all methods from the module manager
    get methods() {
        return this.#methods
    }

    // Remove a method from the module manager
    removeMethod(name) {
        // Check if the method exists
        if (!this.#methods[name])
            throw new Error(METHOD_NOT_FOUND_ERROR + ": "+ name)

        delete this.#methods[name]
    }

    // Check if the method can be executed by a user with a specific profile
    canBeExecutedBy(path, profile) {
        // Check if the path has a nested module
        if (!path.hasNestedModule()) {
            // Get the method
            const method = this.getMethod(path.method)

            // Check if the method can be executed by the profile
            return method.canBeExecutedBy(profile)
        }

        // Get the nested module name
        const nestedModuleName = path.nestedModule

        // Get the nested module
        const module = this.getNestedModule(nestedModuleName)

        // Remove the nested module from the path
        path.removeNestedModule()

        // Check if the method can be executed by the profile on the nested module
        return module.canBeExecutedBy(path, profile)
    }
}

// NewRootModuleManager creates a new root module manager
export function NewRootModuleManager() {
    return new ModuleManager()
}