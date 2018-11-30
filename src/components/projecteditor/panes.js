// Copyright 2018 Superblocks AB
//
// This file is part of Superblocks Lab.
//
// Superblocks Lab is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation version 3 of the License.
//
// Superblocks Lab is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Superblocks Lab.  If not, see <http://www.gnu.org/licenses/>.

import { h, Component } from 'preact';
import classnames from 'classnames';
import SplitterLayout from "react-splitter-layout";
import PropTypes from 'prop-types';
import style from './style';
import { Pane, PaneComponent } from './pane';
import { IconClose, IconTest, IconPlay, IconStop, IconRun, IconCheck } from '../icons';
import { DropdownContainer } from '../dropdown';
import Caret from '../../../src/components/caret';
import Test from './testResults';

// TODO: FIXME: move TestData to bridge code
import { readSelectedTestId, setTestData } from './testResults';

// TODO: FIXME: consider relocating to more appropriate place;
//              consider it to be a state, props, control, ... ?
import { testRunnerBridge } from "../testing/bridge";

const ConsoleTopBar =(props)=>
{
    return(
        <div className={style.consoleTopBar}>
            <span className={style.testBar}>
                <IconTest className={style.icon}  />
            <span className={style.testText}>Tests</span>
            </span>
            <div className={style.closeIcon}>
                <button className="btnNoBg">
                    <IconClose className={style.closeIcon} onClick={props.closeTestPanel} />
                </button>
            </div>
        </div>
);
}
const TestControls =(props)=>{
    return(
        <div className={style.testControls}>
            <span className={style.icons}>
                <div>
                    <button className="btnNoBg" title="Run" onClick={props.onClickPlay}>
                        <IconPlay className={style.iconPlay} />
                    </button>
                </div>
        <div>
                    <button className="btnNoBg" title="Refresh" onClick={props.onClickRetry}>
                <IconRun  />
            </button>
        </div>
       <div className={style.buttons}>
             <button className="btnNoBg" title="Stop" onClick={
                () => {
                    {
                        // TODO: FIXME: being used as a way to debug data
                        // TODO: FIXME: remove debugging code
                        console.warn(testRunnerBridge.readData());
                    }
                }
             }>
                  <IconStop />
             </button>
        </div>
            </span>
        </div>)
};
const TestFilesHeader =(props)=>{
    const { total, totalDone, time } =props;
    return(<div className={style.testFile }>
        <span className={style.bartext}>Done {totalDone} of {total} tests</span>
        <span>{time}</span>
    </div>)
};


export default class Panes extends Component {

    constructor(props) {
        super(props);
        this.panes=[];
        this.activePaneId=null;
        props.router.register("panes", this);
        this.state={
            open: true,
            resultData: []
        }
    }

    componentDidMount() {
        window.addEventListener('resize', ()=>{this.redraw()});
    }

    addWindow = (props, paneId) => {
        var pane;
        if(paneId) {
            pane=this.getPane(paneId).pane;
        }
        if(!pane) {
            pane=new Pane({router: this.props.router, id:this.props.functions.generateId(), parent: this});
            this.panes.unshift(pane);
        }
        var winId = pane.addWindow(props);
        if(winId==null) return {};
        return {pane, winId};
    };

    focusWindow = (paneId, winId, rePerform, cb) => {
        this.activePaneId=paneId;
        var {pane}=this.getPane(paneId);
        pane.focusWindow(winId, rePerform, cb);
    };

    closeWindow = (paneId, winId, cb) => {
        var {pane}=this.getPane(paneId);
        pane.closeWindow(winId, cb);
    };

    removePane = (id) => {
        this.panes = this.panes.filter((pane) => {
            return pane.id!=id;
        });
    };

    getPane = (id) => {
        var pane=null;
        var index=null;
        for(var paneIndex=0;paneIndex<this.panes.length;paneIndex++) {
            var pane2=this.panes[paneIndex];
            if(pane2.id==id) {
                pane=pane2;
                index=paneIndex;
                break;
            }
        }
        return {pane, index};
    };

    // Search all panes for a specific window.
    getWindowByItem = (item) => {
        var pane=null;
        var win=null;
        for(var paneIndex=0;paneIndex<this.panes.length;paneIndex++) {
            var pane2=this.panes[paneIndex];
            var win2=pane2.getWindowByItem(item);
            if(win2) {
                pane=pane2;
                win=win2;
                break;
            }
        }
        return {pane: pane, winId: (win ? win.getItemId():null)};
    };

    getActivePane = () => {
        return this.getPane(this.activePaneId).pane;
    };

    redraw = (all) => {
        const props={};
        var panes;
        if(all) {
            props.all=true;
            panes = this.panes;
        }
        else {
            panes=[];
            const pane=this.getActivePane();
            if(pane) panes.push(pane);
        }
        this.setState();
        setTimeout(()=>{for(var index=0;index<panes.length;index++) panes[index].redraw(props)},1);
    };

    openItem = (item, targetPaneId, cb) => {
        // Check if item is already opened.
        var {pane, winId} = this.getWindowByItem(item);
        if(pane && winId) {
            this.focusWindow(pane.id, winId, true, cb);
        }
        else {
            if(targetPaneId) {
                var {pane} = this.getPane(targetPaneId);
                if(pane==null) return false;
                if(pane.windowsCount()>=4) {
                    targetPaneId=null;
                }
            }
            var {pane, winId} = this.addWindow({item: item, router: this.props.router, functions: this.props.functions}, targetPaneId);
            this.focusWindow(pane.id, winId, false, cb);
        }
        this.setState();
        return true;
    };

    tabRightClicked = (e, id) => {
        // We save the pane id for when closing all other panes.
        e.preventDefault();
        this.setState({showContextMenuPaneId:id});
    };

    tabClicked = (e, id) => {
        e.preventDefault();
        this.activePaneId=id;
        this.setState();
    };

    tabClickedClose = (e, paneId) => {
        e.preventDefault();
        e.stopPropagation();  // Important so we don't trigger tabClicked
        this.closePane(paneId);
    }

    closeAll = (cb, keepPaneId) => {
        const fn = () => {
            if(this.panes.length==0) {
                if(cb) cb(0);
                return;
            }
            var pane = this.panes[0];
            if(keepPaneId == pane.id) {
                if(this.panes.length > 1) {
                    pane = this.panes[1];
                }
                else {
                    if(cb) cb(0);
                    return;
                }
            }
            this.closePane(pane.id, (status) => {
                if(status==0) {
                    fn();
                }
                else {
                    if(cb) cb(1);
                }
            });
        };
        fn();
    };

    closePane = (paneId, cb) => {
        var {pane,index}=this.getPane(paneId);
        pane.closeAll( (status) => {
            if(status==0) {
                this.removePane(paneId);
                var pane=this.panes[index] || this.panes[index-1];
                if(pane) {
                    this.activePaneId=pane.id;
                }
                else {
                    this.activePaneId=null;
                }
                this.setState();
            }
            if(cb) cb(status);
        });
    };

    closeAllPanes = (e) => {
        e.preventDefault();
        this.closeAll();
    };

    closeAllOtherPanes = (e) => {
        e.preventDefault();
        this.closeAll(null, this.state.showContextMenuPaneId);
    };

    renderHeader = () => {
        const tab=style.tab;
        const selected=style.selected;
        const html = this.panes.map( (pane, index) => {
            const contextMenu=(
                    <div class={style.contextMenu}>
                        <a href="#" onClick={this.closeAllPanes}>Close all</a>
                        <a href="#" onClick={this.closeAllOtherPanes}>Close all other</a>
                    </div>
            );
            var isSelected=(pane.id==this.activePaneId);
            const cls={};
            cls[tab]=true;
            cls[selected]=isSelected;
            return (
                <div>
                    <a href="#" className={classnames(cls)} onClick={(e) => this.tabClicked(e, pane.id)} onContextMenu={(e) => this.tabRightClicked(e, pane.id)}>
                        <DropdownContainer dropdownContent={contextMenu} useRightClick={true}>
                            <div>
                                <div class={style.title}>
                                    <div class={style.icon}>
                                        {pane.getIcon()}
                                    </div>
                                    <div class={style.title2}>
                                        {pane.getTitle()}
                                    </div>
                                </div>
                                <div class={style.close}>
                                    <a href="#" onClick={(e) => this.tabClickedClose(e, pane.id)}>
                                        <IconClose />
                                    </a>
                                </div>
                            </div>
                        </DropdownContainer>
                    </a>
                </div>
            );
        });
        return (<div>{html}</div>);
    };

    getPaneHeight = () => {
        const a=document.getElementById("panes");
        const b=document.getElementById("panes_header");
        return a.offsetHeight - b.offsetHeight - 80;  // 80 is the magic number to adjust for height taken by borders/toolbars.
    };

    renderPanes = () => {
        const default1=style.pane;
        const visible=style.visible;
        const html = this.panes.map( (pane, index) => {
            var isVisible=(pane.id==this.activePaneId);
            const cls={};
            cls[default1]=true;
            cls[visible]=isVisible;
            const key="pane_"+pane.id;
            // NOTE: We are prematurely setting the display property of the pane
            // because it will affect any javascript "offsetHeight" which will
            // otherwise get 0 when the pane goes from invisible to visible.
            // I don't think there's any harm in doing this.
            if(isVisible) {
                var paneObj=document.getElementById(key);
                if(paneObj) {paneObj.style.display="block";
            }
            }
            else {
                var paneObj=document.getElementById(key);
                if(paneObj) paneObj.style.display="none";
            }
            const maxHeight = {
                height: this.getPaneHeight() + "px"
            };
            return (
                <div key={key} id={key} className={classnames(cls)} style={maxHeight}>
                    <PaneComponent obj={pane} />
                </div>);
        });
        return (<div>{html}</div>);
    };


    // TODO: FIXME: improve action names
    onPlayRun = () =>{
        testRunnerBridge.runAll(this.props.functions.EVM.getProvider());
        setTimeout(()=>{
            const data = testRunnerBridge.readData();
            this.setState({resultData: data})
            setTestData(data.reportOutput);
        },2000);
    };

    onRetry = () => {
        // TODO: FIXME: selection by index position
        const index = readSelectedTestId();
        testRunnerBridge.runSingle(this.props.functions.EVM.getProvider(), index);
        setTimeout(()=>{
            const data = testRunnerBridge.readData();
            this.setState({resultData: data})
            setTestData(data.reportOutput);
        },2000);
    };

    render() {
        const header=this.renderHeader();
        const panes=this.renderPanes();
        console.log('result data::', this.state.resultData);
        const { resultData } = this.state;
        const { isActionPanelShowing, testPanel } = this.props;

        return (
           <div key="panes" id="panes" class="full" style={{ width: isActionPanelShowing ? 'calc(100% - 450px)' : '100%'}}>
               <div key="header" id="panes_header" class={style.header}>
                   {header}
               </div>
               {/*remove this condition and add proper state management for handling closing the pane.*/}
               { this.props.testPanel &&
                <SplitterLayout customClassName='dragBar' percentage secondaryInitialSize={60} vertical={true}>
                    <div key="panes2" className={style.panes}>
                        {panes}
                    </div>
                    <div>
                        <ConsoleTopBar testResults={resultData} closeTestPanel={this.props.closeTestPanel}/>
                        <SplitterLayout customClassName='dragBar' percentage secondaryInitialSize={70} primaryMinSize={30} secondaryMinSize={30} vertical={false}>
                            <div className={style.leftPane}>
                                <TestFilesHeader total={resultData.summary ? resultData.done.count : 0 } totalDone={resultData.summary ? resultData.done.total : 0 } time={'60ms'} />
                                <TestControls onClickPlay={this.onPlayRun } onClickRetry={this.onRetry} />
                                <div id="test" style={{position:'absolute',left: 20, top: 40, width: '98%'}} >
                                    <Test open={this.state.open} />
                                </div>
                            </div>
                        <div className={style.rightPane}>
                            <div className={style.rightStatusBar}>
                                <span className={style.statusBar}>Test Summary</span>
                                <span style={{ color: '#7ed321' }} className={style.statusBar}>{resultData.summary ? resultData.summary.passed : 0} Passed</span>
                                <span style={{ color: '#d0021b' }} className={style.statusBar}>{resultData.summary ? resultData.summary.failed : 0} Failed</span>
                                <span className={style.statusBar}>{resultData.summary ? resultData.summary.total : 0  } Total</span>
                            </div>
                            <div className={style.consoleText}>{resultData.consoleOutput}</div>
                        </div>
                        </SplitterLayout>
                    </div>
                </SplitterLayout>
               }
               {
                   !this.props.testPanel &&
                   <div key="panes2" className={style.panes}>
                       {panes}
                   </div>
               }
           </div>


        );
    }
}

Panes.propTypes = {
    router: PropTypes.object.isRequired,
    functions: PropTypes.object.isRequired,
    isActionPanelShowing: PropTypes.bool.isRequired
}
