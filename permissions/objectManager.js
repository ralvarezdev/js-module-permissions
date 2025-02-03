import MethodManager from "./methodManager.js";
import Script from "@ralvarezdev/js-reflection";

// Errors that can be thrown by the module manager
export const METHOD_NOT_FOUND_ERROR = 'Method not found'
export const METHOD_ALREADY_EXISTS_ERROR = 'Method already exists'

// Object manager class to manage the permissions of an object
export default class ObjectManager {
    #scriptPath
    #script
    #name
    #methods = {}

    // Initialize the object with a name
    constructor(scriptPath, name) {
        // Set the script path
        this.#scriptPath = scriptPath

        // Create a script object
        this.#script = new Script(scriptPath)

        // Set the object name
        this.#name = name
    }

    // Get the name of the object
    get name() {
        return this.#name
    }

    // Get the class of the object from the script
    async getClass() {
        return await this.#script.getClass(this.#name)
    }

    // Get the class methods of the object from the script
    async getClassMethods() {
        return await this.#script.getClassMethods(this.#name)
    }

    // Add a method to the object manager
    addMethod(method) {
        // Check if the method already exists
        if (this.#methods[method.name])
            throw new Error(METHOD_ALREADY_EXISTS_ERROR + ": " + method.name)

        this.#methods[method.name] = method
    }

    // Add methods to the object manager
    addMethods(...methods) {
        methods.forEach(method => this.addMethod(method))
    }

    // Create a new method in the object manager
    createMethod(name, method, ...allowedProfiles) {
        // Create a new method
        const methodManager = new MethodManager(name, method)

        // Set the allowed profiles for the method
        methodManager.allow(...allowedProfiles)

        // Add the method to the module manager
        this.addMethod(methodManager)

        return methodManager
    }

    // Checks if a method exists in the object manager
    hasMethod(name) {
        return this.#methods[name] !== undefined
    }

    // Get a method from the object manager
    getMethod(name) {
        // If the method does not exist, throw an error
        if (!this.hasMethod(name))
            throw new Error(METHOD_NOT_FOUND_ERROR + ": " + name)

        return this.#methods[name]
    }

    // Get all methods from the object manager
    get methods() {
        return this.#methods
    }

    // Remove a method from the object manager
    removeMethod(name) {
        // Check if the method exists
        if (!this.#methods[name])
            throw new Error(METHOD_NOT_FOUND_ERROR + ": " + name)

        delete this.#methods[name]
    }

    // Get method function
    async getMethodFunction(name) {
        return await this.#script.getObjectProperty(this.#name, name)
    }

    // Allow the method to be executed by a user with a specific profile
    allow(methodName, ...profiles) {
        // Get the method
        const method = this.getMethod(methodName)

        // Add the profiles to the allowed profiles array
        profiles.forEach(profile => method.allow(profile))
    }

    // Disallow the method to be executed by a user with a specific profile
    disallow(methodName, ...profiles) {
        // Get the method
        const method = this.getMethod(methodName)

        // Remove the profiles from the allowed profiles array
        profiles.forEach(profile => method.disallow(profile))
    }

    // Check if the method can be executed by a user with a specific profile
    canBeExecutedBy(methodName, profile) {
        // Get the method
        const method = this.getMethod(methodName)

        // Check if the method can be executed by the profile
        return method.canBeExecutedBy(profile)
    }
}