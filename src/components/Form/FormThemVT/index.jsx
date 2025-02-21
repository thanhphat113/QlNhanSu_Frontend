import { Field, useFormik } from "formik";
import * as Yup from "yup";
import SubmitButton from "../../Button/SubmitButton/Index";
import { handleErrorResponse, handleMessage} from "../../../DefaultActions";
import Api from "../../../Api";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { setLoading, setMessage } from "../../../Redux/Slices/MessageSlice";

function FormThemVT({ setIsToggle, setVaiTros, vaiTro, type = "create" }) {
    const [prevVaiTro, setPrevVaiTro] = useState(
        vaiTro
            ? {
                  selectedId: vaiTro.idQuyens?.map((quyen) => quyen.idQuyen),
                  tenVaiTro: vaiTro.tenVaiTro,
                  idVaiTro: vaiTro.idVaiTro,
              }
            : null
    );
    const [quyens, setQuyens] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const getQuyen = async () => {
            try {
                const response = await Api.get("/api/Quyen");
                setQuyens(response.data);
            } catch (error) {
                handleErrorResponse(error);
            }
        };
        getQuyen();
    }, []);

    const formik = useFormik({
        initialValues: prevVaiTro || {
            selectedId: [],
            tenVaiTro: "",
        },
        validationSchema: Yup.object({
            selected: Yup.array().min(1, "Bạn phải chọn ít nhất một quyền"),
            tenVaiTro: Yup.string().required("Bạn không được bỏ trống tên"),
        }),
        onSubmit: async (values) => {
            if (type === "create") {
                submitCreate(values);
                return;
            }

            if (JSON.stringify(values) === JSON.stringify(prevVaiTro)) {
                dispatch(setMessage("Chưa có thông tin nào được cập nhật"));
                return;
            }

            submitUpdate(values);
        },
    });

    const submitCreate = async (values) => {
        dispatch(setLoading(true));

        try {
            const response = await Api.post("/api/VaiTro", values);
            const result = response.data;
            handleMessage(result.message);
            setVaiTros((prevVaiTros) => [...prevVaiTros, result.vaiTro]);
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const submitUpdate = async (values) => {
        dispatch(setLoading(true));
        try {
            const response = await Api.put("/api/VaiTro", values);
            const result = response.data;
            handleMessage(result.message);
            setVaiTros((prevVaiTros) =>
                prevVaiTros.map((item) =>
                    item.idVaiTro === result.vaiTro.idVaiTro
                        ? result.vaiTro
                        : item
                )
            );
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        let selectedId = formik.values.selectedId.map(Number);

        if (checked) {
            selectedId = [...new Set([...selectedId, Number(value)])];
        } else {
            selectedId = selectedId.filter((item) => item !== Number(value));
        }

        formik.setFieldValue("selectedId", selectedId);
    };

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="relative w-[60rem] bg-white p-5 flex flex-col gap-5"
        >
            <i
                onClick={() => setIsToggle()}
                className="text-3xl fas fa-times hover:text-red-500 absolute right-5 cursor-pointer"
            ></i>
            <h1 className="text-center text-4xl">THÊM VAI TRÒ</h1>
            <div className="w-full flex flex-col gap-5 mt-5">
                <div className="flex justify-between gap-5">
                    <p className="w-1/3">Tên vai trò</p>
                    <input
                        type="text"
                        name="tenVaiTro"
                        value={formik.values.tenVaiTro}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        className=" flex-1 border ps-2"
                    ></input>
                </div>
                {formik.errors.tenVaiTro && formik.touched.tenVaiTro && (
                    <p className="text-red-500 text-2xl mt-1">
                        * {formik.errors.tenVaiTro}
                    </p>
                )}
                <div className="flex justify-between px-[10rem]">
                    {quyens.map((item) => (
                        <div className="flex gap-3" key={item.idQuyen}>
                            {type === "update" ? (
                                <input
                                    type="checkbox"
                                    name="selectedId"
                                    value={item.idQuyen}
                                    onChange={handleCheckboxChange}
                                    checked={formik.values.selectedId?.includes(
                                        item.idQuyen
                                    )}
                                ></input>
                            ) : (
                                <input
                                    type="checkbox"
                                    name="selectedId"
                                    value={item.idQuyen}
                                    onChange={formik.handleChange}
                                ></input>
                            )}
                            <label>{item.tenQuyen}</label>
                        </div>
                    ))}
                </div>
                {formik.errors.selected && formik.touched.selected && (
                    <p className="text-red-500 text-2xl mt-1">
                        * {formik.errors.selected}
                    </p>
                )}
            </div>
            <SubmitButton label="Xác nhận"></SubmitButton>
        </form>
    );
}

export default FormThemVT;
