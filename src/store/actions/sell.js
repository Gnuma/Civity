import * as actionTypes from "./actionTypes";
import NavigatorService from "../../navigator/NavigationService";
import { setItem, getItem, removeItem } from "../utility";
import axios from "axios";
import RNFetchBlob from "rn-fetch-blob";
import FormData from "form-data";
import uuid from "uuid";
import {
  ___BASE_UPLOAD_PICTURE___,
  ___CREATE_AD___,
  ___MODIFY_AD___
} from "../constants";
import { ___BOOK_IMG_RATIO___, SellType } from "../../utils/constants";
import { chatNewItem, chatModifyItem } from "./chat";

export const sellStart = () => {
  return {
    type: actionTypes.SELL_START
  };
};

export const sellSuccess = () => {
  return {
    type: actionTypes.SELL_SUCCESS
  };
};

export const sellFail = error => {
  return {
    type: actionTypes.SELL_FAIL,
    payload: {
      error
    }
  };
};

export const takePreview = data => {
  return {
    type: actionTypes.SELL_TAKEPREVIEW,
    payload: {
      data
    }
  };
};

export const setPreviewsOrder = order => {
  return {
    type: actionTypes.SELL_SET_PREVIEWSORDER,
    payload: {
      order
    }
  };
};

export const deletePreview = index => {
  return {
    type: actionTypes.SELL_DELETE_PREVIEW,
    payload: {
      index
    }
  };
};

export const selectBook = book => {
  return {
    type: actionTypes.SELL_SELECTBOOK,
    payload: {
      book
    }
  };
};

export const createBook = (isbn, title, author = "Sconosciuto", subject) => {
  return {
    type: actionTypes.SELL_CREATEBOOK,
    payload: {
      isbn,
      title,
      author,
      subject
    }
  };
};

export const sellSetInfos = ({ conditions, price, description }) => ({
  type: actionTypes.SELL_SET_INFOS,
  payload: {
    conditions,
    price,
    description
  }
});

export const sellAddReview = data => ({
  type: actionTypes.SELL_ADD_REVIEW,
  payload: {
    data
  }
});

export const sellRemoveReview = () => ({
  type: actionTypes.SELL_REMOVE_REVIEW
});

export const submit = () => {
  return (dispatch, getState) => {
    return new Promise(async function(resolve, reject) {
      const {
        previews,
        previewsOrder,
        book,
        price,
        conditions,
        description,
        loading,
        type,
        itemModId
      } = getState().sell;
      if (loading) return reject("Running already");
      dispatch(sellStart());
      let data = new FormData();
      let counter = 0;
      for (let i = 0; i < previewsOrder.length; i++) {
        let img = previews[previewsOrder[i]];
        if (img !== null) {
          if (!img.base64) {
            try {
              img.base64 = await getBase64IP(img.uri);
            } catch (err) {
              console.log(err);
            }
          }
          data.append(counter.toString(), img.base64);
          counter++;
        }
      }

      data.append("isbn", book.isbn);
      data.append("price", price);
      data.append("condition", conditions);
      data.append("description", description);

      let endpoint;
      if (type === SellType.MODIFY) {
        endpoint = ___MODIFY_AD___;
        data.append("item", itemModId);
      } else {
        endpoint = ___CREATE_AD___;
      }

      if (counter > 0) {
        axios
          .post(endpoint, data, {
            headers: {
              accept: "application/json",
              "Accept-Language": "en-US,en;q=0.8",
              "Content-Type": `multipart/form-data`
            }
          })
          .then(res => {
            console.log(res);
            type === SellType.NEW
              ? dispatch(chatNewItem(res.data.item))
              : dispatch(chatModifyItem(res.data));
            dispatch(sellSuccess());
            resolve();
          })
          .catch(err => {
            console.warn("Something went wrongato", "Error in creation");
            dispatch(sellFail(err));
            reject(err);
          });
      } else {
        dispatch(sellFail("No images selected"));
        reject("No images selected");
      }
    });
  };
};

export const sellStartSelling = () => dispatch => {
  dispatch({
    type: actionTypes.SELL_START_SELLING
  });
  NavigatorService.navigate("Camera");
};

export const sellStartModifying = item => dispatch => {
  dispatch({
    type: actionTypes.SELL_START_MODIFYING,
    payload: {
      item
    }
  });
  NavigatorService.navigate("Camera");
};

const getBase64IP = uri =>
  new Promise((resolve, reject) => {
    RNFetchBlob.config({
      fileCache: true
    })
      .fetch("GET", uri)
      // the image is now dowloaded to device's storage
      .then(resp => {
        // the image path you can use it directly with Image component
        imagePath = resp.path();
        return resp.readFile("base64");
      })
      .then(base64Data => {
        // here's base64 encoded image
        RNFetchBlob.fs.unlink(imagePath);
        resolve(base64Data);
        // remove the file from storage
      })
      .catch(err => reject(err));
  });
