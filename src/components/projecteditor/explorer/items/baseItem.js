import React from 'react';
import classnames from 'classnames';
import style from './style.less';
import Caret from '../../../caret';
import { DropdownContainer } from '../../../dropdown';

export function BaseItem(props) {
    let icon = props.icon;
    let caret;

    function onCaretClick(e) {
        e.stopPropagation();
        props.onToggle(props.data.id);
    }

    if (props.data.togglable) {
        if (props.data.opened) {
            icon = props.iconOpen || props.icon;
        }
        caret = (
            <Caret
                expanded={ props.data.opened || false }
                onClick={ onCaretClick }
            />
        );
    } else {
        caret = (
            <div className={ style.nocaret } />
        );
    }

    return (
        <div className={ style.item }>
            <DropdownContainer dropdownContent={ props.contextMenu } useRightClick={ true }>
                <div className={ style.header } onClick={ () => props.onClick(props.data.id) } onContextMenu={ e => e.preventDefault() }>
                    <div className={ style.overlay }></div>
                    <div className={ style.icons }>
                        { caret }
                        <div className={style.icon}>{ icon }</div>
                    </div>
                    <div className={ style.title }><a>{ props.data.name }</a></div>
                </div>
            </DropdownContainer>

            <div className={ classnames(style.childrenContainer, { [style.hidden]: !props.data.opened }) }>
                { props.children }
            </div>
        </div>
    );
}
