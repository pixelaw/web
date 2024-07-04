/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import ProposalItem, { type StartVoteParam } from '../ProposalList/ProposalItem';
import { usePixelawProvider } from '@/providers/PixelawProvider';
import { GAME_ID } from '@/global/constants.ts';
import { toastContractError } from '@/global/utils.ts';
import useProposals from '@/hooks/useProposals.ts';

interface ProposalListForMainProps {
    headerHeight: number;
    statusFilter: 'All' | 'Active' | 'Closed';
}

const ProposalListForMain: React.FC<ProposalListForMainProps> = ({
    headerHeight,
    statusFilter,
}) => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const filterRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const [selectedProposal, setSelectedProposal] = useState<StartVoteParam | null>(null);
    const [voteType, setVoteType] = useState<'for' | 'against'>('for');
    const [votePoints, setVotePoints] = useState<number | ''>(0);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setFilterOpen(false);
            }
        };
        const handleClickOutsideModal = (event: MouseEvent) => {
            // Add this function
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setSelectedProposal(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('mousedown', handleClickOutsideModal); // Add this line
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('mousedown', handleClickOutsideModal); // Add this line
        };
    }, []);

    const { gameData } = usePixelawProvider();
    const proposals = useProposals(GAME_ID);
    const proposalArray = proposals?.data ?? [];

    // const getStatusColor = (status: string) => {
    //     if (status.startsWith('end in')) {
    //         return 'bg-green-500';
    //     } else if (status === 'closed') {
    //         return 'bg-purple-500';
    //     } else {
    //         return 'bg-gray-500';
    //     }
    // };

    // const getStatusColorForBg = (status: string) => {
    //     if (status.startsWith('end in')) {
    //         return 'bg-black-800';
    //     } else if (status === 'closed') {
    //         return 'bg-gray-500';
    //     } else {
    //         return 'bg-black-800';
    //     }
    // };

    const handleVote = (proposal: StartVoteParam) => {
        setSelectedProposal(proposal);
        setVotePoints(0);
    };

    const handleVoteProposal = () => {
        if (!gameData?.account.account || !selectedProposal) return;
        gameData.setup.systemCalls
            .vote(
                gameData.account.account,
                GAME_ID,
                selectedProposal.id,
                votePoints === '' ? 0 : votePoints,
                voteType === 'for',
            )
            .then(() => setSelectedProposal(null))
            .catch((e) => {
                toastContractError(e);
            });
    };

    const extractHexColor = (title: string) => {
        const match = title.match(/#[0-9A-Fa-f]{6}/);
        return match ? match[0].toUpperCase() : null;
    };

    const closeModal = () => {
        setSelectedProposal(null);
    };

    const toggleVoteType = () => {
        setVoteType(voteType === 'for' ? 'against' : 'for');
    };

    const handleVotePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = Number(value);
        setVotePoints(numericValue < 0 ? 0 : value === '' ? '' : numericValue);
    };

    return (
        <div className=''>
            <div
                className={`overflow-y-auto px-2`}
                style={{ height: `calc(100vh - ${headerHeight}px - 170px)` }}
            >
                <div className='space-y-4'>
                    {proposalArray.map((proposal) => {
                        return (
                            <ProposalItem
                                proposal={proposal}
                                key={proposal.index}
                                onStartVote={handleVote}
                                filter={statusFilter}
                                searchTerm={searchTerm}
                            />
                        );
                    })}
                </div>
            </div>
            {selectedProposal && (
                <div className='fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur'>
                    <div
                        ref={modalRef}
                        className='w-1/3 rounded-lg bg-gray-800 p-6 text-white shadow-lg'
                    >
                        <h2 className='mb-4 flex items-center text-xl font-bold'>
                            {selectedProposal.title}
                            {extractHexColor(selectedProposal.title) && (
                                <div
                                    className='ml-2 size-6 rounded-md'
                                    style={{
                                        backgroundColor:
                                            extractHexColor(selectedProposal.title) || undefined,
                                    }}
                                />
                            )}
                        </h2>
                        <div className='mb-4 flex items-center justify-between'>
                            <button
                                className={`w-full rounded-md p-2 ${voteType === 'for' ? 'bg-blue-600' : 'bg-gray-600'}`}
                                onClick={toggleVoteType}
                            >
                                For
                            </button>
                            <button
                                className={`ml-4 w-full rounded-md p-2 ${voteType === 'against' ? 'bg-blue-600' : 'bg-gray-600'}`}
                                onClick={toggleVoteType}
                            >
                                Against
                            </button>
                        </div>
                        <div className='mb-4'>
                            <label className='mb-2 block'>Voting Power(PX)</label>
                            <input
                                type='number'
                                value={votePoints}
                                onChange={handleVotePointsChange}
                                className='w-full rounded-md border bg-gray-700 p-2 text-white'
                            />
                        </div>
                        <div className='flex justify-end'>
                            <button
                                className='mr-2 rounded-md bg-gray-600 px-4 py-2 text-white'
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                            <button
                                className='rounded-md bg-blue-600 px-4 py-2 text-white'
                                onClick={handleVoteProposal}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProposalListForMain;
