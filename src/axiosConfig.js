import axios from "axios";
import axiosRetry from "axios-retry";

axiosRetry(axios, {
  retries: 3,
  retryDelay: (retryCount) => {
    const delay = retryCount * 1000;
    console.log(`Retry attempt #${retryCount}, delaying request by ${delay}ms`);
    return delay;
  },
  retryCondition: (error) => {
    const shouldRetry = error.response?.status === 504;
    console.log(`Retry condition checked: ${shouldRetry}`);
    return shouldRetry;
  },
});

export default axios;
