import React from 'react';
import { Text, SafeAreaView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Button, Header, Footer, Icon, Right } from 'native-base';

export default class CameraSection extends React.Component {
	state = {
		hasCameraPermission: null,
		type: Camera.Constants.Type.back,
	};

	async componentDidMount() {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({ hasCameraPermission: status === 'granted' });
	}

	flipCamera = () => {
		this.setState({
			type:
				this.state.type === Camera.Constants.Type.back
					? Camera.Constants.Type.front
					: Camera.Constants.Type.back,
		});
	}

	takePhoto = async () => {
		console.log('Button Pressed');
		if (this.camera) {
			console.log('Taking photo');
			const options = {
				quality: 1, base64: true, fixOrientation: true,
				exif: true
			};
			let photo = await this.camera.takePictureAsync(options);
			console.log(photo);
		}
	}

	render() {
		const { hasCameraPermission } = this.state;
		if (hasCameraPermission === null) {
			return <SafeAreaView />;
		} else if (hasCameraPermission === false) {
			return <Text>No access to camera</Text>;
		} else {
			return (
				<SafeAreaView style={{ flex: 1 }}>
					<Camera
						style={{ flex: 1, justifyContent: 'space-between' }}
						type={this.state.type}
						ref={ref => {
							this.camera = ref;
						}}>
						<Header transparent >
							<Right>
								<Button transparent onPress={this.flipCamera}>
									<Icon type="Ionicons" name="reverse-camera" style={{ fontSize: 30 }} />
								</Button>
							</Right>
						</ Header>
						<Button style={styles.footer} onPress={this.takePhoto}>
							<Icon type="Ionicons" name="radio-button-on" style={{ fontSize: 50 }} />
						</Button>
					</Camera>
				</SafeAreaView>
			);
		}
	}
}

const styles = StyleSheet.create({
	captureButton: {
		alignSelf: 'flex-end',
		alignItems: 'center',
		backgroundColor: 'purple'
	},
	footer: {
		backgroundColor: 'transparent',
		flexDirection: 'row',
		justifyContent: 'center',
		alignSelf: 'center'
	},
	header: {
		position: 'absolute',
		backgroundColor: 'transparent',
		left: 0,
		top: 0,
		right: 0,
		zIndex: 100,
		alignItems: 'center'
	}

})