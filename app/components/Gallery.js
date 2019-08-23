import * as React from 'react';
import { Button, Image, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

export default class Gallery extends React.Component {
	state = {
		image: null,
	};

	render() {
		let { image } = this.state;

		return (
			<React.Fragment>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<Button
						title="Pick an image from camera roll"
						onPress={this._pickImage}
					/>
					{image &&
						<Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
				</View>
				<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
					<Button
						title="Pick an image from camera roll"
						onPress={this._takePicture}
					/>
					{image &&
						<Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
				</View>
			</React.Fragment>
		);
	}

	componentDidMount() {
		this.getPermissionAsync();
	}

	getPermissionAsync = async () => {
		if (Constants.platform.ios) {
			const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
			if (status !== 'granted') {
				alert('Sorry, we need camera roll permissions to make this work!');
			}
		}
	}

	_pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
		});

		console.log(result);

		if (!result.cancelled) {
			this.setState({ image: result.uri });
		}
	};

	_takePicture = async () => {
		let result = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [4, 3],
		});

		console.log(result);
		if (!result.cancelled) {
			this.setState({ image: result.uri });
		}
	}
}