import { all, fork, takeEvery, call, put } from "redux-saga/effects";
import axios from "axios";
import {
  GET_PROGRAMLIST_REQUEST,
  GET_PROGRAMLIST_SUCCESS,
  GET_PROGRAMLIST_FAILURE,
  ADD_PROGRAMITEM_REQUEST,
  ADD_PROGRAMITEM_SUCCESS,
  ADD_PROGRAMITEM_FAILURE,
  GET_GENRELIST_REQUEST,
  GET_GENRELIST_SUCCESS,
  GET_GENRELIST_FAILURE,
  GET_DETAILGENRELIST_REQUEST,
  GET_DETAILGENRELIST_SUCCESS,
  GET_DETAILGENRELIST_FAILURE,
  GET_AGEGRADELIST_REQUEST,
  GET_AGEGRADELIST_SUCCESS,
  GET_AGEGRADELIST_FAILURE
} from "../reducers/program";
import {
  SHOW_LOGINLAYER_REQUEST,
  HIDE_ADDPROGRAMMODAL_REQUEST
} from "../reducers/common";
import { LOG_OUT_SUCCESS } from "../reducers/user";
import { axiosErrorHandle } from "../module/error";
import { showToast } from "../module/toast";

function getListAPI({ lastId = 0, limit = 20 }) {
  return axios
    .get(`/program/list?lastId=${lastId}&limit=${limit}`)
    .then(response => ({ response }))
    .catch(error => ({ error }));
}
function addItemAPI(payload) {
  const {
    title,
    description,
    selectedFile,
    prdtYear,
    genre,
    detailGenre,
    ageGrade
  } = payload;

  const formData = new FormData();
  formData.append("title", title);
  formData.append("product_year", prdtYear);
  formData.append("genre", genre);
  formData.append("detailgenre", detailGenre);
  formData.append("agegrade", ageGrade);
  if (description) {
    formData.append("description", description);
  }
  if (selectedFile) {
    formData.append("file", selectedFile);
  }

  return axios
    .post("/program/add", formData, {
      withCredentials: true
    })
    .then(response => ({ response }))
    .catch(error => ({ error }));
}
function getGenreListAPI() {
  return axios
    .get("/program/genre")
    .then(response => ({ response }))
    .catch(error => ({ error }));
}
function getDetailGenreListAPI({ id }) {
  return axios
    .get(`/program/detailgenre?id=${id}`)
    .then(response => ({ response }))
    .catch(error => ({ error }));
}
function getAgeGradeListAPI() {
  return axios
    .get("/program/agegrade")
    .then(response => ({ response }))
    .catch(error => ({ error }));
}
function* getList(action) {
  const { response, error } = yield call(getListAPI, action.payload);
  if (response) {
    yield put({
      type: GET_PROGRAMLIST_SUCCESS,
      payload: response.data
    });
  } else if (error) {
    const { message, type } = axiosErrorHandle(error);
    yield put({
      type: GET_PROGRAMLIST_FAILURE,
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
      type: ADD_PROGRAMITEM_SUCCESS,
      payload: response.data
    });
    showToast({
      type: "success",
      message: response.data.message
    });
    yield put({
      type: GET_PROGRAMLIST_REQUEST,
      payload: {
        lastId: 0,
        limit: 20
      }
    });
    yield put({
      type: HIDE_ADDPROGRAMMODAL_REQUEST
    });
  } else if (error) {
    const { message, type, isExpired } = axiosErrorHandle(error);
    if (isExpired) {
      yield put({
        type: LOG_OUT_SUCCESS
      });
      yield put({
        type: HIDE_ADDPROGRAMMODAL_REQUEST
      });
      yield put({
        type: SHOW_LOGINLAYER_REQUEST
      });
    } else {
      yield put({
        type: ADD_PROGRAMITEM_FAILURE,
        payload: message
      });
    }
    showToast({
      type,
      message
    });
  }
}
function* getGenreList(action) {
  const { response, error } = yield call(getGenreListAPI);
  if (response) {
    yield put({
      type: GET_GENRELIST_SUCCESS,
      payload: response.data
    });
  } else if (error) {
    const { message, type } = axiosErrorHandle(error);
    yield put({
      type: GET_GENRELIST_FAILURE,
      payload: message
    });
    showToast({
      type,
      message
    });
  }
}
function* getDetailGenreList(action) {
  const { response, error } = yield call(getDetailGenreListAPI, action.payload);
  if (response) {
    yield put({
      type: GET_DETAILGENRELIST_SUCCESS,
      payload: response.data
    });
  } else if (error) {
    const { message, type } = axiosErrorHandle(error);
    yield put({
      type: GET_DETAILGENRELIST_FAILURE,
      payload: message
    });
    showToast({
      type,
      message
    });
  }
}
function* getAgeGradeList(action) {
  const { response, error } = yield call(getAgeGradeListAPI);
  if (response) {
    yield put({
      type: GET_AGEGRADELIST_SUCCESS,
      payload: response.data
    });
  } else if (error) {
    const { message, type } = axiosErrorHandle(error);
    yield put({
      type: GET_AGEGRADELIST_FAILURE,
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
  yield takeEvery(GET_PROGRAMLIST_REQUEST, getList);
}
// 등록
function* watchAddItem() {
  yield takeEvery(ADD_PROGRAMITEM_REQUEST, addItem);
}
// 장르 목록 로드
function* watchGetGenreList() {
  yield takeEvery(GET_GENRELIST_REQUEST, getGenreList);
}
// 세부장르 목록 로드
function* watchGetDetailGenreList() {
  yield takeEvery(GET_DETAILGENRELIST_REQUEST, getDetailGenreList);
}
// 연령등급 목록 로드
function* watchGetAgeGradeList() {
  yield takeEvery(GET_AGEGRADELIST_REQUEST, getAgeGradeList);
}
export default function*() {
  yield all([
    fork(watchGetList),
    fork(watchAddItem),
    fork(watchGetGenreList),
    fork(watchGetDetailGenreList),
    fork(watchGetAgeGradeList)
  ]);
}