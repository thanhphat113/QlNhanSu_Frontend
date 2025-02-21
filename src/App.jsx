import { useEffect, useState } from "react";
import "./App.css";
import { Routes, Route, useNavigate} from "react-router-dom";

import Login from "./Pages/Login/Index";
import ChamCong from "./components/Gui/ChamCong";
import Authentication from "./components/Authentication";
import BaoCao from "./components/Gui/BaoCao";
import NhanVien from "./components/Gui/NhanVien";
import ThongTinCaNhan from "./components/Gui/ThongTinCaNhan";
import DefaultLayout from "./components/Layout/DefaultLayout";
import { useDispatch, useSelector } from "react-redux";
import DefaultNotification from "./components/Notification/DefaultNotification";
import { resetMessage } from "./Redux/Slices/MessageSlice";
import { AnimatePresence } from "framer-motion";
import { loginByToken } from "./Redux/Actions/UserActions";
import LoadingSpinner from "./components/Animation/LoadingSpinner";
import Loading from "./Pages/Loading/Index";
import CaLam from "./components/Gui/CaLam";
import Dashboard from "./components/Gui/Dashboard";
import VaiTro from "./components/Gui/VaiTro";
import Forbidden from "./Pages/Forbidden";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const user = useSelector((state) => state.user.information);

    const { isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.message
    );

    useEffect(() => {
        const getUser = async () => {
            try {
                await dispatch(loginByToken());
            } catch (error) {
                console.log("Lỗi", error);
            } finally {
                setLoading(false);
            }
        };
        !user ? getUser() : navigate("/");
    }, []);

    if (loading) return <Loading />;

    return (
        <>
            <Routes>
                <Route element={<DefaultLayout />}>
                    <Route
                        path="/"
                        element={
                            <Authentication>
                                {user && user.chucVu !== "Nhân viên" ? (
                                    <Dashboard />
                                ) : (
                                    <ChamCong />
                                )}
                            </Authentication>
                        }
                    ></Route>
                    <Route
                        path="/vaitro"
                        element={
                            <Authentication requiredPermission="Role">
                                <VaiTro />
                            </Authentication>
                        }
                    ></Route>
                    <Route
                        path="/calam"
                        element={
                            <Authentication requiredPermission="Shift">
                                <CaLam />
                            </Authentication>
                        }
                    ></Route>
                    <Route
                        path="/diemdanh"
                        element={
                            <Authentication requiredPermission="CheckIn">
                                <ChamCong />
                            </Authentication>
                        }
                    ></Route>
                    <Route
                        path="/baocao"
                        element={
                            <Authentication requiredPermission="Report">
                                <BaoCao />
                            </Authentication>
                        }
                    ></Route>
                    <Route
                        path="/nhanvien"
                        element={
                            <Authentication requiredPermission="Employee">
                                <NhanVien />
                            </Authentication>
                        }
                    ></Route>
                    <Route
                        path="/thongtin"
                        element={
                            <Authentication >
                                <ThongTinCaNhan />
                            </Authentication>
                        }
                    ></Route>
                </Route>
                <Route path="/login" element={<Login></Login>}></Route>
                <Route path="/403" element={<Forbidden />}></Route>
            </Routes>
            <AnimatePresence>
                {message && (
                    <DefaultNotification
                        title="Thông báo"
                        message={message}
                        accept={() => dispatch(resetMessage())}
                        deny={() => dispatch(resetMessage())}
                    />
                )}
            </AnimatePresence>
            {isLoading && <LoadingSpinner />}
        </>
    );
}

export default App;
