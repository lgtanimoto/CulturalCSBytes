import React, { Component } from 'react';
import './course.css';

class Course extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name,
            completed: this.props.completed,
            high: this.props.high,
            status: this.props.status
        };
    }

    render() {
        return (
            <div className="course">
                <p>{this.props.name}</p>
                <p>{this.props.completed}</p>
                <p>{this.props.high}</p>
                <p>{this.props.status}</p>
                <button type="button">
                    Stats
                </button>
                <button type="button" onClick={() => this.props.continueClick(this.props.name)}>
                    Continue
                </button>
            </div>
        )
    }
}

export default Course