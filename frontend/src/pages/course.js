import React, { Component } from 'react';
import './questions.css';

class Course extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
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
                <p>Completed: {this.props.completed}</p>
                <p>High Score: {this.props.high}</p>
                <p>Status: {this.props.status}</p>
                <button type="button" onClick={() => this.props.statsClick(this.props.id, this.props.name)}>
                    Stats
                </button>
                <button type="button" onClick={() => this.props.continueClick(this.props.id, this.props.name)}>
                    Continue
                </button>
            </div>
        )
    }
}

export default Course;