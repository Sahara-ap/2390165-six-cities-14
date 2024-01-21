import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { StatusCodes } from 'http-status-codes';
import { getToken } from './token';
// import { processErrorHandle } from '../../utilities/utilities';
import { toast } from 'react-toastify';

type DetailMessageError = {
  type: string;
  message: string;
}

const StatusCodesMapping: Record<number, boolean> = {
  [StatusCodes.BAD_REQUEST]: true,
  [StatusCodes.UNAUTHORIZED]: true,
  [StatusCodes.NOT_FOUND]: true
};

function shouldDisplayError(response: AxiosResponse) {
  return Boolean(StatusCodesMapping[response.status]);
}

const BASE_URL = 'https://14.design.pages.academy/six-cities';
const REQUEST_TIMEOUT = 5000;

function createAPI(): AxiosInstance {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getToken();

      if (token && config.headers) {
        config.headers['x-token'] = token;
      }

      return config;
    });

  api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<DetailMessageError>) => {
      if (error.response && shouldDisplayError(error.response)) {
        const detailMessage = error.response.data;
        // processErrorHandle(detailMessage.message);
        toast.warn(detailMessage.message);
      }

      throw error;
    });

  return api;
}


export {
  createAPI,
};
