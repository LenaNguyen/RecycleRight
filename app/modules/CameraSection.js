import React from 'react';
import { Text, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import { Button, Header, Icon, Right } from 'native-base';

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
		try {
			const { onPhotoTaken, onLoad } = this.props;
			//onLoad();
			if (this.camera) {
				this.setState({ disabled: true })
				console.log('taking photo');
				const options = {
					quality: 1,
					base64: true,
					fixOrientation: true,
					exif: true
				}
				let photo = await this.camera.takePictureAsync();
				onPhotoTaken(photo);
				console.log(photo);
			}
		} catch (error) {
			console.log(error)
		}
	}

	render() {
		const { hasCameraPermission, disabled } = this.state;
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
						<TouchableOpacity style={[styles.footer, disabled ? { opacity: 0.2 } : null]} onPress={this.takePhoto} disabled={disabled}>
							<Ionicons name="md-radio-button-on" size={60} color="white" />
						</TouchableOpacity>
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
		alignSelf: 'center',
		padding: 15,
		zIndex: 100
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