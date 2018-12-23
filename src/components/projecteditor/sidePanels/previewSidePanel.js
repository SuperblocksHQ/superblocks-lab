import React from 'react';
import style from './style.less';
import SuperProvider from '../../superprovider';
import { IconShowPreview, IconRefresh, IconDownloadDApp, IconOpenWindow } from '../../icons';
import Tooltip from '../../tooltip';
import { BaseSidePanel } from './baseSidePanel';
import { previewService } from '../../../services';

function getIframeSrc() {
    if (window.location.hostname === 'localhost') {
        return `${window.location.protocol}//${window.location.host}/app-view.html`;
    } else {
        return `${window.location.protocol}//lab-dapp.${window.location.host}/app-view.html`;
    }
}

const IFRAME_ID = 'appViewIframe';

export class PreviewSidePanel extends React.Component {
    constructor(props) {
        super(props);
        this.superProvider = new SuperProvider(IFRAME_ID, previewService.projectItem);
    }

    componentDidMount() {
        this.superProvider._attachListener();
        this.superProvider.initIframe(document.getElementById(IFRAME_ID));
    }

    componentWillUnmount() {
        this.superProvider._detachListener();
    }

    refresh() {
        document.getElementById(IFRAME_ID).contentWindow.location.reload();
    }

    download() {
        previewService.downloadDapp(); // TODO: this should be removed from here and done though redux
    }

    render() {
        return (
            <BaseSidePanel icon={<IconShowPreview />} name="Preview" onClose={this.props.onClose}>
                <div className={style.appview}>
                    <div className={style.toolbar}>
                        <button className="btnNoBg" title="Refresh" onClick={() => this.refresh()}>
                            <Tooltip title="Refresh Page"><IconRefresh /></Tooltip>
                        </button>
                        <div className={style.urlBar}>{getIframeSrc()}</div>
                        <button className="btnNoBg" title="Download" onClick={() => this.download()}>
                            <Tooltip title="Download DApp"><IconDownloadDApp /></Tooltip>
                        </button>
                        <button className="btnNoBg" title="Open window" onClick={() => this.refresh()}>
                            <Tooltip title="Open window"><IconOpenWindow /></Tooltip>
                        </button>
                    </div>
                    <iframe id={IFRAME_ID} src={getIframeSrc()}></iframe>
                </div>
            </BaseSidePanel>
        );
    }
}
