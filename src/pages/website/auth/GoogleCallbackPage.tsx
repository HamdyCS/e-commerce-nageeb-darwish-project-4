import React, { useEffect } from "react";
import { getAsync, postAsync } from "../../../services/apiService";
import { Api_Url, Google_Auth_Callback } from "../../../Apis/Apis";
import { useLocation } from "react-router-dom";
import GoogleCallbackResponseDto from "../../../dtos/auth/GoogleCallbackResponseDto";
import { setInCookie } from "../../../services/cookieService";

export default function GoogleCallbackPage() {
  const location = useLocation();
  useEffect(() => {
    // console.log(location.search);//?code=4%2F0A
    async function fetchData() {
      try {
        const googleCallbackResponseDto =
          await getAsync<GoogleCallbackResponseDto>(
            `${Google_Auth_Callback}${location.search}`,
          );

        //save token in cookie
        setInCookie("BearerToken", googleCallbackResponseDto.access_token);
      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  }, []);

  return <h1>Google Callback Page</h1>;
}
