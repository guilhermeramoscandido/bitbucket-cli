import axios from 'axios';
import Logger from '../logger/logger.js';

const logger = Logger(import.meta.url);

export class BaseApiService {
    authToken = '';

    constructor(authToken) {
        this.authToken = authToken;
    }

    async getToken() {
        try {
            const response = await axios.post('https://api.bitbucket.org/2.0/tokens', {
                grant_type: 'client_credentials'
            }, {
                auth: {
                    username: process.env.BITBUCKET_CLIENT_ID,
                    password: process.env.BITBUCKET_SECRET
                }
            });
            return response.data.access_token;
        } catch (error) {
            console.error('Error fetching token:', error.response ? error.response.data : error);
        }
    }

    async get(url) {
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `Bearer ${this.authToken}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            if (error.response && error.response.data) {
                console.error('Error fetching data:', error.response.data);
                logger.info(JSON.stringify(error.response.data));
            } else {
                console.error('Error fetching data:', error);
            }
        }
    }

    async post(url, data) {
        try {
            const response = await axios.post(url, data, {
                headers: {
                    Authorization: `Bearer ${this.authToken}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                logger.info(JSON.stringify(error.response.data));
                throw new Error(JSON.stringify(error.response.data))
            } else {
                console.error('Error posting data:', error);
            }
        }
    }

    async put(url, data) {
        try {
            const response = await axios.put(url, data, {
                headers: {
                    Authorization: `Bearer ${this.authToken}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Error updating data:', error.response.data);
                logger.info(JSON.stringify(error.response.data));
            } else {
                console.error('Error updating data:', error);
            }
        }
    }

    async delete(url) {
        try {
            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Bearer ${this.authToken}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            if (error.response && error.response.data) {
                console.error('Error deleting data:', error.response.data);
                logger.info(JSON.stringify(error.response.data));
            } else {
                console.error('Error deleting data:', error);
            }
        }
    }

    async deleteWithAppPassword(url) {
        try {
            const response = await axios.delete(url, {
                headers: {
                    Authorization: `Basic ${process.env.APP_PASSWORD_BASE64}`,
                    Accept: 'application/json'
                }
            });
            
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                console.error('Error deleting data:', error.response.data);
                logger.info(JSON.stringify(error.response.data));
            } else {
                console.error('Error deleting data:', error);
            }
        }
    }


    async putWithAppPassword(url, data) {
        try {
            const response = await axios.put(url, data, {
                headers: {
                    Authorization: `Basic ${process.env.APP_PASSWORD_BASE64}`,
                    Accept: 'application/json'
                }
            });

            return response.data;
        } catch (error) {

            if (error.response.data) {
                console.error('Error updating data:', error.response.data);
            } else {
                console.error('Error updating data:', error);
            }
        }
    }
}