export const environment = {
  production: true,
  isMockEnabled: true, // You have to switch this, when your real back-end is done
  // API_GATEWAY_ENDPOINT: 'http://18.136.101.195:8080/api/',
  API_GATEWAY_ENDPOINT: 'http://localhost:8080/api/',
  TOKEN_API: '5beeb41f-bbd7-11ec-935b-4e3cff801388',
  timer: 120, // seconds
  ROLE: {
    // admin
    ADMIN: 'ROLE_ADMIN', // quan ly
    USER: 'ROLE_USER', // nguoi dung
  },
};
