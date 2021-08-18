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
      const licenseToUpdate = action.payload.license._id;
      return {
        ...state,
        licenses: state.licenses.forEach(lic => {
          if (lic._id === licenseToUpdate) {
            return action.payload.license;
          } else {
            return lic;
          }
        }),
        isLoaded: true
      };
    default:
      return state;
  }
}

export default licenseReducer;
