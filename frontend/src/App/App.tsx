import store from '../store/store'
import Router from './Router'
import { Provider } from 'react-redux';

import '../css/App.scss'


function App() {

  return (
    <div className='app'>
      <Provider store={store}>
        <Router />
      </Provider>
    </div>
  )
}

export default App
