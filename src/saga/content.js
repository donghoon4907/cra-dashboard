import { all, fork, takeEvery, call, put } from "redux-saga/effects";
import axios from "axios";
import {
  INACTIVE_CONTENTITEM,
  GET_CONTENTLIST_REQUEST,
  GET_CONTENTLIST_SUCCESS,
  GET_CONTENTLIST_FAILURE,
  ADD_CONTENTITEM_REQUEST,
  ADD_CONTENTITEM_SUCCESS,
  ADD_CONTENTITEM_FAILURE,
  UPDATE_CONTENTITEM_REQUEST,
  UPDATE_CONTENTITEM_SUCCESS,
  UPDATE_CONTENTITEM_FAILURE,
  SEARCH_CASTLIST_REQUEST,
  SEARCH_CASTLIST_SUCCESS,
  SEARCH_CASTLIST_FAILURE
} from "../reducers/content";
import {
  HIDE_ADDCONTENTMODAL,
  HIDE_UPDATECONTENTMODAL
} from "../reducers/common";
import { axiosErrorHandle } from "../module/error";
import { showToast } from "../module/toast";
import { makeListQuery } from "../module/query";

function getListAPI(payload) {
  return axios
    .get(makeListQuery({ type: "content", ...payload }))
    .then(response => ({ response }))
    .catch(error => ({ error }));
}
function addItemAPI(payload) {
  return axios
    .post(
      "/content/add",
      { ...payload },
      {
        withCredentials: true
      }
    )
    .then(response => ({ response }))
    .catch(error => ({ error }));
}
function updateItemAPI(payload) {
  const { id, description } = payload;

  const formData = new FormData();
  formData.append("id", id);
  if (description) {
    formData.append("description", description);
  }

  return axios
    .put("/content/update", formData, {
      withCredentials: true
    })
    .then(response => ({ response }))
    .catch(error => ({ error }));
}
function getCastListAPI(payload) {
  return axios
    .get(makeListQuery({ type: "cast", ...payload }))
    .then(response => ({ response }))
    .catch(error => ({ error }));
}
function* getList(action) {
  const { response, error } = yield call(getListAPI, action.payload);
  if (response) {
    yield put({
      type: GET_CONTENTLIST_SUCCESS,
      payload: response.data
    });
  } else if (error) {
    const { message, type } = axiosErrorHandle(error);
    yield put({
      type: GET_CONTENTLIST_FAILURE,
      payload: message
    });
    showToast({
      type,
      message
    });
  }
}
function* addItem(action) {
  const { response, error } = yield call(addItemAPI, action.payload);
  if (response) {
    yield put({
      type: ADD_CONTENTITEM_SUCCESS
    });
    showToast({
      type: "success",
      message: response.data.message
    });
    yield put({
      type: HIDE_ADDCONTENTMODAL
    });
  } else if (error) {
    const { message, type, isExpired } = axiosErrorHandle(error);
    if (isExpired) {
      window.location.reload();
    } else {
      yield put({
        type: ADD_CONTENTITEM_FAILURE,
        payload: message
      });
      showToast({
        type,
        message
      });
    }
  }
}
function* updateItem(action) {
  const { response, error } = yield call(updateItemAPI, action.payload);
  if (response) {
    yield put({
      type: UPDATE_CONTENTITEM_SUCCESS,
      payload: response.data.data
    });
    showToast({
      type: "success",
      message: response.data.message
    });
    yield put({
      type: INACTIVE_CONTENTITEM
    });
    yield put({
      type: HIDE_UPDATECONTENTMODAL
    });
  } else if (error) {
    const { message, type, isExpired } = axiosErrorHandle(error);
    if (isExpired) {
      window.location.reload();
    } else {
      yield put({
        type: UPDATE_CONTENTITEM_FAILURE,
        payload: message
      });
      showToast({
        type,
        message
      });
    }
  }
}
function* searchCastList(action) {
  const { response, error } = yield call(getCastListAPI, action.payload);
  if (response) {
    yield put({
      type: SEARCH_CASTLIST_SUCCESS,
      payload: response.data
    });
  } else if (error) {
    const { message, type } = axiosErrorHandle(error);
    yield put({
      type: SEARCH_CASTLIST_FAILURE,
      payload: message
    });
    showToast({
      type,
      message
    });
  }
}
// 목록 로드
function* watchGetList() {
  yield takeEvery(GET_CONTENTLIST_REQUEST, getList);
}
// 등록
function* watchAddItem() {
  yield takeEvery(ADD_CONTENTITEM_REQUEST, addItem);
}
// 수정
function* watchUpdateItem() {
  yield takeEvery(UPDATE_CONTENTITEM_REQUEST, updateItem);
}
// 츌욘잔 검색 결과 로드
function* watchCastSearchList() {
  yield takeEvery(SEARCH_CASTLIST_REQUEST, searchCastList);
}
export default function*() {
  yield all([
    fork(watchGetList),
    fork(watchAddItem),
    fork(watchUpdateItem),
    fork(watchCastSearchList)
  ]);
}
