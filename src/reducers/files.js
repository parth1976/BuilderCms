import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loaderActivityFn } from "../utils/api";
import UtilLocalService, { notify } from "../utils/localServiceUtil";
import { BASE_URL, TOKEN_KEY } from "../constanats";
import { setApiStatus } from "./auth";
import { store } from "..";
import axios from "axios";
import { useDispatch } from "react-redux";

export const getFiles = createAsyncThunk("files/getFiles", async (isMasterData, thunkAPI) => {
    const user = thunkAPI.getState();
    const dispatch = thunkAPI.dispatch; // Use dispatch from thunkAPI, not useDispatch()
    try {
      loaderActivityFn(true);
      store.dispatch(setApiStatus('start'));
  
      const authUser = user.auth.authUser;
      const apiUrl = 'user/files/paginate';
  
      if (UtilLocalService.getLocalStorage(TOKEN_KEY)) {
        let reqObj = {};
        if (isMasterData) {
          reqObj.isMasterData = isMasterData;
        }
  
        const response = await axios.post(
          `${BASE_URL}/${apiUrl}`,
          reqObj,
          {
            headers: {
              Authorization: "Bearer " + UtilLocalService.getLocalStorage(TOKEN_KEY),
            },
          }
        );
          if (response.data.code !== "OK") {
          notify("error", response.data.message);
          return thunkAPI.rejectWithValue(response.data.message);
        }
    
        if(authUser?.selectedCompany){
          const updatedCompanyData = response.data.data.list.find(item => item?._id == authUser?.selectedCompany)
          dispatch(setSelectedCompanyData(updatedCompanyData))
          UtilLocalService.setLocalStorage("selectedCompany" , updatedCompanyData)
      }
  
        // UtilLocalService.setLocalStorage('companies', response?.data?.data?.list.filter(companies => companies.isPaid));
        let data = {
          data: {
            count: response.data.data.count,
            isThirdPartyActive: response.data.data.isThirdPartyActive,
            isThirdPartyDisabled: response.data.data.isThirdPartyDisabled,
          },
          count: response.data.data.count,
          isThirdPartyActive: response.data.data.isThirdPartyActive,
          isThirdPartyDisabled: response.data.data.isThirdPartyDisabled,
          allComponies: response.data.data.list,
          list: response.data.data.list.filter(companies => companies.isPaid)
        }
        // UtilLocalService.setLocalStorage('allCompanies', [...response.data.data.list]);
        // UtilLocalService.setLocalStorage('companies',response.data.data.list.filter(companies => companies.isPaid ));
        return thunkAPI.fulfillWithValue({ ...data });
      }
      else {
        return thunkAPI.fulfillWithValue({ list: [] });
      }
  
    } catch (err) {
      notify("error", err?.response?.data?.message);
      return thunkAPI.rejectWithValue(JSON.parse(err));
    }
    finally {
      loaderActivityFn(false);
      store.dispatch(setApiStatus('complete'));
    }
  });

  const filesSlice = createSlice({
    name: 'files',
    initialState: {
      data: {
        count: 0,
        isThirdPartyActive: false,
        isThirdPartyDisabled: false,
        loading: true,
      },
      list: UtilLocalService.getLocalStorage('companies') != null ? UtilLocalService.getLocalStorage('companies') : [],
      allComponies: UtilLocalService.getLocalStorage('allCompanies'),
      selectedCompanyData : null,
      isFaq : false,
      isVideoTutorial : false,
    },
    reducers: {
      stateEmpty: (state) => {
        state.data.count = 0;
        state.data.isThirdPartyActive = false;
        state.data.isThirdPartyDisabled = false;
        state.data.loading = false;
        state.list = [];
        state.allComponies = []
      },
      setSelectedCompanyData : (state , action) => {
          state.selectedCompanyData = action.payload
      },
      setIsFAQ : (state , action) => {
          state.isFaq = action.payload
      },
      setIsVideoTutorial : (state , action) => {
          state.isVideoTutorial = action.payload
      }
    },
    extraReducers: (builder) => {
      builder.addCase(getFiles.rejected, (state) => {
        state.data.loading = false;
        state.list = []
        state.allComponies = []
        state.data.count = 0
        state.data.isThirdPartyActive = false
        state.data.isThirdPartyDisabled = false
      })
  
      builder.addCase(getFiles.pending, (state) => {
        state.data.loading = true;
      })
  
      builder.addCase(getFiles.fulfilled, (state, action) => {
        state.data.count = action.payload.count
        state.data.isThirdPartyActive = action.payload.isThirdPartyActive
        state.data.isThirdPartyDisabled = action.payload.isThirdPartyDisabled
        state.list = [...action.payload.list]
        state.allComponies = [...action.payload.allComponies]
        state.data.loading = false;
      })
    }
  }
  )
  export const { stateEmpty , setSelectedCompanyData, setIsFAQ, setIsVideoTutorial } = filesSlice.actions;
  export default filesSlice.reducer;