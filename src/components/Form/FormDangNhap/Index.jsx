import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

import * as Yup from "yup";
import SubmitButton from "../../Button/SubmitButton/Index";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../../../Redux/Actions/UserActions";
import { handleErrorResponse } from "../../../DefaultActions";

function FormDangNhap() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
        },
        validationSchema: Yup.object({
            username: Yup.string().required("Tài khoản không được để trống"),
            password: Yup.string()
                .min(6, "Mật khẩu phải dài hơn 6 ký tự")
                .required("Mật khẩu không được để trống"),
        }),
        onSubmit: (values) => {
            Login(values);
        },
    });

    const Login = async (values) => {
        try {
            await dispatch(login(values));
            navigate("/");
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    return (
        <form
            className="flex flex-col gap-5 px-5 py-16 text-white rounded-[10px] shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            onSubmit={formik.handleSubmit}
        >
            <h1 className="text-6xl text-center font-bold">ĐĂNG NHẬP</h1>
            <div className="mb-5">
                <div className="flex justify-between gap-2 text-4xl">
                    <div className="w-[4rem] h-[4rem] flex justify-center items-center">
                        <i className="fas fa-user"></i>
                    </div>
                    <input
                        className="flex-1 outline-0"
                        type="text"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        name="username"
                        onBlur={formik.handleBlur}
                        placeholder="Tên đăng nhập..."
                    ></input>
                </div>
                <hr className=" text-2xl"></hr>
                {formik.errors.username && formik.touched.username && (
                    <p className="text-red-500 text-2xl mt-1 [text-shadow:0px_0px_5px_black]">* {formik.errors.username}</p>
                )}
            </div>

            <div>
                <div className="flex justify-between gap-2 text-4xl">
                    <div className="w-[4rem] h-[4rem] flex justify-center items-center">
                        <i className="fas fa-key"></i>
                    </div>
                    <input
                        className="flex-1 outline-0"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        name="password"
                        placeholder="******"
                        onBlur={formik.handleBlur}
                    ></input>
                </div>
                <hr className=" text-2xl"></hr>
                {formik.errors.password && formik.touched.password && (
                    <p className="text-red-500 text-2xl mt-1 [text-shadow:0px_0px_5px_black]">* {formik.errors.password}</p>
                )}
            </div>

            <SubmitButton label="Đăng nhập" />
        </form>
    );
}

export default FormDangNhap;
