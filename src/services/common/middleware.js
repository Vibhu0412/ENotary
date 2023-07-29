import { assertOptionalCallExpression } from '@babel/types';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const rtkQueryErrorLogger = api => next => action => {
  if (isRejectedWithValue(action)) {
    let error = action?.payload?.data?.message;

    if (error === undefined) {
      error = action?.payload?.data?.error;
    }
    toast.error(`${error}`, {
      position: 'top-right',
      autoClose: 5500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  }

  return next(action);
};
