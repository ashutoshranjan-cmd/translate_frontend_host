import { useState } from "react";
import Cookies from 'js-cookie';
import { useDispatch } from "react-redux";
import { getLogin } from "../redux/slices";

export const useLogin = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const dispatch = useDispatch();

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (!response.ok) {
                setError(result.message || 'An error occurred during login');
                return false;
            }

            dispatch(getLogin(true));
            Cookies.set('user', JSON.stringify(result));
            return true;

        } catch (err) {
            setError('An unexpected error occurred');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};