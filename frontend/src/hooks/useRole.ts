import { useSelector } from "react-redux";
import { selectUserRole } from "../store/reducers/authSlicer";


export const useRole = () => {
    const role = useSelector(selectUserRole);
    
    const hasRole = (requiredRole: string) => {
        return role === requiredRole;
    };

    return { role, hasRole };
};