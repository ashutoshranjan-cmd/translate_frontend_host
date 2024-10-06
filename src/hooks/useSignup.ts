import { useState } from 'react';
import Cookies from 'js-cookie';

export const useSignup = () => {
  const [error, setError] = useState<boolean|null>(false);
  const [isLoading, setIsLoading] = useState(false);

  const signup = async (formData:FormData) => {
    setIsLoading(true);
    setError(null);
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
  

    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        body: formData,

        // If using FormData, do not set Content-Type
        // headers: { 'Content-Type': 'multipart/form-data' }, // Not needed for FormData
      });

      const result = await response.json();

      if (!response.ok) {
        // setError(result.message || 'An error occurred'); // Ensure server sends 'message'
        setError(false);
        return error;
      } else {
        Cookies.set('user', JSON.stringify(result), { expires: 3 }); // Example of expiration
        console.log('Signup successful:', result);
        setError(true)
        return error;
      }
    } catch (err) {
      setError(false);
      // return false;
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading };
};
