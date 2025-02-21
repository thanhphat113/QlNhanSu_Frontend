import { useFormik } from "formik";
import * as Yup from "yup";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

import SubmitButton from "../../Button/SubmitButton/Index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "../../../Redux/Slices/MessageSlice";
import { handleErrorResponse, handleMessage, hashSHA256 } from "../../../DefaultActions";
import Api from "../../../Api";

function FormCheckIn({ setCheckIns, setLastCheckIn, setIsToggle }) {
    const [calams, setCalams] = useState([]);
    const [initCaLam, setInitCaLam] = useState("");
    const [fingerId, setFingerId] = useState();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.information);

    useEffect(() => {
        const getFingerprint = async () => {
            const fp = await FingerprintJS.load();
            const result = await fp.get();
            setFingerId([result.visitorId,hashSHA256(user.email),hashSHA256(user.idNhanVien)].join("-"));
        };

        getFingerprint();
    }, []);

    useEffect(() => {
        if (initCaLam) {
            formik.setValues({idCaLam: initCaLam})
        }
    }, [initCaLam]);

    useEffect(() => {
        const getCaLams = async () => {
            try {
                const response = await Api.get(
                    "/api/CaLam/list-for-checkin"
                );

                setInit(response.data);
                setCalams(response.data);
            } catch (error) {
                handleErrorResponse(error)
            }
        };

        calams.length === 0 && getCaLams();
    }, []);

    const setInit = (values) => {
        let smallestDifference = Number.MAX_VALUE;
        let nextClosestId = null;

        const future = values.filter((item) => {
            const timeParts = item.thoiGianBatDau.split(":");
            const listTime = new Date();
            listTime.setHours(timeParts[0], timeParts[1], timeParts[2]);
            return listTime > new Date();
        });

        if (future.length === 0 ){
            setInitCaLam(values[values.length - 1].idCaLam)
            return
        }

        future.forEach((item) => {
            const timeParts = item.thoiGianBatDau.split(":");
            const listTime = new Date();
            listTime.setHours(timeParts[0], timeParts[1], timeParts[2]);

            const diff = listTime - new Date();

            if (diff < smallestDifference) {
                smallestDifference = diff;
                nextClosestId = item.idCaLam; // Lấy ID của thời gian gần nhất
            }
        });
        setInitCaLam(nextClosestId);
    };

    const formik = useFormik({
        initialValues: {
            idCaLam: "",
        },
        validationSchema: Yup.object({
            idCaLam: Yup.string().required("Vui lòng chọn 1 ca làm việc"),
        }),
        onSubmit: (values) => {
            if (fingerId != user.idFingerPrint) {
                dispatch(
                    setMessage(
                        "Khác thiết bị đăng ký nên không thể check-in, vui lòng cập nhật lại thiết bị để thực hiện tác vụ"
                    )
                );
                return;
            }

            checkIn(values.idCaLam);
        },
    });

    const checkIn = async (values) => {
        try {
            const response = await Api.post(
                "/api/DiemDanh/check-in",
                { IdCaLam: values },
            );
            handleMessage(response.data.message)
            setIsToggle(false);
            setCheckIns((prevCheckIns) => [
                ...prevCheckIns,
                response.data.checkIn,
            ]);
            setLastCheckIn({
                idDiemDanh: response.data.checkIn.idDiemDanh,
                hasCheckIn: true,
            });
        } catch (error) {
            handleErrorResponse(error)
        }
    };
    return (
        <form
            onSubmit={formik.handleSubmit}
            className="relative w-[60rem] h-[15rem] bg-white p-5 flex flex-col gap-5"
        >
            <i
                onClick={() => setIsToggle(false)}
                className="text-3xl fas fa-times hover:text-red-500 absolute right-5 cursor-pointer"
            ></i>
            <h1 className="text-center text-4xl">CHECK-IN</h1>
            <div className="flex gap-3">
                <span>Chọn loại ca làm:</span>
                <select
                    className="flex-1 text-center border"
                    name="idCaLam"
                    value={formik.values.idCaLam}
                    onChange={formik.handleChange}
                >
                    {calams.map((item, index) => (
                        <option key={index} value={item.idCaLam}>
                            {item.tenCaLam} (Từ: {item.thoiGianBatDau}, đến:{" "}
                            {item.thoiGianKetThuc})
                        </option>
                    ))}
                </select>
            </div>
            <SubmitButton className="h-[4rem]" label="Check-In" />
        </form>
    );
}

export default FormCheckIn;
