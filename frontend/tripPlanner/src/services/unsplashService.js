import { createApi } from 'unsplash-js';

// Create an Unsplash API instance
const unsplash = createApi({
  accessKey: '6LheLkDvUA-Snn7od83zXfm60t9YaP8osQMl_am5omo', //ovo bi trebalo u env ali nmvz
});

/**
 * Get a relevant photo for a city using search (not random)
 * @param {string} query - City name
 * @param {string} orientation - Photo orientation: landscape, portrait, or squarish
 * @returns {Promise} - Returns photo data
 */
export const getCityPhoto = async (query, orientation = 'landscape') => {
  try {
    const result = await unsplash.search.getPhotos({
      query: `${query} city skyline cityscape`,
      orientation,
      perPage: 1,
      page: 1,
    });

    if (result.errors || !result.response.results.length) {
      console.error('No photos found for city:', result.errors?.[0] || 'No results');
      return null;
    }

    return result.response.results[0];
  } catch (error) {
    console.error('Error fetching city photo:', error);
    return null;
  }
};

/**
 * Get a relevant photo for a trip destination using search (not random)
 * @param {string} fromCity - Origin city
 * @param {string} toCity - Destination city
 * @param {string} orientation - Photo orientation
 * @returns {Promise} - Returns photo data
 */
export const getTripPhoto = async (fromCity, toCity, orientation = 'landscape') => {
  try {
    const result = await unsplash.search.getPhotos({
      query: `${toCity} landmark city travel`,
      orientation,
      perPage: 1,
      page: 1,
    });

    if (result.errors || !result.response.results.length) {
      console.error('No photos found for destination:', result.errors?.[0] || 'No results');
      return null;
    }

    return result.response.results[0];
  } catch (error) {
    console.error('Error fetching trip photo:', error);
    return null;
  }
};

/**
 * General search for photos
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @param {number} perPage - Results per page
 * @returns {Promise} - Returns search results
 */
export const searchPhotos = async (query, page = 1, perPage = 10) => {
  try {
    const result = await unsplash.search.getPhotos({
      query,
      page,
      perPage,
    });

    if (result.errors) {
      console.error('Error searching Unsplash photos:', result.errors[0]);
      return { photos: [], total: 0 };
    }

    return {
      photos: result.response.results,
      total: result.response.total,
    };
  } catch (error) {
    console.error('Error in unsplash service:', error);
    return { photos: [], total: 0 };
  }
};
