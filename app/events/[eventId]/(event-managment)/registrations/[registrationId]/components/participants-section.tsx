import { Participant } from '../registration-type';
import { ParticipantCard } from './participant-card';

interface ParticipantsSectionProps {
  participants: Participant[];
}

export function ParticipantsSection({ participants }: ParticipantsSectionProps) {
  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Registered Participants</h3>
        <p className="">
          {participants.length} participant{participants.length !== 1 ? 's' : ''} confirmed for this registration
        </p>
      </div>

      <div className="space-y-3">
        {participants.map((participant, index) => (
          <ParticipantCard key={participant._id} participant={participant} index={index} total={participants.length} />
        ))}
      </div>
    </div>
  );
}
