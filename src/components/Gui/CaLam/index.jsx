import { useEffect, useState } from "react";
import ActionButton from "../../Button/ActionButton/Index";
import Table from "../../Table";
import { handleErrorResponse, handleMessage } from "../../../DefaultActions";
import Api from "../../../Api";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../Redux/Slices/MessageSlice";
import FormThemCL from "../../Form/FormThemCL";
import DialogLayout from "../../Layout/DialogLayout";
import DefaultNotification from "../../Notification/DefaultNotification";

function CaLam() {
    const [caLams, setCaLams] = useState([]);
    const [isToggle, setIsToggle] = useState();
    const [selected, setSelected] = useState();
    const [selectedDelete, setSelectedDelete] = useState();
    const dispatch = useDispatch();
    const caLamHead = [
        "Id",
        "Tên ca làm",
        "Thời gian bắt đầu",
        "Trễ cho phép",
        "Thời gian kết thúc",
        "Sớm cho phép",
        "Hành động",
    ];

    useEffect(() => {
        dispatch(setLoading(true));
        const getCaLams = async () => {
            try {
                const response = await Api.get("/api/CaLam");
                setCaLams(response.data);
            } catch (error) {
                handleErrorResponse(error);
            } finally {
                dispatch(setLoading(false));
            }
        };
        getCaLams();
    }, []);

    const deleteSelectId = async (idCaLam) => {
        try {
            const response = await Api.delete(`/api/CaLam/${idCaLam}`, {
                idCaLam: idCaLam,
            });
            var result = response.data;
            handleMessage(result.message);
            result.caLamId &&
                setCaLams((prevCaLams) =>
                    prevCaLams.filter((item) => item.idCaLam !== result.caLamId)
                );
        } catch (error) {
            handleErrorResponse(error);
        }
    };

    return (
        <div>
            <div className="flex justify-between ">
                <h1 className="text-6xl font-bold">Danh sách ca làm</h1>
                <div className="w-[15rem]">
                    <ActionButton
                        action={() => setIsToggle("create")}
                        label="Thêm ca làm"
                    />
                </div>
            </div>
            <div className=" mt-3 max-w-[113.5rem] h-[90vh] rounded-[10px] shadow-[0_0_15px_rgba(0,0,0,0.3)] bg-white overflow-x-auto">
                <Table thead={caLamHead}>
                    {caLams.map((item) => (
                        <tr
                            key={item.idCaLam}
                            className="odd:bg-gray-100 even:bg-white h-[4rem] hover:border-2 "
                        >
                            <td className="px-5 whitespace-nowrap">
                                {item.idCaLam}
                            </td>
                            <td className="px-5 whitespace-nowrap">
                                {item.tenCaLam}
                            </td>
                            <td className="px-5 whitespace-nowrap">
                                {item.thoiGianBatDau}
                            </td>
                            <td className="px-5 whitespace-nowrap">
                                {item.thoiGianTreChoPhep}
                            </td>
                            <td className="px-5 whitespace-nowrap">
                                {item.thoiGianKetThuc}
                            </td>
                            <td className="px-5 whitespace-nowrap">
                                {item.thoiGianSomChoPhep}
                            </td>
                            <td className="px-5 py-5">
                                <div className="flex gap-3 justify-center">
                                    <div
                                        onClick={() => {
                                            setSelected(item);
                                            setIsToggle("update");
                                        }}
                                        className="w-[3.3rem] cursor-pointer h-[3.3rem] flex justify-center items-center hover:scale-[1.4]  rounded-[10px] hover:bg-green-700  hover:text-white border"
                                    >
                                        <i className="fas fa-pencil"></i>
                                    </div>
                                    <div
                                        onClick={() =>
                                            setSelectedDelete(item.idCaLam)
                                        }
                                        className="w-[3.3rem] cursor-pointer h-[3.3rem] flex justify-center items-center hover:scale-[1.4]  rounded-[10px] hover:bg-red-700  hover:text-white border"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
            </div>
            {isToggle === "create" ? (
                <DialogLayout>
                    <FormThemCL
                        setIsToggle={setIsToggle}
                        setCaLams={setCaLams}
                    />
                </DialogLayout>
            ) : (
                isToggle === "update" && (
                    <DialogLayout>
                        <FormThemCL
                            setIsToggle={setIsToggle}
                            setCaLams={setCaLams}
                            type="update"
                            caLam={selected}
                        />
                    </DialogLayout>
                )
            )}

            {selectedDelete && (
                <DefaultNotification
                    title="Xác nhận xóa"
                    message="Bạn có chắc chắn muốn xóa đối tượng"
                    accept={() => {
                        deleteSelectId(selectedDelete);
                        setSelectedDelete();
                    }}
                    deny={() => setSelectedDelete()}
                />
            )}
        </div>
    );
}

export default CaLam;
