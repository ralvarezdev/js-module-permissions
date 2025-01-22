// Method manager class to manage the permissions of a method
export default class MethodManager {
    #name
    #allowedProfiles

    // Initialize the method with a name
    constructor(name) {
        this.#name = name
    }

    // Get the name of the method
    get name() {
        return this.#name
    }

    // Allow the method to be executed by a user with a specific profile
    allow(...profiles) {
        // If the allowed profiles array does not exist, create it
        if (!this.#allowedProfiles) {
            this.#allowedProfiles = []
        }

        // Add the profiles to the allowed profiles array
        profiles.forEach(profile => this.#allowedProfiles.push(profile))
    }

    // Check if the method can be executed by a user with a specific profile
    canBeExecutedBy(profile) {
        return this.#allowedProfiles.includes(profile)
    }
}