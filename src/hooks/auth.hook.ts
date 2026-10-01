import { useMutation } from "@tanstack/react-query"
import { userLogin } from "@/api"

export function useLogin(){

    return useMutation ({
        mutationFn: userLogin,
    })
}