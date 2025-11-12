import { Benefits } from "../../[eventId]/components/Benefits"


const BenefitsStep = ({ event, setEvent }) => {
    return (
        <Benefits eventId={event?._id} className="flex-1 h-full" />
    )
}

export default BenefitsStep