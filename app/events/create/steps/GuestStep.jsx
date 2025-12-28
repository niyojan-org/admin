import GuestSpeaker from "../../[eventId]/components/GuestSpeaker"


const GuestStep = ({ event, setEvent }) => {
    return (
        <GuestSpeaker eventId={event._id} className={'flex-1 h-full'} />
    )
}

export default GuestStep