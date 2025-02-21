import { useEffect, useState } from "react";
import ActionButton from "../../Button/ActionButton/Index";
import Table from "../../Table";
import {
    handleErrorResponse,
    handleMessage,
    roleCheck,
} from "../../../DefaultActions";
import Api from "../../../Api";
import DialogLayout from "../../Layout/DialogLayout";
import FormThemVT from "../../Form/FormThemVT";
import { useDispatch } from "react-redux";
import { setLoading } from "../../../Redux/Slices/MessageSlice";
import DefaultNotification from "../../Notification/DefaultNotification";

function VaiTro() {
    const [vaiTros, setVaiTros] = useState([]);
    const [isToggle, setIsToggle] = useState();
    const [selected, setSelected] = useState();
    const [selectedDelete, setSelectedDelete] = useState();
    const dispatch = useDispatch();

    const vaiTroHead = [
        "Id",
        "Tên vai trò",
        "Ca làm",
        "Vai trò",
        "Nhân viên",
        "Điểm danh",
        "Báo cáo",
        "Hành động",
    ];

    useEffect(() => {
        dispatch(setLoading(true));
        const getValues = async () => {
            try {
                const response = await Api.get("/api/VaiTro");
                setVaiTros(response.data);
            } catch (error) {
                handleErrorResponse(error);
            } finally {
                dispatch(setLoading(false));
            }
        };

        getValues();
    }, []);

    const deleteSelectId = async (idVaiTro) => {
        dispatch(setLoading(true));

        try {
            const response = await Api.delete(`/api/VaiTro/${idVaiTro}`);
            var result = response.data;
            handleMessage(result.message);
            response.status === 200 &&
                setVaiTros((prevCaLams) =>
                    prevCaLams.filter((item) => item.idVaiTro !== idVaiTro)
                );
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div>
            <div className="flex justify-between ">
                <h1 className="text-6xl font-bold">Danh sách vai trò</h1>
                <div className="w-[15rem]">
                    <ActionButton
                        action={() => setIsToggle("create")}
                        label="Thêm vai trò"
                    />
                </div>
            </div>
            <div className=" mt-3 max-w-[113.5rem] h-[90vh] rounded-[10px] shadow-[0_0_15px_rgba(0,0,0,0.3)] bg-white overflow-x-auto">
                <Table className="" thead={vaiTroHead}>
                    {vaiTros.map((item) => (
                        <tr
                            key={item.idCaLam}
                            className="odd:bg-gray-100 even:bg-white h-[4rem] hover:border-2 "
                        >
                            <td className="px-5 whitespace-nowrap">
                                {item.idVaiTro}
                            </td>
                            <td className="px-5 whitespace-nowrap">
                                {item.tenVaiTro}
                            </td>
                            <td className="px-5 whitespace-nowrap">
                                {roleCheck(item.idQuyens, "Shift") ? (
                                    <i className="fas fa-check-circle text-green-700"></i>
                                ) : (
                                    <i className="fas fa-times-circle text-red-700"></i>
                                )}
                            </td>
                            <td className="px-5 whitespace-nowrap">
                                {roleCheck(item.idQuyens, "Role") ? (
                                    <i className="fas fa-check-circle text-green-700"></i>
                                ) : (
                                    <i className="fas fa-times-circle text-red-700"></i>
                                )}
                            </td>
                            <td className="px-5 whitespace-nowrap">
                                {roleCheck(item.idQuyens, "Employee") ? (
                                    <i className="fas fa-check-circle text-green-700"></i>
                                ) : (
                                    <i className="fas fa-times-circle text-red-700"></i>
                                )}
                            </td>
                            <td className="px-5 whitespace-nowrap">
                                {roleCheck(item.idQuyens, "CheckIn") ? (
                                    <i className="fas fa-check-circle text-green-700"></i>
                                ) : (
                                    <i className="fas fa-times-circle text-red-700"></i>
                                )}
                            </td>
                            <td className="px-5 whitespace-nowrap">
                                {roleCheck(item.idQuyens, "Report") ? (
                                    <i className="fas fa-check-circle text-green-700"></i>
                                ) : (
                                    <i className="fas fa-times-circle text-red-700"></i>
                                )}
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
                                            setSelectedDelete(item.idVaiTro)
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
                    <FormThemVT
                        setVaiTros={setVaiTros}
                        setIsToggle={setIsToggle}
                    ></FormThemVT>
                </DialogLayout>
            ) : (
                isToggle === "update" && (
                    <DialogLayout>
                        <FormThemVT
                            setVaiTros={setVaiTros}
                            setIsToggle={setIsToggle}
                            vaiTro={selected}
                            type="update"
                        ></FormThemVT>
                    </DialogLayout>
                )
            )}

            {selectedDelete && (
                <DefaultNotification
                    title="Xác nhận xóa"
                    message="Bạn có chắc chắn muốn xóa đối tượng"
                    accept={() => {
                        deleteSelectId(selectedDelete);
                        setSelectedDelete()
                    }}
                    deny={() => setSelectedDelete()}
                ></DefaultNotification>
            )}
        </div>
    );
}

export default VaiTro;
