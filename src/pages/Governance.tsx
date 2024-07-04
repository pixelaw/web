import React from 'react';
import ProposalList from '../components/ProposalList/ProposalList';

const Governance: React.FC = () => {
    const headerHeight = 64; // px

    return (
        <div className='flex min-h-screen w-full flex-col bg-gray-900 text-white'>
            <div className='grow overflow-hidden px-40 py-4'>
                <ProposalList headerHeight={headerHeight} />
            </div>
        </div>
    );
};

export default Governance;
