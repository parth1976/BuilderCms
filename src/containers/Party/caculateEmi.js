import { TENURE } from "../../constanats";

export const calculateEmi = (formValues) => {
    if(formValues?.payment && formValues?.downPayment && formValues?.month && formValues?.regularEMI && formValues?.regularTenure && formValues?.masterEMI && formValues?.masterTenure){
        const { payment, downPayment, month, regularEMI, regularTenure, masterEMI, masterTenure } = formValues;

        // Calculate the total payment
        let remainingAmount = payment;

        // Subtract the down payment
        remainingAmount -= downPayment;

        // Calculate the number of regular EMI installments based on its tenure
        let incrementMonthsRegular;
        switch (regularTenure) {
            case TENURE.MONTHLY: incrementMonthsRegular = 1; break;
            case TENURE.QUARTERLY: incrementMonthsRegular = 3; break;
            case TENURE.SEMI_ANNUAL: incrementMonthsRegular = 6; break;
            case TENURE.ANNUAL: incrementMonthsRegular = 12; break;
            default: incrementMonthsRegular = 1;  // Default to monthly if an unknown tenure type is passed
        }
        let regularInstallments = month / incrementMonthsRegular;

        // Subtract the regular EMI based on the number of installments
        remainingAmount -= (regularEMI * regularInstallments);
        let incrementMonthsMaster;
        switch (masterTenure) {
            case TENURE.MONTHLY: incrementMonthsMaster = 1; break;
            case TENURE.QUARTERLY: incrementMonthsMaster = 3; break;
            case TENURE.SEMI_ANNUAL: incrementMonthsMaster = 6; break;
            case TENURE.ANNUAL: incrementMonthsMaster = 12; break;
            default: incrementMonthsMaster = 1;  // Default to monthly if an unknown tenure type is passed
        }
        // Calculate the number of master EMI installments based on its tenure
        let masterInstallments = month / incrementMonthsMaster;

        // Subtract the master EMI based on the number of installments
        remainingAmount -= (masterEMI * masterInstallments);

        return remainingAmount;
    }
    return null; // or handle the error/invalid input cases
}
