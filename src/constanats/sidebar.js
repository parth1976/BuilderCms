import React from "react";
import { F_BankCashIcon, F_BankingIcon, F_CompanyIcon, F_DashboardIcon, F_MultiUserIcon, F_NotificationIcon, F_ReportLedgerIcon } from "../Icons";

export const USER_SIDEBAR_MENU = [

    {
        path: '/dashboard',
        name: 'Dashboard',
        icon: (
            <React.Fragment>
                <F_DashboardIcon width="18px" height="18px" />
            </React.Fragment>
        ),
    },
    {
        path: '/company',
        name: 'Company',
        icon: (
            <React.Fragment>
                <F_CompanyIcon width="18px" height="18px" />
            </React.Fragment>
        ),
    },
    {
        path: '/party',
        name: 'Party',
        icon: (
            <React.Fragment>
                <F_MultiUserIcon width="20px" height="20px" />
            </React.Fragment>
        ),
    },
    {
        path: '/reminder',
        name: 'Reminder',
        icon: (
            <React.Fragment>
                <F_NotificationIcon width="21px" height="21px" />
            </React.Fragment>
        ),
    },
    {
        path: '/cash-account',
        name: 'Cash Account',
        icon: (
            <React.Fragment>
                <F_BankCashIcon width="18px" height="18px" />
            </React.Fragment>
        ),
    },
    {
        path: '/bank-account',
        name: 'Bank Account',
        icon: (
            <React.Fragment>
                <F_BankingIcon width="18px" height="18px" />
            </React.Fragment>
        ),
    },
    {
        path: '/ledger-report',
        name: 'Ledger Report',
        icon: (
            <React.Fragment>
                <F_ReportLedgerIcon width="18px" height="18px" />
            </React.Fragment>
        ),
    },
]