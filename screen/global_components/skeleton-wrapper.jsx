import React from 'react';
import { View, ActivityIndicator } from 'react-native';
// Uncomment the following line if using a shimmer loading library
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';

export function SkeletonWrapper ({ children, isLoading, fullWidth }) {
  if (!isLoading) return children;

  return (
    <View style={{ width: fullWidth ? '100%' : 'auto', opacity: 0.5 }}>
      {/* Use ActivityIndicator for loading spinner */}
      <ActivityIndicator size="large" color="#0000ff" />
      
      {/* Uncomment this if using a shimmer placeholder */}
      <ShimmerPlaceholder style={{ width: fullWidth ? '100%' : 'auto' }} />
      
      {/* If using a placeholder, hide children while loading */}
      <View style={{ opacity: 0 }}>{children}</View>
    </View>
  );
};
