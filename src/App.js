import React, { PureComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import Palette from './Palette';
import seedColors from './seedColors';
import PaletteList from './PaletteList';
import { generatePalette } from './colorHelpers';
import SingleColorPalette from './SingleColorPalette';
import NewPaletteForm from './NewPaletteForm';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import Page from './Page'

class App extends PureComponent {
	state = {
		palettes: JSON.parse(window.localStorage.getItem('palettes')) || seedColors
	};
	findPalette = (id) => {
		return this.state.palettes.find(function(palette) {
			return palette.id === id;
		});
	};
	deletePalette = (id) => {
		this.setState(
			(st) => ({ palettes: st.palettes.filter((palette) => palette.id !== id) }),
			this.syncLocalStorage
		);
	};
	savePalette = (newPalette) => {
		console.log(newPalette);
		this.setState(
			{
				palettes: [ ...this.state.palettes, newPalette ]
			},
			this.syncLocalStorage
		);
	};
	syncLocalStorage = () => {
		window.localStorage.setItem('palettes', JSON.stringify(this.state.palettes));
	};
	render() {
		// const savedPaletted = JSON.parse(window.localStorage.getItem("palettes"))
		return (
			<Route
				render={({location}) => (
					<TransitionGroup>
						<CSSTransition classNames='page' timeout={500} key={location.key}>
							<Switch location={location}>
								<Route
									exact
									path="/palette/new"
									render={(routeProps) => (
										<Page>
										<NewPaletteForm
											savePalette={this.savePalette}
											palettes={this.state.palettes}
											{...routeProps}
										/>
										</Page>
									)}
								/>{' '}
								<Route
									path="/palette/:paletteId/:colorId"
									render={(routeProps) => (
										<Page>
										<SingleColorPalette
											colorId={routeProps.match.params.colorId}
											palette={generatePalette(
												this.findPalette(routeProps.match.params.paletteId)
											)}
										/>
										</Page>
									)}
								/>{' '}
								<Route
									exact
									path="/"
									render={(routeProps) => (
										<Page>
										<PaletteList
											palettes={this.state.palettes}
											deletePalette={this.deletePalette}
											{...routeProps}
										/>
										</Page>
									)}
								/>
								<Route
									exact
									path="/palette/:id"
									render={(routeProps) => (
										<Page>
										<Palette
											palette={generatePalette(this.findPalette(routeProps.match.params.id))}
										/>
										</Page>
									)}
								/>
								<Route
									render={(routeProps) => (
										<Page>
										<PaletteList
											palettes={this.state.palettes}
											deletePalette={this.deletePalette}
											{...routeProps}
										/>
										</Page>
									)}/>
							</Switch>
						</CSSTransition>
					</TransitionGroup>
				)}
			/>

			// <div>
			//  <Palette palette={generatePalette(seedColors[4])} />
			//</div>
		);
	}
}

export default App;
