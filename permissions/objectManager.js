import MethodManager from "./methodManager.js";
import Script from "@ralvarezdev/js-reflection";

// Errors that can be thrown by the module manager
export const METHOD_NOT_FOUND_ERROR = 'Method not found'
export const METHOD_ALREADY_EXISTS_ERROR = 'Method already exists'

// Object manager class to manage the permissions of an object
export default class ObjectManager {
    #scriptPath
    #script
    #className
    #instanceName
    #methods = {}

    // Initialize the object with a class name and an instance name
    constructor(scriptPath, className, instanceName) {
        // Set the script path
        this.#scriptPath = scriptPath

        // Create a script object
        this.#script = new Script(scriptPath)

        // Set the class name and instance name
        this.#className = className
        this.#instanceName = instanceName
    }

    // Get the name of the object class
    get className() {
        return this.#className
    }

    // Get the name of the object instance
    get instanceName() {
        return this.#instanceName
    }

    // Get the class of the object from the script
    async getClass() {
        return await this.#script.getClass(this.#className)
    }

    // Get the class methods of the object from the script
    async getClassMethods() {
        return await this.#script.getClassMethods(this.#className)
    }

    // Get the instance of the object from the script
    async getInstance() {
        return await this.#script.getObject(this.#instanceName)
    }

    // Get the instance method from the object
    async getInstanceMethod(name) {
        return await this.#script.getObjectFunctionProperty(this.#instanceName, name)
    }

    // Create a new method in the object manager
    createMethod(name, ...allowedProfiles) {
        // Get the instance method
        const method = this.getInstanceMethod(name)

        // Create a new method
        const methodManager = new MethodManager(name, method)

        // Set the allowed profiles for the method
        methodManager.allow(...allowedProfiles)

        // Check if the method already exists
        if (this.#methods[name])
            throw new Error(METHOD_ALREADY_EXISTS_ERROR + ": " + name)

        // Add the method to the methods object
        this.#methods[name] = methodManager

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