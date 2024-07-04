import React, { useState, useRef, useEffect } from 'react';
import ProposalItem from '../ProposalList/ProposalItem';
import {usePixelawProvider} from "@/providers/PixelawProvider";
import {GAME_ID} from "@/global/constants.ts";
import {toastContractError, toastProposalAdded} from "@/global/utils.ts";
import useProposals from "@/hooks/useProposals.ts";


interface ProposalListForMainProps {
  headerHeight: number;
  statusFilter: 'All' | 'Active' | 'Closed';
}

const ProposalListForMain: React.FC<ProposalListForMainProps> = ({ headerHeight, statusFilter }) => {
  const [filterOpen, setFilterOpen] = useState(false);
  // const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Closed'>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [voteType, setVoteType] = useState<'for' | 'against'>('for');
  const [votePoints, setVotePoints] = useState<number | ''>(0);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setFilterOpen(false);
      }
    };
    const handleClickOutsideModal = (event: MouseEvent) => { // Add this function
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
  const proposals = useProposals(GAME_ID)
  const proposalArray = proposals?.data ?? [];

  // FIXME: this implementation is not working correctly. proposals is updated only when we open the proposal list popup.
  // const [previousProposalCount, setPreviousProposalCount] = useState(proposalArray.length);
  // useEffect(() => {
  //   if (proposalArray.length > previousProposalCount) {
  //     toastProposalAdded('New proposal added');
  //     setPreviousProposalCount(proposalArray.length);
  //   }
  // }, [proposalArray.length, previousProposalCount]);


  const getStatusColor = (status: string) => {
    if (status.startsWith('end in')) {
      return 'bg-green-500';
    } else if (status === 'closed') {
      return 'bg-purple-500';
    } else {
      return 'bg-gray-500';
    }
  };

  const getStatusColorForBg = (status: string) => {
    if (status.startsWith('end in')) {
      return 'bg-black-800';
    } else if (status === 'closed') {
      return 'bg-gray-500';
    } else {
      return 'bg-black-800';
    }
  };

  const handleVote = (proposal: any) => {
    setSelectedProposal(proposal);
    setVotePoints(0);
  };

  const handleVoteProposal = () => {
    if (!gameData?.account.account) return
    gameData.setup.systemCalls.vote(
        gameData.account.account,
        GAME_ID,
        selectedProposal.id,
        votePoints === '' ? 0 : votePoints,
        voteType === 'for'
    )
        .then(() => setSelectedProposal(null))
        .catch((e) => {
            toastContractError(e)
        })
}

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
    setVotePoints(numericValue < 0 ? 0 : (value === '' ? '' : numericValue));
  };

  return (
    <div className=''>
      {/* <div className={`flex items-center justify-between mb-4`}>
        <div className='text-white text-xl font-bold'>
          Proposals
        </div>
        <div className='ml-auto'>
          <Link to="/new-proposal" className='bg-blue-600 text-white px-6 py-3 rounded-md text-sm font-semibold shadow-lg hover:bg-blue-500 transition duration-300'>
            New Proposal
          </Link>
        </div>
      </div> */}
      <div className={`overflow-y-auto px-2`} style={{ height: `calc(100vh - ${headerHeight}px - 30vh)` }}>
        <div className='space-y-4'>
          {proposalArray.map((proposal) => {
            return <ProposalItem proposal={proposal} key={proposal.index} onStartVote={handleVote} filter={statusFilter} searchTerm={searchTerm} />
          })}
        </div>
      </div>
      {selectedProposal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur flex justify-center items-center z-20'>
          <div ref={modalRef} className='bg-gray-800 text-white p-6 rounded-lg shadow-lg w-1/3'>
            <h2 className='text-xl font-bold mb-4 flex items-center'>
              {selectedProposal.title}
              {extractHexColor(selectedProposal.title) && (
                <div 
                  className='w-6 h-6 rounded-md ml-2' 
                  style={{ backgroundColor: extractHexColor(selectedProposal.title) || undefined }}
                ></div>
              )}
            </h2>
            <div className='flex justify-between items-center mb-4'>
              <button 
                className={`w-full p-2 rounded-md ${voteType === 'for' ? 'bg-blue-600' : 'bg-gray-600'}`} 
                onClick={toggleVoteType}
              >
                For
              </button>
              <button 
                className={`w-full p-2 rounded-md ml-4 ${voteType === 'against' ? 'bg-blue-600' : 'bg-gray-600'}`} 
                onClick={toggleVoteType}
              >
                Against
              </button>
            </div>
            <div className='mb-4'>
              <label className='block mb-2'>Voting Power(PX)</label>
              <input 
                type='number' 
                value={votePoints} 
                onChange={handleVotePointsChange} 
                className='w-full p-2 border rounded-md bg-gray-700 text-white'
              />
            </div>
            <div className='flex justify-end'>
              <button className='bg-gray-600 text-white px-4 py-2 rounded-md mr-2' onClick={closeModal}>Cancel</button>
              <button className='bg-blue-600 text-white px-4 py-2 rounded-md' onClick={handleVoteProposal}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProposalListForMain;
