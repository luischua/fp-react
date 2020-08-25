import React from 'react';
import { SafeAreaView, ActivityIndicator } from "react-native";
import { Container, Header, Left, Body, Title, Right, Content, Text, Button} from 'native-base';
import axios from 'axios';
import FPSearchBox from './FPSearchBox'
import FPPersonTable from './FPPersonTable'
import {log, httpUrl} from "./FPUtil";
export default class FPSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            personList: [],
            errorHttp: false,
            loading: false,
        };
    }

    triggerSearch = (searchText) => {
        log("Trigger Search"); 
        this.setState({loading: true});
        axios.get(httpUrl()+"/search/"+searchText, {timeout: 10000})
        .then(response => {
            console.log('getting data from axios', response.data);
            this.setState({personList: response.data, errorHttp: false, loading: false});
            this.setState({errorHttp: false});
        })
        .catch(error => {
            console.log(error);
            this.setState({errorHttp: true, loading: false});
        });
    }

    render(){
        const {loading, errorHttp, personList} = this.state
        return(
            <Container> 
                <Header>
                    <Title>Search</Title>
                </Header>
                <Content>
                <FPSearchBox submitForm={ text => {this.triggerSearch(text)}} />
                {loading && 
                    <ActivityIndicator size="large" />
                }
                {errorHttp &&   
                    <Text>Error!!!</Text>                
                }
                {!loading && !errorHttp && personList.length > 0 &&
                    <SafeAreaView>    
                        <FPPersonTable compType='flatlist' personList={personList}/>   
                    </SafeAreaView>
                }
                {!loading && !errorHttp && personList.length == 0 &&
                    <Text> No Result</Text>
                }
                </Content>
            </Container>       
        );
    }
}