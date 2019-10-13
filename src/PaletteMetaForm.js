import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import 'emoji-mart/css/emoji-mart.css';
import { Picker } from 'emoji-mart';

class PaletteMetaForm extends Component {
  state = {
    stage: 'form',
    newPaletteName: ''
  };
  componentDidMount() {
    ValidatorForm.addValidationRule('isPaletteNameUnique', value =>
      this.props.palettes.every(
        ({ paletteName }) => paletteName.toLowerCase() !== value.toLowerCase()
      )
    );
  }
  handleChange = evt => {
    this.setState({
      [evt.target.name]: evt.target.value
    });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  showEmojiPicker = () => {
    this.setState({ stage: 'emoji' });
  };
  savePalette = emoji => {
    const newPalette = {
      paletteName: this.state.newPaletteName,
      emoji: emoji.native
    };
    this.props.handleSubmit(newPalette);
    this.setState({stage: ''})
  };

  render() {
    const { newPaletteName } = this.state;
    const { hideForm } = this.props;
    return (
      <div>
        <Dialog open={this.state.stage === 'emoji'} onClose={hideForm}>
          <DialogTitle id='form-dialog-title'>Choose an emoji </DialogTitle>
          <Picker title='Choose an emoji' onSelect={this.savePalette} />
        </Dialog>
        <Dialog
          open={this.state.stage === 'form'}
          aria-labelledby='form-dialog-title'
          onClose={hideForm}>
          <DialogTitle id='form-dialog-title'>
            Choose a Palette Name{' '}
          </DialogTitle>

          <ValidatorForm onSubmit={this.showEmojiPicker}>
            <DialogContent>
              <DialogContentText>
                Enter a name for your new Palette. Make sure it`s unique
              </DialogContentText>

              <TextValidator
                label='Palette Name'
                value={newPaletteName}
                name='newPaletteName'
                onChange={this.handleChange}
                fullWidth
                margin='normal'
                validators={['required', 'isPaletteNameUnique']}
                errorMessages={['Enter palette name', 'Name already used']}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={hideForm} color='primary'>
                Cancel
              </Button>
              <Button variant='contained' color='primary' type='submit'>
                Save Palette
              </Button>
            </DialogActions>
          </ValidatorForm>
        </Dialog>
      </div>
    );
  }
}

export default PaletteMetaForm;
