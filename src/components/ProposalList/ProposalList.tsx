import React, { useEffect, useRef, useState } from 'react';
import { FaFilter, FaSearch } from 'react-icons/fa';
import FilterMenu from '../FilterMenu/FilterMenu';
import { Link } from 'react-router-dom';
import { usePixelawProvider } from '@/providers/PixelawProvider';
import { GAME_ID } from '@/global/constants.ts';
import ProposalItem, { type StartVoteParam } from '@/components/ProposalList/ProposalItem.tsx';
import useProposals from '@/hooks/useProposals.ts';

interface ProposalListProps {
    headerHeight: number;
}

const ProposalList: React.FC<ProposalListProps> = ({ headerHeight }) => {
    const [filterOpen, setFilterOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Closed'>('All');
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
                // toast error message
                console.error(e);
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
        setVotePoints(value === '' ? '' : Number(value));
    };

    return (
        <div className=''>
            <div
                className={`mb-4 flex items-center justify-between ${selectedProposal ? 'blur' : ''}`}
            >
                <div className='relative w-1/3'>
                    <input
                        type='text'
                        placeholder='Search'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full rounded-md bg-gray-800 p-2 pl-10 text-white'
                    />
                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
                        <FaSearch />
                    </span>
                </div>
                <div className='relative ml-1 flex items-center'>
                    <button
                        className='rounded-md bg-gray-700 px-4 py-2 text-white'
                        onClick={() => setFilterOpen(!filterOpen)}
                    >
                        <FaFilter />
                    </button>
                    {filterOpen && (
                        <div
                            className='absolute z-10 mt-2 w-48 rounded-md bg-gray-800 shadow-lg'
                            ref={filterRef}
                            style={{ top: '100%', right: 0 }}
                        >
                            <FilterMenu
                                statusFilter={statusFilter}
                                setStatusFilter={setStatusFilter}
                            />
                        </div>
                    )}
                </div>
                <div className='ml-auto'>
                    <Link
                        to='/new-proposal'
                        className='rounded-md bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-lg transition duration-300 hover:bg-blue-500'
                    >
                        Create A New Proposal
                    </Link>
                </div>
            </div>
            <div
                className={`overflow-y-auto px-6 ${selectedProposal ? 'blur' : ''}`}
                style={{ height: `calc(100vh - ${headerHeight}px - 112px)` }}
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
                <div className='fixed inset-0 z-20 flex items-center justify-center bg-black bg-opacity-50'>
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

export default ProposalList;
