import { gql } from '@apollo/client';

export const FAVORITE_PETS_SUBSCRIPTION = gql`
  subscription FavoritePetsSubscription {
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
        next_breeding_date
        pregnant
        user {
          id
          given_name
          family_name
          address
          profile_picture
        }
        kennel {
          name
          id
          address
          post_number
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
        images: images_pets(order_by: { profile_picture: desc_nulls_last }) {
          id
          location
        }
      }
    }
  }
`;


