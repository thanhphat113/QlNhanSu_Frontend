import { useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../Button/SubmitButton/Index";
import { useDispatch } from "react-redux";
import Api from "../../../Api";
import { handleErrorResponse, handleMessage } from "../../../DefaultActions";

function FormCheckOut({
    setIsToggle,
    lastCheckIn,
    setCheckIns,
    setLastCheckIn,
}) {
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            ghiChu: "",
        },
        validationSchema: Yup.object({}),
        onSubmit: (values) => {
            checkOut(values);
        },
    });

    const checkOut = async (values) => {
        try {
            const response = await Api.put("/api/DiemDanh", {
                idDiemDanh: lastCheckIn.idDiemDanh,
                ghiChu: values.ghiChu,
            });
            handleMessage(response.data.message)

            setCheckIns((prevCheckIns) =>
                prevCheckIns.map((item) =>
                    item.idDiemDanh === response.data.diemdanh.idDiemDanh
                        ? response.data.diemdanh
                        : item
                )
            );
            setLastCheckIn({ hasCheckIn: false });
            setIsToggle(false);
        } catch (error) {
            handleErrorResponse(error)
        }
    };

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="relative w-[50rem] bg-white p-5 flex flex-col gap-5"
        >
            <i
                onClick={() => setIsToggle(false)}
                className="text-3xl fas fa-times hover:text-red-500 absolute right-5 cursor-pointer"
            ></i>
            <h1 className="text-center text-4xl">CHECK-OUT</h1>
            <p className="w-full text-center">Xác nhận thực hiện Check-Out</p>
            <textarea
                className="border h-[20rem] p-3"
                placeholder="Ghi chú...."
                value={formik.values.ghiChu}
                onChange={formik.handleChange}
                name="ghiChu"
            ></textarea>
            <SubmitButton label="Check-Out" />
        </form>
    );
}

export default FormCheckOut;
