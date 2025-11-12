import { InputFieldManager } from './input-fields';

function InputField({ eventId, className }) {
  return <InputFieldManager eventId={eventId} className={className} />;
}

export default InputField;