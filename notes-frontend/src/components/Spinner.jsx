import '../styles/Spinner.css';

function Spinner({ size = 16 }) {
    return (
        <span
            className="sq-spinner"
            style={{ width: size, height: size }}
            aria-label="Loading"
        >
            <span className="sq-ring sq-ring-1" />
            <span className="sq-ring sq-ring-2" />
        </span>
    );
}

export default Spinner;