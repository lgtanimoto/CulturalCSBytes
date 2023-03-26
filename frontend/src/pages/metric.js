import React, { Component } from 'react';
import './questions.css';

class Metric extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            name: this.props.name,
            date: this.props.date.split("T")[0],
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
                {this.props.correct ? (
                    <p>Date: {this.props.date.split("T")[0]}</p>
                ) : (
                    <p>Expected Start Date: {this.props.date.split("T")[0]}</p>
                )}
                {this.props.cultures ? (
                    <p>Cultures: {this.props.cultures}</p>
                ) : (
                    <p>Cultures: N/A</p>
                )}
                {this.props.correct ? (
                    <p>Score: {this.props.correct}/{this.props.totalQuestions}</p>
                ) : (
                    <p>Score: N/A</p>
                )}
            </div>
        )
    }
}

export default Metric;