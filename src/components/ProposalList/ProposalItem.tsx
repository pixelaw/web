import { Entity } from "@dojoengine/recs";
import React from "react";
import {useComponentValue} from "@dojoengine/react";
import {usePixelawProvider} from "@/providers/PixelawProvider.tsx";
import {ProposalType} from "@/global/types.ts";
import {numRGBAToHex} from "@/webtools/utils.ts";
import {GAME_ID, NEEDED_YES_PX} from "@/global/constants.ts";

type PropsType = {
    entityId: Entity,
    onStartVote?: (proposal: any) => void,
    filter?: 'All' | 'Active' | 'Closed'
}


const createProposalTitle = (proposalType: ProposalType, hexColor: string) => {
    switch (proposalType) {
        case ProposalType.AddNewColor: return `Adding A New Color: ${hexColor}`
        case ProposalType.MakeADisasterByColor: return `Make a Disaster by Color: ${hexColor}`
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

const ProposalItem: React.FC<PropsType> = ({ entityId, onStartVote, filter }) => {
    const { gameData } = usePixelawProvider();
    const proposal = useComponentValue(gameData!.setup.contractComponents.Proposal, entityId)
    const [proposalStatus, setProposalStatus] = React.useState('')

    React.useEffect(() => {
        if (proposalStatus === 'closed') return

        // Function to update the seconds state every second
        const interval = setInterval(() => {
            const current = Math.floor(Date.now() / 1_000)
            const start = Number(proposal?.start ?? 0)
            const end = Number(proposal?.end ?? 0)
            if (current < start) {
                setProposalStatus(`starts in ${start - current}s`)
            } else if (current > start && current < end) {
                setProposalStatus(`ends in ${end - current}s`)
            } else {
                setProposalStatus('closed')
            }
        }, 1000);

        // Cleanup function to clear the interval when the component unmounts or when dependencies change
        return () => clearInterval(interval);
    }, []); // Empty dependency array ensures this effect runs only once

    if (!proposal || (filter === 'Closed' && proposalStatus !== 'closed') || (filter === 'Active' && !proposalStatus.includes('ends in'))) return <></>

    const hexColor = numRGBAToHex(proposal.target_color)
    const title = createProposalTitle(proposal.proposal_type, hexColor)
    const canActivateProposal = proposal.yes_px >= NEEDED_YES_PX

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
                // toast error message
                console.error(e)
            })
    }



    return (
        <div
             className='relative bg-gray-800 p-4 rounded-md border border-gray-700 hover:border-gray-600 transition-colors duration-300'>
            <div className='block'>
                <div className='flex justify-between items-center mb-1'>
                    <div className='text-xl font-bold text-white flex items-center'>
                        {title}
                        {hexColor && (
                            <div
                                className='w-6 h-6 rounded-md ml-2'
                                style={{backgroundColor: hexColor}}
                            ></div>
                        )}
                    </div>
                    <div
                        className={`px-2 py-1 rounded-md text-white text-sm ${getStatusColor(proposalStatus)}`}>
                        {proposalStatus}
                    </div>
                </div>
                <div className='text-gray-400 text-sm mb-2'>
                    proposed by {proposal.author.toString()}
                </div>
                <div className='bg-gray-700 rounded-full h-2 relative flex mb-1 mr-20'>
                    <div
                        className='bg-green-500 h-full rounded-l-full'
                        style={{width: `${(proposal.yes_px / (proposal.yes_px + proposal.no_px)) * 100}%`}}
                    ></div>
                    <div
                        className='bg-red-500 h-full rounded-r-full'
                        style={{width: `${(proposal.no_px / (proposal.yes_px + proposal.no_px)) * 100}%`}}
                    ></div>
                </div>
                <div className='flex justify-between text-sm text-gray-300 mr-20'>
                    <div>
                        For {proposal.yes_px} points
                    </div>
                    <div>
                        Against {proposal.no_px} points
                    </div>
                </div>
            </div>
            <button
                className={`absolute bottom-4 right-4 px-4 py-2 rounded-md transition duration-300 bg-blue-600 hover:bg-blue-500 text-white`}
                onClick={() => proposalStatus === 'closed' ? handleActivateProposal() : onStartVote ? onStartVote(onStartVoteParam) : ''}
                disabled={proposalStatus.includes('starts') || (!canActivateProposal && proposalStatus === 'closed')}
            >
                {proposalStatus === 'closed' ? 'Start' : 'Vote'}
            </button>
        </div>
    )
}

export default ProposalItem