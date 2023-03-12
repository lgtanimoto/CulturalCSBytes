import React, { Component } from 'react';
import './course.css';

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
                <p>completed: {this.props.completed}</p>
                <p>high score: {this.props.high}</p>
                <p>status: {this.props.status}</p>
                <button type="button">
                    Stats
                </button>
                <button type="button" onClick={() => this.props.continueClick(this.props.id)}>
                    Continue
                </button>
            </div>
        )
    }
}

export default Course