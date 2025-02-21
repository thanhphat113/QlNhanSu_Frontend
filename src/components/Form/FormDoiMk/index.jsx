import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../Button/SubmitButton/Index";
import { handleErrorResponse, handleMessage } from "../../../DefaultActions";
import Api from "../../../Api";
import {  useSelector } from "react-redux";

function FormDoiMk({setIsToggle}) {
	const user = useSelector(state => state.user.information)

    const formik = useFormik({
        initialValues: {
			idNhanVien: user.idNhanVien,
            oldPassword: "",
            newPassword: "",
            rePassword: "",
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string()
                .min(6, "Mật khẩu phải ít nhất có 6 giá trị")
                .required("Vui lòng nhập lại mật khẩu cũ"),
            newPassword: Yup.string()
                .notOneOf(
                    [Yup.ref("oldPassword")],
                    "Mật khẩu mới không được giống mật khẩu cũ"
                )
                .min(6, "Mật khẩu phải ít nhất có 6 giá trị")
                .required("Vui lòng nhập lại mật khẩu mới"),
            rePassword: Yup.string()
                .oneOf([Yup.ref("newPassword")], "Mật khẩu nhập lại không khớp")
                .min(6, "Mật khẩu phải ít nhất có 6 giá trị")
                .required("Vui lòng nhập lại mật khẩu"),
        }),
        onSubmit: async (values) => {
            submitUpdate(values);
        },
    });

    const submitUpdate = async (values) => {
        try {
            const response = await Api.put("/api/TaiKhoan/update-password", values);
            handleMessage(response.data.message);
			setIsToggle(false)
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="relative w-[60rem] bg-white p-5 flex flex-col gap-5"
        >
            <i
                onClick={() => setIsToggle(false)}
                className="text-3xl fas fa-times hover:text-red-500 absolute right-5 cursor-pointer"
            ></i>
            <h1 className="text-center text-4xl">ĐỔI MẬT KHẨU</h1>
            <div className="w-full flex flex-col gap-5 mt-5">
                <div className="flex justify-between gap-5">
                    <p className="w-1/3">Mật khẩu cũ</p>
                    <input
                        type="password"
                        name="oldPassword"
                        value={formik.values.oldPassword}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        className=" flex-1 border ps-2"
                    ></input>
                </div>
                {formik.errors.oldPassword && formik.touched.oldPassword && (
                    <p className="text-red-500 text-2xl mt-1">
                        * {formik.errors.oldPassword}
                    </p>
                )}
                <div className="flex justify-between gap-5">
                    <p className="w-1/3">Mật khẩu mới</p>
                    <input
                        type="password"
                        name="newPassword"
                        value={formik.values.newPassword}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        className=" flex-1 border ps-2"
                    ></input>
                </div>
                {formik.errors.newPassword && formik.touched.newPassword && (
                    <p className="text-red-500 text-2xl mt-1">
                        * {formik.errors.newPassword}
                    </p>
                )}
                <div className="flex justify-between gap-5">
                    <p className="w-1/3">Nhập lại mật khẩu</p>
                    <input
                        type="password"
                        name="rePassword"
                        value={formik.values.rePassword}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        className=" flex-1 border ps-2"
                    ></input>
                </div>
                {formik.errors.rePassword && formik.touched.rePassword && (
                    <p className="text-red-500 text-2xl mt-1">
                        * {formik.errors.rePassword}
                    </p>
                )}
            </div>
            <SubmitButton label="Xác nhận"></SubmitButton>
        </form>
    );
}

export default FormDoiMk;
