import { buildProjectHtml } from './utils/buildProjectHtml';
import React from 'react'; // TODO: remove this import when refactored
import Modal from '../components/modal'; // TODO: remove this import when refactored

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

    downloadDapp() {
        if (!exportableDappHtml) {
            alert('Error: Cannot download DApp. The DApp contracts are not deployed yet.');
            return;
        }
        const environment = this.projectItem.getEnvironment();

        if (environment === 'browser') {
            const body = (
                <div>
                    <p>Computer says no.</p>
                    <p>
                        When you download your creation, it is configured for
                        the specific network you have chosen (up to the far
                        left). Right now you have chosen the Browser network,
                        which only exists in your browser when using Superblocks
                        Lab, so downloading your DApp makes no sense until you
                        choose any other network than Browser.
                    </p>
                    <div style={{marginTop: 15}}>
                        <a
                            className="btn2"
                            onClick={modalFunctions.cancel}
                        >
                            Thanks, but I already knew that
                        </a>
                    </div>
                </div>
            );
            const modalData = {
                title: 'Cannot export DApp for the Browser network',
                body: body,
                style: { 'textAlign': 'center' },
            };
            const modal = <Modal data={modalData} />;
            modalFunctions.show({
                render: () => {
                    return modal;
                },
            });
            return;
        }

        const onDownloadClick = e => {
            e.preventDefault();
            modalFunctions.cancel();
            const exportName = 'superblocks_dapp_' + this.projectItem.getName() + '.html';
            var dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(exportableDappHtml);
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute('href', dataStr);
            downloadAnchorNode.setAttribute('download', exportName);
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        };

        const body = (
            <div>
                <p>
                    You are downloading this DApp preconfigured for the{' '}
                    {environment} network.
                </p>
                <p>
                    The HTML file you are about to download contains everything
                    which the DApp needs, such as HTML, CSS, Javascript,
                    contract data and network configurations.
                </p>
                <p>
                    After download you can upload the DApp HTML file to any
                    (decentralized) web host of choice.
                </p>
                <div style={{marginTop: 15}}>
                    <a
                        className="btn2"
                        style={{marginRight: 30}}
                        onClick={modalFunctions.cancel}
                    >
                        Cancel
                    </a>
                    <a className="btn2 filled" onClick={onDownloadClick}>
                        Download
                    </a>
                </div>
            </div>
        );
        const modalData = {
            title: 'Download DApp for the ' + environment + ' network',
            body: body,
            style: { 'textAlign': 'center' },
        };
        const modal = <Modal data={modalData} />;
        modalFunctions.show({
            render: () => {
                return modal;
            }
        });
    }
};
