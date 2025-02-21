import { createSlice } from "@reduxjs/toolkit";
import { login, loginByToken, logout, updateInfo } from "../Actions/UserActions";

const UserSlice = createSlice({
    name: "user",
    initialState: {
        information: null,
		message: '',
        isLoading: false,
        isError: false,
    },
    reducers: {
		resetUser: (state) => {
            state.information = null
        },
	},
    extraReducers: (builder) =>
        builder
			.addCase(login.fulfilled, (state, action) => {
				const data = action.payload.data
				
				state.information = data.information
				state.isError = false;
				state.message = action.payload.message
				state.isLoading = false;
			})
			.addCase(login.pending, (state) => {
				state.information = null,
				state.isError = false;
				state.isLoading = true;
			})
			.addCase(login.rejected, (state,action) => {
				state.information = null,
				state.message = action.payload.data.message
				state.isError = true;
				state.isLoading = false;
			})
			.addCase(loginByToken.fulfilled, (state,action) => {
				state.information = action.payload
			})
			.addCase(updateInfo.fulfilled, (state,action) => {
				const results = action.payload.data
				state.information = results.information
			})
			.addCase(logout.fulfilled,(state, action) => {
				if (action.payload) state.information = null
			})
		
});

export const { resetUser } = UserSlice.actions
export default UserSlice.reducer;
