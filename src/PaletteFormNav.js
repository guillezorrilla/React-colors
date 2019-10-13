import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddToPhotosIcon from '@material-ui/icons/AddToPhotos';
import Button from '@material-ui/core/Button';
import { ValidatorForm } from 'react-material-ui-form-validator';
import PaletteMetaForm from './PaletteMetaForm';
import styles from './styles/PaletteFormNavStyles'

class PaletteFormNav extends Component {
  state = {
    newPaletteName: '',
    fromShowing: false
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

  showForm = () => {
    this.setState({ fromShowing: true });
  };

  hideForm = () => {
    this.setState({ fromShowing: false });
  };
  render() {
    const { classes, open, palettes, handleSubmit } = this.props;
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position='fixed'
          color='default'
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open
          })}>
          <Toolbar>
            <IconButton
              color='inherit'
              aria-label='open drawer'
              onClick={this.props.handleDrawerOpen}
              edge='start'
              className={clsx(classes.menuButton, {[classes.hide]: open})}>
              <AddToPhotosIcon />
            </IconButton>
            <Typography variant='h6' noWrap>
              Create Your Palette
            </Typography>
          </Toolbar>
          <div className={classes.navBtns}>
            <Link to='/'>
              <Button
                variant='contained'
                color='secondary'
                className={classes.button}>
                Go Back
              </Button>
            </Link>
            <Button
              variant='contained'
              color='primary'
              onClick={this.showForm}
              className={classes.button}>
              Save
            </Button>
          </div>
        </AppBar>
        {this.state.fromShowing && (
          <PaletteMetaForm
            palettes={palettes}
            handleSubmit={handleSubmit}
            hideForm={this.hideForm}
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(PaletteFormNav);
