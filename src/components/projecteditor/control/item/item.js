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

import {
    IconTrash,
    IconGem,
    IconFile,
    IconFolder,
    IconFolderOpen,
    IconCube,
    IconConfigure,
    IconCompile,
    IconDeploy,
    IconClone,
    IconInteract,
    IconContract,
    IconAddContract,
    IconHtml,
    IconJS,
    IconCss,
    IconMd,
    IconShowPreview,
    IconMosaic,
} from '../../../icons';
import Caret from '../../../caret';

import style from '../style';
import classnames from 'classnames';

export default class Item {
    props;
    static idCounter = 0;
    constructor(props, router) {
        if (props.state == null) props.state = {};
        if (props.state.id == null) props.state.id = this.generateId();
        if (props.toggable == null) props.toggable = (props.children != null && props.children.length > 0);
        if (props.toggable && props.state.open == null) props.state.open = true;
        this.props = props;
        this.router = router;
    }

    generateId = () => {
        return "Item_" + (++Item.idCounter);
    };

    getId = () => {
        return this.props.state.id;
    };

    /**
     * Set the children of this item.
     * Either an array or a function.
     *
     */
    setChildren = (children) => {
        this.props.state.children = children;
    };

    /**
     * Set hidden Item of this item.
     * This is a way of using items without showing them in the explorer.
     *
     * @param key: name of this item type.
     * @param: item
     *
     */
    setHiddenItem = (key, item) => {
        this.props.state.hiddenItems = this.props.state.hiddenItems || {};
        this.props.state.hiddenItems[key] = item;
    };

    getChildren = (force, cb) => {
        console.log("getChildren", this);
        if (this.props.state.children == null) this.props.state.children = [];
        if (this.props.state.children instanceof Function) {
            if(this.props.lazy && !force) return this.props.state._children || [];
            console.log("go");
            return this.props.state.children(cb) || [];
            // We need to return empty set first time since it is async.
            // The callback will trigger when children are ready and cached.
        }
        return this.props.state.children;
    };

    getTitle = () => {
        return (this.props.state || {}).title || this.props.title;
    }

    getIcon = () => {
        return this.props.icon ? this.props.icon : <IconFile />;
    };

    getType = () => {
        return this.props.type;
    };

    getType2 = () => {
        return this.props.type2;
    };

    /**
     * Return the project item this item belongs to.
     *
     */
    getProject = () => {
        return this.props.state.project;
    };

    reKey = (newKey) => {
        this.props.key = newKey;
    };

    _copyState = (target, source) => {
        var ret=[];
        for(var index=0;index<target.length;index++) {
            var targetChild=target[index];
            for(var index2=0;index2<source.length;index2++) {
                var sourceChild=source[index2];
                // Compare properties.
                if(this._cmpItem(targetChild.props, sourceChild.props)) {
                    targetChild.props.state=sourceChild.props.state;
                }
            }
        }
    };

    _cmpItem = (item1, item2) => {
        return (item1.key === item2.key);
    };

    redraw = () => {
        this.router.control.redraw();
    };

    _openItem = (e, item) => {
        e.preventDefault();
        e.stopPropagation();

        console.log("open", item);
        if(this.router.panes) this.router.panes.openItem(item);
    };

    _angleClicked = (e) => {
        e.preventDefault();
        this.props.state.open = !this.props.state.open;
        if(this.props.state.open && this.props.lazy) {
            this.getChildren(true, () => {
                // Since we get child list async, we need to redraw when wo got it.
                this.redraw();
                console.log("REDRAW");
            });
        }
        // Always redraw
        this.redraw();
    };

    _renderIcons = (level, index) => {
        var caret;
        var isToggable = this.props.toggable && (this.getChildren().length>0 || this.props.lazy);
        if (isToggable) {
            caret = (
                <Caret
                    expanded={this.props.state.open}
                    onClick={(e)=>this._angleClicked(e)} />
            );
        }
        else {
            caret = (
                <div class={style.nocaret}></div>
            );
        }

        var iconOpen;
        var iconCollapsed;
        if (this.props.icon !== undefined) {
            iconOpen = this.props.icon;
            iconCollapsed = this.props.iconCollapsed || iconOpen;
        }
        else {
            if (this.props.type == "folder") {
                iconOpen = <IconFolderOpen />;
                iconCollapsed = <IconFolder />;
            }
            else if (this.props.type2=="contract") {
                iconOpen = <IconContract />;
                iconCollapsed = <IconContract />;
            }
            else {
                iconOpen= <IconFile />;
                iconCollapsed= <IconFile />;
            }
        }

        var icon;
        if(iconOpen == null) {
            icon = (
                <div class={style.noicon}></div>
            );
        }
        else {
            var iconIcon=iconCollapsed;;
            if (this.props.state.open) {
                iconIcon = iconOpen;
            }
            if (isToggable) {
                icon = (
                    <div class={style.icon} onClick={(e)=>this._angleClicked(e)}>
                        { iconIcon }
                    </div>
                );
            }
            else {
                if (this.props.onClick) {
                    icon = (
                        <div class={style.icon} onClick={(e)=>{this.props.onClick(e,this)}}>
                            { iconIcon }
                        </div>
                    );
                }
                else {
                    icon = (
                        <div class={style.icon}>
                            { iconIcon }
                        </div>
                    );
                }
            }
        }

        return (<div class={style.icons}>{caret}{icon}</div>);
    };

    _getClasses = (level, index) => {
        const cls={};
        cls[style.item]=true;
        if(style["level"+level]) cls[style["level"+level]]=true;
        if(style["index"+index]) cls[style["index"+index]]=true;
        if(this.getChildren().length>0 || this.props.lazy) cls[style.haschildren]=true;
        for(var i=0;i<(this.props.classes||[]).length;i++) {
            var classs=this.props.classes[i];
            if(style[classs]) {
                cls[style[classs]]=true;
            }
            else {
                cls[classs]=true;
            }
        }
        return cls;
    };

    _packageChildren = (level, index, renderedChildren) => {
        if(renderedChildren.length==0) return;
        const cls={};
        cls[style.children]=true;
        if(this.props.state.open==false) cls[style.collapsed]=true;
        return (
            <div className={classnames(cls)}>
                {renderedChildren}
            </div>
        );
    };

    /**
     * Default render implementation.
     */
    _render = (level, index) => {
        return (
            <div title={this.props.state.title} class={style.title}>
                {this.getTitle()}
            </div>
        );
    };

    _render2 = (level, index, renderedChildren) => {
        if (this.props._hidden) return;

        var output = this._render(level, index);
        //if (this.props.render) {
            //output = this.props.render(level, index, item);
        //}
        //else {
            //output = this._defaultRender(level, index, item);
        //}

        const icons = this._renderIcons(level, index);
        const childrenPkg = this._packageChildren(level, index, renderedChildren);
        const classes = this._getClasses(level, index);
        return (
            <div className={classnames(classes)} onClick={this.props.onClick ? (e) => this.props.onClick(e, this) : null}>
                <div class={style.header}>
                    {icons}
                    {output}
                </div>
                {childrenPkg}
            </div>
        );
    };

    render = (level, index) => {
        //console.log("render", this);
        level = (level !== undefined ? level : 0);
        index = (index !== undefined ? index : 0);
        const renderedChildren = this.getChildren().map((item, index2) => {
            return item.render(level+1, index2);
        });
        return this._render2(level, index, renderedChildren);
    };
}
