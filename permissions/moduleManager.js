import ObjectManager from "./objectManager.js";
import Script from "@ralvarezdev/js-reflection";

// Errors that can be thrown by the module manager
export const OBJECT_NOT_FOUND_ERROR = 'Object not found'
export const OBJECT_ALREADY_EXISTS_ERROR = 'Object already exists'
export const NESTED_MODULE_NOT_FOUND_ERROR = 'Nested module not found'
export const NESTED_MODULE_ALREADY_EXISTS_ERROR = 'Nested module already exists'
export const USER_NOT_AUTHORIZED_ERROR = 'User not authorized'

// Scripts
const scripts = {}

// Routes module management for permissions
export default class ModuleManager {
    #name
    #nestedModules = {}
    #objects = {}

    // Initialize the module manager
    constructor(name) {
        // Set the module manager name
        this.#name = name
    }

    // Get the module manager name
    get name() {
        return this.#name
    }

    // Add a nested module to the module manager
    addNestedModule(nestedModule) {
        // Check if the nested module already exists
        if (this.#nestedModules[nestedModule.name])
            throw new Error(NESTED_MODULE_ALREADY_EXISTS_ERROR + ": " + nestedModule.name)

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
        return this.#nestedModules[name] !== undefined
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
            throw new Error(NESTED_MODULE_NOT_FOUND_ERROR + ": " + name)

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

    // Create a new object in the module manager
    createObject(scriptPath, scriptName, classNameFn,instanceNameFn) {
        // Get the class name
        const className = classNameFn(scriptPath, scriptName)

        // Get the instance name
        const instanceName = instanceNameFn(scriptPath, scriptName)

        // Create a new object
        const objectManager = new ObjectManager(scriptPath,className, instanceName)

        // Check if the object already exists
        if (this.#objects[className])
            throw new Error(OBJECT_ALREADY_EXISTS_ERROR + ": " + className)

        // Add the object to the module manager
        this.#objects[className] = objectManager

        return objectManager
    }

    //  Checks if an object exists in the module manager
    hasObject(name) {
        return this.#objects[name] !== undefined
    }

    // Get an object from the module manager
    getObject(name) {
        // Check if the object exists
        if (!this.#objects[name])
            throw new Error(OBJECT_NOT_FOUND_ERROR + ": " + name)

        return this.#objects[name]
    }

    // Get all objects from the module manager
    get objects() {
        return this.#objects
    }

    // Remove an object from the module manager
    removeObject(name) {
        // Check if the object exists
        if (!this.#objects[name])
            throw new Error(OBJECT_NOT_FOUND_ERROR + ": " + name)

        delete this.#objects[name]
    }

    // Create a new method in the module manager
    createMethod(objectName, methodName, ...allowedProfiles) {
        // Get the object
        const object = this.getObject(objectName)

        // Create a new method
        return object.createMethod(methodName, allowedProfiles)
    }

    // Checks if a method exists in the module manager
    hasMethod(objectName, methodName) {
        // Get the object
        const object = this.getObject(objectName)

        return object.hasMethod(methodName)
    }

    // Get a method from the module manager
    getMethod(objectName, methodName) {
        // Get the object
        const object = this.getObject(objectName)

        return object.getMethod(methodName)
    }

    // Get all methods from the module manager
    getMethods(objectName) {
        // Get the object
        const object = this.getObject(objectName)

        return object.methods
    }

    // Remove a method from the module manager
    removeMethod(objectName, methodName) {
        // Get the object
        const object = this.getObject(objectName)

        object.removeMethod(methodName)
    }

    // Check if the method can be executed by a user with a specific profile
    #canBeExecutedBy(nestedModulesName, objectName, methodName, profile) {
        // Get the deepest nested module
        let module = this
        for (const nestedModuleName of nestedModulesName)
            module = module.getNestedModule(nestedModuleName)

        // Get the method
        const method = module.getMethod(objectName, methodName)

        // Check if the method can be executed by the profile
        return method.canBeExecutedBy(profile)
    }

    // Check if the route can be executed by a user with a specific profile
    canBeExecutedBy(route, profile) {
        return this.#canBeExecutedBy(route.modulesName, route.objectName, route.methodName, profile)
    }

    // Get the loaded script
    async getLoadedScript(scriptPath) {
        // Check if the script is not loaded
        if (!scripts[scriptPath])
            scripts[scriptPath] = new Script(scriptPath)

        // Wait for the script to load
        return await scripts[scriptPath].loadedScript()
    }

    // Execute the method with the given parameters if the user has the required profile
    async executeMethod(route, profile, ...params) {
        // Check if the route can be executed by the user
        if (!this.canBeExecutedBy(route, profile))
            throw new Error(USER_NOT_AUTHORIZED_ERROR + ": " + profile)

        // Get the loaded script
        const loadedScript = await this.getLoadedScript(route.path)

        // Execute the method
        return await loadedScript.callObjectMethod(route.objectName, route.methodName, ...params)
    }

    // Execute the method with the given parameters if the user has the required profile with the same number of parameters
    async safeExecuteMethod(route, profile, ...params) {
        // Check if the route can be executed by the user
        if (!this.canBeExecutedBy(route, profile))
            throw new Error(USER_NOT_AUTHORIZED_ERROR + ": " + profile)

        // Get the loaded script
        const loadedScript = await this.getLoadedScript(route.path)

        // Execute the method
        return await loadedScript.safeCallObjectMethod(route.objectName, route.methodName, ...params)
    }
}

// NewRootModuleManager creates a new root module manager
export function NewRootModuleManager() {
    return new ModuleManager()
}