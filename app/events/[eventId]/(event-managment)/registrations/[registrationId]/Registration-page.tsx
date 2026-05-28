import { Registration } from './registration-type';
import { ParticipantsSection } from './components/participants-section';
import { RightSidebar } from './components/right-sidebar';
import { Badge } from '@/components/ui/badge';

const RegistrationPage = ({ registration }: { registration: Registration }) => {
  return (
    <div className="h-full">
      {/* Main content */}
      <div className="">
        {/* Top Action Bar */}
        <div className="sticky top-0 border-b bg-background">
          <div className="sm:px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-primary">Registration Details</h1>
              <p className="text-sm text-secondary mt-0.5">
                Registration ID: <span className="text-secondary font-mono">{registration._id}</span>
              </p>
            </div>
            <Badge className="flex items-center gap-2">{registration.status}</Badge>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="lg:grid lg:grid-cols-4 gap-6 mt-4 mx-auto space-y-2">
          {/* Main Content - 3 columns */}
          <div className="lg:col-span-3 space-y-6">
            {/* Registration Hero */}
            {/*<RegistrationHero registration={registration} />*/}

            {/* Participants Section */}
            <ParticipantsSection participants={registration.participantIds} />

            {/* Activity Timeline */}
            {/*<ActivityTimeline registration={registration} />*/}
          </div>

          {/* Right Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <RightSidebar registration={registration} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
