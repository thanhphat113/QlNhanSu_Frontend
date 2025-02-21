import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./Slices/UserSlice"
import MessageReducer from "./Slices/MessageSlice"

const store = configureStore({
	reducer: {
		user: UserReducer,
		message: MessageReducer,
	}
})

export default store