import React, { Component } from 'react';
import clsx from 'clsx';
import PaletteFormNav from './PaletteFormNav';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import Button from '@material-ui/core/Button';
import DraggableColorList from './DraggableColorList';
import { arrayMove } from 'react-sortable-hoc';
import ColorPickerForm from './ColorPickerForm';
import styles from './styles/NewPaletteFormStyles';
import seedColors from './seedColors'

class NewPaletteForm extends Component {
	//   const theme = useTheme();
	static defaultProps = {
		maxColors: 20
	};
	state = {
		open: true,

		colors: seedColors[0].colors
	};

	handleDrawerOpen = () => {
		this.setState({ open: true });
	};
	s;
	handleDrawerClose = () => {
		this.setState({ open: false });
	};

	addNewColor = (newColor) => {
		this.setState({
			colors: [ ...this.state.colors, newColor ],
			newColorName: ''
		});
	};
	handleChange = (evt) => {
		this.setState({
			[evt.target.name]: evt.target.value
		});
	};
	handleSubmit = (newPalette) => {
		newPalette.id = newPalette.paletteName.toLowerCase().replace(/ /g, '-');
		newPalette.colors = this.state.colors;
		this.props.savePalette(newPalette);
		this.props.history.push('/');
	};

	removeColor = (colorName) => {
		this.setState({
			colors: this.state.colors.filter((color) => color.name !== colorName)
		});
	};
	onSortEnd = ({ oldIndex, newIndex }) => {
		this.setState(({ colors }) => ({
			colors: arrayMove(colors, oldIndex, newIndex)
		}));
	};

	clearColors = () => {
		this.setState({ colors: [] });
	};

	addRandomColor = () => {
		//pick random color from existing palettes
		const allColors = this.props.palettes.map((p) => p.colors).flat();
		let rand;
		let randomColor;
		let isDuplicatedColor = true
		while(isDuplicatedColor) {
			rand = Math.floor(Math.random() * allColors.length);
			randomColor = allColors[rand];
			isDuplicatedColor = this.state.colors.some(color => color.name === randomColor.name)
		}
		this.setState({ colors: [ ...this.state.colors, randomColor ] });
	};

	render() {
		const { classes, maxColors, palettes } = this.props;
		const { open, colors } = this.state;
		const paletteFull = colors.length >= maxColors;
		return (
			<div className={classes.root}>
				<PaletteFormNav
					open={open}
					palettes={palettes}
					handleSubmit={this.handleSubmit}
					handleDrawerOpen={this.handleDrawerOpen}
				/>
				<Drawer
					className={classes.drawer}
					variant="persistent"
					anchor="left"
					open={open}
					classes={{
						paper: classes.drawerPaper
					}}
				>
					<div className={classes.drawerHeader}>
						<IconButton onClick={this.handleDrawerClose}>
							<ChevronLeftIcon />
						</IconButton>
					</div>
					<Divider />
					<div className={classes.container}>
						<Typography variant="h4" gutterBottom>
							Desing Your Palette
						</Typography>
						<div className={classes.buttons}>
							<Button
								variant="contained"
								color="secondary"
								onClick={this.clearColors}
								className={classes.button}
							>
								Clear Palette
							</Button>
							<Button
								variant="contained"
								color="primary"
								disabled={paletteFull}
								onClick={this.addRandomColor}
								className={classes.button}
							>
								Random Color
							</Button>
						</div>
						<ColorPickerForm paletteFull={paletteFull} addNewColor={this.addNewColor} colors={colors} />
					</div>
				</Drawer>
				<main
					className={clsx(classes.content, {
						[classes.contentShift]: open
					})}
				>
					<div className={classes.drawerHeader} />
					<DraggableColorList
						colors={colors}
						removeColor={this.removeColor}
						axis="xy"
						onSortEnd={this.onSortEnd}
						distance={20}
					/>
				</main>
			</div>
		);
	}
}

export default withStyles(styles, { withTheme: true })(NewPaletteForm);
