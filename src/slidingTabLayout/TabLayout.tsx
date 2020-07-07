import React,{ useState } from 'react';
import ManualInput from '../screens/ManualInput';
import ApiNutritionx from '../screens/ApiNutritionx';
import { TabView,SceneMap, TabBar } from 'react-native-tab-view';
import ViewPagerAdapter from 'react-native-tab-view-viewpager-adapter';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function TabViewExample():JSX.Element {
  const [index, setIndex] = useState<number>(0);
  const [routes] = useState([
    { key: '0', title: "Input Meal" },
    { key: '1', title:  "Search Meal"},
  ]);
  const renderScene = SceneMap({
    0: ManualInput,
    1: ApiNutritionx,
  });


  const setColor=(route:any):string=>{
    return(route===index?'white':'#000000');
  }
  const getTabBarIcon = (props:any):JSX.Element => {
      const {route} = props;
      if (route.key === '0') {
        return <FontAwesome5 name='keyboard' size={20} color={setColor(0)}/>
      } else {
        return <FontAwesome5 name='search' size={20} color={setColor(1)}/>
      }
  }
  const renderTabBar=(props:any):JSX.Element=>{
     return(<TabBar
              {...props}
              labelStyle={{fontFamily:'Fondamento-Regular'}}
              indicatorStyle={{borderRadius:10,borderWidth:1}}
              style={{ backgroundColor: '#2e8b57'}}
              inactiveColor='#000000'
              activeColor="white"
              renderIcon={
                props=>getTabBarIcon(props)
              }
            />)
    }
    return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={renderTabBar}
      onIndexChange={setIndex}
      renderPager={props => (
      <ViewPagerAdapter {...props} transition="curl"  showPageIndicator />
    )}
    tabBarPosition="top"
    
    // ...
/>
  );
}
