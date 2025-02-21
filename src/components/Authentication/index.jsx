import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { roleCheck } from "../../DefaultActions";

function Authentication({ children, requiredPermission }) {
    const user = useSelector((state) => state.user.information);

    if (!user) {
        return <Navigate to="/login" />;
    }

    const hasPermission = requiredPermission
        ? roleCheck(user.quyens, requiredPermission)
        : true;

    return <>{hasPermission ? children : <Navigate to="/403"></Navigate>}</>;
}

export default Authentication;
