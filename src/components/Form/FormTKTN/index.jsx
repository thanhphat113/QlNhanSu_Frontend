import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../Button/SubmitButton/Index";
import Api from "../../../Api";
import { handleErrorResponse } from "../../../DefaultActions";

function FormTKTN({setThongKes}) {
    const formik = useFormik({
        initialValues: {
            ngayBd: "",
            ngayKt: "",
        },
        validationSchema: Yup.object({
            ngayBd: Yup.date()
                .typeError("Ngày bắt đầu không hợp lệ")
                .required("Vui lòng nhập ngày bắt đầu"),
            ngayKt: Yup.date()
                .typeError("Ngày kết thúc không hợp lệ")
                .required("Vui lòng nhập ngày kết thúc"),
        }),
        onSubmit: async (values) => {
            submitValues(values);
        },
    });

	const submitValues = async (values) => {
		try {
            const response = await Api.get(
                "/api/ThongKe",
                {params : {NgayBd: values.ngayBd, NgayKt: values.ngayKt}}
            );
			setThongKes(response.data)
        } catch (error) {
            handleErrorResponse(error);
        }
	}

    return (
        <form onSubmit={formik.handleSubmit} className="flex gap-5">
            <div className="flex gap-5 items-center">
                <p>Ngày bắt đầu</p>
                <div>
                    <input
                        name="ngayBd"
                        type="date"
                        value={formik.values.ngayBd}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        className=" border ps-2"
                    />
                    {formik.errors.ngayBd && formik.touched.ngayBd && (
                        <p className="text-red-500 text-2xl mt-1">
                            * {formik.errors.ngayBd}
                        </p>
                    )}
                </div>

                <p>Ngày kết thúc</p>
                <div>
                    <input
                        name="ngayKt"
                        type="date"
                        value={formik.values.ngayKt}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        className=" flex-1 border ps-2"
                    />
                    {formik.errors.ngayKt && formik.touched.ngayKt && (
                        <p className="text-red-500 text-2xl mt-1">
                            * {formik.errors.ngayKt}
                        </p>
                    )}
                </div>
            </div>

            <div className="w-[10rem]">
                <SubmitButton label="Xác nhận"></SubmitButton>
            </div>
        </form>
    );
}

export default FormTKTN;
