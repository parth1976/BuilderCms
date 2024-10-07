import axios from "axios";
import UtilLocalService from "./localServiceUtil";
import {BASE_URL, TOKEN_KEY } from "../constanats";

export const StaticComponent = () => { }
StaticComponent.counter = 0;

export default axios.create({
    baseURL: "/",
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
        Expires: "0",
        websiteCode: 'user',
    },
});

export const SuvitAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        websiteCode: 'user',
        Authorization: "Bearer " + UtilLocalService.getLocalStorage(TOKEN_KEY),
    }
})

export const callAPI = (method, url, data = {}, header = {}, Isloader = true, isThunk = false, abortSignal) => {
    return new Promise((resolve, reject) => {
        Isloader && loaderActivityFn(true);
        let apiUrl = url;
        const authToken = UtilLocalService.getLocalStorage(TOKEN_KEY);
        const startTime = new Date();
        const request = {
            method: method,
            url: apiUrl,
            headers: {
                Authorization: "Bearer " + authToken,
                websiteCode: 'user',
                ...header,
            },
            data: data,

        };
        axios(request)
            .then(async (data) => {
                const endTime = new Date(); // End time of the API call
                const duration = endTime - startTime; // Calculate duration
                if (data && data.data) data.data.executionTime = duration
                resolve(data?.data);
            })
            .catch(async (error) => {
                if (
                    error?.response?.data?.code === "E_UNAUTHORIZED" ||
                    error?.response?.data?.code === "E_FORBIDDEN"
                ) {
                    if (!window.location.pathname.includes("/signIn")) {
                        loaderActivityFn(true)
                        setTimeout(() => {
                            logoutClear().then((data) => {
                                UtilLocalService.removeLocalStorage("user");
                                UtilLocalService.removeLocalStorage(TOKEN_KEY);
                                UtilLocalService.removeLocalStorage("playerId");
                                UtilLocalService.removeLocalStorage("playerIds");
                                UtilLocalService.removeLocalStorage("isPlanExpired");
                                window.location.replace("/signIn");
                                loaderActivityFn(false)
                            });
                        }, 1000);
                    }
                } else if (error?.response?.data && !error.response.data.message) {
                    error.response.data.message = "Please contact admin.";
                }
                if (error.message !== "changed") {
                    let errorMessage = error?.response?.data
                    if (error.message == "Network Error") {
                        errorMessage = 'Network Error';
                    }
                    console.log('==========> error', error);
                    reject(errorMessage);
                }
            }).finally(() => {
                Isloader && loaderActivityFn(false);
                // loader && !url.includes(`get-ocr-document-data`) && loaderActivityFn(false);

            });

        // cancel();

    });
};

export const loaderActivityFn = (showLoader) => {
    if (showLoader) {
        StaticComponent.counter++;
    } else {
        StaticComponent.counter = Math.max(0, StaticComponent.counter - 1);;
    }
    let getLoaderEle = document.getElementById("loader");
    if (getLoaderEle) {
        if (StaticComponent.counter > 0) {
            getLoaderEle.classList.add("show");
        } else {
            getLoaderEle.classList.remove("show");
        }
    }
};

export const logoutClear = () => {
    return new Promise(async (resolve, reject) => {
        const authUser = UtilLocalService.getLocalStorage("user");
        const playerId = UtilLocalService.getLocalStorage("playerId");
        const authToken = UtilLocalService.getLocalStorage(TOKEN_KEY);
        axios({
            method: "POST",
            url: `${BASE_URL}/auth/logout`,
            headers: {
                Authorization: "Bearer " + authToken,
                websiteCode: 'user'
            },
            data: { playerId },
        })
            .then(resolve)
            .catch(async (error) => {
                if (error?.response?.data?.code === "E_UNAUTHORIZED") {
                    UtilLocalService.removeLocalStorage("user");
                    UtilLocalService.removeLocalStorage(TOKEN_KEY);
                    UtilLocalService.removeLocalStorage("playerId");
                    UtilLocalService.removeLocalStorage("playerIds");
                    window.location.replace("/signIn");
                }
                reject(error?.response?.data);
            });
    });
};

