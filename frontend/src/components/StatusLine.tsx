import { useEffect, useRef, useState, type CSSProperties } from "react";

// Typing
interface Props {
    eventIdentifier: string;
}

type StatusType = "ok"|"err";

interface StatusLineDetails {
    message?: string;
    type?: StatusType;
    timeout?: number;
}

class StatusLineEvent extends CustomEvent<StatusLineDetails> {
}

// The actual component
function StatusLine({ eventIdentifier }: Props){
    // Create states
    const [status, setStatus] = useState<string|undefined>();
    const [statusType, setStatusType] = useState<StatusType|undefined>();
    const [statusTimeout, setStatusTimeout] = useState<number|undefined>();
    const timeoutRef = useRef<NodeJS.Timeout|null>(null);

    // Helper function
    const startTimeout = () => {
        // Update the new interval
        if(statusTimeout && status && statusType === "ok"){
            timeoutRef.current = setTimeout(() => {
                setStatus(undefined);
                setStatusType(undefined);
                setStatusTimeout(undefined);
                timeoutRef.current = null;
            }, statusTimeout);
        }
    };

    // Create event listener
    useEffect(() => {
        const handleEvent = (event: Event) => {
            const typedEvent = event as StatusLineEvent;
            setStatus(typedEvent.detail.message);
            setStatusType(typedEvent.detail.type);
            setStatusTimeout(typedEvent.detail.timeout);
        };

        window.addEventListener(eventIdentifier, handleEvent);

        return () => {
            // Cleanup
            window.removeEventListener(eventIdentifier, handleEvent);
        };
    }, []);

    // Handle the timeout for the status
    useEffect(() => {
        if(timeoutRef.current){
            // If an interval exists and one of the values is changed, recreate the timeout
            clearTimeout(timeoutRef.current);
        }

        startTimeout();
    }, [status, statusType, statusTimeout]);

    // Create style
    let displayType = "none";
    let displayColor: string|undefined;

    if(status){
        // This guarantees a message is set to display
        displayType = "block";

        if(statusType === "ok"){
            displayColor = "#bbf7d0";
        } else if(statusType === "err"){
            displayColor = "#fecaca";
        }
    }

    const divStyle: CSSProperties = {
        padding: "0 18px 14px 18px",
        display: displayType,
        color: displayColor
    };

    // The HTML to return
    return (<div style={divStyle} className={`status ${statusType ?? ""}`.trim()}>{status ?? ""}</div>);
}

// Exports
export { StatusLineEvent };
export type { StatusLineDetails };
export default StatusLine;