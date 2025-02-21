import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import SubmitButton from "../../Button/SubmitButton/Index";
import ActionButton from "../../Button/ActionButton/Index";
import { useEffect, useState } from "react";
import { updateInfo } from "../../../Redux/Actions/UserActions";
import { setMessage } from "../../../Redux/Slices/MessageSlice";
import { handleErrorResponse, hashSHA256 } from "../../../DefaultActions";
import Api from "../../../Api";
import * as Yup from "yup";
import FormDoiMk from "../../Form/FormDoiMk";
import DialogLayout from "../../Layout/DialogLayout";

function ThongTinCaNhan() {
    const user = useSelector((state) => state.user.information) || {};
    const dispatch = useDispatch();
    const [fingerId, setFingerId] = useState(user.idFingerPrint);
    const [prevValues, setPrevValues] = useState(user);
    const [users, setUsers] = useState([]);
    const [isToggle, setIsToggle] = useState(false);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await Api.get(
                    "/api/NhanVien/list-users-for-manager"
                );
                setUsers(response.data);
            } catch (error) {
                handleErrorResponse(error);
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        formik.setValues(user);
    }, [user]);

    const formik = useFormik({
        initialValues: prevValues,
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
                        return !users.filter((item) => item.email !== user.email).some((item) => item.email === value);
                    }
                ),
        }),
        onSubmit: async (values) => {
            let submitValue = { ...values };
            if (JSON.stringify(values) === JSON.stringify(prevValues)) {
                dispatch(setMessage("Chưa có thông tin nào được thay đổi"));
                return;
            }
            if (!values.idFingerPrint) {
                dispatch(setMessage("Vui lòng cập nhật thiết bị!!!"));
                return;
            }
            if (!user.isAccept) delete submitValue.idFingerPrint;

            await dispatch(updateInfo(submitValue));

            setPrevValues(values);
        },
    });

    useEffect(() => {
        const getFingerprint = async () => {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            setFingerId(
                [
                    result.visitorId,
                    hashSHA256(user.email),
                    hashSHA256(user.idNhanVien),
                ].join("-")
            );
        };

        getFingerprint();
    }, []);

    return (
        <div className="w-full h-[95vh] shadow-[0_0_10px_rgba(0,0,0,0.3)]">
            <form
                onSubmit={formik.handleSubmit}
                className="bg-white w-full h-full p-7 flex-col flex items-center"
            >
                <h1 className="text-center text-5xl font-bold">
                    THÔNG TIN CÁ NHÂN
                </h1>
                <div className="w-1/2 flex flex-col gap-5 mt-5">
                    <div className="flex justify-between gap-5">
                        <p className="w-1/3">Mã nhân viên</p>
                        <input
                            type="text"
                            value={formik.values.idNhanVien}
                            readOnly
                            className="bg-gray-300 flex-1 border ps-2"
                        ></input>
                    </div>
                    <div className="flex justify-between gap-5">
                        <p className="w-1/3">Họ và tên</p>
                        <input
                            type="text"
                            value={formik.values.tenNv}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="tenNv"
                            className=" border flex-1 ps-2"
                        ></input>
                    </div>
                    {formik.errors.tenNv && formik.touched.tenNv && (
                        <p className="text-red-500 text-2xl mt-1">
                            * {formik.errors.tenNv}
                        </p>
                    )}
                    <div className="flex justify-between gap-5">
                        <p className="w-1/3">Email</p>
                        <input
                            type="text"
                            value={formik.values.email}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            name="email"
                            className=" border flex-1 ps-2"
                        ></input>
                    </div>
                    {formik.errors.email && formik.touched.email && (
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
                    {formik.errors.sdt && formik.touched.sdt && (
                        <p className="text-red-500 text-2xl mt-1">
                            * {formik.errors.sdt}
                        </p>
                    )}
                    <div className="flex justify-between gap-5">
                        <p className="w-1/3">Chức vụ</p>
                        <input
                            type="text"
                            readOnly
                            value={formik.values.chucVu}
                            name="chucVu"
                            className=" border bg-gray-300 flex-1 ps-2"
                        ></input>
                    </div>
                    <div className="flex justify-between gap-5">
                        <p className="w-1/3">Thiết bị đăng ký</p>
                        <input
                            type="text"
                            value={formik.values.idFingerPrint || ""}
                            readOnly
                            name="idFingerPrint"
                            className=" bg-gray-300	 border flex-1 ps-2"
                        ></input>
                        {!user.isWaiting &&
                            fingerId !== formik.values.idFingerPrint && (
                                <div className="w-[15rem]">
                                    <ActionButton
                                        label="Thay đổi"
                                        action={() =>
                                            formik.setFieldValue(
                                                "idFingerPrint",
                                                fingerId
                                            )
                                        }
                                    />
                                </div>
                            )}
                    </div>
                    {!user.isAccept && (
                        <p className="text-red-700">
                            Thông báo: Thiết bị đang chờ được xác thực
                        </p>
                    )}
                    {fingerId !== formik.values.idFingerPrint && (
                        <p className="text-red-700">
                            Thông báo: Thiết bị hiện tại không trùng khớp với
                            thiết bị đã đăng ký
                        </p>
                    )}

                    <SubmitButton label="Thay đổi thông tin"></SubmitButton>
                </div>
                <div className="h-[3.5rem] w-1/2 mt-5">
                    <ActionButton
                        label="Đổi mật khẩu"
                        action={() => setIsToggle(true)}
                    ></ActionButton>
                </div>
            </form>
            {isToggle && (
                <DialogLayout>
                    <FormDoiMk setIsToggle={setIsToggle}/>
                </DialogLayout>
            )}
        </div>
    );
}

export default ThongTinCaNhan;
