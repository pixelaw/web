import React from "react";
import {usePixelawProvider} from "@/providers/PixelawProvider.tsx";
import {ProposalType} from "@/global/types.ts";
import {numRGBAToHex} from "@/webtools/utils.ts";
import {GAME_ID, NEEDED_YES_PX} from "@/global/constants.ts";
import {formatWalletAddress, toastContractError} from "@/global/utils.ts";
import {ProposalDataType} from "@/hooks/useProposals.ts";

type PropsType = {
    proposal?: ProposalDataType,
    onStartVote?: (proposal: any) => void,
    filter?: 'All' | 'Active' | 'Closed',
    searchTerm?: string
}


const createProposalTitle = (proposalType: ProposalType, hexColor: string) => {
    switch (proposalType) {
        case ProposalType.AddNewColor: return `Adding A New Color: ${hexColor.toUpperCase()}`
        case ProposalType.ResetToWhiteByColor: return `Reset To White: ${hexColor.toUpperCase()}`
        default: {
            console.error('unhandled proposal type: ', proposalType)
            return ''
        }
    }

}

const getStatusColor = (status: string) => {
    if (status.startsWith('ends in')) {
        return 'bg-green-500';
    } else if (status === 'closed') {
        return 'bg-purple-500';
    } else {
        return 'bg-gray-500';
    }
};

// doesn't work correctly...
const getTextColor = (proposalStatus:string, proposal: any) => {
    if (proposalStatus === 'closed' && proposal.yes_px > proposal.no_px) {
        return 'text-green-300';
    } else if (proposalStatus === 'closed' && proposal.yes_px <= proposal.no_px) {
        return 'text-red-300';
    } else {
        return 'text-white';
    }
};

const ProposalItem: React.FC<PropsType> = ({ proposal, onStartVote, filter, searchTerm }) => {
    const { gameData } = usePixelawProvider();
    const [proposalStatus, setProposalStatus] = React.useState('')

    const start = Number(proposal?.start ?? 0)
    const end = Number(proposal?.end ?? 0)

    function formatTimeRemaining(remainingSeconds: number) {
        const hours = Math.floor(remainingSeconds / 3600);
        remainingSeconds %= 3600;
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
      
        let formattedTime = '';
        if (hours > 0) {
          formattedTime += `${hours}h`;
        }
        if (minutes > 0) {
          formattedTime += `${minutes}m`;
        }
        if (seconds > 0) {
          formattedTime += `${seconds}s`;
        }
      
        return formattedTime || '0s';
      }

    React.useEffect(() => {

        if (proposalStatus === 'closed') return

        // Function to update the seconds state every second
        const interval = setInterval(() => {
            const current = Math.floor(Date.now() / 1_000)

            if (current < start) {
                setProposalStatus(`starts in ${formatTimeRemaining(start - current)}`)
            } else if (current > start && current < end) {
                setProposalStatus(`ends in ${formatTimeRemaining(end - current)}`)
            } else {
                setProposalStatus('closed')
            }
        }, 1000);

        // Cleanup function to clear the interval when the component unmounts or when dependencies change
        return () => clearInterval(interval);
    }, [start, end, proposalStatus]); // Empty dependency array ensures this effect runs only once

    if (!proposal) return <></>

    const hexColor = numRGBAToHex(proposal.target_color)
    const title = createProposalTitle(proposal.proposal_type, hexColor)
    const canActivateProposal = proposal.yes_px >= NEEDED_YES_PX

    if (
        (filter === 'Closed' && proposalStatus !== 'closed') ||
        (filter === 'Active' && !proposalStatus.includes('ends in')) ||
        (!!searchTerm?.trim() && !title.toLowerCase().includes(searchTerm?.toLowerCase()))
    ) return <></>

    const onStartVoteParam = {
        id: proposal.index,
        title,
        proposer: proposal.author,
        forPoints: proposal.yes_px,
        againstPoints: proposal.no_px,
        status: proposalStatus,
        statusColor: getStatusColor(proposalStatus),
        comments: "",
    }

    const handleActivateProposal = () => {
        if (!gameData?.account.account) return
        gameData.setup.systemCalls.activateProposal(
            gameData.account.account,
            GAME_ID,
            proposal.index,
        )
            .then(() => console.log('activateProposal'))
            .catch((e) => {
                toastContractError(e)
            })
    }

    const containerClassName = `relative p-4 rounded-md border transition-colors duration-300 ${proposalStatus === 'closed' ? 'bg-gray-600 border-gray-700' : 'bg-gray-800 border-gray-700 hover:border-gray-600'}`;
    const isButtonDisabled = proposalStatus === '' || proposalStatus.includes('starts') || (!canActivateProposal && proposalStatus === 'closed') || proposal.is_activated

    return (
        <div
            // className='relative bg-gray-800 p-4 rounded-md border border-gray-700 hover:border-gray-600 transition-colors duration-300'>
            className={containerClassName}>
             <div className='block'>
                <div className='flex justify-between items-center mb-1'>
                    <div className={`text-sm font-bold flex items-center ${getTextColor(proposalStatus, proposal)}`}>
                        {title}
                        {hexColor && (
                            <div
                                className='w-6 h-6 rounded-md ml-2'
                                style={{backgroundColor: hexColor}}
                            ></div>
                        )}
                    </div>
                    <div
                        className={`px-2 py-1 rounded-md text-white text-xs ${getStatusColor(proposalStatus)}`} style={{marginLeft: '1rem'}}>
                        {proposalStatus}
                    </div>
                </div>
                <div className='text-gray-400 text-xs mb-2'>
                    proposed by {formatWalletAddress(proposal.author.toString())}
                </div>
                <div className='bg-gray-700 rounded-full h-2 relative flex mb-1 mr-30' style={{marginRight: '7rem'}}>
                    <div
                        className='bg-green-500 h-full rounded-l-full'
                        style={{width: `${(proposal.yes_px / (proposal.yes_px + proposal.no_px)) * 100}%`}}
                    ></div>
                    <div
                        className='bg-red-500 h-full rounded-r-full'
                        style={{width: `${(proposal.no_px / (proposal.yes_px + proposal.no_px)) * 100}%`}}
                    ></div>
                </div>
                <div className='flex justify-between text-xs text-gray-300 mr-30' style={{marginRight: '7rem'}}>
                    <div>
                        For {proposal.yes_px} points
                    </div>
                    <div>
                        Against {proposal.no_px} points
                    </div>
                </div>
            </div>
            <button
                className={`absolute bottom-4 text-sm right-4 px-4 py-2 rounded-md transition duration-300 ${
                    isButtonDisabled ? `${getTextColor(proposalStatus, proposal)} bg-gray-500 cursor-not-allowed` : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
                onClick={() => proposalStatus === 'closed' ? handleActivateProposal() : onStartVote ? onStartVote(onStartVoteParam) : ''}
                disabled={isButtonDisabled}
            >
                {
                    proposalStatus === '' ? '...' :
                        proposal.is_activated ? 'Applied' :
                            proposalStatus === 'closed' ?
                                (canActivateProposal ? 'Activate' : 'Denied') : 'Vote'
                }
            </button>
        </div>
    )
}

export default ProposalItem