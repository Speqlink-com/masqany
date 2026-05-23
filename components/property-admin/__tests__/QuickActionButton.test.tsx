/**
 * QuickActionButton Component Tests
 * 
 * Tests for the QuickActionButton component used in dashboard quick actions.
 */

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import QuickActionButton from '../QuickActionButton';

describe('QuickActionButton', () => {
  it('renders with correct label', () => {
    const { getByText } = render(
      <QuickActionButton label="My Units" onPress={() => {}} />
    );
    
    expect(getByText('My Units')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <QuickActionButton label="Switch Status" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Switch Status'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renders multiple buttons with different labels', () => {
    const { getByText } = render(
      <>
        <QuickActionButton label="My Units" onPress={() => {}} />
        <QuickActionButton label="Switch Status" onPress={() => {}} />
        <QuickActionButton label="Analytics" onPress={() => {}} />
      </>
    );
    
    expect(getByText('My Units')).toBeTruthy();
    expect(getByText('Switch Status')).toBeTruthy();
    expect(getByText('Analytics')).toBeTruthy();
  });

  it('has correct styling classes', () => {
    const { getByText } = render(
      <QuickActionButton label="Test Button" onPress={() => {}} />
    );
    
    const button = getByText('Test Button').parent;
    expect(button?.props.activeOpacity).toBe(0.8);
  });
});
