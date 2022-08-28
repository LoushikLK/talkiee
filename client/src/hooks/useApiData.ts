import { BASE_URL } from "config/path";
import { useEffect, useState } from "react";

const useApiData = <T>(path: string) => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<T>();

  const [error, setError] = useState<string>("");

  const [reFetch, setRefetch] = useState(false);

  const getData = async () => {
    try {
      setLoading(true);
      const authToken = localStorage.getItem("authToken");
      const result = await fetch(BASE_URL + path, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      const data = await result.json();

      if (result.status !== 200) {
        setLoading(false);
        setError(data?.message);
        setData(undefined);
        return;
      }

      setLoading(false);
      setData(data?.data);
    } catch (error) {
      setLoading(false);
      if (error instanceof Error) {
        setError(error.message);
        return;
      }
      setError("Something went wrong");
    }
  };

  const handleRefetch = () => {
    setRefetch(!reFetch);
  };

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      getData();
    }

    return () => {
      mounted = false;
    };
  }, [path, reFetch]);

  return {
    data,
    loading,
    error,
    reFetch: handleRefetch,
  };
};

export default useApiData;
