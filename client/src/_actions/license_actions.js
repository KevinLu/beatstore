import axios from 'axios';
import {
  GET_USER_LICENSES,
  CREATE_LICENSE,
  DELETE_LICENSE,
  TOGGLE_LICENSE_ACTIVATION,
  UPDATE_LICENSE,
} from '../_actions/types';
import {LICENSE_SERVER} from '../components/Config';

export function getUserLicenses() {
  const request = axios.get(`${LICENSE_SERVER}/licenses`)
    .then(response => response.data);

  return {
    type: GET_USER_LICENSES,
    payload: request
  }
}

export function createLicense(licenseInfo) {
  const request = axios.post(`${LICENSE_SERVER}/create`, licenseInfo)
    .then(response => response.data);

  return {
    type: CREATE_LICENSE,
    payload: request
  }
}

export function deleteLicense(licenseId) {
  const request = axios.delete(`${LICENSE_SERVER}/delete?id=${licenseId}`)
    .then(response => response.data);

  return {
    type: DELETE_LICENSE,
    payload: request
  }
}

export function updateLicense(licenseId, licenseInfo) {
  const request = axios.put(`${LICENSE_SERVER}/update?id=${licenseId}`, licenseInfo)
    .then(response => response.data);

  return {
    type: UPDATE_LICENSE,
    payload: request
  }
}

export function toggleLicenseActivation(licenseId) {
  const request = axios.put(`${LICENSE_SERVER}/toggle?id=${licenseId}`)
    .then(response => response.data);

  return {
    type: TOGGLE_LICENSE_ACTIVATION,
    payload: request
  }
}
