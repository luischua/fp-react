import React from 'react';
import { Form, Item, Input, Label, Button, Text, Icon} from 'native-base';
import { Formik } from 'formik';
const FPSearchBox = (props) => (
    <Formik
        initialValues={{ 
            searchText: '',
        }}
        onSubmit={values => {
            props.submitForm(values.searchText)
        }}
    >
        {({ handleChange, handleBlur, handleSubmit, values }) => (
        <Form>
            <Item floatingLabel rounded>
                <Label>Type name or id</Label>
                <Input
                    onChangeText={handleChange('searchText')}
                    onBlur={handleBlur('searchText')}
                    value={values.searchText} 
                />
            </Item>
            <Item>
                <Button rounded
                    onPress={handleSubmit}>
                    <Text>Search</Text>    
                    <Icon name='search' />    
                </Button>
            </Item>
        </Form>     
        )}
    </Formik> 
 );
 export default FPSearchBox