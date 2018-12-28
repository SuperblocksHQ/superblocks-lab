import React from 'react';
import { Modal } from '../../../modal/new';

export function NoExportableContentModal(props) {
    return (
        <Modal onClose={props.onClose}>
            <h2>Error: Cannot download DApp.</h2>
            <div>The DApp contracts are not deployed yet.</div>
        </Modal>
    );
}
