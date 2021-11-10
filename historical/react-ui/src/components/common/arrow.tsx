import { action } from 'mobx';
import { observer } from "mobx-react";
import * as React from 'react';
import "./arrow.css";


@observer class Arrow extends React.Component<{ direction: Direction, clickHandler?: () => void }> {
    public render() {

        let transform = "";
        switch (this.props.direction) {
            case "down":
                transform = "rotate(90) translate(0,-100)";
                break;
            case "up":
                transform = "rotate(-90) translate(-110,0)";
                break;
            case "right":
                transform = "rotate(180) translate(-100,-100)";
                break;
        }

        return (
            <svg viewBox="0 0 100 100" className="arrow" onClick={this.clickHandler} onDoubleClick={this.clickHandler} >
                <path d="M80,50 l-50,-40 l0,80 z" transform={transform} />
            </svg>
        );
    }

    @action.bound private clickHandler(event: React.MouseEvent<SVGSVGElement>) {

        if (this.props.clickHandler) {
            this.props.clickHandler();
        }

        event.preventDefault();
        event.stopPropagation();
        return true;
    }
}

export default Arrow;