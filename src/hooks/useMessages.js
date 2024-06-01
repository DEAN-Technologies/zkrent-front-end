import { useAppContext } from '../context/context';
import enMessages from '../messages/en.json';
import uaMessages from '../messages/ua.json';

const useMessages = () => {
    const { language } = useAppContext();

    let messages;
    switch (language) {
        case 'ua':
            messages = uaMessages;
            break;
        case 'en':
        default:
            messages = enMessages;
            break;
    }

    return messages;
};

export default useMessages;
