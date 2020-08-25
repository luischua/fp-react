import React from 'react';
import {FlatList} from 'react-native';
import {Container, Header, View, Button, Icon, Text, DeckSwiper} from 'native-base';
import FPRecord from './FPRecord';
import FPFlatListSeparator from './FPFlatListSeparator';
import { log } from 'react-native-reanimated';
const FPPersonTable = (props) => {
    return (
        <>
            { props.compType === 'flatlist' &&
                <FlatList 
                    ItemSeparatorComponent={FPFlatListSeparator}
                    data={props.personList}
                    renderItem={({ item }) => 
                        <FPRecord record={item} />
                    }
                />
            }
            { props.compType === 'card' &&
                <Container>
                    <View>
                        <DeckSwiper
                            ref={(c) => this._deckSwiper = c}
                            dataSource={props.personList}
                            renderEmpty={() =>
                                <View style={{ alignSelf: "center" }}>
                                    <Text>Over</Text>
                                </View>
                            }
                            renderItem={ item => 
                                <FPRecord record={item} />
                            }
                        />
                    </View>
                    <View style={{ flexDirection: "row", flex: 1, position: "absolute", 
                        bottom: 0, left: 0, right: 0, justifyContent: 'space-between', padding: 0 }}>
                        <Button iconLeft onPress={() => this._deckSwiper._root.swipeLeft()}>
                            <Icon name="arrow-back" />
                            <Text>Swipe Left</Text>
                        </Button>
                        <Button iconRight onPress={() => this._deckSwiper._root.swipeRight()}>
                            <Icon name="arrow-forward" />
                            <Text>Swipe Right</Text>
                        </Button>
                    </View>
                </Container>
            }           
        </>
    )
}
export default FPPersonTable