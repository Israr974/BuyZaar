import toast from 'react-hot-toast';

const AxiosError = (error) => {
  const message = error?.response?.data?.message || "Something went wrong";
  toast.error(message);
};

export default AxiosError;
