import { CLIENT_API } from 'common/reduxMiddlewares/requester';
import { createActionTypes } from 'client/common/redux-actions';

const actionTypes = createActionTypes('@@welogix/cwm/whselocation/', [
  'LOAD_LIMIT_LOCATIONS', 'LOAD_LIMIT_LOCATIONS_SUCCEED', 'LOAD_LIMIT_LOCATIONS_FAIL',
  'LOAD_ADVICE_LOCATIONS', 'LOAD_ADVICE_LOCATIONS_SUCCEED', 'LOAD_ADVICE_LOCATIONS_FAIL',
  'LOAD_LOCATIONS', 'LOAD_LOCATIONS_SUCCEED', 'LOAD_LOCATIONS_FAIL',
  'SHOW_LOCATION_MODAL', 'HIDE_LOCATION_MODAL',
  'ADD_LOCATION', 'ADD_LOCATION_SUCCEED', 'ADD_LOCATION_FAIL',
  'DELETE_LOCATIONS', 'DELETE_LOCATIONS_SUCCEED', 'DELETE_LOCATIONS_FAIL',
  'UPDATE_LOCATIONS', 'UPDATE_LOCATIONS_SUCCEED', 'UPDATE_LOCATIONS_FAIL',
  'ADD_ZONE', 'ADD_ZONE_SUCCEED', 'ADD_ZONE_FAIL',
  'LOAD_ZONE', 'LOAD_ZONE_SUCCEED', 'LOAD_ZONE_FAIL',
  'DELETE_ZONE', 'DELETE_ZONE_SUCCEED', 'DELETE_ZONE_FAIL',
  'UPDATE_ZONE', 'UPDATE_ZONE_SUCCEED', 'UPDATE_ZONE_FAIL',
  'SHOW_ZONE_MODAL', 'HIDE_ZONE_MODAL', 'SWITCH_ZONE',
  'LOAD_WHOLE_LOCATIONSTAT', 'LOAD_WHOLE_LOCATIONSTAT_SUCCEED', 'LOAD_WHOLE_LOCATIONSTAT_FAIL',
  'GET_ADVISED_LOCATIONS', 'GET_ADVISED_LOCATIONS_SUCCEED', 'GET_ADVISED_LOCATIONS_FAIL',
  'TOGGLE_PRODUCT_CONFIG_MODAL',
  'CREATE_LOC_PRODUCT_CONFIG', 'CREATE_LOC_PRODUCT_CONFIG_SUCCEED', 'CREATE_LOC_PRODUCT_CONFIG_FAIL',
  'GET_LOC_PRODUCT_CONFIG', 'GET_LOC_PRODUCT_CONFIG_SUCCEED', 'GET_LOC_PRODUCT_CONFIG_FAIL',
]);

const initialState = {
  locations: [],
  locationFilter: { search: '', zoneCode: '', warehouseCode: '' },
  locationLoading: false,
  locationStat: {
    totalCount: 0,
    locationIds: [],
  },
  locationModal: {
    visible: false,
  },
  productConfigModal: {
    visible: false,
    location: '',
  },
  editLocation: {
    type: '1',
    status: '1',
    location: '',
  },
  locationReload: false,
  zoneModal: {
    visible: false,
  },
  zoneList: [],
  currentZone: {},
  zoneLoading: true,
  zoneReload: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case actionTypes.LOAD_LOCATIONS:
      return {
        ...state,
        locations: [],
        locationFilter: JSON.parse(action.params.filter),
        locationLoading: true,
      };
    case actionTypes.LOAD_LOCATIONS_SUCCEED:
      return {
        ...state,
        locations: action.result.data.data,
        locationStat: {
          ...state.locationStat,
          totalCount: action.result.data.totalCount,
        },
        locationLoading: false,
        locationReload: false,
      };
    case actionTypes.LOAD_LOCATIONS_FAIL:
      return { ...state, locationReload: false, locationLoading: false };
    case actionTypes.SHOW_LOCATION_MODAL:
      return {
        ...state,
        locationModal: {
          ...state.locationModal,
          visible: true,
        },
        editLocation: action.data ? action.data : initialState.editLocation,
      };
    case actionTypes.HIDE_LOCATION_MODAL:
      return { ...state, locationModal: { ...state.locationModal, visible: false } };
    case actionTypes.UPDATE_LOCATIONS_SUCCEED:
      return { ...state, locationReload: true };
    case actionTypes.ADD_LOCATION_SUCCEED:
      return { ...state, locationReload: true };
    case actionTypes.LOAD_ZONE:
      return { ...state, zoneLoading: true };
    case actionTypes.LOAD_ZONE_SUCCEED: {
      const currentZone = action.result.data[0];
      const newState = {
        ...state,
        zoneList: action.result.data,
        currentZone,
        zoneLoading: false,
        zoneReload: false,
      };
      if (currentZone) {
        newState.locationReload = true;
      } else {
        newState.locations = initialState.locations;
        newState.locationStat = initialState.locationStat;
      }
      return newState;
    }
    case actionTypes.LOAD_ZONE_FAIL:
      return { ...state, zoneLoading: false, zoneReload: false };
    case actionTypes.DELETE_ZONE_SUCCEED:
      return { ...state, zoneReload: true };
    case actionTypes.SHOW_ZONE_MODAL:
      return { ...state, zoneModal: { ...state.zoneModal, visible: true } };
    case actionTypes.HIDE_ZONE_MODAL:
      return { ...state, zoneModal: { ...state.zoneModal, visible: false } };
    case actionTypes.TOGGLE_PRODUCT_CONFIG_MODAL:
      return {
        ...state,
        productConfigModal: {
          ...state.productConfigModal,
          visible: action.data.visible,
          location: action.data.data && action.data.data.location,
        },
      };
    case actionTypes.UPDATE_ZONE_SUCCEED:
      return { ...state, zoneReload: true };
    case actionTypes.LOAD_WHOLE_LOCATIONSTAT_SUCCEED:
      return {
        ...state,
        locationStat: {
          ...state.locationStat,
          ...action.result.data,
        },
      };
    case actionTypes.SWITCH_ZONE:
      return {
        ...state,
        currentZone: action.data,
        locationReload: true,
      };
    default:
      return state;
  }
}

export function loadLimitLocations(whseCode, zoneCode, text) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_LIMIT_LOCATIONS,
        actionTypes.LOAD_LIMIT_LOCATIONS_SUCCEED,
        actionTypes.LOAD_LIMIT_LOCATIONS_FAIL,
      ],
      endpoint: 'v1/cwm/whse/limit/locations',
      method: 'get',
      params: { whseCode, zoneCode, text },
    },
  };
}

export function loadAdviceLocations(productNo, whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ADVICE_LOCATIONS,
        actionTypes.LOAD_ADVICE_LOCATIONS_SUCCEED,
        actionTypes.LOAD_ADVICE_LOCATIONS_FAIL,
      ],
      endpoint: 'v1/cwm/whse/advice/locations',
      method: 'get',
      params: { productNo, whseCode },
    },
  };
}

export function getPrintAdvisedLocations(productInfos, whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_ADVISED_LOCATIONS,
        actionTypes.GET_ADVISED_LOCATIONS_SUCCEED,
        actionTypes.GET_ADVISED_LOCATIONS_FAIL,
      ],
      endpoint: 'v1/cwm/whse/printadvisedlocation',
      method: 'post',
      data: { productInfos, whseCode },
    },
  };
}

export function loadPagedLocations(current, pageSize, filterJson) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_LOCATIONS,
        actionTypes.LOAD_LOCATIONS_SUCCEED,
        actionTypes.LOAD_LOCATIONS_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/location/load',
      method: 'get',
      params: {
        current, pageSize, filter: filterJson,
      },
    },
  };
}

export function loadLocationStat(warehouseCode, zoneCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_WHOLE_LOCATIONSTAT,
        actionTypes.LOAD_WHOLE_LOCATIONSTAT_SUCCEED,
        actionTypes.LOAD_WHOLE_LOCATIONSTAT_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/locationstat',
      method: 'get',
      params: { warehouseCode, zoneCode },
    },
  };
}

export function showLocationModal(row) {
  return {
    type: actionTypes.SHOW_LOCATION_MODAL,
    data: row,
  };
}

export function hideLocationModal() {
  return {
    type: actionTypes.HIDE_LOCATION_MODAL,
  };
}

export function toggleProductConfigModal(visible, data) {
  return {
    type: actionTypes.TOGGLE_PRODUCT_CONFIG_MODAL,
    data: { visible, data },
  };
}

export function addLocation(whseCode, zoneCode, location, type, status, loginId) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_LOCATION,
        actionTypes.ADD_LOCATION_SUCCEED,
        actionTypes.ADD_LOCATION_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/location/add',
      method: 'post',
      data: {
        whseCode, zoneCode, location, type, status, loginId,
      },
    },
  };
}

export function deleteLocation(id) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_LOCATIONS,
        actionTypes.DELETE_LOCATIONS_SUCCEED,
        actionTypes.DELETE_LOCATIONS_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/dellocation',
      method: 'post',
      data: { id },
    },
  };
}

export function updateLocation(type, status, location, id, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_LOCATIONS,
        actionTypes.UPDATE_LOCATIONS_SUCCEED,
        actionTypes.UPDATE_LOCATIONS_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/location/update',
      method: 'post',
      data: {
        type, status, location, id, contentLog,
      },
    },
  };
}

export function addZone(params) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.ADD_ZONE,
        actionTypes.ADD_ZONE_SUCCEED,
        actionTypes.ADD_ZONE_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/zone/add',
      method: 'get',
      params,
    },
  };
}

export function loadZones(whseCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.LOAD_ZONE,
        actionTypes.LOAD_ZONE_SUCCEED,
        actionTypes.LOAD_ZONE_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/zone/load',
      method: 'get',
      params: { whseCode },
    },
  };
}

export function deleteZone(whseCode, zoneCode) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.DELETE_ZONE,
        actionTypes.DELETE_ZONE_SUCCEED,
        actionTypes.DELETE_ZONE_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/zone/delete',
      method: 'get',
      params: { whseCode, zoneCode },
    },
  };
}

export function updateZone(whseCode, zoneCode, id, zoneName, contentLog) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.UPDATE_ZONE,
        actionTypes.UPDATE_ZONE_SUCCEED,
        actionTypes.UPDATE_ZONE_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/zone/update',
      method: 'get',
      params: {
        whseCode, zoneCode, id, zoneName, contentLog,
      },
    },
  };
}

export function showZoneModal() {
  return {
    type: actionTypes.SHOW_ZONE_MODAL,
  };
}

export function hideZoneModal() {
  return {
    type: actionTypes.HIDE_ZONE_MODAL,
  };
}

export function switchZone(zone) {
  return {
    type: actionTypes.SWITCH_ZONE,
    data: zone,
  };
}

export function createLocProductconfig(data) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.CREATE_LOC_PRODUCT_CONFIG,
        actionTypes.CREATE_LOC_PRODUCT_CONFIG_SUCCEED,
        actionTypes.CREATE_LOC_PRODUCT_CONFIG_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/location/newlocproduct',
      method: 'post',
      data,
    },
  };
}

export function getLocProductconfig(whseCode, location) {
  return {
    [CLIENT_API]: {
      types: [
        actionTypes.GET_LOC_PRODUCT_CONFIG,
        actionTypes.GET_LOC_PRODUCT_CONFIG_SUCCEED,
        actionTypes.GET_LOC_PRODUCT_CONFIG_FAIL,
      ],
      endpoint: 'v1/cwm/warehouse/location/locproductlist',
      method: 'get',
      params: { whseCode, location },
    },
  };
}
