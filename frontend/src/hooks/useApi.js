import { useState, useCallback } from "react";
import axios from "axios";
import { API_URL } from "../config";

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (config) => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const headers = {
        ...config.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await axios({
        ...config,
        url: `${API_URL}${config.url}`,
        headers,
      });

      return response.data;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback(
    (url, config = {}) => {
      return request({ ...config, method: "GET", url });
    },
    [request]
  );

  const post = useCallback(
    (url, data, config = {}) => {
      return request({ ...config, method: "POST", url, data });
    },
    [request]
  );

  const put = useCallback(
    (url, data, config = {}) => {
      return request({ ...config, method: "PUT", url, data });
    },
    [request]
  );

  const patch = useCallback(
    (url, data, config = {}) => {
      return request({ ...config, method: "PATCH", url, data });
    },
    [request]
  );

  const del = useCallback(
    (url, config = {}) => {
      return request({ ...config, method: "DELETE", url });
    },
    [request]
  );

  const upload = useCallback(
    (url, file, config = {}) => {
      const formData = new FormData();
      formData.append("file", file);

      return request({
        ...config,
        method: "POST",
        url,
        data: formData,
        headers: {
          ...config.headers,
          "Content-Type": "multipart/form-data",
        },
      });
    },
    [request]
  );

  const download = useCallback(
    (url, config = {}) => {
      return request({
        ...config,
        method: "GET",
        url,
        responseType: "blob",
      });
    },
    [request]
  );

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    patch,
    delete: del,
    upload,
    download,
  };
};

export default useApi;
