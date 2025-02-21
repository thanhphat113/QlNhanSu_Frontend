import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../../Gui/Sidebar";
import { useState } from "react";
import { useSelector } from "react-redux";

function DefaultLayout() {
    const location = useLocation();
    const user = useSelector(state => state.user.information)
    const [type, setType] = useState(
        location.pathname === "/"
            ? user && user.chucVu !== "Nhân viên" ? "dashboard" :"diemdanh"
            : location.pathname.replace("/", "")
    );

    return (
        <div className="flex w-full h-full">
            <Sidebar type={type} setType={setType} />
            <div className="flex-1 p-5 bg-[whitesmoke] overflow-auto">
                <Outlet />
            </div>
        </div>
    );
}

export default DefaultLayout;
