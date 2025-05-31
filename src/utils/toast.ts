import { toast } from 'sonner';

export const showErrorToast = (
  message: string,
  description?: string,
  duration: number = 5000
) => {
  toast.error(message, {
    description,
    duration,
  });
};

export const showSuccessToast = (
  message: string,
  description?: string,
  duration: number = 5000
) => {
  toast.success(message, {
    description,
    duration,
  });
};

export const showInfoToast = (
  message: string,
  description?: string,
  duration: number = 5000
) => {
  toast.info(message, {
    description,
    duration,
  });
};

export const showLoadingToast = (
  message: string,
  description?: string,
  duration: number = 5000
) => {
  return toast.loading(message, {
    description,
    duration,
  });
};
