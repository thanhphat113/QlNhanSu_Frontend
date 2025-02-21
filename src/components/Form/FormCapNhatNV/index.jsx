import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import SubmitButton from "../../Button/SubmitButton/Index";
import ActionButton from "../../Button/ActionButton/Index";
import { useDispatch } from "react-redux";
import { setLoading, setMessage } from "../../../Redux/Slices/MessageSlice";
import { handleErrorResponse, handleMessage } from "../../../DefaultActions";
import Api from "../../../Api";

function FormCapNhatNV({ user, setIsToggle, users, setUsers, setSelected }) {
    const [values, setValues] = useState({ chucvus: [], vaitros: [] });
    const dispatch = useDispatch();

    const [prevUser, setPrevUser] = useState(user);
    const emailIsUsed = users.filter((item) => item.email !== user.email);
    const [yeuCau, setYeuCau] = useState(user.yeuCau);

    const formik = useFormik({
        initialValues: user,
        validationSchema: Yup.object({
            tenNv: Yup.string().required("Tên nhân viên không được để trống"),
            sdt: Yup.string()
                .length(10, "Số điện thoại phải có đúng 10 chữ số")
                .matches(
                    /^(0[3|5|7|8|9])([0-9]{8})$/,
                    "Số điện thoại không hợp lệ!"
                )
                .required("Số điện thoại không được để trống"),
            email: Yup.string()
                .email("Email không hợp lệ")
                .required("Email không được để trống")
                .test(
                    "email-not-registered",
                    "Email này đã được đăng ký",
                    (value) => {
                        return !emailIsUsed.some(
                            (item) => item.email === value
                        );
                    }
                ),
        }),
        onSubmit: async (values) => {
            if (JSON.stringify(values) === JSON.stringify(prevUser)) {
                dispatch(setMessage("Chưa có thông tin nào được thay đổi !"));
                return;
            }

            const { yeuCau, idFingerPrint, ...valuesSubmit } = values;

            var status = await updateUser(valuesSubmit);

            status === 200 && setPrevUser(values);
        },
    });

    const updateUser = async (values) => {
        dispatch(setLoading(true));
        try {
            const response = await Api.put(
                "/api/NhanVien/update-for-manager",
                values
            );
            var user = response.data.user;
            user && updateUserList(user);
            handleMessage(response.data.message);

            return response.status;
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const updateUserList = (values) => {
        setUsers((prevTbody) =>
            prevTbody.map((item) =>
                item.idNhanVien === values.idNhanVien ? values : item
            )
        );
    };

    const VerifyDevice = async (idYeuCau) => {
        try {
            const response = await axios.put("/api/TaiKhoan/update-device", {
                idYeuCau: idYeuCau,
            });
            const result = response.data;
            const User = result.yeuCau.user;
            updateUserList(User);
            handleMessage(result.message);
            result.yeuCau && setYeuCau(result.yeuCau);
        } catch (error) {
            handleErrorResponse("Lỗi", error);
        }
    };

    useEffect(() => {
        const getValues = async () => {
            try {
                const response = await Api.get("/api/ChucVuVaVaiTro");
                setValues(response.data);
            } catch (error) {
                handleErrorResponse(error);
            }
        };
        getValues();
    }, []);

    const status = [
        { isWork: false, message: "Ngừng hoạt động" },
        { isWork: true, message: "Đang hoạt động" },
    ];

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="bg-white relative w-[65rem] h-full p-7 flex-col flex items-center"
        >
            <h1 className="text-center text-5xl font-bold">
                Cập nhật thông tin
            </h1>
            <i
                onClick={() => {
                    setIsToggle(false);
                    setSelected();
                }}
                className="text-3xl fas fa-times hover:text-red-500 absolute right-5 cursor-pointer"
            ></i>
            <div className="w-full flex flex-col gap-5 mt-5">
                <div className="flex justify-between gap-5">
                    <p className="w-1/3">Mã nhân viên</p>
                    <input
                        type="text"
                        value={formik.values.idNhanVien}
                        readOnly
                        className="bg-gray-300 flex-1 border ps-2"
                    ></input>
                </div>
                {formik.errors.tenNv && formik.touched.tenNv && (
                    <p className="text-red-500 text-2xl mt-1">
                        * {formik.errors.tenNv}
                    </p>
                )}
                <div className="flex justify-between gap-5">
                    <p className="w-1/3">Họ và tên</p>
                    <input
                        type="text"
                        value={formik.values.tenNv}
                        onChange={formik.handleChange}
                        name="tenNv"
                        className=" border flex-1 ps-2"
                        onBlur={formik.handleBlur}
                    ></input>
                </div>
                <div className="flex justify-between gap-5">
                    <p className="w-1/3">Email</p>
                    <input
                        type="text"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        name="email"
                        onBlur={formik.handleBlur}
                        className=" border flex-1 ps-2"
                    ></input>
                </div>
                {formik.initialValues.email !== formik.values.email &&
                    formik.errors.email &&
                    formik.touched.email && (
                        <p className="text-red-500 text-2xl mt-1">
                            * {formik.errors.email}
                        </p>
                    )}
                <div className="flex justify-between gap-5">
                    <p className="w-1/3">Số điện thoại</p>
                    <input
                        type="text"
                        value={formik.values.sdt}
                        name="sdt"
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        className=" border flex-1 ps-2"
                    ></input>
                </div>
                <div className="flex justify-between gap-5">
                    <p className="w-1/3">Thiết bị đăng ký</p>
                    <input
                        type="text"
                        value={formik.values.idFingerPrint}
                        readOnly
                        name="idFingerPrint"
                        className=" bg-gray-300	 border flex-1 ps-2"
                    ></input>
                </div>
                {yeuCau && !yeuCau.trangThai && (
                    <div className="h-[3rem] flex justify-end">
                        <ActionButton
                            label="Xác nhận"
                            action={() => VerifyDevice(yeuCau.idYeuCau)}
                        ></ActionButton>
                    </div>
                )}
                <div className="flex justify-between gap-5">
                    <p className="w-1/3">Vai trò</p>
                    <select
                        className="flex-1 text-center border"
                        name="idVaiTro"
                        value={formik.values.idVaiTro}
                        onChange={formik.handleChange}
                    >
                        {values.vaitros?.map((item, index) => (
                            <option key={index} value={item.idVaiTro}>
                                {item.tenVaiTro} (
                                {item.idQuyens
                                    .map((subItem) => subItem.tenQuyen)
                                    .join(" - ")}
                                )
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-between gap-5">
                    <p className="w-1/3">Chức vụ</p>
                    <select
                        className="flex-1 text-center border"
                        name="idChucVu"
                        value={formik.values.idChucVu}
                        onChange={formik.handleChange}
                    >
                        {values.chucvus?.map((item, index) => (
                            <option key={index} value={item.idChucVu}>
                                {item.tenChucVu}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex justify-between gap-5">
                    <p className="w-1/3">Trạng thái</p>
                    <select
                        className="text-center flex-1 border"
                        value={formik.values.trangThai}
                        name="trangThai"
                        onChange={(e) => {
                            formik.handleChange({
                                target: {
                                    name: "trangThai",
                                    value: e.target.value === "true",
                                },
                            });
                        }}
                    >
                        {status.map((item, index) => (
                            <option key={index} value={item.isWork}>
                                {item.message}
                            </option>
                        ))}
                    </select>
                </div>

                <SubmitButton label="Cập nhật"></SubmitButton>
            </div>
        </form>
    );
}

export default FormCapNhatNV;
