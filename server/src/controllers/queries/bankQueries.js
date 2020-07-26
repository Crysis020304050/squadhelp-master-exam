const db = require('../../models');
const BankDeclineError = require('../../errors/BankDeclineError');
const {SQUADHELP_BANK_NUMBER, SQUADHELP_BANK_CVC, SQUADHELP_BANK_EXPIRY} = require("../../constants/constants");

module.exports.updateBankBalance = async (number, cvc, expiry, sum, isCashOut, transaction) => {
    const [updatedCount] = await db.Banks.update({
            balance: db.sequelize.literal(`
                CASE
            WHEN "cardNumber"='${number.replace(/ /g,
                '')}' AND "cvc"='${cvc}' AND "expiry"='${expiry}'
                THEN "balance"${isCashOut ? '+' : '-'}${sum}
            WHEN "cardNumber"='${SQUADHELP_BANK_NUMBER}' AND "cvc"='${SQUADHELP_BANK_CVC}' AND "expiry"='${SQUADHELP_BANK_EXPIRY}'
                THEN "balance"${isCashOut ? '-' : '+'}${sum} END
        `),
        },
        {
            where: {
                cardNumber: {
                    [db.sequelize.Op.in]: [
                        SQUADHELP_BANK_NUMBER,
                        number.replace(/ /g, ''),
                    ],
                }
            },
            transaction
        });
    if (updatedCount < 2) {
        throw new BankDeclineError();
    }
};