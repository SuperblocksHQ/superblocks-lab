import React from 'react';
import style from '../style.less';
import { IconShowPreview, IconRefresh, IconDownloadDApp, IconOpenWindow } from '../../../icons';
import Tooltip from '../../../tooltip';
import OnlyIf from '../../../onlyIf';
import { BaseSidePanel } from '../baseSidePanel';
import { previewService } from '../../../../services';
import { CannotExportModal } from './cannotExportModal';
import { DownloadModal } from './downloadModal';
import { NoExportableContentModal } from './noExportableContentModal';

function getIframeSrc() {
    if (window.location.hostname === 'localhost') {
        return `${window.location.protocol}//${window.location.host}/app-view.html`;
    } else {
        return `${window.location.protocol}//${window.location.host.replace('lab', 'lab-dapp')}/app-view.html`;
    }
}

const IFRAME_ID = 'appViewIframe';

export class PreviewSidePanel extends React.Component {
    constructor(props) {
        super(props);
        previewService.initSuperProvider(IFRAME_ID);
    }

    componentDidMount() {
        previewService.superProvider._attachListener();
    }

    componentWillUnmount() {
        previewService.superProvider._detachListener();
    }

    refresh() {
        const iframe = document.getElementById(IFRAME_ID);
        iframe.contentWindow.location.reload();
        
    }

    tryDownload() {
        // TODO: parameters should not be passed here, but obtained from redux app state
        this.props.onTryDownload(previewService.hasExportableContent, previewService.projectItem.getEnvironment());
    }

    render() {
        const isProjectOpen = Boolean(previewService.projectItem);

        return (
            <BaseSidePanel icon={<IconShowPreview />} name="Preview" onClose={this.props.onClose} dragging={this.props.dragging}>
                <OnlyIf test={isProjectOpen}>
                    <div className={style.appview}>
                        <div className={style.toolbar}>
                            <button className="btnNoBg" title="Refresh" onClick={() => this.refresh()}>
                                <Tooltip title="Refresh Page"><IconRefresh /></Tooltip>
                            </button>
                            <div className={style.urlBar}>{getIframeSrc()}</div>
                            <button className="btnNoBg" title="Download" onClick={() => this.tryDownload()}>
                                <Tooltip title="Download DApp"><IconDownloadDApp /></Tooltip>
                            </button>
                        </div>
                        <iframe id={IFRAME_ID} src={getIframeSrc()}></iframe>
                    </div>

                    {this.props.showNoExportableContentModal &&
                    <NoExportableContentModal onClose={this.props.onHideModals} />
                    }
                    {this.props.showCannotExportModal &&
                    <CannotExportModal onClose={this.props.onHideModals} />
                    }
                    {this.props.showDownloadModal &&
                    <DownloadModal 
                        environment={previewService.projectItem.getEnvironment()}
                        onClose={this.props.onHideModals}
                        onDownload={this.props.onDownload} />
                    }
                </OnlyIf>
            </BaseSidePanel>
        );
    }
}
