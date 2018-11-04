import React, { Component } from "react";
import { render } from "react-dom";
import Form from "react-jsonschema-form";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { injectIntl,defineMessages  } from 'react-intl';

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
    },
  });

class jsonForm extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { classes,schema, uiSchema, fields, formContext, formData, handleForm, formMode,widgets,intl } = this.props;
        let values = {};
        Object.keys(schema.properties).forEach(function (key) {
            let property = schema.properties[key];
            let title = property.title;
            values[key] ={id:title};
        });
        const messages = defineMessages(values);
        Object.keys(schema.properties).forEach(function (key) {
            let property = schema.properties[key];
             property.title = intl.formatMessage({id:messages[key].id});
        });
        let bt = (<div>
            <Button className={classes.button} variant="raised" color="primary" type="submit" >
                 {intl.formatMessage({id:"submit"})}
            </Button>
            <Button className={classes.button} variant="raised" color="primary" onClick={() => this.props.history.goBack()} >
                {intl.formatMessage({id:"back"})}
            </Button>
        </div>
     
        )
        if (formMode == "view") {
            bt = (<div>
                <Button variant="raised" color="primary" onClick={() => this.props.history.goBack()} >
                 {intl.formatMessage({id:"back"})}
                </Button>
            </div>
            )
        }
        return (
            <Form  widgets={widgets} schema={schema} uiSchema={uiSchema} fields={fields} formContext={formContext} formData={formData} onSubmit={handleForm} >
                {bt}
            </Form>
        )
    }
}

export default withStyles(styles)(injectIntl(jsonForm));