import * as fs from "node:fs";
import {NewRootModuleManager} from "./moduleManager.js";
import {GetDescriptor} from "@ralvarezdev/js-decorator";
import {GetMetadataProfiles} from "./decorator.js";
import path from "path";

// Migrate the permissions from the metadata of each method from the given path
export default async function MigratePermissions(dirPath, matchScriptName, matchClassName, logger) {
    // Create the root module manager
    const rootModuleManager = new NewRootModuleManager();

    // Migrate the permissions from the metadata of each method from the given path to the module manager
    await MigratePermissionsToModuleManager(dirPath, rootModuleManager, matchScriptName, matchClassName, logger);

    // Return the root module manager
    return rootModuleManager;
}

// Migrate the permissions from the metadata of each method from the given path to the module manager
export async function MigratePermissionsToModuleManager(dirPath, rootModuleManager, matchScriptName, matchClassName, logger) {
    // Log the directory path
    if (logger)
        logger.info(`Migrating permissions from: ${dirPath}`);

    // Get the files and folders from the given path
    const filesAndFolders = fs.readdirSync(dirPath);

    // Iterate over the files and folders
    for (const name of filesAndFolders) {
        const nestedPath = path.join(dirPath, name);
        const stats = fs.statSync(nestedPath);

        // Check if it is a directory
        if (stats.isDirectory()) {
            // Log the nested path
            if (logger)
                logger.info(`Nested path found: ${nestedPath}`);

            // Create the module manager and add it to the root module manager
            const nestedModuleManager = rootModuleManager.createNestedModule(name);

            // Migrate the permissions from the metadata of each method from the nested path to the module manager
            await MigratePermissionsToModuleManager(nestedPath, nestedModuleManager, logger);
        } else {
            // Check if the script name matches
            if (matchScriptName && name !== matchScriptName)
                continue;

            // Log the script name
            if (logger)
                logger.info(`Script found: ${name}`);

            // Create the object manager and add it to the module manager
            const objectManager = rootModuleManager.createObject(nestedPath, matchClassName)

            // Migrate the permissions from the metadata of each method from the nested path to the object manager
            await MigratePermissionsToObjectManager(objectManager, logger);
        }
    }
}

// Migrate the permissions from the metadata of each method to the given object manager
export async function MigratePermissionsToObjectManager(objectManager, logger) {
    // Get the class from the object manager
    const Class = await objectManager.getClass();

    // Get the class methods from the object manager
    const ClassMethods = await objectManager.getClassMethods();

    // Iterate over the class methods
    for (const classMethodName of Object.keys(ClassMethods)) {
        // Log the class method name
        if (logger)
            logger.info(`Class method found: ${classMethodName}`);

        // Get the class method
        const classMethod = ClassMethods[classMethodName];

        // Get the descriptors of the class method
        const descriptor = GetDescriptor(Class, classMethodName);

        // Get the allowed profiles for the method
        const allowedProfiles = GetMetadataProfiles(descriptor);

        // Create a new method in the object manager
        objectManager.createMethod(classMethodName, classMethod, ...allowedProfiles);
    }
}