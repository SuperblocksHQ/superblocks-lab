import React from 'react';
import { IconContract, IconConfigure, IconCompile, IconDeploy, IconInteract } from '../../../icons';
import { BaseItem } from './baseItem';

export function ContractItem(props) {
    const toolbar = <span>edit tools</span>;

    function getActionButtonProps(name, onClick) {
        return { data: { id: props.data.id, name, opened: false }, onClick: () => onClick(props.id, props.name) };
    }

    return (
        <BaseItem
            { ...props }
            toolbar={ toolbar }
            icon={ <IconContract /> }>
            <BaseItem icon={ <IconConfigure /> } { ...getActionButtonProps('Configure', props.onConfigureClick) }  />
            <BaseItem icon={ <IconCompile /> } { ...getActionButtonProps('Compile', props.onCompileClick) }  />
            <BaseItem icon={ <IconDeploy /> } { ...getActionButtonProps('Deploy', props.onDeployClick ) }  />
            <BaseItem icon={ <IconInteract /> } { ...getActionButtonProps('Interact', props.onInteractClick) }  />
        </BaseItem>
    );
}
