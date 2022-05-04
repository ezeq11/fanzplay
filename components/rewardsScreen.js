import * as React from 'react';
import { View, Card } from 'react-native-ui-lib';
import {ScrollView} from 'react-native';


export default function Rewards({ navigation })   {
    return (
        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' , backgroundColor: '#2e2f33'}}>
          <ScrollView>
          <Card  flex height={160} onPress={() => {}} useNative activeOpacity={1} activeScale={0.96}>
        <Card.Section
          bg-red30
          padding-20
          flex-3
          content={[
            {text: 'Special sale!', text70: true, white: true},
            {text: '10%', text60: true, white: true}
          ]}
          contentStyle={{alignItems: 'center'}}
        />
        <Card.Section
          bg-white
          padding-20
          flex
          content={[{text: 'All site', text70: true, grey10: true}]}
          contentStyle={{alignItems: 'center', margin: 0, padding: 0}}
        />
      </Card>
      </ScrollView>
      
        </View>
      );
}