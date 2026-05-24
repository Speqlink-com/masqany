/**
 * SectionHeader Component Tests
 * 
 * Unit tests for the SectionHeader component.
 */

import icons from '@/constants/icons';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import SectionHeader from '../SectionHeader';

describe('SectionHeader', () => {
  it('renders with icon and title', () => {
    const { getByText } = render(
      <SectionHeader
        icon={icons.activeMove}
        title="Active moves!!"
      />
    );

    expect(getByText('Active moves!!')).toBeTruthy();
  });

  it('renders with action text when provided', () => {
    const { getByText } = render(
      <SectionHeader
        icon={icons.activeMove}
        title="Active moves!!"
        actionText="refresh"
        onActionPress={() => {}}
      />
    );

    expect(getByText('refresh')).toBeTruthy();
  });

  it('calls onActionPress when action text is tapped', () => {
    const mockOnActionPress = jest.fn();
    const { getByText } = render(
      <SectionHeader
        icon={icons.activeMove}
        title="Active moves!!"
        actionText="refresh"
        onActionPress={mockOnActionPress}
      />
    );

    fireEvent.press(getByText('refresh'));
    expect(mockOnActionPress).toHaveBeenCalledTimes(1);
  });

  it('does not render action text when not provided', () => {
    const { queryByText } = render(
      <SectionHeader
        icon={icons.activeMove}
        title="Active moves!!"
      />
    );

    expect(queryByText('refresh')).toBeNull();
  });

  it('renders with upcoming moves icon and view all action', () => {
    const { getByText } = render(
      <SectionHeader
        icon={icons.upcomingMoves}
        title="Upcoming moves"
        actionText="view all"
        onActionPress={() => {}}
      />
    );

    expect(getByText('Upcoming moves')).toBeTruthy();
    expect(getByText('view all')).toBeTruthy();
  });
});
