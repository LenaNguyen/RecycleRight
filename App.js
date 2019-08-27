import React from 'react';
import { StyleSheet, ActivityIndicator, View, ImageBackground, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import CameraSection from './app/modules/CameraSection';
import Gallery from './app/components/Gallery';
import { Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

export default class App extends React.Component {
	state = {
		loading: false
	}
	classifyPhoto = async (photo) => {
		this.handleLoading();
		this.setState({ photoUri: photo.uri });
		console.log('photo received');
		try {
			const uriParts = photo.uri.split('.');
			const fileType = uriParts[uriParts.length - 1];
			let formData = new FormData();
			formData.append('imageFile', {
				uri: photo.uri,
				name: `photo.${fileType}`,
				type: `image/${fileType}`
			});

			let options = {
				method: 'POST',
				body: formData,
				headers: {
					Accept: 'application/json',
					'Content-Type': 'multipart/form-data',
				},
			};

			console.log('sending');
			const resp = await fetch('https://morning-hamlet-65403.herokuapp.com/api/waste', options);
			const { group, score, message } = await resp.json();
			this.setState({ group, score, message })
			console.log(group);
			this.handleLoading();
		} catch (error) {
			console.log(error);
		}
	}

	handleClose = () => {
		this.setState({ photoUri: null });
	}

	handleLoading = () => {
		const { loading } = this.state;
		this.setState({ loading: !loading })
	}

	render() {
		const { loading, group, score, message } = this.state;
		if (loading)
			return (
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<ActivityIndicator size='large' color="#00ff00" />
				</View>
			)
		else if (this.state.photoUri) {
			return (
				<ImageBackground source={{ uri: this.state.photoUri }} style={styles.container} >
					<SafeAreaView style={styles.header}>
						<TouchableOpacity onPress={this.handleClose} style={{ minHeight: 40, minWidth: 40 }}>
							<Ionicons name="md-close-circle-outline" size={30} color="white" />
						</TouchableOpacity>
					</SafeAreaView>
					<View style={styles.infoContainer} >
						<View style={styles.infoBox}>
							<Text style={styles.bold}> Group:
								<Text>{group}</Text>
							</Text>
							<Text style={styles.bold}> Score:
								<Text>{score}</Text>
							</Text>
						</View>
					</View>
				</ImageBackground>
			)
		}
		return (
			<React.Fragment>
				<CameraSection onPhotoTaken={this.classifyPhoto} onLoad={this.handleLoading} />
			</React.Fragment>
		);
	}
}

styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	infoContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: 100
	},
	infoBox: {
		width: 200,
		height: 200,
		backgroundColor: 'white',
		opacity: 0.6,
		zindex: 50,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 10
	},
	header: {
		flex: 0.18,
		alignItems: 'flex-end',
		justifyContent: 'center',
		zindex: 100,
	},
	bold: {
		fontWeight: 'bold'
	}
}) 