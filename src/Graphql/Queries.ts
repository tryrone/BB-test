import { gql } from "@apollo/client";

export interface GetFeedInput {
  limit: number
  offset: number
}

interface Image {
  alt: String
  src: String
  src2x: String
}

interface Video {
  alt: String
  src: String
}

export interface IGStoryMission {
  date: String
  title: String
  video: Video
  cashReward: number
}

export interface FBPostMission {
  date: String
  title: String
  image: Image
  cashReward: number
}

export type Mission = IGStoryMission | FBPostMission;

export interface GetFeedResponse {
  getFeed: {
    items: [Mission];
    hasNextPage: boolean;
  };
}


export const GET_FEED = gql`
  query getFeed($limit: Int!, $offset: Int!) {
    getFeed(input: { limit: $limit, offset: $offset }) {
      items {
        ... on FBPostMission {
          date
          title
          image {
            alt
            src
            src2x
          }
          cashReward
        }
        ... on IGStoryMission {
          date
          title
          video {
            alt
            src
          }
          cashReward
        }
      }
      hasNextPage
    }
  }
`;
