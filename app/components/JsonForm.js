import React, { Component } from "react";
import { render } from "react-dom";
import Form from "react-jsonschema-form";
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

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
        const { classes,schema, uiSchema, fields, formContext, formData, handleForm, formMode,widgets } = this.props;
        let bt = (<div>
            <Button className={classes.button} variant="raised" color="primary" type="submit" >
                提交
            </Button>
            <Button className={classes.button} variant="raised" color="primary" onClick={() => this.props.history.goBack()} >
                返回
            </Button>
        </div>
     
        )
        if (formMode == "view") {
            bt = (<div>
                <Button variant="raised" color="primary" onClick={() => this.props.history.goBack()} >
                    返回
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

export default withStyles(styles)(jsonForm);