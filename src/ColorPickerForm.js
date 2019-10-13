import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { ChromePicker } from 'react-color';
import styles from './styles/ColorPickerStyles'

class ColorPickerForm extends Component {
  state = {
    currentColor: 'teal',
    newColorName: ''
  };

  componentDidMount() {
    ValidatorForm.addValidationRule('isColorNameUnique', value =>
      this.props.colors.every(
        ({ name }) => name.toLowerCase() !== value.toLowerCase()
      )
    );
    ValidatorForm.addValidationRule('isColorUnique', value =>
      this.props.colors.every(({ color }) => color !== this.state.currentColor)
    );
  }
  updateCurrentColor = newColor => {
    this.setState({ currentColor: newColor.hex });
  };
  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  handleSubmit = () => {
    const newColor = {
      color: this.state.currentColor,
      name: this.state.newColorName
    };
    this.props.addNewColor(newColor);
    this.setState({ newColorName: '' });
  };
  render() {
    const { paletteFull, classes } = this.props;
    const { currentColor, newColorName } = this.state;
    return (
      <div>
        <ChromePicker
          color={currentColor}
          onChangeComplete={newColor => this.updateCurrentColor(newColor)}
          className={classes.picker}
        />
        <ValidatorForm onSubmit={this.handleSubmit} instantValidate={false}>
          <TextValidator
            value={newColorName}
            className={classes.colorNameInput}
            name='newColorName'
            variant='filled'
            margin='normal'
            placeholder='Color Name'
            onChange={this.handleChange}
            validators={['required', 'isColorNameUnique', 'isColorUnique']}
            errorMessages={[
              'Enter a color name',
              'Color name must be unique',
              'Color already used'
            ]}
          />
          <Button
            className={classes.addColor}
            variant='contained'
            color='primary'
            type='submit'
            disabled={paletteFull}
            style={{
              backgroundColor: paletteFull ? 'grey' : currentColor
            }}>
            {paletteFull ? 'Palette Full' : 'Add Color'}
          </Button>
        </ValidatorForm>
      </div>
    );
  }
}

export default withStyles(styles)(ColorPickerForm);
