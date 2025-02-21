import { createAsyncThunk } from "@reduxjs/toolkit";
import Api from "../../Api";

export const login = createAsyncThunk("login", async (values) => {
    try {
        const response = await Api.post(
            "/api/TaiKhoan/Login",
            { username: values.username, password: values.password }
        );
        
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
});

export const logout = createAsyncThunk("logout", async () => {
    try {
        const response = await Api.get(
            "/api/TaiKhoan/Logout"
        );
        
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
});

export const loginByToken = createAsyncThunk("login-account", async () => {
    try {
        const response = await Api.get(
            "/api/NhanVien/user-login"
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
});


export const updateInfo = createAsyncThunk("update-info", async (values) => {
    try {
        const response = await Api.put(
            "/api/NhanVien",
            values
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
});
