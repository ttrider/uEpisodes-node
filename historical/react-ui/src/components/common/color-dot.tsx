import { observer } from 'mobx-react';
import * as React from 'react';
import "./color-dot.css";

@observer class ColorDot extends React.Component<{ color: Colors }> {
    public render() {
        return (
            <svg viewBox="0 0 100 100" className="status-dot">
                <circle cx="50" cy="50" r="40" className={this.props.color} />
            </svg>
        );
    }
}

export default ColorDot;