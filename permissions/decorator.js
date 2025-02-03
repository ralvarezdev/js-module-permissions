import {AddMetadata, GetMetadataKey} from "@ralvarezdev/js-decorator";

// ProfilesKey is the key for the metadata profiles
export const ProfilesKey = "profiles";

// AddMetadataProfiles is a decorator that adds the profiles metadata to the method
export function AddMetadataProfiles(target, property, ...profiles) {
    return AddMetadata(ProfilesKey, profiles)(target, property);
}

// GetMetadataProfiles is a function that gets the metadata profiles from the method
export function GetMetadataProfiles(target, property) {
    return GetMetadataKey(target, property, ProfilesKey);
}