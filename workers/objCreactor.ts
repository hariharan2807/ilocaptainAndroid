import store from '../store';
import {isValidImageURL} from './utils';

export const SanitizeProduct = (payload: any) => {
  let product = [];
  try {
    for (let item of payload) {
      product.push({
        category_id: item.category_id,
        category_name: item.category_name,
        product_id: item.product_id,
        product_name: item.product_name,
        image: isValidImageURL(item.product_image),
        product_offer: item.product_offer,
        product_desc: item.product_description,
        price: item.product_price,
        hasExtra: item.product_price.length > 1 ? true : false,
        favourite: item.is_favourite === 1 ? true : false,
        percentage: item.product_percentage,
        product_status: item.product_status,
        product_rating: item?.product_rating,
        product_recommended: item.product_recommended,
        timeslot: item.timeslot,
      });
    }
    return product;
  } catch (err) {
    return product;
  }
};

export const SanitizeOfferProduct = (payload: any) => {
  let offerProduct = [];
  try {
    for (let item of payload) {
      offerProduct.push({
        category_id: item.category_id,
        category_name: item.category_name,
        product_id: item.product_id,
        product_name: item.product_name,
        image: isValidImageURL(item.product_image),
        product_offer: item.product_offer,
        product_desc: item.product_description,
        price: item.product_price,
        product_status: item.product_status,
        hasExtra: item.product_price.length > 1 ? true : false,
        favourite: item.is_favourite === 1 ? true : false,
        percentage: item.product_percentage,
        product_rating: item?.product_rating,
        product_recommended: item.product_recommended,
        timeslot: item.timeslot,
      });
    }
    return offerProduct;
  } catch (err) {
    return offerProduct;
  }
};

export const SanitizeBestSellingProduct = (payload: any) => {
  let bestSellingProduct = [];
  try {
    for (let item of payload) {
      bestSellingProduct.push({
        category_id: item.category_id,
        category_name: item.category_name,
        product_id: item.product_id,
        product_name: item.product_name,
        image: isValidImageURL(item.product_image),
        product_offer: item.product_offer,
        product_desc: item.product_description,
        price: item.product_price,
        hasExtra: item.product_price.length > 1 ? true : false,
        favourite: item.is_favourite === 1 ? true : false,
        percentage: item.product_percentage,
        product_status: item.product_status,
        product_rating: item?.product_rating,
        product_recommended: item.product_recommended,
        timeslot: item.timeslot,
      });
    }
    return bestSellingProduct;
  } catch (err) {
    return bestSellingProduct;
  }
};

export const SanitizeRecommandProduct = (payload: any) => {
  let MustTryProducts = [];
  try {
    for (let item of payload) {
      MustTryProducts.push({
        category_id: item.category_id,
        category_name: item.category_name,
        product_id: item.product_id,
        product_name: item.product_name,
        image: isValidImageURL(item.product_image),
        product_offer: item.product_offer,
        product_desc: item.product_description,
        price: item.product_price,
        product_status: item.product_status,
        hasExtra: item.product_price.length > 1 ? true : false,
        favourite: item.is_favourite === 1 ? true : false,
        percentage: item.product_percentage,
        product_rating: item?.product_rating,
        product_recommended: item.product_recommended,
        timeslot: item.timeslot,
      });
    }
    return MustTryProducts;
  } catch (err) {
    return MustTryProducts;
  }
};

export const SanitizeGetAllProduct = (payload: any) => {
  let getAllProducts = [];
  try {
    for (let item of payload) {
      getAllProducts.push({
        category_id: item.category_id,
        category_name: item.category_name,
        product_id: item.product_id,
        product_name: item.product_name,
        image: isValidImageURL(item.product_image),
        product_offer: item.product_offer,
        product_desc: item.product_description,
        product_status: item.product_status,
        price: item.product_price,
        hasExtra: item.product_price.length > 1 ? true : false,
        favourite: item.is_favourite === 1 ? true : false,
        percentage: item.product_percentage,
        product_rating: item?.product_rating,
        product_recommended: item.product_recommended,
        timeslot: item.timeslot,
      });
    }
    return getAllProducts;
  } catch (err) {
    return getAllProducts;
  }
};

export const SanitizeGetFavouriteProductAPI = (payload: any) => {
  let getfavouriteProducts = [];
  try {
    for (let item of payload) {
      getfavouriteProducts.push({
        category_id: item.category_id,
        category_name: item.category_name,
        product_id: item.product_id,
        product_name: item.product_name,
        image: isValidImageURL(item.product_image),
        product_offer: item.product_offer,
        product_desc: item.product_description,
        price: item.product_price,
        product_status: item.product_status,
        hasExtra: item.product_price.length > 1 ? true : false,
        favourite: item.is_favourite === 1 ? true : false,
        percentage: item.product_percentage,
        product_rating: item?.product_rating,
        product_recommended: item.product_recommended,
        timeslot: item.timeslot,
      });
    }
    return getfavouriteProducts;
  } catch (err) {
    return getfavouriteProducts;
  }
};

export const isInFavorite = (product_id: string): any => {
  try {
    const favState = store.getState().user.favorites;
    const response = favState.find((item: any) => item === product_id);
    if (response) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

// veg is available ---> "1"
// Non-veg is available ---> "0"

//on Favourite --->1
//oFF Favourite --->0
