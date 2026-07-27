import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const normalizedScheme = scheme === 'dark' ? 'dark' : 'light';
const colors = Colors[normalizedScheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon
          src={require('@/assets/images/tabIcons/home.png')}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <Label>Explore</Label>
        <Icon
          src={require('@/assets/images/tabIcons/explore.png')}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="shiftFeedScreen">
        <Label>Shift Feed Screen</Label>
        <Icon
          src={require('@/assets/images/tabIcons/explore.png')}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="shiftCreationScreen">
        <Label>Shift Creation Screen</Label>
        <Icon
          src={require('@/assets/images/tabIcons/explore.png')}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="shiftAIRecommendations">
        <Label>Shift AI Recommendations</Label>
        <Icon
          src={require('@/assets/images/tabIcons/explore.png')}
        />
      </NativeTabs.Trigger>

    </NativeTabs>
  );
}
