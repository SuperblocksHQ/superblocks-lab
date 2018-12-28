import { buildProjectHtml } from './utils/buildProjectHtml';

let projectItem = null;
let exportableDappHtml = null;
let modalFunctions = null;

export const previewService = {
    init(wallet, modal) { // modal should be removed as parameter
        modalFunctions = modal;

        window.addEventListener('message', async (e) => {
            if (e.data.type === 'window-ready' && this.projectItem) {
                const builtProject = await buildProjectHtml(this.projectItem, wallet);
                exportableDappHtml = builtProject.exportableContent;
                e.source.postMessage({ type: 'set-content', payload: builtProject.content }, '*');
            }
        });
    },

    get projectItem() { return projectItem; },
    set projectItem(value) { 
        projectItem = value;
        exportableDappHtml = null;
    },

    get hasExportableContent() { return Boolean(exportableDappHtml); },

    downloadDapp() {
        if (!exportableDappHtml) {
            return;
        }

        const exportName = 'superblocks_dapp_' + this.projectItem.getName() + '.html';
        var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportableDappHtml);
        var downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute('href', dataStr);
        downloadAnchorNode.setAttribute('download', exportName);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
};
