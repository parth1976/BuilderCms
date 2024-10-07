import BankAccount from "../containers/BankAccount";
import CashAccount from "../containers/CashAccount";
import Company from "../containers/Company";
import Dashboard from "../containers/Dashboard";
import LedgerReport from "../containers/LedgerReport";
import Party from "../containers/Party";
import PartyView from "../containers/Party/PartyView";
import Reminder from "../containers/Reminder";

export const ROUTES = [
    {
        path: '/dashboard',
        component: Dashboard
    },
    {
        path: '/company',
        component: Company
    },
    {
        path: '/party',
        component: Party
    },
    {
        path: '/party/view/:id',
        component: PartyView
    },
    {
        path: '/party/create',
        component: PartyView
    },
    {
        path: '/reminder',
        component: Reminder
    },
    {
        path: '/cash-account',
        component: CashAccount
    },
    {
        path: '/bank-account',
        component: BankAccount
    },
    {
        path: '/ledger-report',
        component: LedgerReport
    },
]