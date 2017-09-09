import React from 'react';
import { render } from 'react-dom';
import Draft from './Draft';
import registerServiceWorker from './registerServiceWorker';

render(<Draft />, document.getElementById('root'));
registerServiceWorker();
