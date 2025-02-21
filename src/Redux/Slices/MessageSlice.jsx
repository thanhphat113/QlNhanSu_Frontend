import { createSlice } from "@reduxjs/toolkit";
import { login, logout, updateInfo } from "../Actions/UserActions";

const MessageSlice = createSlice({
    name: "message",
    initialState: {
        message: "",
        isSuccess: false,
        isError: false,
        isLoading: false,
    },
    reducers: {
        resetMessage: (state) => {
            state.message = "";
            state.isSuccess = false;
            state.isLoading = false;
            state.isError = false;
        },
        setMessage: (state,action)=> {
            state.message = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        }
    },
    extraReducers: (builder) =>
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.message = action.payload.data.message;
                state.isSuccess = true;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(login.pending, (state) => {
                state.isSuccess = false;
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(login.rejected, (state, action) => {
                state.message = action.payload.data.message;
                state.isSuccess = false;
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.message = "Đăng xuất thành công"
                state.isSuccess = true;
                state.isLoading = false;
                state.isError = false;
            })
            .addCase(logout.pending, (state) => {
                state.isSuccess = false;
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(logout.rejected, (state, action) => {
                state.message = "Thực hiện đăng xuất thất bại";
                state.isSuccess = false;
                state.isLoading = false;
                state.isError = true;
            })
            .addCase(updateInfo.fulfilled,(state, action) => {
                const results = action.payload.data
                state.message = results.message
                state.isLoading = false
            })
            .addCase(updateInfo.pending,(state, action) => {
                state.isSuccess = false;
                state.isLoading = true;
                state.isError = false;
            })
            .addCase(updateInfo.rejected,(state, action) => {
                state.message = "Thực hiện tác vụ cập nhật thất bại"
                state.isSuccess = false;
                state.isLoading = false;
                state.isError = true;
            })
});

export const { resetMessage, setMessage,setLoading } = MessageSlice.actions;
export default MessageSlice.reducer;
