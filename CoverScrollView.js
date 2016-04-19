'use strict';


var React = require('react-native');
var crypto = require('crypto-js');

var {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Dimensions,
  Platform,
  TouchableWithoutFeedback,
} = React;

var scollWidth = 450;
var cellwidth=90;

var {
  width, height
} = Dimensions.get('window');

var CoverScrollView = React.createClass({

  getInitialState: function() {
    return {
      currentIndex:0
    };
  },
  componentDidMount: function()  {
    //debugger
    if (this.props.initialPage > 0) {
      this.goToPage(this.props.initialPage);
    }else{
      this.transformCovers(0);
    }
  },
  transformCovers:function(currentOffsetx){
    for (var i = 0; i < this.props.covers.length; i++) {
      var pagePosition=i*(cellwidth);
      var pageOffset= Math.abs(pagePosition-currentOffsetx);
      if(pageOffset>cellwidth){
        pageOffset=cellwidth;
      }
      var scale = (cellwidth-(15*pageOffset/cellwidth))/75;


      this.refs["cover"+i].setNativeProps({style:{transform: [
        {scale: scale},
      ]}});

    }
  },
  render: function() {
    var content= this.renderListView();
    return (
      <View>
        {content}
      </View>
    );

  },

  handleScroll (e){
    var currentPosition = e.nativeEvent.contentOffset.x;
    //this.setState({currentOffset:currentPosition});
    this.transformCovers(currentPosition);
  },
  handleScrollEnd (e){
    var currentPosition = e.nativeEvent.contentOffset.x;
    var currentPage = ~~(currentPosition / cellwidth);
    if(this.state.currentIndex!=currentPage){
      this.setState({currentIndex:currentPage});
      this.refs["cover"+currentPage].setNativeProps({style:{borderWidth:2,borderColor:'#ffc81f'}});
      if (this.props.onPageChange) {
        this.props.onPageChange(currentPage);
      }
    }

  },
  goToPage(index) {
    this.movieScrollView.scrollTo({y:0, x:index*cellwidth});
    if (this.props.onPageChange) {
      this.props.onPageChange(index);
    }
  },
  renderListView: function() {
    var images = this.props.covers.map((c, i) => {
      var imageBorder={};
      if(i==this.state.currentIndex){
        imageBorder ={borderWidth:2,borderColor:'#ffc81f'};
      }
      return(
        <TouchableWithoutFeedback
          key={ i }
          onPress={ ()=> this.goToPage(i) }
          >
          <View style={[{width:cellwidth,justifyContent:'center'}]}>
            <Image ref={"cover"+i}
              style={[styles.coverImg,imageBorder]}
              defaultSource={require('./image/pic_home_page_preload.png')}
              key={"photo"+i}
              resizeMode={Image.resizeMode.cover}
              source={{uri: c}} />
          </View>
        </TouchableWithoutFeedback>
      );
    });


    return (

      <ScrollView
        ref={ c => this.movieScrollView = c }
        style={{width:scollWidth,overflow:'visible'}}
        contentContainerStyle={{
          flex: 1,
          justifyContent: "center"
        }}
        centerContent={true}
        scrollEventThrottle={16}
        onScroll={ this.handleScroll }
        decelerationRate='fast'
        snapToAlignment='start'
        snapToInterval={cellwidth}
        horizontal={true}
        onMomentumScrollEnd={ this.handleScrollEnd}
        automaticallyAdjustContentInsets={false}
        showsHorizontalScrollIndicator={false}
        >
        <View style={{width:2*cellwidth}}>
        </View>
        {images}
        <View style={{width:2*cellwidth}}>
        </View>
      </ScrollView>
    );
  },

});

var styles = StyleSheet.create({
  coverImg:{
    width:75,
    height:100,
  }
});
module.exports = CoverScrollView;
