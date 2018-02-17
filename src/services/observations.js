import axios from 'axios';

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? 'https://kiitos-2018.herokuapp.com/'
    : 'http://127.0.0.1:5000/';

const API = axios.create({
  baseURL: baseUrl
});

const getPoints = () =>
  API.get('observation-points/').then(response => response.data);

const getDetails = id =>
  API.get(`observation-points/${id}/`).then(response => response.data);

export { getPoints, getDetails };
