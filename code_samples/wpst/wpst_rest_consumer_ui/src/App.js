import React from 'react';
import axios from 'axios';
import {getTokens} from "./AppWithAuthentication";
import {WPST_ENDPOINT_BASE_URL} from "./config";

export default class Processes extends React.Component {

    state = {
        processes: []
    }

    componentDidMount() {

        const headers = {
            'Authorization': 'Bearer ' + getTokens().accessToken
        };

        const self = this;
        axios.get(WPST_ENDPOINT_BASE_URL + "/processes", {headers})
            .then(function (response) {
                console.log(response);
                const processes = response.data.processes;
                self.setState({processes});
            });
    }

    render() {
        return (
            <div align="left">
                <ul>
                    {
                        this.state.processes
                            .map(process =>
                                <li key={process.id}>{process.id} : {process.abstract}</li>
                            )
                    }
                </ul>
            </div>
        )
    }
}
