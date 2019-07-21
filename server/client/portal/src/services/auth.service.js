import { Http } from '../utils/Http';

export function register(data) {
  return Http.post(`/api/signup`, data);
}

export function login(data) {
  return Http.post(`/api/login`, data);
}

export function me() {
  return Http.get(`/api/me`);
}
