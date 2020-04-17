import produce from "immer";
// 목록 가져오기
export const GET_CONTENTLIST_REQUEST = "GET_CONTENTLIST_REQUEST";
export const GET_CONTENTLIST_SUCCESS = "GET_CONTENTLIST_SUCCESS";
export const GET_CONTENTLIST_FAILURE = "GET_CONTENTLIST_FAILURE";
// 등록
export const ADD_CONTENTITEM_REQUEST = "ADD_CONTENTITEM_REQUEST";
export const ADD_CONTENTITEM_SUCCESS = "ADD_CONTENTITEM_SUCCESS";
export const ADD_CONTENTITEM_FAILURE = "ADD_CONTENTITEM_FAILURE";
// 수정
export const UPDATE_CONTENTITEM_REQUEST = "UPDATE_CONTENTITEM_REQUEST";
export const UPDATE_CONTENTITEM_SUCCESS = "UPDATE_CONTENTITEM_SUCCESS";
export const UPDATE_CONTENTITEM_FAILURE = "UPDATE_CONTENTITEM_FAILURE";
// 목록 초기화
export const INIT_CONTENTLIST = "INIT_CONTENTLIST";
// 특정 프로그램 활성화
export const ACTIVE_CONTENTITEM = "ACTIVE_CONTENTITEM";
// 특정 프로그램 비활성화
export const INACTIVE_CONTENTITEM = "INACTIVE_CONTENTITEM";
// 등록 초기화
export const INIT_ADDCONTENT = "INIT_ADDCONTENT";

export const initialState = {
  isGetListLoading: false, // 목록 가져오기 시도 중 여부
  isAddItemLoading: false, // 등록 시도 중 여부
  isUpdateItemLoading: false, // 수정 시도 중 여부
  activeContent: null, // 현재 수정 중인 컨텐츠 정보
  getListErrorReason: "", // 목록 가져오기 요청 오류 사유
  addItemErrorReason: "", // 등록 요청 오류 사유
  updateItemErrorReason: "", // 수정 요청 오류 사유
  loadedContent: null, // 가져온 목록 정보
  isSuccessAddItem: false // 등록 성공 여부
};

export default (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_CONTENTLIST_REQUEST: {
        draft.isGetListLoading = true;
        break;
      }
      case GET_CONTENTLIST_SUCCESS: {
        draft.isGetListLoading = false;
        if (draft.loadedContent) {
          draft.loadedContent = draft.loadedContent.concat(action.payload);
        } else {
          draft.loadedContent = action.payload;
        }
        break;
      }
      case GET_CONTENTLIST_FAILURE: {
        draft.isGetListLoading = false;
        draft.getListErrorReason = action.payload;
        break;
      }
      case ADD_CONTENTITEM_REQUEST: {
        draft.isAddItemLoading = true;
        break;
      }
      case ADD_CONTENTITEM_SUCCESS: {
        draft.isAddItemLoading = false;
        draft.isSuccessAddItem = true;
        break;
      }
      case ADD_CONTENTITEM_FAILURE: {
        draft.isAddItemLoading = false;
        draft.addItemErrorReason = action.payload;
        break;
      }
      case UPDATE_CONTENTITEM_REQUEST: {
        draft.isUpdateItemLoading = true;
        break;
      }
      case UPDATE_CONTENTITEM_SUCCESS: {
        draft.isUpdateItemLoading = false;
        draft.loadedContent = draft.loadedContent.map((program) => {
          if (program.id === action.payload.id) {
            return action.payload;
          }
          return program;
        });
        break;
      }
      case UPDATE_CONTENTITEM_FAILURE: {
        draft.isUpdateItemLoading = false;
        draft.updateItemErrorReason = action.payload;
        break;
      }
      case INIT_CONTENTLIST: {
        draft.loadedContent = null;
        break;
      }
      case INIT_ADDCONTENT: {
        draft.isSuccessAddItem = false;
        break;
      }
      case ACTIVE_CONTENTITEM: {
        if (draft.loadedContent && draft.loadedContent.length > 0) {
          draft.activeContent = action.payload;
        }
        break;
      }
      case INACTIVE_CONTENTITEM: {
        draft.activeContent = null;
        break;
      }
      default:
        return state;
    }
  });
