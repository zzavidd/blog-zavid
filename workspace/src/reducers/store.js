
import { createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from '~/reducers/reducers';

const config = {
	key: 'root',
	storage: storage
}

const persistedReducer = persistReducer(config, rootReducer);

export default () => {
	let store = createStore(persistedReducer);
	let persistor = persistStore(store);
	return { store, persistor };
}