import { createSlice } from "@reduxjs/toolkit";
import UtilLocalService from '../utils/localServiceUtil';
import { TOKEN_KEY } from "../constanats";

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: UtilLocalService.getLocalStorage(TOKEN_KEY),
        authUser: UtilLocalService.getLocalStorage('user'),
        dataAuditError: UtilLocalService.getLocalStorage('dataAuditError') || [],
        authUserFlag: UtilLocalService.getLocalStorage('userFlag'),
        subscriptionUser: UtilLocalService.getLocalStorage('subscriptions') || '',
        isPlanExpired: UtilLocalService.getLocalStorage('isPlanExpired') || null,
        userPermission: UtilLocalService.getLocalStorage('permission'),
        userPlanName: UtilLocalService.getLocalStorage('userPlanName') || '',
        clickCountInTrial: 0,
        notificationArrs: '',
        tallyCompany: [],
        currCompany: "",
        purchaseArray: "",
        sales: [],
        payment: [],
        receipt: [],
        fetchFilesData: null,
        openBankingUpload : "",
        mergeDocVisible : UtilLocalService.getLocalStorage("mergeDocEnable") || false,
        mergeDocArr : [],
        systemStatus: {
            isTallyConnectorLogin: UtilLocalService.getLocalStorage('isTallyConnectorLogin') || false,
            isTallyConnected: UtilLocalService.getLocalStorage('isTallyConnected') || false,
            isTallyCompanyOpen: UtilLocalService.getLocalStorage('isTallyCompanyOpen') || false,
            isTallyId: UtilLocalService.getLocalStorage('isTallyId') || ""
        },
        stripHeight: 0,
        apiStatus: "init",
        profileStep: 0
    },
    reducers: {
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setDataAuditError: (state, action) => {
            state.dataAuditError = action.payload;
        },
        setClickCountInTrial: (state, action) => {
            state.clickCountInTrial = action.payload;
        },
        setApiStatus: (state, action) => {
            state.apiStatus = action.payload;
        },
        setAuthUser: (state, action) => {
            state.authUser = action.payload;
        },
        setAuthUserFlag: (state, action) => {
            state.authUserFlag = action.payload;
        },
        setSubscriptionUser: (state, action) => {
            state.subscriptionUser = action.payload;
        },
        setIsPlanExpired: (state, action) => {
            state.isPlanExpired = action.payload;
        },
        setUserPlanName: (state, action) => {
            state.userPlanName = action.payload;
        },
        setUserPermission: (state, action) => {
            state.userPermission = action.payload;
        },
        setNotificationArray: (state, action) => {
            state.notificationArrs = action.payload;
        },
        setTallyCompany: (state, action) => {
            state.tallyCompany = action.payload;
        },
        setCurrCompany: (state, action) => {
            state.currCompany = action.payload;
        },
        setPurchaseArray: (state, action) => {
            state.purchaseArray = action.payload;
        },
        setSales: (state, action) => {
            state.sales = action.payload;
        },
        setReceipt: (state, action) => {
            state.receipt = action.payload;
        },
        setPayment: (state, action) => {
            state.payment = action.payload;
        },
        setsystemStatus: (state, action) => {
            state.systemStatus = action.payload;
        },
        setInitialEmailOrMobile: (state, action) => {
            state.initialEmailOrMobile = action.payload;
        },
        setFetchFilesData: (state, action) => {
            state.fetchFilesData = action.payload;
        },
        setOpenBankingUpload : (state , action) => {
            state.openBankingUpload = action.payload
        },
        setStripHeight: (state, action) => {
            state.stripHeight = action.payload;
        },
        setProfileStep: (state, action) => {
            state.profileStep = action.payload;
        },
        setMergeDocVisible: (state, action) => {
            state.mergeDocVisible = action.payload;
        },
        setMergeDocArr: (state, action) => {
            state.mergeDocArr = action.payload;
        },
        logout: (state) => {
            UtilLocalService.removeLocalStorage('user');
            UtilLocalService.removeLocalStorage(TOKEN_KEY);
            UtilLocalService.removeLocalStorage('playerId');
            UtilLocalService.removeLocalStorage('playerIds');
            UtilLocalService.removeLocalStorage('permission');
            UtilLocalService.removeLocalStorage('subscriptions');
            UtilLocalService.removeLocalStorage('isPlanExpired');
            UtilLocalService.removeLocalStorage('userPlanName');
            UtilLocalService.removeLocalStorage("companyListData");
            UtilLocalService.removeLocalStorage("allCompanies");
            UtilLocalService.removeLocalStorage("companies");
            UtilLocalService.removeLocalStorage('isTallyCompanyOpen')
            UtilLocalService.removeLocalStorage('isTallyConnectorLogin')
            UtilLocalService.removeLocalStorage('isTallyConnected')
            UtilLocalService.removeLocalStorage('isTallyId')
            UtilLocalService.removeLocalStorage("dashboardConfigPageId")
            UtilLocalService.removeLocalStorage("dashboardConfigPage")
            UtilLocalService.removeLocalStorage("dashboardConfigPageList")
            UtilLocalService.removeLocalStorage("mergeDocEnable")

            localStorage.removeItem('forgot-password');
            state.authUser = null;
            state.token = null;
            state.userPlanName = '';
            state.notificationArrs = '';
            state.tallyCompany = [];
            state.currCompany = "";
            state.purchase = [];
            state.sales = [];
            state.payment = [];
            state.receipt = [];
            state.mergeDocArr = [];
            state.initialEmailOrMobile = '';
            state.stripHeight = 0;
            state.profileStep = 0;
        },
    }
})

export const { setToken, setDataAuditError, setAuthUser, setApiStatus, setClickCountInTrial, setAuthUserFlag, logout, setUserPermission, setSubscriptionUser, setIsPlanExpired, setUserPlanName, setNotificationArray, setTallyCompany, setCurrCompany, setPurchaseArray, setSales, setPayment, setReceipt, setsystemStatus, setInitialEmailOrMobile, setFetchFilesData, setOpenBankingUpload,setStripHeight, setProfileStep ,setMergeDocVisible ,setMergeDocArr } = authSlice.actions;
export default authSlice.reducer;
