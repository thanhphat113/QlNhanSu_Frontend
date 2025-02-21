
import { useNavigate } from "react-router-dom";
import FormDangNhap from "../../components/Form/FormDangNhap/Index";
import { useSelector } from "react-redux";
import { useEffect } from "react";

function Login() {
    const navigate = useNavigate()

    const user = useSelector(state => state.user.information)

    useEffect(() => {
        user && navigate("/")
    },[])

    return (
        <div className="w-full h-svh relative bg-[url('/public/background.jpg')] bg-cover">
            <div className=" align-middle w-[50rem] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                <FormDangNhap />
            </div>
        </div>
    );
}

export default Login;
