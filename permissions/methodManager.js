// Method manager class to manage the permissions of a method
export default class MethodManager {
    #name
    #profiles
    #method

    // Initialize the method with a name and its function
    constructor(name, method) {
        // Set the method name
        this.#name = name

        // Set the method function
        this.#method = method

        // Initialize the profiles object
        this.#profiles = {}
    }

    // Get the name of the method
    get name() {
        return this.#name
    }

    // Get the method function
    get method() {
        return this.#method
    }

    // Allow the method to be executed by a user with a specific profile
    allow(...profiles) {
        profiles.forEach(profile => this.#profiles[profile] = true)
    }

    // Disallow the method to be executed by a user with a specific profile
    disallow(...profiles) {
        profiles.forEach(profile => delete this.#profiles[profile])
    }

    // Check if the method can be executed by a user with a specific profile
    canBeExecutedBy(profile) {
        return this.#profiles[profile] === true
    }
}