import { notification } from 'antd';
import CryptoJS from 'crypto-js';
const WORKING_KEY = 'PARTH1108';

export const notify = (type = 'info', msg) => {
    if (msg?.length > 0 || msg?.props['className'] == 'f_cp') { notification.destroy(); notification.open({ message: msg, description: '', type }); }
};

const textEncrypt = (plainText) => {
    const key = CryptoJS.MD5(WORKING_KEY || '');

    // Create an initialization vector (IV)
    const iv = CryptoJS.enc.Hex.parse('0c0d0e0f000102030405060708090a0b');

    // Encrypt using AES
    const encrypted = CryptoJS.AES.encrypt(plainText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString();
};
const textDecrypt = (encText) => {
    if (encText === '') {
        return encText;
    }

    const key = CryptoJS.MD5(WORKING_KEY || '');

    // Create an initialization vector (IV)
    const iv = CryptoJS.enc.Hex.parse('0c0d0e0f000102030405060708090a0b');

    // Decrypt using AES
    const decrypted = CryptoJS.AES.decrypt(encText, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
};

const UtilLocalService = {
    setLocalStorage: (key, value) => {
        const setKey = textEncrypt(JSON.stringify(key));
        const setValue = textEncrypt(JSON.stringify(value));
        localStorage.setItem(setKey, setValue);
    },
    getLocalStorage: (key) => {
        const setKey = textEncrypt(JSON.stringify(key));
        const data = localStorage.getItem(setKey);
        return data ? JSON.parse(textDecrypt(data)) : null;
    },
    removeLocalStorage: (key) => {
        const setKey = textEncrypt(JSON.stringify(key));
        localStorage.removeItem(setKey);
    },
    clearLocalStorage: () => {
        localStorage.clear();
    },
};

export default UtilLocalService;
