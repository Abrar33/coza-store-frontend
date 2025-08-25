import { toast } from 'react-toastify';

export const showError = (message) => {
  toast.error(message, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    pauseOnHover: true,
    theme: 'colored',
  });
};