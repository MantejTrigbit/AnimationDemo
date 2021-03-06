/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Tabb from './Components/Tabb';
const {width} = Dimensions.get('window');
import {images} from './images/images';
import {Transition, Transitioning} from 'react-native-reanimated';
import GridImage from './images/GridImages';
const ref = React.createRef();
const transition = (
  <Transition.Together>
    <Transition.In
      type="slide-right"
      durationMs={2000}
      interpolation="easeInOut"
    />
    <Transition.In type="fade" durationMs={2000} />
    <Transition.Change />
    <Transition.Out type="fade" duration={2000} />
  </Transition.Together>
);
class Moreview extends Component {
  constructor() {
    super();
    this.state = {
      selectedTab: 0,
      images: images,
    };
  }

  selectTab = (tabIndex) => {
    ref.current.animateNextTransition();
    this.setState({selectedTab: tabIndex});
  };

  componentDidMount = () => {
    ref.current.animateNextTransition();
    this.setState({images: images});
  };

  randomizeImages = (images) => {
    const shuffledImages = images.sort(() => 0.5 - Math.random());

    ref.current.animateNextTransition();
    this.setState({images: shuffledImages});
  };

  deleteImages = (images) => {
    images.pop();

    ref.current.animateNextTransition();
    this.setState({images: images});
  };

  render() {
    return (
      <View style={{flex: 1}} removeClippedSubviews={false}>
        <Transitioning.View ref={ref} transition={transition} style={{flex: 1}}>
          <View style={{...styles.tabContainer}}>
            <View
              style={[
                {
                  position: 'absolute',
                  height: 70,
                  width: (width - 30) / 2,
                  backgroundColor: '#BADA55',
                  left: this.state.selectedTab === 0 ? 0 : null,
                  right: this.state.selectedTab === 1 ? 0 : null,
                },
              ]}
            />

            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => this.selectTab(0)}>
              <Tabb
                icon="md-images-sharp"
                isSelected={this.state.selectedTab === 0 ? true : false}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => this.selectTab(1)}>
              <Tabb
                icon="md-grid"
                isSelected={this.state.selectedTab === 1 ? true : false}
              />
            </TouchableOpacity>
          </View>

          {this.state.selectedTab === 0 ? (
            <View style={styles.imageContainer}>
              {this.state.images.map((image) => (
                <GridImage
                  key={image.id}
                  image={image}
                  width={width / 2 - 20}
                />
              ))}
            </View>
          ) : (
            <View style={styles.imageContainer}>
              {this.state.images.map((image) => (
                <GridImage
                  key={image.id}
                  image={image}
                  width={width / 4 - 20}
                />
              ))}
            </View>
          )}

          {this.state.selectedTab === 0 && (
            <View
              style={{
                marginBottom: 80,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text>Images</Text>
            </View>
          )}

          <TouchableWithoutFeedback
            onPress={() => {
              this.deleteImages(this.state.images);
            }}>
            <View
              style={{
                height: 70,
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: this.state.selectedTab === 0 ? -70 : 0,
                backgroundColor: 'red',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 24, color: 'white'}}>Delete Images</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              this.randomizeImages(this.state.images);
            }}>
            <View
              style={{
                height: 70,
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: this.state.selectedTab === 0 ? 0 : -70,
                backgroundColor: '#BADA55',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{fontSize: 24, color: 'white'}}>
                Randomize Images
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </Transitioning.View>
      </View>
    );
  }
}
export default Moreview;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContainer: {
    height: 70,
    flexDirection: 'row',
    marginTop: 50,
    borderRadius: 70,
    width: width - 30,
    marginHorizontal: 15,
    backgroundColor: 'lightgrey',
    overflow: 'hidden',
  },
  imageContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
});
