import React, { Component } from 'react';
import './questions.css';

class Metric extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            name: this.props.name,
            date: this.props.date,
            cultures: this.props.cultures,
            correct: this.props.correct,
            totalQuestions: this.props.totalQuestions,
            isOfficialSession: this.props.isOfficialSession
        };
    }

    render() {
        return (
            <div className="course">
                <p>{this.props.name}</p>
                <p>Date: {this.props.date}</p>
                <p>Cultures: {this.props.cultures}</p>
                <p>Score: {this.props.score}</p>
            </div>
        )
    }
}

export default Metric;