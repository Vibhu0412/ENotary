import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'simplebar-react/dist/simplebar.min.css';
import 'flatpickr/dist/themes/light.css';
import '../src/assets/scss/app.scss';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from './store';
import { UserProvider } from './pages/auth/common/context';
import { notaryApi } from './services/notaryService';
import { authApi } from './services/authService';
import { commonApi } from './services/commonService';
import { adminApi } from './services/adminServices';
import { organizationApi } from './services/organizationService';
import { DevSupport } from '@react-buddy/ide-toolbox';
import { ComponentPreviews, useInitial } from './dev/index.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <BrowserRouter>
      <Provider
        store={store}
        api={(authApi, commonApi, adminApi, organizationApi, notaryApi)}
      >
        <UserProvider>
          <DevSupport ComponentPreviews={ComponentPreviews}
                      useInitialHook={useInitial}
          >
            <App />
          </DevSupport>
        </UserProvider>
      </Provider>
    </BrowserRouter>
  </>,
);
