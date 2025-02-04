import * as fs from "node:fs";
import {NewRootModuleManager} from "./moduleManager.js";
import {GetMetadataProfiles} from "./decorator.js";
import path from "path";

// Migrate the permissions from the metadata of each method from the given path
export default async function MigratePermissions(options = {
    dirPath: null,
    scriptName: null,
    className: null,
    instanceName: null,
    logger: null,
}) {
    // Create the root module manager
    const rootModuleManager = new NewRootModuleManager();

    // Migrate the permissions from the metadata of each method from the given path to the module manager
    await MigratePermissionsToModuleManager({
        ...options,
        module: rootModuleManager
    });

    // Return the root module manager
    return rootModuleManager;
}

// Migrate the permissions from the metadata of each method from the given path to the module manager
export async function MigratePermissionsToModuleManager(options = {
    module: null,
    dirPath: null,
    scriptName: null,
    className: null,
    instanceName: null,
    logger: null,
}) {
    // Log the directory path
    if (options.logger)
        options.logger.info(`Migrating permissions from: ${options.dirPath}`);

    // Get the files and folders from the given path
    const filesAndFolders = fs.readdirSync(options.dirPath);

    // Iterate over the files and folders
    for (const name of filesAndFolders) {
        const nestedPath = path.join(options.dirPath, name);
        const stats = fs.statSync(nestedPath);

        // Check if it is a directory
        if (stats.isDirectory()) {
            // Log the nested path
            if (options.logger)
                options.logger.info(`Nested path found: ${nestedPath}`);

            // Create the module manager and add it to the root module manager
            const nestedModuleManager = options.module.createNestedModule(name);

            // Migrate the permissions from the metadata of each method from the nested path to the module manager
            await MigratePermissionsToModuleManager({
                ...options,
                dirPath: nestedPath,
                module: nestedModuleManager,
            });
        } else {
            // Check if the script name matches
            if (options.scriptName && name !== options.scriptName)
                continue;

            // Log the script name
            if (options.logger)
                options.logger.info(`Script found: ${name}`);

            // Create the object manager and add it to the module manager
            const objectManager = options.module.createObject(nestedPath, options.className, options.instanceName);

            // Migrate the permissions from the metadata of each method from the nested path to the object manager
            await MigratePermissionsToObjectManager({
                object: objectManager,
                logger: options.logger,
            });
        }
    }
}

// Migrate the permissions from the metadata of each method to the given object manager
export async function MigratePermissionsToObjectManager(options = {
    object: null,
    logger: null,
}) {
    // Get the class from the object manager
    const Class = await options.object.getClass();

    // Get the class methods from the object manager
    const ClassMethods = await options.object.getClassMethods();

    // Iterate over the class methods
    for (const classMethodName of Object.keys(ClassMethods)) {
        // Log the class method name
        if (options.logger)
            options.logger.info(`Class method found: ${classMethodName}`);

        // Get the allowed profiles for the method
        const allowedProfiles = GetMetadataProfiles(Class, classMethodName);

        // Create a new method in the object manager
        options.object.createMethod(classMethodName, ...allowedProfiles);
    }
}