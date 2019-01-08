
/**
 * Extract the address from a given account based on the selected environment in the project.
 *
 * @param {ProjectItem} project - The project from which we want to extract the address from.
 * @param {AccountItem} account - The account to extract the wallet address.
 * @param {Wallet} wallet - Helper class managing everything with wallets
 */
export const getAddress = (project, account, wallet) => {
    const chosenEnv = project.getEnvironment();
    const walletName = account.getWallet(chosenEnv);
    let walletItem;
    let walletType = null;

    if (walletName) {
        const walletsItem = project.getHiddenItem('wallets');
        walletItem = walletsItem.getByName(walletName);
    }

    if (walletItem) {
        walletType = walletItem.getWalletType();
        if (walletType == 'external') {
            if (window.web3) {
                const extAccounts = window.web3.eth.accounts || [];
                return extAccounts[0];
            }
        } else {
            const accountIndex = account.getAccountIndex('browser')
            if (wallet.isOpen(walletName)) {
                try {
                    return wallet.getAddress(
                        walletName,
                        accountIndex
                    );
                } catch (ex) {
                    return '0x0';
                }
            }
        }
    } else {
        return account.getAddress(chosenEnv);
    }
}

/**
 * Shorten the the display of an address extracting only the first and last 5 characters
 * of the address value (ex. 0xea6...e7dad)
 *
 * @param {string} address The address to be formatted
 */
export const shortenAddres = (address) => {
    return address ?
            address.substring(0, 5) + '...' + address.substring(address.length - 5, address.length)
        :
            '...';
}
