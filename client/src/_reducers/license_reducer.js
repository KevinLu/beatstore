import {
  GET_USER_LICENSES,
  CREATE_LICENSE,
  DELETE_LICENSE,
  TOGGLE_LICENSE_ACTIVATION,
  UPDATE_LICENSE,
} from '../_actions/types';

const initialState = {
  licenses: [],
  isLoaded: false
}

const licenseReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USER_LICENSES:
      return {...state, licenses: action.payload.licenses, isLoaded: true};
    case CREATE_LICENSE:
      return {...state, licenses: [...state.licenses, action.payload.license], isLoaded: true};
    case DELETE_LICENSE:
      const deletedLicenseId = action.payload.licenseId;
      return {...state, licenses: state.licenses.filter(lic => lic._id !== deletedLicenseId), isLoaded: true};
    case TOGGLE_LICENSE_ACTIVATION:
      const updatedLicenseId = action.payload.licenseId;
      return {...state, licenses: state.licenses.map(lic => lic._id === updatedLicenseId ? {...lic, enabled: !lic.enabled} : lic)};
    case UPDATE_LICENSE:
      return {
        ...state,
        licenses: state.licenses.map(lic => lic._id === action.payload.licenseId ? action.payload.license : lic)
      };
    default:
      return state;
  }
}

export default licenseReducer;
