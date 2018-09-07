import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter as Router } from 'react-router-dom';
import 'react-dropzone-component/styles/filepicker.css'
import 'dropzone/dist/min/dropzone.min.css'
import App from './App';
import  './index.css'
import registerServiceWorker from './registerServiceWorker';
import { AuthProvider } from './AuthContext'

ReactDOM.render(
    <AuthProvider>
    <Router>
        <App />
    </Router>
    </AuthProvider>
    , 
    document.getElementById('root'));
registerServiceWorker();
