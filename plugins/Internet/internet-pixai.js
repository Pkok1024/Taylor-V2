import axios from 'axios'
import fetch from 'node-fetch'
import cheerio from 'cheerio'
import {
    webp2png
} from '../../lib/webp2mp4.js'

/**
 * Handler function for the pixai command.
 * @param {Object} m - The message object.
 * @param {Object} args - The arguments object.
 * @param {string} usedPrefix - The prefix used in the command.
 * @param {string} text - The text input by the user.
 * @param {string} command - The command used.
 */
let handler = async (m, {
    conn,
    args,
    usedPrefix,
    text,
    command
}) => {
    try {
        // Check if text input is provided
        if (!text) throw 'Input Text';

        // Fetch text input as images
        const res = await getImages(encodeURIComponent(text), 1);

        // Check if artworks are present in the response
        if (!res.artworks || !res.artworks.edges || res.artworks.edges.length === 0) {
            throw 'No results found for the given text.';
        }

        // Fetch details of the first artwork
        const output = await apiResponse(res.artworks.edges[0].node.id);

        // Extract image URL from the response
        const outputImg = imageUrlFromResponse(output);

        // Check if artwork information is present in the response
        if (!output.artwork) {
            throw 'Error fetching artwork information.';
        }

        // Construct the response message
        let teks = `
🔍 *[ RESULT ]*

📚 Title: ${output.artwork.title}
🔗 Author: ${output.artwork.author.displayName}
📝 Created At: ${output.artwork.createdAt}
👥 Follower Count: ${output.artwork.author.followerCount}
👁️ Views: ${output.artwork.views}
`;

        // Send the response message with the image
        conn.sendFile(m.chat, await webp2png((await conn.getFile(outputImg[0])).data), '', teks, m);
    } catch (error) {
        console.error(error);
        conn.reply(m.chat, `Error: ${error}`, m);
    }
};

/**
 * Help information for the pixai command.
 */
handler.help = ['pixai']

/**
 * Tags for the pixai command.
 */
handler.pTags = ['internet']

/**
 * Command for the pixai function.
 */
handler.command = ['pixai']

/**
 * Export the handler function.
 */
export default handler

// Base URL for the API requests
const baseURL = "https://api.pixai.art/graphql";

/**
 * Function to fetch images based on the given text.
 * @param {string} q - The text input by the user.
 * @param {number} n - The number of images to fetch.
 * @param {boolean} isNsfw - A flag to indicate if NSFW images should be included.
 * @returns {Object} - The response object from the API.
 */
async function getImages(q, n = 5, isNsfw = false) {
    try {
        // Make the API request
        const response = await fetch(baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `
          query listArtworks($before: String, $after: String, $first: Int, $last: Int, $isNsfw: Boolean, $isPrivate: Boolean, $orderBy: String, $tag: String, $q: String, $relevantArtworkId: ID, $keyword: String, $text: String, $hidePrompts: Boolean, $authorName: String, $feed: String, $authorId: ID, $challenge: Int, $archived: Boolean, $isTheme: Boolean, $themeId: ID) {
            artworks(
              before: $before
              after: $after
              first: $first
              last: $last
              isNsfw: $isNsfw
              isPrivate: $isPrivate
              orderBy: $orderBy
              tag: $tag
              q: $q
              relevantArtworkId: $relevantArtworkId
              keyword: $keyword
              text: $text
              hidePrompts: $hidePrompts
              authorName: $authorName
              feed: $feed
              authorId: $authorId
              challenge: $challenge
              archived: $archived
              isTheme: $isTheme
              themeId: $themeId
            ) {
              edges {
                node {
                  ...ArtworkBase
                }
                cursor
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
                endCursor
                startCursor
              }
              totalCount
            }
          }
          
          fragment ArtworkBase on Artwork {
            id
            title
            authorId
            authorName
            author {
              ...UserBase
            }
            mediaId
            prompts
            createdAt
            updatedAt
            media {
              ...MediaBase
            }
            isNsfw
            hidePrompts
            isPrivate
            tags {
              ...TagBase
            }
            extra
            likedCount
            liked
            views
            commentCount
            inspiredCount
            deriveThemeId
            rootThemeId
          }
          
          fragment UserBase on User {
            id
            email
            emailVerified
            username
            displayName
            createdAt
            updatedAt
            avatarMedia {
              ...MediaBase
            }
            followedByMe
            followingMe
            followerCount
            followingCount
            inspiredCount
            isAdmin
          }
          
          fragment MediaBase on Media {
            id
            type
            width
            height
            urls {
              variant
              url
            }
            imageType
            fileUrl
