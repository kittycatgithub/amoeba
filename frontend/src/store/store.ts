import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./slices/filterSlice";
import propertyReducer from './slices/propertySlice';
import wishlistReducer from './slices/wishlistSlice';
import shortlistReducer from "./slices/shortlistSlice";
import userReducer from "./slices/userSlice";
import adminReducer from './slices/adminSlice';
import settingsReducer from "./slices/settingsSlice";

const store = configureStore({
    reducer: {
        filters: filterReducer,
        property: propertyReducer,
        wishlist:  wishlistReducer,
        shortlist: shortlistReducer,
        user: userReducer,
        admin: adminReducer,   //connecting adminSlice into store
        settings: settingsReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store