import {useRouter} from "next/navigation";
import { useMutation } from "@tanstack/react-query"
import {LoginRequest} from "@/types/auth";
import {authService} from "@/services/auth.service";


export const useLogin = () => {
    const router = useRouter();

    return useMutation({
        mutationFn: (credentials: LoginRequest) => authService.login(credentials),
        onSuccess: () => {
            router.push("/");
        }
    })
}

export const useLogout = () => {
    const router = useRouter();

    return () => {
        authService.logout();
        router.push("/login");
    }
}

export const useIsAuthenticated = () => {
    return authService.isAuthenticated();
}