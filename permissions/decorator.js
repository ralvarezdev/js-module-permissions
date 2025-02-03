import {AddMetadata, GetMetadataKey} from "@ralvarezdev/js-decorator";

// ProfilesKey is the key for the metadata profiles
export const ProfilesKey = "profiles";

// AddMetadataProfiles is a decorator that adds metadata profiles to the method descriptor
export function AddMetadataProfiles(...profiles) {
    return AddMetadata(ProfilesKey, profiles);
}

// GetMetadataProfiles is a function that gets the metadata profiles from the method descriptor
export function GetMetadataProfiles(descriptor) {
    return GetMetadataKey(descriptor, ProfilesKey);
}