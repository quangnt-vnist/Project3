import { managerConstants } from "./constants";
var findIndex = (array, id) => {
  var result = -1;
  array.forEach((value, index) => {
    if (value._id === id) {
      result = index;
    }
  });
  return result;
}
export function managerKpiUnit(state = {}, action) {
  switch (action.type) {
    case managerConstants.GETALL_KPIUNIT_REQUEST:
      return {
        loading: true,
        isLoading: true
      };
    case managerConstants.GETALL_KPIUNIT_SUCCESS:
      return {
        ...state,
        loading: false,
        kpis: action.payload,
        isLoading: false
      };
    case managerConstants.GETALL_KPIUNIT_FAILURE:
      return {
        error: action.payload,
        isLoading: false
      };
    case managerConstants.GETCHILDTARGET_CURRENTTARGET_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      };
    case managerConstants.GETCHILDTARGET_CURRENTTARGET_SUCCESS:
      return {
        ...state,
        loading: false,
        childtarget: action.payload,
        isLoading: false
      };
    case managerConstants.GETCHILDTARGET_CURRENTTARGET_FAILURE:
      return {
        error: action.payload,
        isLoading: false
      };
    case managerConstants.COPY_KPIUNIT_REQUEST:
      return {
        ...state,
        adding: true,
        isLoading: false
      };
    case managerConstants.COPY_KPIUNIT_SUCCESS:
      return {
        ...state,
        adding: false,
        kpis: action.payload,
        isLoading: false
      };
    case managerConstants.COPY_KPIUNIT_FAILURE:
      return {
        error: action.payload,
        isLoading: false
      };
    case managerConstants.CALCULATE_KPIUNIT_REQUEST:
      return {
        ...state,
        loading: true,
        isLoading: true
      };
    case managerConstants.CALCULATE_KPIUNIT_SUCCESS:
      // let index = findIndex(state.kpis, action.payload.kpiUnitSet.id)
      // state.kpis[index] = action.payload.kpiUnitSet;

      return {
        ...state,
        isLoading: false,
        childtarget: action.payload.childrenKpi,
        kpis: state.kpis.map(kpi =>
          kpi._id === action.payload.kpiUnitSet._id ? action.payload.kpiUnitSet : kpi
        )
      }
    case managerConstants.CALCULATE_KPIUNIT_FAILURE:
      return {
        error: action.payload,
        isLoading: false
      };
    default:
      return state
  }
}