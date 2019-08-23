import React from 'react';
import { Text } from 'react-native';
import CameraExample from './app/modules/CameraSection';
import Gallery from './app/components/Gallery';

export default class App extends React.Component {
	render() {
		return (
			<React.Fragment>
				<Gallery />
				{/* <CameraExample /> */}
			</React.Fragment>
		);
	}
}