import { gql } from '@apollo/client';

export const FAVORITE_PETS = gql`
  query FavoritePets {
    favorites {
      id
      pet {
        id
        owner_id
        name
        breed
        date_born
        inbreed_rate
        sex
        last_period_date
        kennel_name
        colour
        weight
        vaccinated
        has_frozen_sperm
        ready_to_breed
        pregnant
        competitions_aggregate {
          aggregate {
            count
          }
        }
        competitions(limit: 1, order_by: { competition_date: desc_nulls_last }) {
          id
          name
          competition_date
        }
        images_pets(order_by: { profile_picture: desc_nulls_last }) {
          id
          location
        }
      }
    }
  }
`;

export const READY_TO_BREED_FEED = gql`
  query ReadyToBreedFeed($limit: Int = 10) {
    pets(limit: $limit, where: { ready_to_breed: { _eq: true } }) {
      id
      owner_id
      name
      breed
      date_born
      inbreed_rate
      sex
      last_period_date
      kennel_name
      colour
      weight
      vaccinated
      has_frozen_sperm
      ready_to_breed
      pregnant
      owner: user {
        id
        given_name
        family_name
        address
        profile_picture
      }
      favorites {
        id
      }
      kennel {
        id
        name
        address
        post_number
        phone_number
        website
        email
      }
      competitions_aggregate {
        aggregate {
          count
        }
      }
      medical_records_aggregate {
        aggregate {
          count
        }
      }
      competitions(limit: 1, order_by: { competition_date: desc_nulls_last }) {
        id
        name
        competition_date
      }
      images_pets(order_by: { profile_picture: desc_nulls_last }) {
        id
        location
      }
    }
  }
`;

export const READY_TO_BREED_FEED_SUGGESTIONS = gql`
  query ReadyToBreedFeedSuggestions($limit: Int = 50) {
    pets(limit: $limit, order_by: { created_at: desc }) {
      id
      owner_id
      name
      breed
      date_born
      inbreed_rate
      sex
      last_period_date
      kennel_name
      colour
      weight
      vaccinated
      has_frozen_sperm
      ready_to_breed
      pregnant
      owner: user {
        id
        given_name
        family_name
        address
        profile_picture
      }
      favorites {
        id
      }
      kennel {
        id
        name
        address
      }
      competitions_aggregate {
        aggregate {
          count
        }
      }
      competitions(limit: 1, order_by: { competition_date: desc_nulls_last }) {
        id
        name
        competition_date
      }
      images_pets(order_by: { profile_picture: desc_nulls_last }) {
        id
        location
      }
    }
  }
`;

export const FEED_SUGGESTED_DOGS = gql`
  query FeedSuggestedDogs($sex: String!, $limit: Int = 5) {
    pets_user_preferred_breeds(limit: $limit, where: { sex: { _eq: $sex } }) {
      id
      owner_id
      name
      breed
      date_born
      inbreed_rate
      sex
      last_period_date
      kennel_name
      colour
      weight
      vaccinated
      has_frozen_sperm
      ready_to_breed
      pregnant
      owner: user {
        id
        given_name
        family_name
        address
        profile_picture
      }
      favorites {
        id
      }
      kennel {
        id
        name
        address
      }
      competitions_aggregate {
        aggregate {
          count
        }
      }
      medical_records_aggregate {
        aggregate {
          count
        }
      }
      competitions(limit: 1, order_by: { competition_date: desc_nulls_last }) {
        id
        name
        competition_date
      }
      images_pets(order_by: { profile_picture: desc_nulls_last }) {
        id
        location
      }
    }
  }
`;

export const USER_QUERY_FOR_FEED = gql`
  query UserForFeed {
    me {
      id
      given_name
      family_name
      email
      profile_picture
      preferred_breeds
      phone
      address
      bio
      pets {
        id
        name
        breed
        sex
        pregnant
        has_frozen_sperm
        ready_to_breed
        inbreed_rate
        pregnant_expecting_puppies_count
        competitions_aggregate {
          aggregate {
            count
          }
        }
        breeds {
          default_image_url
        }
        medical_records_aggregate {
          aggregate {
            count
          }
        }
        images: images_pets(order_by: { profile_picture: desc_nulls_last }) {
          id
          location
        }
      }
    }
  }
`;

export const FETCH_USER_BY_ID = gql`
  query FetchUserById($userId: String!) {
    v1 {
      user(id: $userId) {
        id
        given_name
        family_name
        email
        type
        profile_picture
        phone
        address
        bio
        pets {
          id
          name
          breed
          sex
          favorite {
            id
          }
          pregnant
          has_frozen_sperm
          ready_to_breed
          inbreed_rate
          pregnant_expecting_puppies_count
          competitions {
            id
            name
          }
          images_pets {
            id
            location
          }
          medical_records {
            id
          }
        }
      }
    }
  }
`;

export const GET_PET_DETAILS = gql`
  query GetPetDetails($petId: String!) {
    pets(where: { id: { _eq: $petId } }, limit: 1) {
      id
      owner_id
      kennel_id
      name
      breed
      date_born
      inbreed_rate
      sex
      last_period_date
      kennel_name
      colour
      weight
      vaccinated
      has_frozen_sperm
      ready_to_breed
      pregnant
      pregnant_expecting_puppies_count
      chip_id
      owner: user {
        id
        given_name
        family_name
        address
        profile_picture
      }
      kennel {
        id
        name
        address
      }
      competitions_aggregate {
        aggregate {
          count
        }
      }
      competitions(order_by: { competition_date: desc_nulls_last }) {
        id
        name
        competition_date
        location
        organization
        type
        value
        meaning
      }
      medical_records_aggregate {
        aggregate {
          count
        }
      }
      medical_records(order_by: { date: desc_nulls_last }) {
        id
        date
        veterinary
        diagnose
      }
      images_pets(order_by: { profile_picture: desc_nulls_last }) {
        id
        location
      }
      family_tree
      favorites {
        id
      }
    }
  }
`;

export const GET_FAMILY_TREE = gql`
  query GetFamilyTree($petId: String!) {
    pets_by_pk(id: $petId) {
      id
      name
      breed
      sex
      images_pets(limit: 1, order_by: { profile_picture: desc_nulls_last }) {
        location
      }
      father {
        id
        name
        breed
        sex
        images_pets(limit: 1, order_by: { profile_picture: desc_nulls_last }) {
          location
        }
        father {
          id
          name
          breed
          sex
          images_pets(limit: 1) {
            location
          }
        }
        mother {
          id
          name
          breed
          sex
          images_pets(limit: 1) {
            location
          }
        }
      }
      mother {
        id
        name
        breed
        sex
        images_pets(limit: 1, order_by: { profile_picture: desc_nulls_last }) {
          location
        }
        father {
          id
          name
          breed
          sex
          images_pets(limit: 1) {
            location
          }
        }
        mother {
          id
          name
          breed
          sex
          images_pets(limit: 1) {
            location
          }
        }
      }
    }
  }
`;

export const GET_ALL_BREEDS = gql`
  query GetAllBreeds {
    breeds(order_by: { name: asc }) {
      id
      name
      default_image_url
    }
  }
`;

export const SEARCH_PETS = gql`
  query SearchPets(
    $where: pets_bool_exp
    $limit: Int = 50
  ) {
    pets(
      limit: $limit
      order_by: { created_at: desc }
      where: $where
    ) {
      id
      owner_id
      name
      breed
      date_born
      inbreed_rate
      sex
      last_period_date
      kennel_name
      colour
      weight
      vaccinated
      has_frozen_sperm
      ready_to_breed
      pregnant
      owner: user {
        id
        given_name
        family_name
        address
        profile_picture
      }
      kennel {
        id
        name
        address
        post_number
        phone_number
        website
        email
      }
      favorites {
        id
      }
      competitions_aggregate {
        aggregate {
          count
        }
      }
      competitions(limit: 1, order_by: { competition_date: desc_nulls_last }) {
        id
        name
        competition_date
      }
      images_pets(order_by: { profile_picture: desc_nulls_last }) {
        id
        location
      }
    }
  }
`;

export const GET_PET_TROPHIES = gql`
  query GetPetTrophies($petId: String!) {
    competitions(where: { pet_id: { _eq: $petId } }, order_by: { competition_date: desc }) {
      id
      name
      competition_date
      location
      placement
    }
  }
`;

// Kennel listing/search
export const SEARCH_KENNELS = gql`
  query SearchKennels($where: kennels_bool_exp, $limit: Int = 50) {
    kennels(limit: $limit, order_by: { name: asc }, where: $where) {
      id
      name
      address
      post_number
      phone_number
      website
      email
    }
  }
`;

// Kennel details with dogs
export const GET_KENNEL_DETAILS = gql`
  query GetKennelDetails($kennelId: String!, $limit: Int = 50) {
    kennels(where: { id: { _eq: $kennelId } }, limit: 1) {
      id
      name
      address
      post_number
      phone_number
      website
      email
    }
    pets(where: { kennel_id: { _eq: $kennelId } }, limit: $limit, order_by: { created_at: desc }) {
      id
      name
      breed
      sex
      inbreed_rate
      colour
      images_pets(order_by: { profile_picture: desc_nulls_last }, limit: 1) { id location }
    }
  }
`;


