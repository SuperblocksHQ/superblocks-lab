import React from 'react';
import { DropdownBasic } from './dropDownBasic';

type Props = {
    dropdownContent: React.ReactNode;
    useRightClick: boolean;
    children: React.ReactNode;
    showMenu: boolean;
    onCloseMenu: Function;
    enableClickInside: boolean;
    className: string;
}
type State = { menuVisible: boolean; }

/**
 * Helper component to handle the state of showing/hiding a dropdown
 */
export class DropdownContainer extends React.Component<Props, State> {
    ignoreClassName: string;
    
    constructor(props: Props) {
        super(props);
        this.state = {
            menuVisible: this.props.showMenu,
        }

        // the ignore class name should be specific only this instance of the component
        //  in order to close other dropdown in case a new one is opened
        this.ignoreClassName = 'ignore-react-onclickoutside' + Date.now();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.showMenu !== this.props.showMenu) {
            this.setState({
                menuVisible: this.props.showMenu
            });
        }
    }

    showMenu = () => {
        this.setState({ menuVisible: true });
    };

    toggleMenu: React.MouseEventHandler = (e) => {
        e.stopPropagation();
        this.setState((state) => ({ menuVisible: !state.menuVisible }));
    };

    closeMenu: React.MouseEventHandler = e => {
        e.stopPropagation();

        if (this.props.onCloseMenu) {
            this.props.onCloseMenu();
        }

        this.setState({ menuVisible: false });
    };

    render() {
        const { dropdownContent, useRightClick, enableClickInside, className, ...props } = this.props;
        let main: React.ReactNode;

        if (useRightClick) {
            main = <div onContextMenu={this.showMenu}>{this.props.children}</div>;
        } else {
            main = <div className={this.ignoreClassName} onClick={this.toggleMenu}>{this.props.children}</div>;
        }

        return (
            <div className={className}>
                {main}
                { this.state.menuVisible &&
                <DropdownBasic
                    outsideClickIgnoreClass={this.ignoreClassName}
                    handleClickOutside={this.closeMenu}
                    handleClickInside={!enableClickInside ? this.closeMenu : undefined}
                >
                    {dropdownContent}
                </DropdownBasic> }
            </div>
        );
    }
}
