import { gql } from '@apollo/client';

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $userId: uuid!
    $bio: String
    $givenName: String
    $familyName: String
    $address: String
  ) {
    update_users_by_pk(
      pk_columns: { id: $userId }
      _set: { bio: $bio, given_name: $givenName, family_name: $familyName, address: $address }
    ) {
      id
    }
  }
`;

export const SET_FAVORITE_PET = gql`
  mutation SetFavoritePet($id: String!) {
    v1 {
      setFavoritePet(id: $id) {
        id
      }
    }
  }
`;

export const UPDATE_PET = gql`
  mutation UpdatePet(
    $id: String!
    $name: String
    $color: String
    $hasFrozenSperm: Boolean
    $lastPeriodDate: date
    $weight: numeric
    $readyToBreed: Boolean
    $pregnant: Boolean
    $expectingPuppiesCount: Int
  ) {
    update_pet(
      pk_columns: { id: $id }
      _set: {
        name: $name
        colour: $color
        has_frozen_sperm: $hasFrozenSperm
        last_period_date: $lastPeriodDate
        weight: $weight
        ready_to_breed: $readyToBreed
        pregnant: $pregnant
        pregnant_expecting_puppies_count: $expectingPuppiesCount
      }
    ) {
      id
      name
      colour
      has_frozen_sperm
      last_period_date
      weight
      ready_to_breed
      pregnant
      pregnant_expecting_puppies_count
    }
  }
`;

export const SEND_FEEDBACK = gql`
  mutation SendFeedback($details: SendEmailDetails!) {
    v1 {
      sendEmail(details: $details) {
        message
      }
    }
  }
`;

export const UPDATE_PREFERRED_BREEDS = gql`
  mutation UpdatePreferredBreeds($breeds: [String!]!, $userId: uuid!) {
    update_users_by_pk(pk_columns: { id: $userId }, _set: { preferred_breeds: $breeds }) {
      id
      preferred_breeds
    }
  }
`;

export const CREATE_PET = gql`
  mutation CreatePet(
    $ownerId: String!
    $name: String!
    $breed: String!
    $dateBorn: date!
    $sex: String!
    $colour: String
    $weight: numeric
    $kennelName: String
  ) {
    insert_pets_one(
      object: {
        owner_id: $ownerId
        name: $name
        breed: $breed
        date_born: $dateBorn
        sex: $sex
        colour: $colour
        weight: $weight
        kennel_name: $kennelName
      }
    ) {
      id
      name
      breed
    }
  }
`;

export const DELETE_PET = gql`
  mutation DeletePet($petId: String!) {
    delete_pets_by_pk(id: $petId) {
      id
    }
  }
`;

export const UPLOAD_PET_IMAGE = gql`
  mutation UploadPetImage($petId: String!, $location: String!, $profilePicture: Boolean) {
    insert_images_pets_one(
      object: { pet_id: $petId, location: $location, profile_picture: $profilePicture }
    ) {
      id
      location
    }
  }
`;

export const DELETE_PET_IMAGE = gql`
  mutation DeletePetImage($imageId: String!) {
    delete_images_pets_by_pk(id: $imageId) {
      id
    }
  }
`;

export const CALCULATE_INBREEDING_COEFFICIENT = gql`
  mutation CalculateInbreedingCoefficient($myPet: String!, $targetPet: String!) {
    calculateInbreedingCoefficient(my_pet: $myPet, target_pet: $targetPet) {
      coefficient
      percentage
    }
  }
`;


