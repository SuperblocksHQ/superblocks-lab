export const explorerActions = {
    RENAME_FILE: 'RENAME_FILE',
    renameFile(id: any, name: string) { // maybe should use filepath instead
        return {
            type: explorerActions.RENAME_FILE,
            data: { id, name }
        };
    }
};
