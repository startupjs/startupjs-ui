/* eslint-disable */
// DO NOT MODIFY THIS FILE - IT IS AUTOMATICALLY GENERATED ON COMMITS.

import { type ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
export declare const _PropsJsonSchema: {};
export interface TabsProps {
    /** Tabs configuration containing keys and titles */
    routes: TabsRoute[];
    /** Key of the initially active tab when uncontrolled */
    initialKey?: string;
    /** Scoped model controlling the active tab key */
    $value?: any;
    /** Handler called when active tab changes with the new key */
    onChange?: (key: string) => void;
    /** Handler called when the tab index changes @deprecated use onChange instead */
    onIndexChange?: (index: number) => void;
    /** Handler called when a tab is selected */
    onTabSelect?: (props: {
        index: number;
    }) => void;
    /** Custom TabBar renderer */
    renderTabBar?: (props: any) => ReactNode;
    /** Custom navigation state passed directly to TabView */
    navigationState?: any;
    /** Scene renderer returning content for each route */
    renderScene?: (props: any) => ReactNode;
    /** Initial layout configuration passed to TabView */
    initialLayout?: any;
    /** Controls keyboard dismiss mode for TabView */
    keyboardDismissMode?: 'none' | 'auto' | 'on-drag';
    /** Enable lazy rendering for scenes */
    lazy?: boolean;
    /** Distance of routes to preload while lazy loading */
    lazyPreloadDistance?: number;
    /** Called when swipe gesture starts */
    onSwipeStart?: () => void;
    /** Called when swipe gesture ends */
    onSwipeEnd?: () => void;
    /** Placeholder renderer while lazy loading scenes */
    renderLazyPlaceholder?: (props: any) => ReactNode;
    /** Style applied to scene container */
    sceneContainerStyle?: StyleProp<ViewStyle>;
    /** Style applied to the pager */
    pagerStyle?: StyleProp<ViewStyle>;
    /** Custom styles applied to the root TabView */
    style?: StyleProp<ViewStyle>;
    /** Deprecated alias for style applied to TabView root */
    tabsStyle?: StyleProp<ViewStyle>;
    /** Allow switching tabs with swipe gestures */
    swipeEnabled?: boolean;
    /** Position of the tab bar */
    tabBarPosition?: 'top' | 'bottom';
    /** Locale direction passed to TabView */
    direction?: 'ltr' | 'rtl';
    /** Enable page transition animation */
    animationEnabled?: boolean;
    /** Android overscroll mode */
    overScrollMode?: 'auto' | 'always' | 'never';
    /** Custom icon renderer for the tab bar */
    renderIcon?: (props: any) => ReactNode;
    /** Custom renderer for tab bar items */
    renderTabBarItem?: (props: any) => ReactNode;
    /** DEPRECATED and won't work! Use renderTabBarItem instead @deprecated */
    renderLabel?: (props: any) => ReactNode;
    /** Custom indicator renderer */
    renderIndicator?: (props: any) => ReactNode;
    /** Custom badge renderer */
    renderBadge?: (props: any) => ReactNode;
    /** Tab press handler */
    onTabPress?: (props: any) => void;
    /** Tab long-press handler */
    onTabLongPress?: (props: any) => void;
    /** Active label color @default 'primary' */
    activeColor?: string;
    /** Inactive label color @default 'muted-foreground' */
    inactiveColor?: string;
    /** Ripple color for pressed tab */
    pressColor?: string;
    /** Ripple opacity for pressed tab */
    pressOpacity?: number;
    /** Allow scrolling tabs when they overflow */
    scrollEnabled?: boolean;
    /** Enable bounce effect for scrollable tabs */
    bounces?: boolean;
    /** Style applied to individual tabs */
    tabStyle?: StyleProp<ViewStyle>;
    /** Style applied to the indicator */
    indicatorStyle?: StyleProp<ViewStyle>;
    /** Style applied to indicator container */
    indicatorContainerStyle?: StyleProp<ViewStyle>;
    /** Style applied to tab labels */
    labelStyle?: StyleProp<ViewStyle>;
    /** Style applied to tab bar content container */
    contentContainerStyle?: StyleProp<ViewStyle>;
    /** Per-route options passed through to react-native-tab-view */
    options?: Record<string, any>;
    /** Shared route options passed through to react-native-tab-view */
    commonOptions?: Record<string, any>;
}
export interface TabsRoute {
    /** Route key used to identify the tab */
    key: string;
    /** Visible title displayed in the tab bar */
    title: string;
    /** Test identifier for the tab */
    testID?: string;
    /** Additional route metadata passed through to react-native-tab-view */
    [key: string]: any;
}
declare const ObservedTabs: any;
export default ObservedTabs;
