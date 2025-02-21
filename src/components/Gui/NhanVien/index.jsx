import { useEffect, useState } from "react";
import Table from "../../Table";
import axios from "axios";
import ActionButton from "../../Button/ActionButton/Index";
import FormThemNV from "../../Form/FormThemNV";
import DialogLayout from "../../Layout/DialogLayout";
import { AnimatePresence } from "framer-motion";
import FormCapNhatNV from "../../Form/FormCapNhatNV";
import { handleErrorResponse } from "../../../DefaultActions";
import FormUpdateDD from "../../Form/FormUpdateDD";
import Api from "../../../Api";

function NhanVien() {
    const [tbody, setTbody] = useState([]);
    const [isToggle, setIsToggle] = useState();
    const [selected, setSelected] = useState();
    const [selectedCheck, setSelectedCheck ] = useState()
    const [user, setUser] = useState();

    const thead = [
        "Mã nhân viên",
        "Tên nhân viên",
        "Số điện thoại",
        "Email",
        "Chức vụ",
        "Thiết bị Id",
        "Trạng thái",
        "Chờ duyệt",
        "Hành động",
    ];

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await Api.get(
                    "/api/NhanVien/list-users-for-manager",
                );
                setTbody(response.data);
            } catch (error) {
                handleErrorResponse(error);
            }
        };

        getUser();
    }, []);

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await Api.get(
                    "/api/NhanVien/user-detail",
                    { params: { idNhanVien: selected } }
                );
                setUser(response.data);
            } catch (error) {
                handleErrorResponse(error);
            }
        };

        selected ? getUser() : setUser();
    }, [selected]);

    const openFormUpdate = (id) => {
        setSelected(id);
        setIsToggle("update");
    };

    return (
        <div className="w-full">
            <div className="flex justify-between ">
                <h1 className="text-6xl font-bold">Danh sách nhân viên</h1>
                <div className="w-[15rem]">
                    <ActionButton
                        label={"Thêm nhân viên"}
                        action={() => setIsToggle("add")}
                    />
                </div>
            </div>
            <div className=" mt-3 w-full h-[90vh] rounded-[10px] shadow-[0_0_15px_rgba(0,0,0,0.3)] bg-white overflow-x-auto">
                <Table thead={thead}>
                    {tbody.map((item) => (
                        <tr
                            key={item.idNhanVien}
                            className="odd:bg-gray-100 even:bg-white h-[4rem] hover:shadow-[0_0_15px_rgba(0,0,0,0.3)]"
                        >
                            <td className="px-5 whitespace-nowrap">
                                {item.idNhanVien}
                            </td>
                            <td className="px-5 whitespace-nowrap">
                                {item.tenNv}
                            </td>
                            <td className="px-5">{item.sdt}</td>
                            <td className="px-5">{item.email}</td>
                            <td className="px-5 whitespace-nowrap">
                                {item.chucVu}
                            </td>
                            <td className="px-5">{item.idFingerPrint}</td>
                            <td
                                className={`${
                                    item.trangThai
                                        ? "text-green-400"
                                        : "text-red-400"
                                } px-5 whitespace-nowrap`}
                            >
                                {item.trangThai
                                    ? "Hoạt động"
                                    : "Ngừng hoạt động"}
                            </td>
                            <td className="px-5 whitespace-nowrap">
                                {item.isWaiting ? "Chờ duyệt thiết bị" : ""}
                            </td>
                            <td className="px-5 py-5">
                                <div className="flex gap-3 justify-center">
                                    <div
                                        onClick={() =>
                                            openFormUpdate(item.idNhanVien)
                                        }
                                        className="w-[3.3rem] cursor-pointer h-[3.3rem] flex justify-center items-center hover:scale-[1.4]  rounded-[10px] hover:bg-green-700  hover:text-white border"
                                    >
                                        <i className="fas fa-pencil"></i>
                                    </div>
                                    <div
                                        onClick={() => setSelectedCheck(item.idNhanVien)}
                                        className="w-[3.3rem] cursor-pointer h-[3.3rem] flex justify-center items-center hover:scale-[1.4]  rounded-[10px] hover:bg-blue-400  hover:text-white border"
                                    >
                                        <i className="fa-solid fa-file-pen"></i>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
            </div>
            <AnimatePresence>
                {isToggle === "add" && (
                    <DialogLayout>
                        <FormThemNV
                            setIsToggle={setIsToggle}
                            users={tbody}
                            setUsers={setTbody}
                        />
                    </DialogLayout>
                )}
                {isToggle === "update" && user && (
                    <DialogLayout>
                        <FormCapNhatNV
                            setIsToggle={setIsToggle}
                            setSelected={setSelected}
                            user={user}
                            users={tbody}
                            setUsers={setTbody}
                        />
                    </DialogLayout>
                )}
                {selectedCheck && <DialogLayout><FormUpdateDD userId={selectedCheck} setSelectedCheck={setSelectedCheck}/></DialogLayout>}
            </AnimatePresence>
        </div>
    );
}

export default NhanVien;
