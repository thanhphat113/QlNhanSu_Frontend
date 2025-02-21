import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../../Redux/Actions/UserActions";
import { roleCheck } from "../../../DefaultActions";

function Sidebar(props) {
    const user = useSelector((state) => state.user.information);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const dangxuat = async () => {
        await dispatch(logout());
        navigate("/login");
    };

    return (
        <div className="h-full bg-[#005E90] w-[28rem] min-w-[28rem] text-[whitesmoke]">
            <ul className="flex flex-col justify-between gap-5 items-center py-5 h-full">
                <div className="w-full">
                    <li
                        className={`w-full text-4xl h-[5rem] bg-white mb-5 flex justify-center items-center font-bold text-[#005E90]`}
                    >
                        <p>Quản lý nhân sự</p>
                    </li>
                    {user && user.chucVu !== "Nhân viên" && (
                        <Link
                            onClick={() => props.setType("dashboard")}
                            to="/"
                            className={`w-[full] pb-[1px] flex gap-5 items-center h-[5rem] flex ps-5 items-center ${
                                props.type === "dashboard" &&
                                "bg-white text-[#005E90]"
                            } hover:bg-white hover:text-[#005E90] cursor-pointer`}
                        >
                            <i className="fas fa-columns text-2xl"></i>
                            <p className="text-3xl">Dashboard</p>
                        </Link>
                    )}

                    {user && roleCheck(user.quyens, "Shift") && (
                        <Link
                            onClick={() => props.setType("calam")}
                            to="/calam"
                            className={`w-[full] pb-[1px] flex gap-5 items-center h-[5rem] flex ps-5 items-center ${
                                props.type === "calam" &&
                                "bg-white text-[#005E90]"
                            } hover:bg-white hover:text-[#005E90] cursor-pointer`}
                        >
                            <i className="fa-solid fa-lock"></i>
                            <p className="text-3xl">Ca làm</p>
                        </Link>
                    )}
                    {user && roleCheck(user.quyens, "Role") && (
                        <Link
                            onClick={() => props.setType("vaitro")}
                            to="/vaitro"
                            className={`w-[full] pb-[1px] flex gap-5 items-center h-[5rem] flex ps-5 items-center ${
                                props.type === "vaitro" &&
                                "bg-white text-[#005E90]"
                            } hover:bg-white hover:text-[#005E90] cursor-pointer`}
                        >
                            <i className="fa-regular fa-rectangle-list"></i>
                            <p className="text-3xl">Vai trò</p>
                        </Link>
                    )}
                    {user && roleCheck(user.quyens, "CheckIn") && (
                        <Link
                            onClick={() => props.setType("diemdanh")}
                            to="/diemdanh"
                            className={`w-[full] pb-[1px] flex gap-5 items-center h-[5rem] flex ps-5 items-center ${
                                props.type === "diemdanh" &&
                                "bg-white text-[#005E90]"
                            } hover:bg-white hover:text-[#005E90] cursor-pointer`}
                        >
                            <i className="fas fa-calendar-check text-2xl"></i>
                            <p className="text-3xl">Điểm danh</p>
                        </Link>
                    )}

                    {user && roleCheck(user.quyens, "Report") && (
                        <Link
                            onClick={() => props.setType("baocao")}
                            to="/baocao"
                            className={`w-[full] pb-[1px] flex gap-5 items-center h-[5rem] flex ps-5 items-center ${
                                props.type === "baocao" &&
                                "bg-white text-[#005E90]"
                            } hover:bg-white hover:text-[#005E90] cursor-pointer`}
                        >
                            <i className="fa-solid fa-bullhorn"></i>
                            <p className="text-3xl">Báo cáo</p>
                        </Link>
                    )}

                    {user && roleCheck(user.quyens, "Employee") && (
                        <Link
                            onClick={() => props.setType("nhanvien")}
                            to="/nhanvien"
                            className={`w-[full] pb-[1px] flex gap-5 items-center h-[5rem] flex ps-5 items-center ${
                                props.type === "nhanvien" &&
                                "bg-white text-[#005E90]"
                            } hover:bg-white hover:text-[#005E90] cursor-pointer`}
                        >
                            <i className="fa-solid fa-user-group"></i>
                            <p className="text-3xl">Nhân viên</p>
                        </Link>
                    )}
                </div>
                <div className="w-full ">
                    <Link
                        onClick={() => props.setType("thongtin")}
                        to="/thongtin"
                        className="w-[full] pb-[1px] flex gap-5 items-center h-[5rem] flex ps-5 items-center hover:bg-white hover:text-[#005E90] cursor-pointer"
                    >
                        <i className="fas fa-user text-2xl"></i>
                        <p className="text-3xl">Thông tin cá nhân</p>
                    </Link>
                    <div
                        onClick={() => dangxuat()}
                        className="w-[full] mt-5 pb-[1px] flex gap-5 items-center h-[5rem] flex ps-5 items-center hover:bg-white hover:text-[#005E90] cursor-pointer"
                    >
                        <p>Đăng xuất</p>
                    </div>
                </div>
            </ul>
        </div>
    );
}

export default Sidebar;
